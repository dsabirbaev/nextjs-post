import type { Metadata } from 'next';
import Container from '@/components/Container';
import { auth } from '@/../auth';
import { Suspense } from 'react';
import UserPosts from '@/components/UserPosts';
import { TablesSkeleton } from '@/ui/skeletons';

export const metadata: Metadata = {
  title: 'Profile',
};

export default async function Page() {
  const session = await auth();
  return (
    <Container>
      <div className="text-center mb-8 mt-4">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl font-medium text-gray-600">
            {session?.user?.name?.[0]?.toUpperCase()}
          </span>
        </div>
        <h1 className="text-2xl font-medium text-gray-900 dark:text-white">
          {session?.user?.name ?? 'Guest'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">{session?.user?.email}</p>
      </div>

      <div>
        <div className="flex items-center justify-center mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            My Posts
          </h2>
        </div>

        <Suspense fallback={<TablesSkeleton />}>
          <UserPosts />
        </Suspense>
      </div>
    </Container>
  );
}
