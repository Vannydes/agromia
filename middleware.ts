import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () =>
          request.cookies.getAll().map((cookie) => ({
            name: cookie.name,
            value: cookie.value,
          })),
        setAll: (cookies, headers) => {
          cookies.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
          Object.entries(headers).forEach(([name, value]) => {
            response.headers.set(name, value);
          });
        },
      },
    }
  );

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  const user = session?.user ?? null;

  console.log('[MIDDLEWARE USER]', user, 'path', request.nextUrl.pathname);
  console.log('[MIDDLEWARE SESSION]', session, 'error', error?.message);

  if (error) {
    console.error('Supabase middleware auth error:', error.message);
  }

  // Protected routes - redirect to login if not authenticated
  const protectedRoutes = ['/dashboard', '/crop/', '/coltura/', '/orto/', '/add-crop', '/my-crops'];
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Redirect logged-in users away from auth pages to dashboard
  if ((request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register') && user) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // Keep root "/" ALWAYS PUBLIC - no redirect
  // This allows the landing page to be accessible to everyone

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};