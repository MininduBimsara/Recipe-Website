import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            )
            supabaseResponse = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    // Refresh credentials using the official safe method getUser()
    const { data: { user } } = await supabase.auth.getUser()
    const path = request.nextUrl.pathname;

    // Admin UUID is read from env var — never hardcoded in source
    const adminUserId = process.env.ADMIN_USER_ID;
    const isAdmin = adminUserId ? (user?.id === adminUserId) : false;

    // If session is empty or user is not the designated admin and requesting private admin routes
    if (!isAdmin && path.startsWith('/admin') && path !== '/admin/login') {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirectTo', path)
      return NextResponse.redirect(loginUrl)
    }

    // If signed-in admin lands on login, route to console dashboard
    if (isAdmin && path === '/admin/login') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  } catch (err) {
    console.error('Middleware session refresh error:', err);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
