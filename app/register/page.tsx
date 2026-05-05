import type { Metadata } from 'next';
import RegisterForm from '@/ui/register-form';
import { Suspense } from 'react';
export const metadata: Metadata = {
  title: 'Register',
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-xl overflow-hidden">
        <Suspense>
          <RegisterForm />
        </Suspense>
      </div>
    </main>
  );
}
