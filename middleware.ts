import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Route Map & Guard Strategy:
 * 
 * Protected Routes:
 * - /app/* → requires authentication; unauthenticated → redirect to /login?redirect=/app/...
 * 
 * Auth Routes (redirect authenticated users away):
 * - /login → if authenticated → redirect to /app
 * - /signup → if authenticated → redirect to /app
 * - /forgot-password → if authenticated → redirect to /app
 * - /verify → allow (handles verification tokens)
 * 
 * Public Routes:
 * - / → landing page (accessible to all)
 * - /onboarding → accessible (creates local profile)
 * - /share/* → public sharing routes (accessible to all)
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  // If Supabase is not configured, allow all requests
  // This allows the app to work even without Supabase configured
  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    // Refresh session and read cookies - this ensures newly set cookies after login are properly read
    // Use getUser() which automatically refreshes expired sessions
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Protect /app/* routes
    if (request.nextUrl.pathname.startsWith('/app')) {
      if (!user) {
        // Redirect to login if not authenticated
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('redirect', request.nextUrl.pathname);
        return NextResponse.redirect(url);
      }
    }

    // Redirect authenticated users away from auth pages
    const authPages = ['/login', '/signup', '/forgot-password'];
    if (user && authPages.includes(request.nextUrl.pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = '/app';
      return NextResponse.redirect(url);
    }
  } catch (error) {
    // If there's an error (e.g., Supabase connection issue), allow request through
    // The client-side will handle the error
    console.error('Middleware error:', error);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next (all Next.js internal routes - static files, chunks, webpack, etc.)
     * - favicon.ico (favicon file)
     * - public folder files
     * - api routes (handled separately)
     */
    '/((?!_next|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
