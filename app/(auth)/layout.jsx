import Image from 'next/image';

export default function AuthLayout({ children }) {
  return (
    <div className="auth-layout">
      <section className="auth-left-section">
        <div className="auth-logo">
          <h1 className="text-2xl font-bold text-yellow-400">Signalist</h1>
        </div>
        {children}
      </section>

      <section className="auth-right-section">
        <blockquote className="auth-blockquote">
          "Signalist transformed how I track my investments. The real-time
          alerts and market insights are game-changing!"
        </blockquote>
        <cite className="auth-testimonial-author">
          — Sarah Chen, Retail Investor
        </cite>

        <div className="mt-8 rounded-xl border border-gray-600 p-4 bg-gray-900">
          <p className="text-gray-400 text-sm text-center">
            Dashboard Preview Coming Soon
          </p>
        </div>
      </section>
    </div>
  );
}