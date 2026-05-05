'use client';
import { useActionState } from 'react';
import { updatePost } from '@/lib/actions';
import Link from 'next/link';
import { ArrowLeftIcon, ArrowPathIcon } from '@heroicons/react/20/solid';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

type Post = {
  id: string;
  title: string;
  content: string;
};

export default function EditPostForm({ post }: { post: Post }) {
  const updatePostWithId = updatePost.bind(null, post.id);
  const [error, formAction, isPending] = useActionState(
    updatePostWithId,
    undefined
  );

  return (
    <form
      action={formAction}
      className="bg-white border border-gray-100 rounded-xl overflow-hidden"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
        <Link
          href={`/posts/${post.id}`}
          className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1"
        >
          <ArrowLeftIcon className="h-4 w-4" /> Back
        </Link>
      </div>

      <div className="px-10 py-8">
        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 mb-4">
            <ExclamationCircleIcon className="h-4 w-4 text-red-500" />
            <p className="text-xs text-red-500">{error}</p>
          </div>
        )}

        {/* Title */}
        <input
          type="text"
          name="title"
          defaultValue={post.title}
          placeholder="Post title..."
          required
          className="w-full text-2xl font-medium border-b border-gray-100 pb-3 mb-3 outline-none placeholder-gray-300 text-gray-900"
        />

        {/* Content */}
        <textarea
          name="content"
          defaultValue={post.content}
          placeholder="Write your post content here..."
          required
          className="w-full min-h-52 text-sm leading-relaxed outline-none placeholder-gray-300 text-gray-700 resize-none mt-4"
        />

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
          <button
            type="submit"
            disabled={isPending}
            className="ml-auto flex items-center gap-2 text-sm font-medium px-6 py-2.5 rounded-full bg-blue-900 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isPending ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                Save changes
                <ArrowPathIcon className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
