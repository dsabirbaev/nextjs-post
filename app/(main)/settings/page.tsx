import type { Metadata } from 'next';
import Container from '@/components/Container';
import ChangePasswordForm from '@/ui/change-password-form';
export const metadata: Metadata = {
  title: 'Settings',
};

export default async function Page() {
  return (
    <Container>
      <h1 className="text-center text-2xl text-bold mb-2">Settings</h1>
      <ChangePasswordForm />
    </Container>
  );
}
