import Link from 'next/link';

export default function FooterLink({ text, linkText, href }) {
  return (
    <p className="text-center text-sm text-gray-400 mt-6">
      {text}{' '}
      <Link href={href} className="footer-link">
        {linkText}
      </Link>
    </p>
  );
}