'use client';
import { useActionState } from 'react';
import { createComment } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Field } from '@/components/ui/field';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

type Comment = {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  reply_id: string;
  users: {
    name: string;
  };
};

type Props = {
  postId: string;
  comments: Comment[];
  isLoggedIn: boolean;
};

export default function Comments({ postId, comments, isLoggedIn }: Props) {
  console.log('comments ', comments);
  const createCommentWithId = createComment.bind(null, postId);
  const [error, formAction, isPending] = useActionState(
    createCommentWithId,
    undefined
  );

  return (
    <div className="mt-5 border-t border-gray-100 pt-5">
      <h2 className="text-base font-medium text-gray-900 mb-6">
        Comments ({comments.length})
      </h2>

      {/* Список комментариев */}
      <div className="flex flex-col gap-6 mb-8">
        {comments.length === 0 && (
          <p className="text-sm text-gray-400">
            No comments yet. Be the first!
          </p>
        )}
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-2">
            {/* Аватар */}
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600 flex-shrink-0">
              {comment.users?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <div className="flex flex-col gap-2 mb-1">
                <span className="text-sm font-medium text-gray-900">
                  {comment.users?.name}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(comment.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <p className="text-sm text-gray-700">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Форма */}
      {isLoggedIn ? (
        <form action={formAction} className="flex flex-col gap-2">
          <div className="flex flex-col gap-2 items-end">
            <Textarea
              name="content"
              placeholder="Type your message here."
              className="min-h-[120px]"
            />
            <Button
              disabled={isPending}
              size="lg"
              className="bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-50 cursor-pointer w-50"
            >
              {isPending ? (
                <>
                  <Spinner className="size-4" />
                </>
              ) : (
                'Send'
              )}
            </Button>
          </div>
          <Field>
            {error && (
              <Alert variant="destructive" className="text-xs">
                <AlertCircleIcon className="size-4" />
                <AlertTitle>{error}</AlertTitle>
              </Alert>
            )}
          </Field>
        </form>
      ) : (
        <div className="">
          <Textarea
            name="content"
            placeholder="Sign In to leave a comment"
            disabled
          />
        </div>
      )}
    </div>
  );
}
