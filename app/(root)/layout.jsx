import { auth } from '@/lib/auth-client'

export default function RootLayout({ children }) {
  const session = auth.useSession()
  return (
    <html>
      <body>
        <Header />
        {children}
        <Toaster />
      </body>
    </html>
  )
}
