import Link from 'next/link';
import { NAV_ITEMS } from '@/lib/constants';
import SearchCommand from './SearchCommand';
import { searchStocks } from '@/lib/actions/finnhub.actions';

export default async function Header() {
  const initialStocks = await searchStocks();

  return (
    <header className="header">
      <div className="header-wrapper container">
        <Link href="/" className="text-2xl font-bold text-yellow-400">
          Signalist
        </Link>

        <nav className="nav-list">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-gray-400 hover:text-yellow-500 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <SearchCommand renderAs="text" label="Search" initialStocks={initialStocks} />
          <div className="h-8 w-8 rounded-full bg-yellow-500" />
        </div>
      </div>
    </header>
  );
}