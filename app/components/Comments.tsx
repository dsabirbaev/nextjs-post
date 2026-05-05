'use client';
import { useActionState } from 'react';
import { createComment } from '@/lib/actions';
import Link from 'next/link';
import { Button } from '@/ui/button';

type Comment = {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  users: { name: string };
};

type Props = {
  postId: string;
  comments: Comment[];
  isLoggedIn: boolean;
};

export default function Comments({ postId, comments, isLoggedIn }: Props) {
  const createCommentWithId = createComment.bind(null, postId);
  const [error, formAction, isPending] = useActionState(
    createCommentWithId,
    undefined
  );

  return (
    <div className="mt-10 border-t border-gray-100 pt-8">
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
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex gap-3">
            <input
              type="text"
              name="content"
              placeholder="Write a comment..."
              required
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-900"
            />
            <Button
              aria-disabled={isPending}
              className="px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
            >
              {isPending ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                'Send'
              )}
            </Button>
          </div>
        </form>
      ) : (
        <div className="text-sm text-gray-500 border border-gray-100 p-2">
          <Link
            href="/login"
            className="text-gray-900 font-medium hover:underline"
          >
            Sign In
          </Link>{' '}
          to leave a comment
        </div>
      )}
    </div>
  );
}
