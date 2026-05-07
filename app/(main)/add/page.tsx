'use client';
import { useActionState } from 'react';
import Link from 'next/link';
import { createPost } from '@/lib/actions';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@/ui/button';

export default function CreatePostPage() {
  const [error, formAction, isPending] = useActionState(createPost, undefined);

  const today = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white border border-gray-100 rounded-xl overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">
            ← Back
          </Link>
        </div>

        <form action={formAction} className="px-10 py-8">
          {/* Error */}
          {error && <p className="text-xs text-red-500 mb-4">{error}</p>}

          {/* Title */}
          <input
            type="text"
            name="title"
            placeholder="Post title..."
            required
            className="w-full text-2xl font-medium border-b border-gray-100 pb-3 mb-3 outline-none placeholder-gray-300 text-gray-900"
          />

          {/* Meta */}
          <p className="text-xs text-gray-400 mb-5">myBlog · {today}</p>

          {/* Content */}
          <textarea
            name="content"
            placeholder="Write your post content here..."
            required
            className="w-full min-h-52 text-sm leading-relaxed outline-none placeholder-gray-300 text-gray-700 resize-none"
          />

          {/* Footer */}
          <div className="flex items-center justify-end pt-4 border-t border-gray-100 mt-4">
            <Button
              className="mt-4 w-50 bg-gray-900 hover:bg-gray-700 disabled:opacity-50 transition-colors"
              aria-disabled={isPending}
            >
              Publish{' '}
              {isPending ? (
                <div className="flex items-center justify-end gap-2 ml-auto">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                </div>
              ) : (
                <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
