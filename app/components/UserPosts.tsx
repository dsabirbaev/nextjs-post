import { getUserPosts } from '@/lib/data';
import UserPostList from './UserPostList';
import { auth } from '@/../auth';

export default async function UserPosts() {
  const session = await auth();
  const posts = await getUserPosts(session?.user?.id || '');
  return <UserPostList posts={posts} />;
}
