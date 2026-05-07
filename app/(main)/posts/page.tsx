import type { Metadata } from 'next';
import Container from '@/components/Container';
import MyPostList from '@/components/MyPostList';
import { Suspense } from 'react';
import { CardsSkeleton } from '@/ui/skeletons';

export const metadata: Metadata = {
  title: 'Posts',
};

export default async function Page() {
  return (
    <Container>
      <h1 className="text-center text-2xl text-bold mb-5">My Posts</h1>
      <div className="flex flex-col gap-4">
        <Suspense fallback={<CardsSkeleton />}>
          <MyPostList />
        </Suspense>
      </div>
    </Container>
  );
}
