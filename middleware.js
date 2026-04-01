import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { LOGIN, PUBLIC_ROUTES, REGISTER, ROOT, STUDENT_ROUTES, TEACHER_ROUTES } from './lib/routes';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;
  const role = req.auth?.user?.role;
  const { pathname } = nextUrl;

  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route)) || pathname === ROOT;

  const isTeachersRoute = TEACHER_ROUTES.some((route) => pathname.startsWith(route));

  const isStudentRoute = STUDENT_ROUTES.some((route) => pathname.startsWith(route));

  // Teacher-only: in TEACHER_ROUTES but NOT in STUDENT_ROUTES
  const isTeacherOnlyRoute = isTeachersRoute && !isStudentRoute;

  if (!isAuthenticated && !isPublicRoute) {
    return Response.redirect(new URL(LOGIN, nextUrl));
  }

  if (isAuthenticated && (pathname.startsWith(LOGIN) || pathname.startsWith(REGISTER))) {
    return Response.redirect(new URL('/', nextUrl));
  }

  // Students cannot access teacher-only routes
  if (role === 'student' && isTeacherOnlyRoute) {
    return Response.redirect(new URL('/', nextUrl));
  }

  if (role === 'teacher' && !isTeachersRoute && !isPublicRoute && !pathname.startsWith('/enroll-success')) {
    return Response.redirect(new URL('/dashboard', nextUrl));
  }
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)'],
};
