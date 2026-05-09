import type { Metadata } from 'next';
import Container from '@/components/Container';
import ChangePasswordForm from '@/ui/change-password-form';
import ChangeProfileForm from '@/components/ChangeProfileForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserRoundCog, UserRoundKey } from 'lucide-react';
import { auth } from '@/../auth';
export const metadata: Metadata = {
  title: 'Settings',
};

export default async function Page() {
  const session = await auth();
  return (
    <Container>
      <Tabs defaultValue="profile">
        <div className="flex items-center justify-center mb-6">
          <TabsList>
            <TabsTrigger value="profile">
              <UserRoundCog />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security">
              <UserRoundKey />
              Security
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="profile">
          <ChangeProfileForm user={session?.user ?? {}} />
        </TabsContent>
        <TabsContent value="security">
          <ChangePasswordForm />
        </TabsContent>
      </Tabs>
    </Container>
  );
}
