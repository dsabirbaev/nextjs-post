import type { Metadata } from 'next';
import Container from '@/components/Container';
import { Suspense } from 'react';
import { CardsSkeleton } from '@/ui/skeletons';
import PostList from '@/components/PostList';

export const metadata: Metadata = {
  title: 'Home',
};

export default async function HomePage() {
  return (
    <Container>
      <div className="flex flex-col gap-4">
        <Suspense fallback={<CardsSkeleton />}>
          <PostList />
        </Suspense>
      </div>
    </Container>
  );
}
