'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HandThumbUpIcon, HandThumbDownIcon } from '@heroicons/react/20/solid';
import { createLike, createDisLike } from '@/lib/actions';

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
    <div className="mt-10 border-t border-gray-100 pt-2">
      {isLoggedIn ? (
        <div className="flex items-center justify-end gap-3">
          <form action={createLike.bind(null, postId)}>
            <Button
              disabled={userLiked}
              variant="outline"
              className="cursor-pointer group hover:border-green-300"
            >
              <HandThumbUpIcon className="w-3 h-3 text-gray-400 group-hover:text-green-600" />
              <span className="text-gray-400">{likesCount}</span>
            </Button>
          </form>

          <form action={createDisLike.bind(null, postId)}>
            <Button
              disabled={!userLiked}
              variant="outline"
              className="cursor-pointer group hover:border-red-300"
            >
              <HandThumbDownIcon className="w-3 h-3 text-gray-400 group-hover:text-red-600" />
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
