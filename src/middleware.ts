import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from './lib/auth'

const protectedRoutes = ['/dashboard', '/walidata']
const authRoutes = ['/login', '/register']

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
  const isAuthRoute = authRoutes.some(route => path.startsWith(route))

  const session = request.cookies.get('session')?.value
  const user = session ? await decrypt(session) : null

  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect to dashboard if already logged in and trying to access auth pages
  if (isAuthRoute && user) {
    if (user.role === 'walidata' || user.role === 'admin') {
      return NextResponse.redirect(new URL('/walidata', request.url))
    }
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Role-based access control
  if (path.startsWith('/dashboard') && user?.role === 'walidata') {
    return NextResponse.redirect(new URL('/walidata', request.url))
  }

  if (path.startsWith('/walidata') && user?.role === 'instansi') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
