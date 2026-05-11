import type { Metadata } from 'next';
import Container from '@/components/Container';

export const metadata: Metadata = {
  title: 'About',
};

export default async function Page() {
  return (
    <Container>
      <div className="max-w-3xl mx-auto py-10 space-y-6">
        <h1 className="text-3xl font-bold">About</h1>

        <p className="text-muted-foreground leading-7">
          Welcome to our community platform where users can create, share, and
          explore posts on different topics.
        </p>

        <p className="text-muted-foreground leading-7">
          Our goal is to provide a simple and user-friendly space for people to
          express ideas, share experiences, and connect with others through
          meaningful content.
        </p>

        <p className="text-muted-foreground leading-7">
          Users can publish posts, interact with the community, and discover new
          perspectives from people around the world.
        </p>

        <p className="text-muted-foreground leading-7">
          Whether you want to share knowledge, tell a story, or stay updated
          with recent discussions, our platform is designed to make posting and
          reading content easy and enjoyable.
        </p>

        <p className="text-muted-foreground leading-7">
          Thank you for being part of our growing community.
        </p>
      </div>
    </Container>
  );
}
