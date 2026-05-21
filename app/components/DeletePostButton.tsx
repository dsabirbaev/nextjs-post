'use client';
import { useActionState, useEffect } from 'react';
import { deletePost } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function DeletePostButton({ postId }: { postId: string }) {
  const [state, formAction, isPending] = useActionState(deletePost, undefined);

  useEffect(() => {
    if (state === 'success') {
      console.log('Post deleted successfully');
      toast.success('Post deleted successfully', {
        position: 'top-center',
        className: '!bg-green-50 !text-green-700 !border-green-200',
      });
    } else if (state) {
      toast.error(state);
    }
  }, [state]);

  return (
    <form action={formAction} style={{ display: 'inline' }}>
      <input type="hidden" name="postId" value={postId} />
      <Button
        variant="destructive"
        size="sm"
        disabled={isPending}
        type="submit"
        className="cursor-pointer"
      >
        {isPending ? (
          <>
            <Spinner className="size-4" />
            Deleting
          </>
        ) : (
          <>
            <Trash2 className="size-4" />
            Delete
          </>
        )}
      </Button>
    </form>
  );
}
