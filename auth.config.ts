import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      // страницы только для незалогиненных
      const authRoutes = ['/login', '/register'];
      if (authRoutes.includes(pathname)) {
        if (isLoggedIn) {
          // ✅ залогинен — редиректим с login/register на главную
          return Response.redirect(new URL('/', nextUrl));
        }
        return true; // незалогинен — разрешаем
      }

      // защищённые страницы
      const protectedRoutes = ['/add'];
      if (protectedRoutes.some((r) => pathname.startsWith(r))) {
        if (isLoggedIn) return true;
        return false; // незалогинен — редиректим на login
      }

      // все остальные страницы — разрешаем всем
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
