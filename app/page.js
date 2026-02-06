import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirect to sign-in (this page shouldn't be accessed directly)
  redirect('/sign-in');
}