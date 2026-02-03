"use client";

import { useState, useEffect } from "react";
import { Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  addToWatchlist,
  removeFromWatchlist,
  isInWatchlist,
} from "@/lib/actions/watchlist.actions";

/**
 * WatchlistButton Component
 * 
 * @param {Object} props
 * @param {string} props.symbol - Stock symbol
 * @param {string} props.name - Stock name
 * @param {string} props.userEmail - User email
 * @param {string} props.type - Button type: "button" or "icon"
 * @param {boolean} props.showTrash - Show trash icon instead of star
 */
export default function WatchlistButton({
  symbol,
  name,
  userEmail,
  type = "button",
  showTrash = false,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);

  // Check if stock is in watchlist on mount
  useEffect(() => {
    const checkWatchlist = async () => {
      try {
        const result = await isInWatchlist(userEmail, symbol);
        setInWatchlist(result);
      } catch (error) {
        console.error("Error checking watchlist:", error);
      }
    };

    if (userEmail && symbol) {
      checkWatchlist();
    }
  }, [userEmail, symbol]);

  const handleToggle = async () => {
    if (!userEmail) {
      toast.error("Please sign in to manage your watchlist");
      return;
    }

    setIsLoading(true);

    try {
      if (inWatchlist) {
        // Remove from watchlist
        await removeFromWatchlist(userEmail, symbol);
        setInWatchlist(false);
        toast.success(`${symbol} removed from watchlist`);
      } else {
        // Add to watchlist
        await addToWatchlist(userEmail, symbol, name);
        setInWatchlist(true);
        toast.success(`${symbol} added to watchlist`);
      }
    } catch (error) {
      console.error("Watchlist error:", error);
      toast.error("Failed to update watchlist");
    } finally {
      setIsLoading(false);
    }
  };

  // Icon-only button (for table rows)
  if (type === "icon") {
    return (
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className="p-2 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50"
        title={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
      >
        {showTrash ? (
          <Trash2 className="h-5 w-5 text-red-500" />
        ) : (
          <Star
            className={`h-5 w-5 ${
              inWatchlist
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-400"
            }`}
          />
        )}
      </button>
    );
  }

  // Full button (for stock details page)
  return (
    <Button
      onClick={handleToggle}
      disabled={isLoading}
      variant={inWatchlist ? "outline" : "default"}
      className={`gap-2 ${
        inWatchlist
          ? "border-yellow-400 text-yellow-400 hover:bg-yellow-400/10"
          : "bg-yellow-400 text-black hover:bg-yellow-500"
      }`}
    >
      <Star
        className={`h-4 w-4 ${
          inWatchlist ? "fill-yellow-400" : ""
        }`}
      />
      {isLoading
        ? "Loading..."
        : inWatchlist
        ? "In Watchlist"
        : "Add to Watchlist"}
    </Button>
  );
}