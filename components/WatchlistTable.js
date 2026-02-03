"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import WatchlistButton from "./WatchlistButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/**
 * WatchlistTable Component
 * Displays stocks in a table format with live data
 * 
 * @param {Object} props
 * @param {Array} props.stocks - Array of stock objects from watchlist
 * @param {string} props.userEmail - User email for watchlist actions
 */
export default function WatchlistTable({ stocks, userEmail }) {
  const [stockData, setStockData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch real-time data for all stocks
    const fetchStockData = async () => {
      setLoading(true);
      
      try {
        const dataPromises = stocks.map(async (stock) => {
          // You can use Finnhub API here to get real-time quotes
          // For now, returning mock data structure
          return {
            symbol: stock.symbol,
            price: 0,
            change: 0,
            changePercent: 0,
            marketCap: 0,
            peRatio: 0,
          };
        });

        const results = await Promise.all(dataPromises);
        
        const dataMap = {};
        results.forEach((data) => {
          dataMap[data.symbol] = data;
        });
        
        setStockData(dataMap);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (stocks.length > 0) {
      fetchStockData();
    } else {
      setLoading(false);
    }
  }, [stocks]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">Loading watchlist...</div>
      </div>
    );
  }

  if (stocks.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-gray-800 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-900 hover:bg-gray-900">
            <TableHead className="text-gray-400">Symbol</TableHead>
            <TableHead className="text-gray-400">Name</TableHead>
            <TableHead className="text-gray-400 text-right">Price</TableHead>
            <TableHead className="text-gray-400 text-right">Change</TableHead>
            <TableHead className="text-gray-400 text-right">Change %</TableHead>
            <TableHead className="text-gray-400 text-right">Market Cap</TableHead>
            <TableHead className="text-gray-400 text-right">P/E Ratio</TableHead>
            <TableHead className="text-gray-400 text-center">Alert</TableHead>
            <TableHead className="text-gray-400 text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stocks.map((stock) => {
            const data = stockData[stock.symbol] || {};
            const isPositive = (data.change || 0) >= 0;

            return (
              <TableRow key={stock.symbol} className="border-gray-800">
                <TableCell className="font-medium">
                  <Link
                    href={`/stocks/${stock.symbol}`}
                    className="text-yellow-400 hover:underline"
                  >
                    {stock.symbol}
                  </Link>
                </TableCell>
                <TableCell>{stock.name}</TableCell>
                <TableCell className="text-right">
                  ${data.price?.toFixed(2) || "—"}
                </TableCell>
                <TableCell
                  className={`text-right ${
                    isPositive ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {isPositive ? "+" : ""}
                  {data.change?.toFixed(2) || "—"}
                </TableCell>
                <TableCell
                  className={`text-right ${
                    isPositive ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {isPositive ? "+" : ""}
                  {data.changePercent?.toFixed(2) || "—"}%
                </TableCell>
                <TableCell className="text-right">
                  {data.marketCap
                    ? `$${(data.marketCap / 1e9).toFixed(2)}B`
                    : "—"}
                </TableCell>
                <TableCell className="text-right">
                  {data.peRatio?.toFixed(2) || "—"}
                </TableCell>
                <TableCell className="text-center">
                  <button className="text-gray-500 hover:text-yellow-400 transition-colors">
                    🔔
                  </button>
                </TableCell>
                <TableCell className="text-center">
                  <WatchlistButton
                    symbol={stock.symbol}
                    name={stock.name}
                    userEmail={userEmail}
                    type="icon"
                    showTrash
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}