import Link from 'next/link';
import Image from 'next/image';
import { auth } from '@/../auth';
import { logout } from '../lib/actions';
import NavLinks from './NavLinks';
import ModeToggle from './ModeToggle';

export default async function Navbar() {
  const session = await auth();
  const isLoggedIn = !!session?.user;
  return (
    <nav className="flex min-h-16 px-6 w-full justify-between items-center bg-white border-b border-gray-100 dark:bg-black dark:border-gray-700">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/myblog-logo.svg"
          width={120}
          height={36}
          alt="myBlog"
          className="dark:invert"
        />
      </Link>

      <NavLinks />

      {isLoggedIn ? (
        <div className="flex gap-2">
          <ModeToggle />
          {/* <span className="text-sm text-gray-500">{session?.user?.name}</span> */}
          <Link
            href="/add"
            className="text-xs bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-gray-700"
          >
            Add post
          </Link>
          <form action={logout}>
            <button className="text-xs bg-white text-black border border-gray-200 px-4 py-2 rounded-full hover:bg-gray-900 hover:text-white">
              Sign Out
            </button>
          </form>
        </div>
      ) : (
        <div className="flex gap-2">
          <Link
            href="/login"
            className="text-xs bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-gray-700"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="text-xs bg-white text-black px-4 py-2 rounded-full hover:bg-gray-900 hover:text-white"
          >
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
}
