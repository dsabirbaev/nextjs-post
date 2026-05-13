import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        const { data: user } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single();

        if (!user) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          country: user.country || '',
          phone: user.phone || '',
          address: user.address || '',
          avatar_url: user.avatar_url || '',
        };
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.country = user.country;
        token.phone = user.phone;
        token.address = user.address;
        token.avatar_url = user.avatar_url;
      }
      if (trigger === 'update' && session?.user) {
        token.name = session.user.name;
        token.country = session.user.country;
        token.phone = session.user.phone;
        token.address = session.user.address;
        token.avatar_url = session.user.avatar_url;
      }
      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.country = (token.country as string) || '';
        session.user.phone = (token.phone as string) || '';
        session.user.address = (token.address as string) || '';
        session.user.avatar_url = (token.avatar_url as string) || '';
      }
      return session;
    },
  },
});
