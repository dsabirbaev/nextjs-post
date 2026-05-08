import { getPost, getComments, getLikesCount, getUserLike } from '@/lib/data';
import Link from 'next/link';
import { Metadata } from 'next';
import { auth } from '@/../auth';
import Container from '@/components/Container';
import { notFound } from 'next/navigation';
import Comments from '@/components/Comments';
import Likes from '@/components/Likes';

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
  const [post, comments, likesCount, userLiked] = await Promise.all([
    getPost(id),
    getComments(id),
    getLikesCount(id),
    session?.user ? getUserLike(id, session.user.id) : Promise.resolve(false),
  ]);

  if (!post) notFound();

  return (
    <Container>
      <Link
        href="/"
        className="text-sm text-gray-500 hover:text-gray-900 mb-8 block"
      >
        ← Back
      </Link>

      <h1 className="text-3xl font-medium text-gray-900 mt-4 mb-3">
        {post.title}
      </h1>

      <p className="text-xs text-gray-400 mb-8 pb-8 border-b border-gray-100">
        myBlog ·{' '}
        {new Date(post.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </p>

      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
        {post.content}
      </p>

      <Likes
        postId={id}
        isLoggedIn={!!session?.user}
        likesCount={likesCount}
        userLiked={userLiked}
      />

      <Comments postId={id} comments={comments} isLoggedIn={!!session?.user} />
    </Container>
  );
}
