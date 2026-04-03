# Signalist - Stock Market Tracker

Signalist is a modern stock market tracking application built with Next.js that provides real-time market data, watchlist management, price alerts, and automated email notifications.

---

## Features

- **User Authentication** - Secure sign-up/sign-in with email and password
- **Stock Search** - Search stocks by symbol or company name
- **Watchlist Management** - Add/remove stocks to your personal watchlist
- **Real-time Stock Data** - Live stock quotes powered by Finnhub API
- **Price Alerts** - Set price above/below alerts with email notifications
- **Volume Alerts** - Get notified when trading volume exceeds thresholds
- **Daily News Summary** - Automated daily market news digest via email
- **TradingView Integration** - Interactive charts and widgets
- **Dark Theme UI** - Modern, responsive design

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Frontend**: React 19, Tailwind CSS 4
- **Authentication**: Better Auth
- **Database**: MongoDB with Mongoose
- **Stock Data API**: Finnhub
- **Background Jobs**: Inngest
- **Email Service**: Nodemailer
- **UI Components**: Radix UI, shadcn/ui style

---

## Project Structure

```
stock-market-app/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (root)/              # Protected pages
│   │   ├── dashboard/
│   │   ├── watchlist/
│   │   └── stocks/[symbol]/
│   ├── api/
│   │   ├── auth/[...all]/   # Better Auth endpoints
│   │   ├── alerts/          # Alert CRUD endpoints
│   │   └── inngest/         # Background job handlers
│   └── layout.js
├── components/
│   ├── Header.jsx
│   ├── SearchCommand.jsx
│   ├── TradingViewWidget.jsx
│   ├── WatchlistButton.js
│   ├── WatchlistTable.js
│   └── ui/                  # UI components
├── lib/
│   ├── actions/             # Server actions
│   │   ├── auth.actions.js
│   │   ├── finnhub.actions.js
│   │   ├── watchlist.actions.js
│   │   └── alert.actions.js
│   ├── database/
│   │   ├── index.js
│   │   └── models/
│   │       ├── user.model.js
│   │       ├── watchlist.model.js
│   │       └── alert.model.js
│   ├── inngest/
│   │   ├── client.js
│   │   ├── functions.js
│   │   └── prompts.js
│   ├── nodemailer/
│   │   ├── config.js
│   │   └── templates.js
│   ├── auth.js
│   ├── auth-client.js
│   ├── constants.js
│   └── utils.js
├── hooks/
├── public/
├── middleware.js
└── package.json
```

---

## Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  emailVerified: Boolean,
  image: String,
  country: String,
  experienceLevel: ['beginner', 'intermediate', 'advanced', 'expert'],
  investmentGoal: ['growth', 'income', 'speculation', 'preservation'],
  riskTolerance: ['low', 'medium', 'high'],
  notificationsEnabled: Boolean,
  lastLoginAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Watchlist
```javascript
{
  userId: String,
  symbol: String (uppercase),
  company: String,
  addedAt: Date
}
// Compound index: userId + symbol (unique)
```

### Alert
```javascript
{
  userId: String,
  symbol: String (uppercase),
  company: String,
  alertType: ['price_above', 'price_below', 'volume_above'],
  targetPrice: Number,
  targetVolume: Number,
  condition: ['greater_than', 'less_than'],
  isActive: Boolean,
  triggeredAt: Date,
  lastCheckedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## API Endpoints

### Authentication
- `POST /api/auth/sign-in` - Sign in user
- `POST /api/auth/sign-up` - Register new user
- `POST /api/auth/sign-out` - Sign out user
- `GET /api/auth/session` - Get current session

### Alerts
- `GET /api/alerts` - Get user's alerts
- `GET /api/alerts?action=counts` - Get alert counts
- `POST /api/alerts` - Create new alert
- `PUT /api/alerts/[id]` - Update alert
- `DELETE /api/alerts/[id]` - Delete alert

### Background Jobs
- `GET /api/inngest` - Inngest handler (GET)
- `POST /api/inngest` - Inngest handler (events)

---

## Server Actions

### Finnhub Actions (`lib/actions/finnhub.actions.js`)
- `getNews(symbols)` - Fetch market news
- `searchStocks(query, userId)` - Search stocks
- `getQuote(symbol)` - Get real-time quote
- `getQuotes(symbols)` - Get multiple quotes

### Watchlist Actions (`lib/actions/watchlist.actions.js`)
- `addToWatchlist(userId, symbol, company)`
- `removeFromWatchlist(userId, symbol)`
- `getWatchlist(userId)`
- `isInWatchlist(userId, symbol)`

### Alert Actions (`lib/actions/alert.actions.js`)
- `createAlert(userId, alertData)`
- `getAlerts(userId)`
- `getActiveAlerts(userId)`
- `updateAlert(userId, alertId, updateData)`
- `deleteAlert(userId, alertId)`
- `toggleAlert(userId, alertId)`

---

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/stockmarket

# Finnhub API
FINNHUB_API_KEY=your_finnhub_api_key
NEXT_PUBLIC_FINNHUB_API_KEY=your_finnhub_api_key

# Better Auth
BETTER_AUTH_SECRET=your_secret_key_here
BETTER_AUTH_URL=http://localhost:3000

# Email Configuration (SMTP)
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password

# Inngest (for production)
INNGEST_SIGNING_KEY=your_inngest_signing_key
INNGEST_EVENT_KEY=your_inngest_event_key
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB
- Finnhub API key (free at https://finnhub.io)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd stock-market-app
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file with required environment variables

4. Start MongoDB:
```bash
mongod
```

5. Run the development server:
```bash
npm run dev
```

6. Run Inngest dev server (for background jobs):
```bash
npx inngest-cli@latest dev
```

7. Open http://localhost:3000

---

## Background Jobs

### Automated Tasks (Inngest)

| Job | Schedule | Description |
|-----|----------|-------------|
| `check-price-alerts` | Every 5 minutes | Checks all active price alerts |
| `send-daily-news` | Daily at 12 PM UTC | Sends news summary to users |

### Alert Checking Flow
1. Fetch all active alerts from database
2. Group alerts by stock symbol
3. Fetch current quotes from Finnhub API
4. Compare current price against alert thresholds
5. Send email notification if threshold met
6. Mark alert as triggered (deactivates)

---

## Email Templates

| Template | Trigger |
|----------|---------|
| Welcome Email | User sign-up |
| Daily News Summary | Scheduled (daily) |
| Price Above Alert | Stock price exceeds threshold |
| Price Below Alert | Stock price drops below threshold |
| Volume Alert | Unusual trading volume |
| Inactive User Reminder | User hasn't logged in |

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

MIT License

---

## Acknowledgments

- [Finnhub](https://finnhub.io) for stock market data API
- [TradingView](https://tradingview.com) for chart widgets
- [Better Auth](https://better-auth.com) for authentication
- [Inngest](https://inngest.com) for background job processing