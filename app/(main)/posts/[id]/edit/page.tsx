import { getPost } from '@/lib/data';
import { auth } from '@/../auth';
import { redirect } from 'next/navigation';
import EditPostForm from '@/ui/edit-post-form';
import Container from '@/components/Container';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Post',
};

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const post = await getPost(id);

  // только автор может редактировать
  if (!post || session?.user?.id !== post.user_id) {
    redirect('/');
  }

  return (
    <Container>
      <h1 className="text-2xl font-medium text-gray-900 mb-6">Edit post</h1>
      <EditPostForm post={post} />
    </Container>
  );
}
