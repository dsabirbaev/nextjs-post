'use client';

import Link from 'next/link';
import { Home, BookOpen, BookText } from 'lucide-react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 dark:bg-gray-900 dark:border-gray-800">
      <nav className="p-4 space-y-2">
        <SidebarLink href="/" icon={<Home />} label="Home" pathname="/" />
        <SidebarLink
          href="/posts"
          icon={<BookOpen />}
          label="Posts"
          pathname="/posts"
        />
        <SidebarLink
          href="/about"
          icon={<BookText />}
          label="About"
          pathname="/about"
        />
      </nav>
    </aside>
  );
}

function SidebarLink({
  href,
  icon,
  label,
  pathname,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  pathname: string;
}) {
  const isActive = usePathname() === pathname;
  return (
    <Link
      href={href}
      className={clsx(
        'flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition',
        {
          'text-gray-900 font-medium dark:text-white': isActive,
          'text-gray-500 dark:text-gray-400': !isActive,
        }
      )}
    >
      <span className="w-5 h-5">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}
