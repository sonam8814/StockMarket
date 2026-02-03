import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import TradingViewWidget from "@/components/TradingViewWidget";
import WatchlistButton from "@/components/WatchlistButton";
import { getNews } from "@/lib/actions/finnhub.actions";
import { WIDGET_CONFIGS } from "@/lib/constants";

export default async function StockDetailsPage({ params }) {
  let session = null;
  let userEmail = null;

  // Get user session with error handling
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
    
    if (!session) {
      redirect("/sign-in");
    }
    
    userEmail = session.user?.email;
  } catch (error) {
    console.error("Auth error:", error);
    redirect("/sign-in");
  }

  const { symbol } = params;

  // Fetch company-specific news
  let news = [];
  try {
    news = await getNews(symbol);
  } catch (error) {
    console.error("Error fetching news:", error);
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">{symbol}</h1>
            <p className="text-gray-400">Real-time stock data and analysis</p>
          </div>
          
          <WatchlistButton
            symbol={symbol}
            name={symbol}
            userEmail={userEmail}
            type="button"
          />
        </div>

        {/* Main Grid - 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Symbol Overview */}
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <TradingViewWidget
                config={{
                  ...WIDGET_CONFIGS.symbolOverview,
                  symbols: [[`${symbol}|1D`]],
                }}
              />
            </div>

            {/* Advanced Chart */}
            <div className="bg-gray-900 rounded-lg overflow-hidden h-[500px]">
              <TradingViewWidget
                config={{
                  ...WIDGET_CONFIGS.advancedChart,
                  symbol: symbol,
                }}
              />
            </div>

            {/* Technical Analysis */}
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <TradingViewWidget
                config={{
                  ...WIDGET_CONFIGS.technicalAnalysis,
                  symbol: symbol,
                }}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Company Profile */}
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <TradingViewWidget
                config={{
                  ...WIDGET_CONFIGS.companyProfile,
                  symbol: symbol,
                }}
              />
            </div>

            {/* Fundamental Data */}
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <TradingViewWidget
                config={{
                  ...WIDGET_CONFIGS.fundamentalData,
                  symbol: symbol,
                }}
              />
            </div>

            {/* Top Stories */}
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <TradingViewWidget
                config={{
                  ...WIDGET_CONFIGS.topStories,
                  symbol: symbol,
                }}
              />
            </div>
          </div>
        </div>

        {/* Latest News Section */}
        {news.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Latest News</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.slice(0, 6).map((article, index) => (
                <a
                  key={index}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors"
                >
                  {article.image && (
                    <img
                      src={article.image}
                      alt={article.headline}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 className="font-semibold mb-2 line-clamp-2">
                    {article.headline}
                  </h3>
                  <p className="text-sm text-gray-400 mb-2">
                    {article.source}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(article.datetime * 1000).toLocaleDateString()}
                  </p>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}