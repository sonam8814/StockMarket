import { Toaster } from "sonner";
import "./globals.css";

export const metadata = {
  title: "Signalist - Stock Market Tracking",
  description: "Track stocks, get real-time alerts, and manage your watchlist",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}