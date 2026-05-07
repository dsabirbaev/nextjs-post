import { getPosts } from '@/lib/data';
import Link from 'next/link';
import PostCard from '@/components/PostCard';

export default async function PostList() {
  const posts = await getPosts();

  return (
    <>
      {posts.map((post) => (
        <Link href={`/posts/${post.id}`} key={post.id}>
          <PostCard post={post} />
        </Link>
      ))}
    </>
  );
}
