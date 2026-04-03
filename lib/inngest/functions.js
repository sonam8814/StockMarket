import { inngest } from './client';
import { sendEmail } from '@/lib/nodemailer/config';
import { WELCOME_EMAIL_TEMPLATE, NEWS_SUMMARY_EMAIL_TEMPLATE, STOCK_ALERT_UPPER_EMAIL_TEMPLATE, STOCK_ALERT_LOWER_EMAIL_TEMPLATE, VOLUME_ALERT_EMAIL_TEMPLATE } from '@/lib/nodemailer/templates';
import { PERSONALIZED_WELCOME_EMAIL_PROMPT, NEWS_SUMMARY_EMAIL_PROMPT } from './prompts';
import connectToDatabase from '@/lib/database';
import User from '@/lib/database/models/user.model';
import { getWatchlistSymbolsByEmail } from '@/lib/actions/watchlist.actions';
import { getNews, getQuote } from '@/lib/actions/finnhub.actions';
import { getAllActiveAlerts, markAlertTriggered, updateLastChecked } from '@/lib/actions/alert.actions';

export const sendSignUpEmail = inngest.createFunction(
  { id: 'send-signup-email' },
  { event: 'app/user.signup' },
  async ({ event, step }) => {
    const { email, name, userProfile } = event.data;

    // Step 1: Generate personalized intro with AI (placeholder - implement with OpenAI later)
    const intro = await step.run('generate-intro', async () => {
      // TODO: Call OpenAI API with PERSONALIZED_WELCOME_EMAIL_PROMPT
      return `<p class="mobile-text" style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">Thanks for joining! We're excited to help you track your investments and stay informed about market movements.</p>`;
    });

    // Step 2: Send email
    await step.run('send-email', async () => {
      const html = WELCOME_EMAIL_TEMPLATE
        .replace('{{name}}', name)
        .replace('{{intro}}', intro);

      return sendEmail({
        to: email,
        subject: 'Welcome to Signalist!',
        html,
      });
    });

    return { success: true };
  }
);

export const sendDailyNewsSummary = inngest.createFunction(
  { id: 'send-daily-news' },
  { cron: '0 12 * * *' }, // Daily at 12 PM UTC
  async ({ step }) => {
    // Step 1: Get all users
    const users = await step.run('get-users', async () => {
      await connectToDatabase();
      return User.find({ notificationsEnabled: { $ne: false } }).select('email name');
    });

    // Step 2: Process each user
    for (const user of users) {
      await step.run(`process-user-${user.email}`, async () => {
        // Get user's watchlist symbols
        const symbols = await getWatchlistSymbolsByEmail(user.email);

        // Fetch news
        const news = await getNews(symbols.length > 0 ? symbols : undefined);

        if (news.length === 0) return { skipped: true, reason: 'No news' };

        // TODO: Summarize news with AI using NEWS_SUMMARY_EMAIL_PROMPT
        const newsContent = news.map(article => `
          <h3>${article.headline}</h3>
          <p>${article.summary}</p>
          <a href="${article.url}">Read more</a>
        `).join('');

        const html = NEWS_SUMMARY_EMAIL_TEMPLATE
          .replace('{{date}}', new Date().toLocaleDateString())
          .replace('{{newsContent}}', newsContent);

        return sendEmail({
          to: user.email,
          subject: 'Your Daily Market News Summary',
          html,
        });
      });
    }

    return { success: true, processedUsers: users.length };
  }
);

export const checkPriceAlerts = inngest.createFunction(
  { id: 'check-price-alerts' },
  { cron: '*/5 * * * *' }, // Every 5 minutes
  async ({ step }) => {
    // Step 1: Get all active alerts
    const alerts = await step.run('get-active-alerts', async () => {
      return getAllActiveAlerts();
    });

    if (alerts.length === 0) {
      return { success: true, checked: 0, triggered: 0 };
    }

    // Group alerts by symbol to minimize API calls
    const alertsBySymbol = {};
    alerts.forEach(alert => {
      const symbol = alert.symbol.toUpperCase();
      if (!alertsBySymbol[symbol]) {
        alertsBySymbol[symbol] = [];
      }
      alertsBySymbol[symbol].push(alert);
    });

    let triggeredCount = 0;

    // Step 2: Check each symbol's price
    for (const [symbol, symbolAlerts] of Object.entries(alertsBySymbol)) {
      const quote = await step.run(`fetch-quote-${symbol}`, async () => {
        return getQuote(symbol);
      });

      if (!quote || quote.error) {
        console.error(`Failed to fetch quote for ${symbol}`);
        continue;
      }

      const currentPrice = quote.currentPrice;

      // Step 3: Check each alert for this symbol
      for (const alert of symbolAlerts) {
        await updateLastChecked(alert._id);

        let shouldTrigger = false;

        if (alert.alertType === 'price_above' && currentPrice >= alert.targetPrice) {
          shouldTrigger = true;
        } else if (alert.alertType === 'price_below' && currentPrice <= alert.targetPrice) {
          shouldTrigger = true;
        }

        if (shouldTrigger) {
          await step.run(`trigger-alert-${alert._id}`, async () => {
            // Get user email
            await connectToDatabase();
            const user = await User.findById(alert.userId);

            if (!user || !user.email) {
              console.error(`User not found for alert ${alert._id}`);
              return;
            }

            // Determine which template to use
            const template = alert.alertType === 'price_above'
              ? STOCK_ALERT_UPPER_EMAIL_TEMPLATE
              : STOCK_ALERT_LOWER_EMAIL_TEMPLATE;

            const html = template
              .replace(/{{symbol}}/g, symbol)
              .replace(/{{currentPrice}}/g, currentPrice.toFixed(2))
              .replace(/{{thresholdPrice}}/g, alert.targetPrice.toFixed(2));

            // Send email
            await sendEmail({
              to: user.email,
              subject: `${symbol} Alert: Price ${alert.alertType === 'price_above' ? 'Above' : 'Below'} Threshold`,
              html,
            });

            // Mark alert as triggered
            await markAlertTriggered(alert.userId, alert._id);

            triggeredCount++;
          });
        }
      }
    }

    return {
      success: true,
      checked: alerts.length,
      triggered: triggeredCount,
    };
  }
);
