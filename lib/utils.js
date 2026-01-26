import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names using clsx and tailwind-merge
 * @param {...any} inputs - Class names to merge
 * @returns {string} Merged class names
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a timestamp to "X hours/days ago" format
 * @param {string|Date} timestamp - Timestamp to format
 * @returns {string} Formatted time string
 */
export function formatTimeAgo(timestamp) {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
}

/**
 * Creates a promise that resolves after a specified delay
 * @param {number} ms - Delay in milliseconds
 * @returns {Promise<void>} Promise that resolves after the delay
 */
export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Formats a number as market cap value (e.g., $3.10T, $900B)
 * @param {number} value - Number to format
 * @returns {string} Formatted market cap string
 */
export function formatMarketCapValue(value) {
  if (!value || value === 0) return '$0';
  
  const absValue = Math.abs(value);
  
  if (absValue >= 1e12) {
    return `$${(absValue / 1e12).toFixed(2)}T`;
  } else if (absValue >= 1e9) {
    return `$${(absValue / 1e9).toFixed(2)}B`;
  } else if (absValue >= 1e6) {
    return `$${(absValue / 1e6).toFixed(2)}M`;
  } else if (absValue >= 1e3) {
    return `$${(absValue / 1e3).toFixed(2)}K`;
  }
  
  return `$${absValue.toFixed(2)}`;
}

/**
 * Gets date range for API calls (from and to dates)
 * @param {number} days - Number of days to go back
 * @returns {{from: number, to: number}} Date range object with Unix timestamps
 */
export function getDateRange(days) {
  const to = Math.floor(Date.now() / 1000);
  const from = to - (days * 24 * 60 * 60);
  return { from, to };
}

/**
 * Gets today's date range (start and end of today)
 * @returns {{from: number, to: number}} Today's date range with Unix timestamps
 */
export function getTodayDateRange() {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(startOfDay);
  endOfDay.setHours(23, 59, 59, 999);
  
  return {
    from: Math.floor(startOfDay.getTime() / 1000),
    to: Math.floor(endOfDay.getTime() / 1000),
  };
}

/**
 * Calculates news distribution per symbol
 * @param {Array} news - Array of news articles
 * @returns {Object} Object with symbol as key and count as value
 */
export function calculateNewsDistribution(news) {
  if (!news || !Array.isArray(news)) return {};
  
  const distribution = {};
  news.forEach((article) => {
    if (article.symbol) {
      distribution[article.symbol] = (distribution[article.symbol] || 0) + 1;
    }
  });
  
  return distribution;
}

/**
 * Validates that an article has all required fields
 * @param {Object} article - Article object to validate
 * @returns {boolean} True if article is valid
 */
export function validateArticle(article) {
  if (!article) return false;
  
  const requiredFields = ['headline', 'summary', 'url', 'source', 'datetime'];
  return requiredFields.every((field) => article[field] !== undefined && article[field] !== null);
}

/**
 * Gets today's date in YYYY-MM-DD format
 * @returns {string} Today's date string
 */
export function getTodayString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formats a news article object
 * @param {Object} article - Raw article object
 * @returns {Object} Formatted article object
 */
export function formatArticle(article) {
  if (!article) return null;
  
  return {
    id: article.id || article.url,
    headline: article.headline || '',
    summary: article.summary || '',
    url: article.url || '',
    source: article.source || '',
    datetime: article.datetime || article.time || Date.now(),
    symbol: article.symbol || '',
    image: article.image || '',
    category: article.category || '',
  };
}

/**
 * Formats percentage change with +/- sign
 * @param {number} value - Percentage value
 * @returns {string} Formatted percentage string
 */
export function formatChangePercent(value) {
  if (value === null || value === undefined) return '0.00%';
  
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

/**
 * Gets color class based on change value (positive/negative)
 * @param {number} value - Change value
 * @returns {string} Color class name
 */
export function getChangeColorClass(value) {
  if (value === null || value === undefined) return 'text-gray-400';
  return value >= 0 ? 'text-green-500' : 'text-red-500';
}

/**
 * Formats a number as USD currency
 * @param {number} value - Number to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted currency string
 */
export function formatPrice(value, decimals = 2) {
  if (value === null || value === undefined) return '$0.00';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Formats today's date for display
 * @returns {string} Formatted date string
 */
export function formatDateToday() {
  const today = new Date();
  return today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Gets alert condition text based on condition type
 * @param {string} condition - Alert condition type
 * @param {number} value - Alert threshold value
 * @returns {string} Formatted alert text
 */
export function getAlertText(condition, value) {
  if (!condition || value === undefined) return '';
  
  const conditionMap = {
    'above': `Price above $${value.toFixed(2)}`,
    'below': `Price below $${value.toFixed(2)}`,
    'percent_above': `Price ${value}% above current`,
    'percent_below': `Price ${value}% below current`,
  };
  
  return conditionMap[condition] || `Alert at $${value.toFixed(2)}`;
}

/**
 * Gets formatted today's date string
 * @returns {string} Formatted date string (YYYY-MM-DD)
 */
export function getFormattedTodayDate() {
  return getTodayString();
}
