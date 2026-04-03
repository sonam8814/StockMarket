import TradingViewWidget from '@/components/TradingViewWidget';
import {
  MARKET_OVERVIEW_WIDGET_CONFIG,
  HEATMAP_WIDGET_CONFIG,
  TOP_STORIES_WIDGET_CONFIG,
} from '@/lib/constants';

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-2">
          Track your favorite stocks and stay updated with market trends 📈
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-sm font-medium text-gray-400">Market Status</h3>
          <p className="text-2xl font-bold text-green-400 mt-2">Open</p>
          <p className="text-xs text-gray-500 mt-1">NYSE, NASDAQ</p>
        </div>
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-sm font-medium text-gray-400">Watchlist Items</h3>
          <p className="text-2xl font-bold text-yellow-400 mt-2">0</p>
          <p className="text-xs text-gray-500 mt-1">Add stocks to track</p>
        </div>
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-sm font-medium text-gray-400">Alerts Active</h3>
          <p className="text-2xl font-bold text-blue-400 mt-2">0</p>
          <p className="text-xs text-gray-500 mt-1">Set price alerts</p>
        </div>
      </div>

      {/* Market Overview Widget */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Market Overview</h2>
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden" style={{ height: '400px' }}>
          <TradingViewWidget config={MARKET_OVERVIEW_WIDGET_CONFIG} />
        </div>
      </section>

      {/* Market Heatmap Widget */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Market Heatmap</h2>
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden" style={{ height: '500px' }}>
          <TradingViewWidget config={HEATMAP_WIDGET_CONFIG} />
        </div>
      </section>

      {/* Top Stories Widget */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Top Market News</h2>
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden" style={{ height: '500px' }}>
          <TradingViewWidget config={TOP_STORIES_WIDGET_CONFIG} />
        </div>
      </section>
    </div>
  );
}
