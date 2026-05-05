import Link from 'next/link';
import { FaceFrownIcon } from '@heroicons/react/24/outline';
import Container from '@/components/Container';

export default function NotFound() {
  return (
    <Container>
      <FaceFrownIcon className="w-10 text-gray-400" />
      <h2 className="text-xl font-semibold my-4">404 Not Found</h2>
      <Link
        href="/"
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
      >
        Go Back
      </Link>
    </Container>
  );
}
