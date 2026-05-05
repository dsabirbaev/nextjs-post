import type { Metadata } from 'next';
import { getPosts } from '@/lib/data';
import Link from 'next/link';
import Container from '@/components/Container';
import { ChatBubbleOvalLeftIcon } from '@heroicons/react/20/solid';
export const metadata: Metadata = {
  title: 'Home',
};

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <Container>
      <div className="flex flex-col gap-4">
        {posts?.map((post) => (
          <Link href={`/posts/${post.id}`} key={post.id}>
            <div className="border border-gray-100 rounded-xl p-6 hover:border-gray-200 transition-colors">
              <h2 className="text-lg font-medium text-gray-900 mt-3 mb-2 flex items-start">
                {post.title}
                <span className="ml-2 text-xs">
                  <ChatBubbleOvalLeftIcon className="w-4 h-4 inline-block text-green-500" />{' '}
                  {post.comments[0]?.count ?? 0}
                </span>
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
