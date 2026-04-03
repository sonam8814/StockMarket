'use server';

import { getDateRange, validateArticle, formatArticle } from '@/lib/utils';
import { POPULAR_STOCK_SYMBOLS } from '@/lib/constants';
import { cache } from 'react';

const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';
const NEXT_PUBLIC_FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY || '';

async function fetchJSON(url, revalidateSeconds) {
  const options = revalidateSeconds
    ? { cache: 'force-cache', next: { revalidate: revalidateSeconds } }
    : { cache: 'no-store' };

  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Fetch failed ${res.status}: ${text}`);
  }
  return await res.json();
}

export { fetchJSON };

export async function getNews(symbols) {
  try {
    const range = getDateRange(5);
    const token = process.env.FINNHUB_API_KEY || NEXT_PUBLIC_FINNHUB_API_KEY;
    if (!token) {
      throw new Error('FINNHUB API key is not configured');
    }
    
    const cleanSymbols = (symbols || [])
      .map((s) => s?.trim().toUpperCase())
      .filter((s) => Boolean(s));

    const maxArticles = 6;

    // If we have symbols, try to fetch company news per symbol
    if (cleanSymbols.length > 0) {
      const perSymbolArticles = {};

      await Promise.all(
        cleanSymbols.map(async (sym) => {
          try {
            const url = `${FINNHUB_BASE_URL}/company-news?symbol=${encodeURIComponent(sym)}&from=${range.from}&to=${range.to}&token=${token}`;
            const articles = await fetchJSON(url, 300);
            perSymbolArticles[sym] = (articles || []).filter(validateArticle);
          } catch (e) {
            console.error('Error fetching company news for', sym, e);
            perSymbolArticles[sym] = [];
          }
        })
      );

      const collected = [];
      // Round-robin up to 6 picks
      for (let round = 0; round < maxArticles; round++) {
        for (let i = 0; i < cleanSymbols.length; i++) {
          const sym = cleanSymbols[i];
          const list = perSymbolArticles[sym] || [];
          if (list.length === 0) continue;
          const article = list.shift();
          if (!article || !validateArticle(article)) continue;
          collected.push(formatArticle(article, true, sym, round));
          if (collected.length >= maxArticles) break;
        }
        if (collected.length >= maxArticles) break;
      }

      if (collected.length > 0) {
        collected.sort((a, b) => (b.datetime || 0) - (a.datetime || 0));
        return collected.slice(0, maxArticles);
      }
    }

    // General market news fallback
    const generalUrl = `${FINNHUB_BASE_URL}/news?category=general&token=${token}`;
    const general = await fetchJSON(generalUrl, 300);

    const seen = new Set();
    const unique = [];
    for (const art of general || []) {
      if (!validateArticle(art)) continue;
      const key = `${art.id}-${art.url}-${art.headline}`;
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(art);
      if (unique.length >= 20) break;
    }

    const formatted = unique.slice(0, maxArticles).map((a, idx) => formatArticle(a, false, undefined, idx));
    return formatted;
  } catch (err) {
    console.error('getNews error:', err);
    throw new Error('Failed to fetch news');
  }
}

export async function getQuote(symbol) {
  try {
    const token = process.env.FINNHUB_API_KEY || NEXT_PUBLIC_FINNHUB_API_KEY;
    if (!token) {
      throw new Error('FINNHUB API key is not configured');
    }

    const url = `${FINNHUB_BASE_URL}/quote?symbol=${encodeURIComponent(symbol.toUpperCase())}&token=${token}`;
    const data = await fetchJSON(url, 60); // Cache for 1 minute

    return {
      symbol: symbol.toUpperCase(),
      currentPrice: data.c || 0,         // Current price
      change: data.d || 0,                // Change
      changePercent: data.dp || 0,        // Percent change
      high: data.h || 0,                  // High price of the day
      low: data.l || 0,                   // Low price of the day
      open: data.o || 0,                  // Open price of the day
      previousClose: data.pc || 0,        // Previous close price
      timestamp: data.t || Date.now(),    // Timestamp
    };
  } catch (err) {
    console.error('getQuote error:', err);
    return {
      symbol: symbol.toUpperCase(),
      currentPrice: 0,
      change: 0,
      changePercent: 0,
      high: 0,
      low: 0,
      open: 0,
      previousClose: 0,
      timestamp: Date.now(),
      error: 'Failed to fetch quote',
    };
  }
}

export async function getQuotes(symbols) {
  try {
    const quotes = await Promise.all(
      symbols.map(async (symbol) => {
        const quote = await getQuote(symbol);
        return quote;
      })
    );
    return quotes;
  } catch (err) {
    console.error('getQuotes error:', err);
    return [];
  }
}

export const searchStocks = cache(async (query, userId = null) => {
  try {
    const token = process.env.FINNHUB_API_KEY || NEXT_PUBLIC_FINNHUB_API_KEY;
    if (!token) {
      console.error('Error in stock search:', new Error('FINNHUB API key is not configured'));
      return [];
    }

    const trimmed = typeof query === 'string' ? query.trim() : '';

    let results = [];

    if (!trimmed) {
      // Fetch top 10 popular symbols' profiles
      const top = POPULAR_STOCK_SYMBOLS.slice(0, 10);
      const profiles = await Promise.all(
        top.map(async (sym) => {
          try {
            const url = `${FINNHUB_BASE_URL}/stock/profile2?symbol=${encodeURIComponent(sym)}&token=${token}`;
            const profile = await fetchJSON(url, 3600);
            return { sym, profile };
          } catch (e) {
            console.error('Error fetching profile2 for', sym, e);
            return { sym, profile: null };
          }
        })
      );

      results = profiles
        .map(({ sym, profile }) => {
          const symbol = sym.toUpperCase();
          const name = profile?.name || profile?.ticker || undefined;
          const exchange = profile?.exchange || undefined;
          if (!name) return undefined;
          const r = {
            symbol,
            description: name,
            displaySymbol: symbol,
            type: 'Common Stock',
          };
          r.__exchange = exchange;
          return r;
        })
        .filter((x) => Boolean(x));
    } else {
      const url = `${FINNHUB_BASE_URL}/search?q=${encodeURIComponent(trimmed)}&token=${token}`;
      const data = await fetchJSON(url, 1800);
      results = Array.isArray(data?.result) ? data.result : [];
    }

    // Get unique symbols
    const symbolsToCheck = results
      .map((r) => (r.symbol || '').toUpperCase())
      .filter((s) => s);

    // Check watchlist status if userId provided
    let watchlistSymbols = new Set();
    if (userId) {
      try {
        const { isInWatchlist: checkWatchlist } = await import('@/lib/actions/watchlist.actions');
        const watchlistCheck = await Promise.all(
          symbolsToCheck.map(async (sym) => {
            const inList = await checkWatchlist(userId, sym);
            return { sym, inList };
          })
        );
        watchlistCheck.forEach(({ sym, inList }) => {
          if (inList) watchlistSymbols.add(sym);
        });
      } catch (e) {
        console.error('Error checking watchlist status:', e);
      }
    }

    const mapped = results
      .map((r) => {
        const upper = (r.symbol || '').toUpperCase();
        const name = r.description || upper;
        const exchangeFromDisplay = r.displaySymbol || undefined;
        const exchangeFromProfile = r.__exchange || undefined;
        const exchange = exchangeFromDisplay || exchangeFromProfile || 'US';
        const type = r.type || 'Stock';
        const item = {
          symbol: upper,
          name,
          exchange,
          type,
          isInWatchlist: watchlistSymbols.has(upper),
        };
        return item;
      })
      .slice(0, 15);

    return mapped;
  } catch (err) {
    console.error('Error in stock search:', err);
    return [];
  }
});