import { NextResponse } from "next/server";

export default async function authMiddleware(request) {
  const pathname = request.nextUrl.pathname;

  // Allow public paths
  const publicPaths = ['/sign-in', '/sign-up'];
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  // Always allow API and static files
  if (pathname.startsWith('/api/') || 
      pathname.startsWith('/_next/') || 
      pathname.startsWith('/assets/')) {
    return NextResponse.next();
  }

  // Check for session cookie
  const sessionToken = request.cookies.get('better-auth.session_token');
  const hasSession = !!sessionToken;

  console.log('🔒 Middleware:', { 
    pathname, 
    hasSession,
    cookie: sessionToken?.value?.substring(0, 10) + '...'
  });

  // Redirect logged-in users away from auth pages
  if (hasSession && isPublicPath) {
    console.log('✅ Logged in, redirecting to /');
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect non-logged-in users to sign-in
  if (!hasSession && !isPublicPath) {
    console.log('❌ No session, redirecting to /sign-in');
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};