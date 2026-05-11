'use client';
import { useEffect, useActionState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { deletePost } from '@/lib/actions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { Spinner } from './ui/spinner';

type Post = {
  id: string;
  title: string;
  content: string;
  created_at: string;
};

export default function UserPostList({ posts }: { posts: Post[] }) {
  const [state, formAction, isPending] = useActionState(deletePost, undefined);

  useEffect(() => {
    if (state === 'success') {
      toast.success('Post deleted successfully', {
        position: 'top-center',
        className: '!bg-green-50 !text-green-700 !border-green-200',
      });
    } else if (state) {
      toast.error(state);
    }
  }, [state]);

  if (!posts.length) {
    return <p className="text-center text-sm text-gray-400 py-10">No Posts</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title Post</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post?.id}>
              <TableCell className="font-medium">{post?.title}</TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <Button
                    asChild
                    className="cursor-pointer bg-green-500"
                    size="sm"
                    variant="outline"
                  >
                    <Link
                      href={`/posts/${post.id}/edit`}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Edit
                      <Pencil />
                    </Link>
                  </Button>

                  <form action={formAction} style={{ display: 'inline' }}>
                    <input type="hidden" name="postId" value={post.id} />
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={isPending}
                      type="submit"
                      className="cursor-pointer"
                    >
                      {isPending ? (
                        <>
                          <span>Deleting</span> <Spinner className="size-4" />
                        </>
                      ) : (
                        <>
                          <span>Delete</span> <Trash2 className="size-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
