'use server';

import connectToDatabase from '@/lib/database';
import Watchlist from '@/lib/database/models/watchlist.model';
import User from '@/lib/database/models/user.model';

export async function getWatchlistSymbolsByEmail(email) {
  try {
    await connectToDatabase();
    
    const user = await User.findOne({ email });
    if (!user) return [];
    
    const watchlist = await Watchlist.find({ userId: user._id.toString() });
    return watchlist.map(item => item.symbol);
  } catch (error) {
    console.error('Error getting watchlist symbols:', error);
    return [];
  }
}

export async function addToWatchlist(userId, symbol, company) {
  try {
    await connectToDatabase();
    
    const item = await Watchlist.create({
      userId,
      symbol: symbol.toUpperCase(),
      company,
    });
    
    return { success: true, data: item };
  } catch (error) {
    if (error.code === 11000) {
      return { success: false, error: 'Stock already in watchlist' };
    }
    console.error('Error adding to watchlist:', error);
    return { success: false, error: 'Failed to add stock' };
  }
}

export async function removeFromWatchlist(userId, symbol) {
  try {
    await connectToDatabase();
    
    await Watchlist.deleteOne({
      userId,
      symbol: symbol.toUpperCase(),
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    return { success: false, error: 'Failed to remove stock' };
  }
}

export async function getWatchlist(userId) {
  try {
    await connectToDatabase();
    
    const watchlist = await Watchlist.find({ userId }).sort({ addedAt: -1 });
    return watchlist;
  } catch (error) {
    console.error('Error getting watchlist:', error);
    return [];
  }
}

export async function isInWatchlist(userId, symbol) {
  try {
    await connectToDatabase();
    
    const item = await Watchlist.findOne({
      userId,
      symbol: symbol.toUpperCase(),
    });
    
    return !!item;
  } catch (error) {
    console.error('Error checking watchlist:', error);
    return false;
  }
}
