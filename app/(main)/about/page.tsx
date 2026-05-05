import type { Metadata } from 'next';
import Container from '@/components/Container';
import { auth } from '@/../auth';
export const metadata: Metadata = {
  title: 'About',
};

export default async function Page() {
  const session = await auth();
  console.log('Session in About page:', session);
  return (
    <Container>
      <h1 className="text-3xl font-medium text-gray-900 mt-4 mb-3 text-center">
        {session
          ? `Welcome, ${session?.user?.name}!`
          : 'Welcome to the Blog News!'}
      </h1>
      <h4 className="text-lg text-gray-600 mb-4 text-center">
        {session?.user?.email
          ? `Your email: ${session.user.email}`
          : 'Please log in to see your email.'}
      </h4>
    </Container>
  );
}
