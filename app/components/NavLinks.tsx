'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="flex gap-8">
      <Link
        href="/"
        className={clsx('text-sm hover:text-gray-900', {
          'text-gray-900 font-medium dark:text-white': pathname === '/',
          'text-gray-500 dark:text-gray-400': pathname !== '/',
        })}
      >
        Home
      </Link>

      <Link
        href="/posts"
        className={clsx('text-sm hover:text-gray-900', {
          'text-gray-900 font-medium dark:text-white': pathname === '/posts',
          'text-gray-500 dark:text-gray-400': pathname !== '/posts',
        })}
      >
        Posts
      </Link>

      <Link
        href="/about"
        className={clsx('text-sm hover:text-gray-900', {
          'text-gray-900 font-medium dark:text-white': pathname === '/about',
          'text-gray-500 dark:text-gray-400': pathname !== '/about',
        })}
      >
        About
      </Link>
    </div>
  );
}
