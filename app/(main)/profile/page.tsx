import type { Metadata } from 'next';
import Container from '@/components/Container';
import { auth } from '@/../auth';
export const metadata: Metadata = {
  title: 'Profile',
};

export default async function Page() {
  const session = await auth();
  return (
    <Container>
      <h1 className="text-3xl font-medium text-gray-900 mt-4 mb-3 text-center dark:text-white">
        {session
          ? `Welcome, ${session?.user?.name}!`
          : 'Welcome to the Blog News!'}
      </h1>
      <h4 className="text-lg text-gray-600 mb-4 text-center dark:text-white">
        {session?.user?.email
          ? `Your email: ${session.user.email}`
          : 'Please log in to see your email.'}
      </h4>
    </Container>
  );
}
