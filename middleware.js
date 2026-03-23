import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import {
  LOGIN,
  PUBLIC_ROUTES,
  REGISTER,
  ROOT,
  TEACHER_ROUTES,
} from './lib/routes';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;
  const role = req.auth?.user?.role;
  const { pathname } = nextUrl;

  const isPublicRoute =
    PUBLIC_ROUTES.some((route) => pathname.startsWith(route)) ||
    pathname === ROOT;

  const isTeachersRoute = TEACHER_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  if (!isAuthenticated && !isPublicRoute) {
    return Response.redirect(new URL(LOGIN, nextUrl));
  }

  if (
    isAuthenticated &&
    (pathname.startsWith(LOGIN) || pathname.startsWith(REGISTER))
  ) {
    return Response.redirect(new URL('/', nextUrl));
  }

  if (role === 'student' && isTeachersRoute) {
    return Response.redirect(new URL('/', nextUrl));
  }

  if (role === 'teacher' && !isTeachersRoute) {
    return Response.redirect(new URL('/dashboard', nextUrl));
  }
});

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)',
  ],
};
