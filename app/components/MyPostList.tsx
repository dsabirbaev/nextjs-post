import Link from 'next/link';
import PostCard from '@/components/PostCard';
import { getUserPosts } from '@/lib/data';
import { auth } from '@/../auth';

export default async function MyPostList() {
  const session = await auth();
  const posts = await getUserPosts(session?.user?.id || '');

  return (
    <>
      {posts.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-10">
          No posts yet.{' '}
          <Link href="/add" className="text-gray-900 underline">
            Create one
          </Link>
        </p>
      )}
      {posts.map((post) => (
        <Link href={`/posts/${post.id}`} key={post.id}>
          <PostCard post={post} />
        </Link>
      ))}
    </>
  );
}
