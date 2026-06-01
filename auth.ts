import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import Twitter from 'next-auth/providers/twitter';

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
    // ✅ Google OAuth
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      async profile(profile) {
        // Проверь юзера в БД
        const { data: existingUser } = await supabase
          .from('users')
          .select('*')
          .eq('email', profile.email)
          .single();

        if (existingUser) {
          // Юзер существует
          return {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            country: existingUser.country || '',
            phone: existingUser.phone || '',
            address: existingUser.address || '',
            avatar_url: existingUser.avatar_url || profile.picture,
          };
        }

        // Создай нового юзера
        const { data: newUser } = await supabase
          .from('users')
          .insert({
            name: profile.name,
            email: profile.email,
            avatar_url: profile.picture,
            // password не нужен для Google
          })
          .select()
          .single();

        return {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          country: newUser.country || '',
          phone: newUser.phone || '',
          address: newUser.address || '',
          avatar_url: newUser.avatar_url || '',
        };
      },
    }),
    // ✅ GitHub
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      async profile(profile) {
        const { data: existingUser } = await supabase
          .from('users')
          .select('*')
          .eq('email', profile.email)
          .single();

        if (existingUser) {
          return {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            avatar_url: existingUser.avatar_url || profile.avatar_url,
          };
        }

        const { data: newUser } = await supabase
          .from('users')
          .insert({
            name: profile.name || profile.login,
            email: profile.email,
            avatar_url: profile.avatar_url,
          })
          .select()
          .single();

        return {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          avatar_url: newUser.avatar_url,
        };
      },
    }),

    // ✅ Twitter
    Twitter({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: '2.0', // ← важно для Twitter v2
      async profile(profile) {
        const { data: existingUser } = await supabase
          .from('users')
          .select('*')
          .eq('email', profile.email || profile.username)
          .single();

        if (existingUser) {
          return {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            avatar_url: existingUser.avatar_url || profile.image,
          };
        }

        const { data: newUser } = await supabase
          .from('users')
          .insert({
            name: profile.name,
            email: profile.email || `${profile.username}@twitter.local`,
            avatar_url: profile.image,
          })
          .select()
          .single();

        return {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          avatar_url: newUser.avatar_url,
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

declare module 'next-auth' {
  interface User {
    id: string;
    name: string;
    email: string;
    country?: string;
    phone?: string;
    address?: string;
    avatar_url?: string;
  }

  interface Session {
    user: User;
  }

  interface JWT {
    id?: string;
    name?: string;
    email?: string;
    country?: string;
    phone?: string;
    address?: string;
    avatar_url?: string;
  }
}
