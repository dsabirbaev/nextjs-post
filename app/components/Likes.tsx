'use client';
import Link from 'next/link';
import { Button } from '@/ui/button';
import { HandThumbUpIcon, HandThumbDownIcon } from '@heroicons/react/20/solid';
import { createLike, createDisLike } from '@/lib/actions';
import clsx from 'clsx';
type Props = {
  postId: string;
  isLoggedIn: boolean;
  likesCount: number;
  userLiked: boolean; // ← уже лайкнул или нет
};

export default function Likes({
  postId,
  isLoggedIn,
  likesCount,
  userLiked,
}: Props) {
  return (
    <div className="mt-10 border-t border-gray-100 pt-8">
      {isLoggedIn ? (
        <div className="flex items-center justify-end gap-3">
          <form action={createLike.bind(null, postId)}>
            <Button
              disabled={userLiked} // ← блокируем если уже лайкнул
              className={clsx(
                `flex items-center gap-2 rounded-lg transition-colors hover:bg-gray-300`,
                {
                  'bg-white text-red-600 cursor-not-allowed': userLiked,
                  'bg-gray-900 text-red-600 hover:bg-red-600 cursor-pointer':
                    !userLiked,
                }
              )}
            >
              <HandThumbUpIcon
                className={clsx('w-5 h-5', {
                  'text-white': !userLiked,
                  'text-red-600': userLiked,
                })}
              />
              <span
                className={clsx({
                  'text-red-600': userLiked,
                  'text-white-600': !userLiked,
                })}
              >
                {' '}
                {likesCount}{' '}
              </span>
            </Button>
          </form>

          <form action={createDisLike.bind(null, postId)}>
            <Button
              disabled={!userLiked} // ← блокируем если не лайкнул
              className={clsx(
                `flex items-center gap-2 rounded-lg transition-colors`,
                {
                  'bg-gray-200 text-gray-400 cursor-not-allowed': !userLiked,
                  'bg-gray-900 text-white hover:bg-red-600': userLiked,
                }
              )}
            >
              <HandThumbDownIcon className="w-5 h-5" />
            </Button>
          </form>
        </div>
      ) : (
        <Link
          href="/login"
          className="text-sm text-gray-500 hover:text-gray-900 mt-4 flex items-center justify-end gap-3"
        >
          <HandThumbUpIcon className="w-5 h-5" />
          {likesCount}
          <HandThumbDownIcon className="w-5 h-5" />
        </Link>
      )}
    </div>
  );
}
