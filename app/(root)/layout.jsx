import Header from '@/components/Header';

export default function RootLayout({ children }) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-900 pt-[70px]">{children}</main>
    </>
  );
}