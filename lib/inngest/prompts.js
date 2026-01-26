// AI Prompt Templates for Email Generation
// TODO: Replace with actual prompt content when available

/**
 * Prompt for generating personalized welcome email introduction
 * @param {string} name - User's name
 * @param {Object} userProfile - User profile data
 * @returns {string} Prompt string
 */
export const PERSONALIZED_WELCOME_EMAIL_PROMPT = (name, userProfile) => {
  return `Generate a personalized welcome email introduction for ${name}. 
User profile: ${JSON.stringify(userProfile)}
Create a warm, engaging introduction that welcomes them to Signalist and highlights how we can help them track their investments.`;
};

/**
 * Prompt for generating news summary email content
 * @param {Array} news - Array of news articles
 * @param {Array} symbols - User's watchlist symbols
 * @returns {string} Prompt string
 */
export const NEWS_SUMMARY_EMAIL_PROMPT = (news, symbols) => {
  return `Summarize the following market news articles for a user interested in these stocks: ${symbols.join(', ')}.
  
News articles:
${news.map(article => `- ${article.headline}: ${article.summary}`).join('\n')}

Create a concise, engaging summary that highlights the most important information relevant to their watchlist.`;
};
