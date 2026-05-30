import { getPosts } from '@/lib/data';
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
