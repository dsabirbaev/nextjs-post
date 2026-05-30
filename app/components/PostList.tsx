import { getPosts } from '@/lib/data';
import Link from 'next/link';
import PostCard from '@/components/PostCard';
import PostListInfinite from '@/components/PostListInfinite';

export default async function PostList() {
  const initialPosts = await getPosts(0);
  return (
    <>
      <main>
        <PostListInfinite initialPosts={initialPosts} />
      </main>
    </>
  );
}
