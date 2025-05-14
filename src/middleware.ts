import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res: response });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protected routes that require authentication
  const protectedRoutes = ['/profile'];

  // Check if the current path is a protected route and user is not authenticated
  if (
    protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route)) &&
    !session
  ) {
    const redirectUrl = new URL('/auth/login', request.url);
    // Add the original URL as a query parameter to redirect after login
    redirectUrl.searchParams.set('redirectUrl', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

// Specify the paths that the middleware should run on
export const config = {
  matcher: ['/profile/:path*'],
};