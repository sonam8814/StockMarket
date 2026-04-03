import { NextResponse } from 'next/server';
import { getQuotes, getQuote } from '@/lib/actions/finnhub.actions';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbols = searchParams.get('symbols');
    const symbol = searchParams.get('symbol');

    if (symbol) {
      // Single symbol request
      const quote = await getQuote(symbol);
      return NextResponse.json(quote);
    }

    if (symbols) {
      // Multiple symbols request
      const symbolArray = symbols.split(',').map(s => s.trim()).filter(Boolean);
      const quotes = await getQuotes(symbolArray);
      return NextResponse.json(quotes);
    }

    return NextResponse.json({ error: 'Missing symbol or symbols parameter' }, { status: 400 });
  } catch (error) {
    console.error('GET /api/quotes error:', error);
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
  }
}