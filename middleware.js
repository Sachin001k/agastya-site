import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { isAdminEmail } from '@/lib/admin-emails';

// Guards /admin and /api/admin on the server. Also refreshes the Supabase session cookie.
export async function middleware(request) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) { return request.cookies.get(name)?.value; },
        set(name, value, options) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request });
          response.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({ request });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;
  const isAdmin = !!user && isAdminEmail(user.email);

  if (pathname === '/admin/login') {
    if (isAdmin) return NextResponse.redirect(new URL('/admin', request.url));
    return response;
  }

  if (!isAdmin) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Not authorised' }, { status: 401 });
    }
    const url = new URL('/admin/login', request.url);
    if (user) url.searchParams.set('error', 'not-admin');
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
