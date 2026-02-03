import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getWatchlist } from "@/lib/actions/watchlist.actions";
import { getNews } from "@/lib/actions/finnhub.actions";
import WatchlistTable from "@/components/WatchlistTable";
import { Star } from "lucide-react";

export default async function WatchlistPage() {
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

  // Fetch user's watchlist
  let watchlist = [];
  try {
    watchlist = await getWatchlist(userEmail);
  } catch (error) {
    console.error("Error fetching watchlist:", error);
  }

  // Fetch general market news
  let news = [];
  try {
    news = await getNews();
  } catch (error) {
    console.error("Error fetching news:", error);
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Star className="h-8 w-8 text-yellow-400 fill-yellow-400" />
            My Watchlist
          </h1>
          <p className="text-gray-400">
            Track your favorite stocks in one place
          </p>
        </div>

        {/* Watchlist Table or Empty State */}
        {watchlist.length > 0 ? (
          <div className="mb-12">
            <WatchlistTable stocks={watchlist} userEmail={userEmail} />
          </div>
        ) : (
          <div className="bg-gray-900 rounded-lg p-12 text-center mb-12">
            <Star className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">
              Your watchlist is empty
            </h2>
            <p className="text-gray-400 mb-6">
              Start adding stocks to track them here
            </p>
            <a
              href="/"
              className="inline-block bg-yellow-400 text-black px-6 py-3 rounded-lg font-medium hover:bg-yellow-500 transition-colors"
            >
              Explore Stocks
            </a>
          </div>
        )}

        {/* Related News */}
        {news.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Market News</h2>
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
                  <p className="text-sm text-gray-400 mb-2">{article.source}</p>
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