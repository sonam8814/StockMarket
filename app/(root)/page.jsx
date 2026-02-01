import TradingViewWidget from '@/components/TradingViewWidget';
import {
  MARKET_OVERVIEW_WIDGET_CONFIG,
  HEATMAP_WIDGET_CONFIG,
  TOP_STORIES_WIDGET_CONFIG,
  MARKET_DATA_WIDGET_CONFIG,
} from '@/lib/constants';
import SearchCommand from '@/components/SearchCommand';
import { searchStocks, getNews } from '@/lib/actions/finnhub.actions';
import { formatTimeAgo } from '@/lib/utils';
import Link from 'next/link';

export default async function Dashboard() {
  const initialStocks = await searchStocks();
  const news = await getNews();
  const scriptUrl = 'https://s3.tradingview.com/external-embedding/embed-widget-';

  return (
    <div className="container py-8">
      <div className="home-wrapper flex">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-100">Market Dashboard</h1>
            <p className="text-gray-500 mt-2">Track stocks, monitor trends, and stay informed</p>
          </div>
          <SearchCommand renderAs="button" label="Search Stocks" initialStocks={initialStocks} />
        </div>

        {/* Market Overview */}
        <section className="home-section grid">
          <div className="xl:col-span-2">
            <h2 className="text-2xl font-bold text-gray-100 mb-4">Market Overview</h2>
            <TradingViewWidget
              scriptUrl={`${scriptUrl}market-overview.js`}
              config={MARKET_OVERVIEW_WIDGET_CONFIG}
              height={600}
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-100 mb-4">Latest News</h2>
            <div className="space-y-4">
              {news.slice(0, 5).map((article) => (
                <Link
                  key={article.id}
                  href={article.url}
                  target="_blank"
                  className="block p-4 bg-gray-800 rounded-lg border border-gray-600 hover:border-yellow-500 transition-colors"
                >
                  <span className="news-tag">{article.category}</span>
                  <h3 className="text-base font-semibold text-gray-100 mb-2 line-clamp-2">
                    {article.headline}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {article.source} • {formatTimeAgo(article.datetime)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Heat Map */}
        <section className="w-full">
          <h2 className="text-2xl font-bold text-gray-100 mb-4">Market Heat Map</h2>
          <TradingViewWidget
            scriptUrl={`${scriptUrl}stock-heatmap.js`}
            config={HEATMAP_WIDGET_CONFIG}
            height={600}
          />
        </section>

        {/* Top Stories & Market Data */}
        <section className="home-section grid">
          <div>
            <h2 className="text-2xl font-bold text-gray-100 mb-4">Top Stories</h2>
            <TradingViewWidget
              scriptUrl={`${scriptUrl}timeline.js`}
              config={TOP_STORIES_WIDGET_CONFIG}
              height={600}
            />
          </div>

          <div className="xl:col-span-2">
            <h2 className="text-2xl font-bold text-gray-100 mb-4">Market Data</h2>
            <TradingViewWidget
              scriptUrl={`${scriptUrl}market-quotes.js`}
              config={MARKET_DATA_WIDGET_CONFIG}
              height={600}
            />
          </div>
        </section>
      </div>
    </div>
  );
}