import { getComments } from '@/lib/data';
import { auth } from '@/../auth';
import Comments from './Comments';

export default async function PostComments({ postId }: { postId: string }) {
  const [session, comments] = await Promise.all([auth(), getComments(postId)]);

  return (
    <Comments
      postId={postId}
      comments={comments}
      isLoggedIn={!!session?.user}
    />
  );
}
