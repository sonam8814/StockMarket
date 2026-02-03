'use client'
import { useEffect, useState } from 'react'
import { auth } from '@/lib/auth-client'
import { getNews, searchStocks } from '@/lib/actions/finnhub.actions'
import { getWatchlist } from '@/lib/actions/watchlist.actions'
import TradingViewWidget from '@/components/TradingViewWidget'
import SearchCommand from '@/components/SearchCommand'
import { Skeleton } from '@/components/ui/skeleton'
import { TrendingUp, Fire, Newspaper, Heart } from 'lucide-react'

const STAT_CARDS = [
  { title: 'Market', value: '+2.34%', icon: TrendingUp, color: 'bg-green-500/10 text-green-500' },
  { title: 'Top Gainers', value: '+4.12%', icon: Fire, color: 'bg-orange-500/10 text-orange-500' },
  { title: 'News', value: '247', icon: Newspaper, color: 'bg-blue-500/10 text-blue-500' },
  { title: 'Watchlist', value: '12', icon: Heart, color: 'bg-yellow-500/10 text-yellow-500' }
]

export default function Dashboard() {
  const session = auth.useSession()
  const [news, setNews] = useState([])
  const [watchlist, setWatchlist] = useState([])
  const [stats, setStats] = useState(STAT_CARDS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session.data?.user) return

    const fetchData = async () => {
      try {
        const newsData = await getNews()
        const watchlistData = await getWatchlist(session.data.user.email)
        setNews(newsData.slice(0, 5))
        setWatchlist(watchlistData)
        setStats(prev => [{ ...prev[3], value: watchlistData.length }])
      } catch (error) {
        console.error('Dashboard data error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [session.data?.user])

  if (!session.data?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-4">
            Stock Market Dashboard
          </h1>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Sign in to access real-time market data, watchlists, and insights
          </p>
          <a href="/sign-in" className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold px-8 py-4 rounded-2xl text-lg shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300">
            Sign In Now
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-gray-400 mt-1">Your markets at a glance</p>
            </div>
            <SearchCommand />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-2xl" />
            ))
          ) : (
            stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <div key={stat.title} className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 hover:border-gray-700 rounded-2xl p-6 hover:bg-gray-900/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-yellow-500/10">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl ${stat.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                    <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  </div>
                </div>
              )
            })
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-8 h-[500px]">
              <TradingViewWidget symbol="NASDAQ:AAPL" />
            </div>
          </div>

          {/* News & Watchlist */}
          <div className="space-y-6">
            {/* Latest News */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-6">
              <h3 className="flex items-center gap-2 text-xl font-bold text-white mb-6">
                <Fire className="h-5 w-5 text-orange-500" />
                Latest News
              </h3>
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {news.map((article, i) => (
                    <div key={i} className="group hover:bg-gray-800/50 p-4 rounded-xl transition-all">
                      <h4 className="font-semibold text-white line-clamp-2 group-hover:text-yellow-400">
                        {article.headline}
                      </h4>
                      <p className="text-sm text-gray-400 mt-1 line-clamp-1">
                        {article.summary}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Watchlist */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-6">
              <h3 className="flex items-center gap-2 text-xl font-bold text-white mb-6">
                <Heart className="h-5 w-5 text-yellow-500" />
                Watchlist ({watchlist.length})
              </h3>
              {loading ? (
                <Skeleton className="h-32 w-full rounded-xl" />
              ) : watchlist.length ? (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {watchlist.slice(0, 5).map(symbol => (
                    <div key={symbol} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl">
                      <span className="font-mono text-white">{symbol}</span>
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No stocks in watchlist</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
