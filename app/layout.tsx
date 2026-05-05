import '@/ui/globals.css';
import { inter } from './ui/fonts';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Blog News',
    default: 'Blog News',
  },
  description: 'Personal blog built with Next.js App Router.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
