import { getPost, getLikesCount, getUserLike } from '@/lib/data';
import Link from 'next/link';
import { Metadata } from 'next';
import { auth } from '@/../auth';
import Container from '@/components/Container';
import { notFound } from 'next/navigation';
import Likes from '@/components/Likes';
import { MoveLeft } from 'lucide-react';
import PostDetail from '@/components/PostDetail';
import PostComments from '@/components/PostComments';
import { Suspense } from 'react';
import PostCommentsSkeleton from '@/ui/skeletons';

export const metadata: Metadata = {
  title: 'Post Details',
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // ✅ сначала session
  const session = await auth();

  // ✅ потом всё остальное
  const [post, likesCount, userLiked] = await Promise.all([
    getPost(id),
    getLikesCount(id),
    session?.user ? getUserLike(id, session.user.id) : Promise.resolve(false),
  ]);

  if (!post) notFound();

  return (
    <Container>
      <Link
        href="/"
        className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-8 flex gap-1"
      >
        <MoveLeft className="w-4 h-4" /> Back
      </Link>

      <PostDetail post={post} />

      <Likes
        postId={id}
        isLoggedIn={!!session?.user}
        likesCount={likesCount}
        userLiked={userLiked}
      />

      <Suspense fallback={<PostCommentsSkeleton />}>
        <PostComments postId={id} />
      </Suspense>
    </Container>
  );
}
