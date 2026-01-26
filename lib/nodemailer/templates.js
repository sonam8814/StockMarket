// Email HTML Templates
// TODO: Replace placeholder templates with actual HTML content

export const WELCOME_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Signalist</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #141414; color: #fff; padding: 30px; border-radius: 8px;">
    <h1 style="color: #FDD458; margin-top: 0;">Welcome to Signalist!</h1>
    <p>Thank you for joining Signalist. We're excited to help you stay informed about the stock market.</p>
    <p>Get started by exploring stocks, adding them to your watchlist, and setting up alerts.</p>
    <p style="margin-top: 30px;">
      <a href="http://localhost:3000" style="background-color: #FDD458; color: #050505; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Get Started</a>
    </p>
  </div>
</body>
</html>
`;

export const NEWS_SUMMARY_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Market News Summary</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #141414; color: #fff; padding: 30px; border-radius: 8px;">
    <h1 style="color: #FDD458; margin-top: 0;">Market News Summary</h1>
    <p>Here's your daily market news summary.</p>
    <!-- News items will be inserted here -->
    <p style="margin-top: 30px;">
      <a href="http://localhost:3000/news" style="background-color: #FDD458; color: #050505; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">View All News</a>
    </p>
  </div>
</body>
</html>
`;

export const STOCK_ALERT_UPPER_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Stock Alert - Price Above Threshold</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #141414; color: #fff; padding: 30px; border-radius: 8px;">
    <h1 style="color: #0FEDBE; margin-top: 0;">Stock Alert Triggered</h1>
    <p><strong>{{symbol}}</strong> has reached your alert threshold!</p>
    <p>Current Price: <strong style="color: #0FEDBE;">${{currentPrice}}</strong></p>
    <p>Alert Threshold: <strong>${{thresholdPrice}}</strong></p>
    <p style="margin-top: 30px;">
      <a href="http://localhost:3000/stock/{{symbol}}" style="background-color: #0FEDBE; color: #050505; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">View Stock</a>
    </p>
  </div>
</body>
</html>
`;

export const STOCK_ALERT_LOWER_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Stock Alert - Price Below Threshold</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #141414; color: #fff; padding: 30px; border-radius: 8px;">
    <h1 style="color: #FF495B; margin-top: 0;">Stock Alert Triggered</h1>
    <p><strong>{{symbol}}</strong> has dropped below your alert threshold!</p>
    <p>Current Price: <strong style="color: #FF495B;">${{currentPrice}}</strong></p>
    <p>Alert Threshold: <strong>${{thresholdPrice}}</strong></p>
    <p style="margin-top: 30px;">
      <a href="http://localhost:3000/stock/{{symbol}}" style="background-color: #FF495B; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">View Stock</a>
    </p>
  </div>
</body>
</html>
`;

export const VOLUME_ALERT_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Volume Alert</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #141414; color: #fff; padding: 30px; border-radius: 8px;">
    <h1 style="color: #FF8243; margin-top: 0;">Volume Alert</h1>
    <p><strong>{{symbol}}</strong> has unusual trading volume!</p>
    <p>Current Volume: <strong style="color: #FF8243;">{{currentVolume}}</strong></p>
    <p>Average Volume: <strong>{{averageVolume}}</strong></p>
    <p style="margin-top: 30px;">
      <a href="http://localhost:3000/stock/{{symbol}}" style="background-color: #FF8243; color: #050505; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">View Stock</a>
    </p>
  </div>
</body>
</html>
`;

export const INACTIVE_USER_REMINDER_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>We Miss You!</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #141414; color: #fff; padding: 30px; border-radius: 8px;">
    <h1 style="color: #FDD458; margin-top: 0;">We Miss You!</h1>
    <p>It's been a while since you last visited Signalist. The market is always moving, and there's a lot happening!</p>
    <p>Check out the latest market news and updates on your watchlist.</p>
    <p style="margin-top: 30px;">
      <a href="http://localhost:3000" style="background-color: #FDD458; color: #050505; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Visit Signalist</a>
    </p>
  </div>
</body>
</html>
`;
