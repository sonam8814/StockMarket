export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-black flex">
      {/* Left side - Auth forms */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {children}
        </div>
      </div>

      {/* Right side - Testimonial & Features */}
      <div className="hidden lg:block relative flex-1 bg-gray-900">
        <div className="h-full flex items-center justify-center p-12">
          <div className="max-w-lg w-full space-y-8">
            
            {/* Dashboard Preview Card */}
            <div className="bg-gray-800 rounded-xl p-8 text-center border border-gray-700">
              <div className="text-6xl mb-4">📈</div>
              <h3 className="text-xl font-bold text-white mb-2">
                Dashboard Preview Coming Soon
              </h3>
              <p className="text-gray-400 text-sm">
                Track stocks, get real-time alerts, and manage your watchlist
              </p>
            </div>

            {/* Testimonial Card */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <p className="text-lg text-white mb-4 leading-relaxed">
                "Signalist transformed how I track my investments. The real-time alerts and market insights are game-changing!"
              </p>
              <p className="text-yellow-400 font-semibold">
                — Sarah Chen, Retail Investor
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                <span className="text-2xl">🔍</span>
                <span className="text-gray-300 text-sm">Search 50,000+ stocks globally</span>
              </div>
              
              <div className="flex items-center gap-3 bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                <span className="text-2xl">📊</span>
                <span className="text-gray-300 text-sm">Real-time market data via TradingView</span>
              </div>
              
              <div className="flex items-center gap-3 bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                <span className="text-2xl">⭐</span>
                <span className="text-gray-300 text-sm">Create custom watchlists</span>
              </div>
              
              <div className="flex items-center gap-3 bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                <span className="text-2xl">🔔</span>
                <span className="text-gray-300 text-sm">Price & volume alerts (coming soon)</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}