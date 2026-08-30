import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Only 'owner' and 'admin' roles may use this Admin panel.
// 'muneeb' and 'customer' roles belong to their own separate apps.
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard')
    || request.nextUrl.pathname.startsWith('/accounts')
    || request.nextUrl.pathname.startsWith('/sales')
    || request.nextUrl.pathname.startsWith('/purchases')
    || request.nextUrl.pathname.startsWith('/inventory')
    || request.nextUrl.pathname.startsWith('/customers')
    || request.nextUrl.pathname.startsWith('/suppliers')
    || request.nextUrl.pathname.startsWith('/reports')
    || request.nextUrl.pathname.startsWith('/settings')

  if (isDashboardRoute && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user && isDashboardRoute) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, is_active')
      .eq('id', user.id)
      .single()

    if (!profile || !profile.is_active || !['owner', 'admin'].includes(profile.role)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/accounts/:path*', '/sales/:path*', '/purchases/:path*',
    '/inventory/:path*', '/customers/:path*', '/suppliers/:path*', '/reports/:path*', '/settings/:path*'],
}
