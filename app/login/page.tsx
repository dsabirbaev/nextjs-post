import LoginForm from '@/ui/login-form';
import { Suspense } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-xl overflow-hidden">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
