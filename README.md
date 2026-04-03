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
