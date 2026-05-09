import type { Metadata } from 'next';
import Container from '@/components/Container';
import { Suspense } from 'react';
import UserPosts from '@/components/UserPosts';
import { TablesSkeleton } from '@/ui/skeletons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShieldUser, LibraryBig } from 'lucide-react';
import ProfileForm from '@/components/ProfileForm';

export const metadata: Metadata = {
  title: 'Profile',
};

export default async function Page() {
  return (
    <Container>
      <Tabs defaultValue="user-info" className="mb-4">
        <div className="flex items-center justify-center mb-4">
          <TabsList>
            <TabsTrigger value="user-info">
              <ShieldUser />
              User Info
            </TabsTrigger>
            <TabsTrigger value="posts">
              <LibraryBig />
              My Posts
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="user-info">
          <ProfileForm />
        </TabsContent>
        <TabsContent value="posts">
          <Suspense fallback={<TablesSkeleton />}>
            <UserPosts />
          </Suspense>
        </TabsContent>
      </Tabs>
    </Container>
  );
}
