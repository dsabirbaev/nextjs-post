'use client';

import { useActionState, useEffect, useState } from 'react';
import { createComment } from '@/lib/actions';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';

type Comment = {
  id: string;
  content: string;
  user_id: string;
  post_id: string;
  reply_id: string | null;
  created_at: string;
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
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  // Главные комментарии
  const mainComments = comments.filter((c) => !c.reply_id);

  // Replies конкретного комментария
  const getReplies = (commentId: string) =>
    comments.filter((c) => c.reply_id === commentId);

  return (
    <div className="mt-5">
      <h2 className="text-lg font-medium text-gray-900 mb-6 dark:text-white">
        Comments ({comments.length})
      </h2>

      {/* СПИСОК КОММЕНТАРИЕВ */}
      <div className="space-y-6 mb-8">
        {mainComments.length === 0 ? (
          <p className="text-sm text-gray-400">
            No comments yet. Be the first!
          </p>
        ) : (
          mainComments.map((comment) => (
            <div key={comment.id}>
              {/* Главный комментарий */}
              <CommentBlock
                comment={comment}
                onReply={() => setReplyingTo(comment.id)}
                isLoggedIn={isLoggedIn}
              />

              {/* Replies */}
              <div className="ml-8 space-y-4 mt-4">
                {getReplies(comment.id).map((reply) => (
                  <CommentBlock
                    key={reply.id}
                    comment={reply}
                    isReply
                    isLoggedIn={isLoggedIn}
                  />
                ))}
              </div>

              {/* Reply форма */}
              {isLoggedIn && replyingTo === comment.id && (
                <div className="ml-8 mt-4">
                  <CommentFormReply
                    postId={postId}
                    replyToId={comment.id}
                    onSuccess={() => setReplyingTo(null)}
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* ФОРМА ДЛЯ ГЛАВНЫХ КОММЕНТАРИЕВ */}
      {isLoggedIn ? (
        <CommentFormMain postId={postId} />
      ) : (
        <Textarea disabled placeholder="Sign in to leave a comment" />
      )}
    </div>
  );
}

// Блок комментария
function CommentBlock({
  comment,
  isReply = false,
  onReply,
  isLoggedIn,
}: {
  comment: Comment;
  isReply?: boolean;
  onReply?: () => void;
  isLoggedIn?: boolean;
}) {
  return (
    <div className="flex gap-3">
      {/* Аватар */}
      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold flex-shrink-0">
        {comment.users?.name?.[0]?.toUpperCase()}
      </div>

      {/* Содержимое */}
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {comment.users?.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(comment.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          {isLoggedIn && onReply && !isReply && (
            <Button
              variant="outline"
              size="xs"
              onClick={onReply}
              className="cursor-pointer"
            >
              Reply
            </Button>
          )}
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {comment.content}
        </p>
      </div>
    </div>
  );
}

// Форма для главных комментариев
function CommentFormMain({ postId }: { postId: string }) {
  const createMainComment = createComment.bind(null, postId, null);
  const [state, formAction, isPending] = useActionState(
    createMainComment,
    undefined
  );

  useEffect(() => {
    if (state === 'success') {
      toast.success('Comment responded', {
        position: 'top-center',
        className: '!bg-green-50 !text-green-700 !border-green-200',
      });
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-3">
      <Textarea
        name="content"
        placeholder="Write a comment..."
        className="min-h-[120px]"
        required
      />

      {state && state !== 'success' && (
        <Alert variant="destructive">
          <AlertCircleIcon className="size-4" />
          <AlertTitle>{state}</AlertTitle>
        </Alert>
      )}

      <div className="flex justify-end">
        <Button
          disabled={isPending}
          variant="outline"
          className="cursor-pointer"
        >
          {isPending ? (
            <>
              <Spinner />
            </>
          ) : (
            'Respond'
          )}
        </Button>
      </div>
    </form>
  );
}

// Форма для reply
function CommentFormReply({
  postId,
  replyToId,
  onSuccess,
}: {
  postId: string;
  replyToId: string;
  onSuccess: () => void;
}) {
  const createReply = createComment.bind(null, postId, replyToId);
  const [state, formAction, isPending] = useActionState(createReply, undefined);

  useEffect(() => {
    if (state === 'success') {
      toast.success('Reply responded', {
        position: 'top-center',
        className: '!bg-green-50 !text-green-700 !border-green-200',
      });
      onSuccess();
    }
  }, [state, onSuccess]);

  return (
    <form action={formAction} className="space-y-3">
      <Textarea
        name="content"
        placeholder="Write a reply..."
        className="min-h-[100px]"
        required
      />

      {state && state !== 'success' && (
        <Alert variant="destructive">
          <AlertCircleIcon className="size-4" />
          <AlertTitle>{state}</AlertTitle>
        </Alert>
      )}

      <div className="flex gap-2 justify-end">
        <Button
          variant="destructive"
          className="cursor-pointer"
          onClick={onSuccess}
        >
          Cancel
        </Button>
        <Button
          disabled={isPending}
          variant="outline"
          className="cursor-pointer"
        >
          {isPending ? (
            <>
              <Spinner />
            </>
          ) : (
            'Respond'
          )}
        </Button>
      </div>
    </form>
  );
}
