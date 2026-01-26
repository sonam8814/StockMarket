/**
 * Navigation items for the app
 */
export const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Watchlist', href: '/watchlist' },
  { label: 'News', href: '/news' },
];

/**
 * Investment goals options for forms
 */
export const INVESTMENT_GOALS = [
  { value: 'growth', label: 'Growth' },
  { value: 'income', label: 'Income' },
  { value: 'balanced', label: 'Balanced' },
  { value: 'conservative', label: 'Conservative' },
];

/**
 * Risk tolerance options for forms
 */
export const RISK_TOLERANCE_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'very-high', label: 'Very High' },
];

/**
 * Investment time horizon options
 */
export const TIME_HORIZON_OPTIONS = [
  { value: 'short', label: 'Short-term (0-2 years)' },
  { value: 'medium', label: 'Medium-term (3-5 years)' },
  { value: 'long', label: 'Long-term (6+ years)' },
];

/**
 * Popular stock symbols array
 */
export const POPULAR_STOCK_SYMBOLS = [
  'AAPL',
  'MSFT',
  'GOOGL',
  'AMZN',
  'META',
  'TSLA',
  'NVDA',
  'JPM',
  'V',
  'JNJ',
  'WMT',
  'PG',
  'MA',
  'UNH',
  'HD',
  'DIS',
  'BAC',
  'ADBE',
  'NFLX',
  'CRM',
];

/**
 * Watchlist table header columns
 */
export const WATCHLIST_TABLE_HEADER = [
  { key: 'symbol', label: 'Symbol' },
  { key: 'name', label: 'Name' },
  { key: 'price', label: 'Price' },
  { key: 'change', label: 'Change' },
  { key: 'changePercent', label: 'Change %' },
  { key: 'volume', label: 'Volume' },
  { key: 'marketCap', label: 'Market Cap' },
  { key: 'actions', label: 'Actions' },
];

/**
 * No market news message constant
 */
export const NO_MARKET_NEWS = 'No market news available at this time.';

/**
 * Creates TradingView Advanced Chart widget configuration
 * @param {string} symbol - Stock symbol
 * @param {string} theme - Theme ('dark' or 'light')
 * @param {number} height - Widget height
 * @returns {Object} TradingView widget configuration
 */
export function getTradingViewChartConfig(symbol, theme = 'dark', height = 500) {
  return {
    symbol: symbol,
    theme: theme,
    style: '1',
    locale: 'en',
    toolbar_bg: '#141414',
    enable_publishing: false,
    hide_top_toolbar: true,
    hide_legend: false,
    save_image: false,
    container_id: `tradingview_${symbol}`,
    height: height,
    width: '100%',
    autosize: true,
    studies: [
      'Volume@tv-basicstudies',
    ],
  };
}

/**
 * Creates TradingView Mini Chart widget configuration
 * @param {string} symbol - Stock symbol
 * @param {string} theme - Theme ('dark' or 'light')
 * @param {number} width - Widget width
 * @param {number} height - Widget height
 * @returns {Object} TradingView mini chart configuration
 */
export function getTradingViewMiniChartConfig(symbol, theme = 'dark', width = 400, height = 220) {
  return {
    symbol: symbol,
    theme: theme,
    style: '1',
    locale: 'en',
    dateRange: '1D',
    colorTheme: theme,
    isTransparent: false,
    autosize: true,
    largeChartUrl: '',
    width: width,
    height: height,
  };
}

/**
 * Creates TradingView Stock Heatmap widget configuration
 * @param {string} theme - Theme ('dark' or 'light')
 * @param {number} width - Widget width
 * @param {number} height - Widget height
 * @returns {Object} TradingView heatmap configuration
 */
export function getTradingViewHeatmapConfig(theme = 'dark', width = 1000, height = 450) {
  return {
    colorTheme: theme,
    dateRange: '1D',
    exchange: 'US',
    showVolume: true,
    locale: 'en',
    width: width,
    height: height,
    isTransparent: false,
  };
}

/**
 * Creates TradingView Market Overview widget configuration
 * @param {string} theme - Theme ('dark' or 'light')
 * @param {number} width - Widget width
 * @param {number} height - Widget height
 * @returns {Object} TradingView market overview configuration
 */
export function getTradingViewMarketOverviewConfig(theme = 'dark', width = 1000, height = 400) {
  return {
    colorTheme: theme,
    dateRange: '1D',
    showChart: true,
    locale: 'en',
    largeChartUrl: '',
    isTransparent: false,
    showSymbolLogo: true,
    showVolume: false,
    width: width,
    height: height,
    plotLineColorGrowing: '#2962FF',
    plotLineColorFalling: '#2962FF',
    gridLineColor: 'rgba(42, 46, 57, 0)',
    scaleFontColor: 'rgba(120, 123, 134, 1)',
    belowLineFillColorGrowing: 'rgba(41, 98, 255, 0.12)',
    belowLineFillColorFalling: 'rgba(41, 98, 255, 0.12)',
    belowLineFillColorGrowingBottom: 'rgba(41, 98, 255, 0)',
    belowLineFillColorFallingBottom: 'rgba(41, 98, 255, 0)',
    symbolActiveColor: 'rgba(41, 98, 255, 0.12)',
  };
}

/**
 * Creates TradingView Ticker widget configuration
 * @param {Array<string>} symbols - Array of stock symbols
 * @param {string} theme - Theme ('dark' or 'light')
 * @param {number} width - Widget width
 * @param {number} height - Widget height
 * @returns {Object} TradingView ticker configuration
 */
export function getTradingViewTickerConfig(symbols = [], theme = 'dark', width = 1000, height = 46) {
  return {
    symbols: symbols.length > 0 ? symbols : POPULAR_STOCK_SYMBOLS.slice(0, 10),
    colorTheme: theme,
    isTransparent: false,
    showSymbolLogo: true,
    locale: 'en',
    width: width,
    height: height,
  };
}

/**
 * Creates TradingView Symbol Overview widget configuration
 * @param {string} symbol - Stock symbol
 * @param {string} theme - Theme ('dark' or 'light')
 * @param {number} width - Widget width
 * @param {number} height - Widget height
 * @returns {Object} TradingView symbol overview configuration
 */
export function getTradingViewSymbolOverviewConfig(symbol, theme = 'dark', width = 1000, height = 400) {
  return {
    symbols: [[symbol]],
    chartOnly: false,
    width: width,
    height: height,
    locale: 'en',
    colorTheme: theme,
    autosize: true,
    showVolume: false,
    hideDateRanges: false,
    scalePosition: 'right',
    scaleMode: 'Normal',
    fontFamily: '-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif',
    fontSize: '10',
    noTimeScale: false,
    valuesScale: 'normal',
    chartType: 'area',
    lineColor: 'rgba(88, 98, 255, 1)',
    bottomColor: 'rgba(88, 98, 255, 0)',
    topColor: 'rgba(88, 98, 255, 0.3)',
    gridLineColor: 'rgba(42, 46, 57, 0)',
  };
}
