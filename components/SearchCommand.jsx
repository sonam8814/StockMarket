'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { searchStocks } from '@/lib/actions/finnhub.actions';
import { useDebounce } from '@/hooks/useDebounce';
import { Search } from 'lucide-react';

export default function SearchCommand() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  useEffect(() => {
    const searchSymbols = async () => {
      if (!debouncedQuery || debouncedQuery.length < 1) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const data = await searchStocks(debouncedQuery);
        setResults(data?.result || []);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    searchSymbols();
  }, [debouncedQuery]);

  const handleSelect = (symbol) => {
    setOpen(false);
    setQuery('');
    setResults([]);
    router.push(`/stocks/${symbol}`);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">Search stocks...</span>
        <kbd className="ml-auto px-2 py-0.5 text-xs bg-white rounded border hidden sm:inline">
          ⌘K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search for stocks (e.g., AAPL, TSLA)..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {loading && (
            <div className="py-6 text-center text-sm text-gray-500">
              Searching...
            </div>
          )}
          {!loading && query && results.length === 0 && (
            <CommandEmpty>No stocks found.</CommandEmpty>
          )}
          {!loading && results.length > 0 && (
            <CommandGroup heading="Stocks">
              {results.slice(0, 10).map((stock) => (
                <CommandItem
                  key={stock.symbol}
                  value={stock.symbol}
                  onSelect={() => handleSelect(stock.symbol)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <p className="font-medium">{stock.symbol}</p>
                      <p className="text-sm text-gray-500">{stock.description}</p>
                    </div>
                    <span className="text-xs text-gray-400">{stock.type}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}