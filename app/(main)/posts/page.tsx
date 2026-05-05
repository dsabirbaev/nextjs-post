import type { Metadata } from 'next';
import Container from '@/components/Container';
import { auth } from '../../../auth';
import Link from 'next/link';
import { getUserPosts } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Posts',
};

export default async function Page() {
  const session = await auth();
  const posts = await getUserPosts(session?.user?.id || '');

  return (
    <Container>
      <h1 className="text-center text-2xl text-bold mb-5">My Posts</h1>

      {posts.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-10">
          No posts yet.{' '}
          <Link href="/add" className="text-gray-900 underline">
            Create one
          </Link>
        </p>
      )}

      <div className="flex flex-col gap-4">
        {posts?.map((post) => (
          <Link href={`/posts/${post.id}`} key={post.id}>
            <div className="border border-gray-100 rounded-xl p-6 hover:border-gray-200 transition-colors">
              <h2 className="text-lg font-medium text-gray-900 mt-3 mb-2">
                {post.title}
              </h2>
              <p className="text-sm text-gray-500 line-clamp-2">
                {post.content}
              </p>
              <p className="text-xs text-gray-400 mt-3">
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
}
