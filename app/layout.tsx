import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';

import { Toaster } from "@/components/ui/sonner";
import { SyncUser } from '@/components/SyncUser';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BrandGenie - AI-Powered Branding Platform',
  description: 'Generate complete branding elements for your business using AI',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //This cookie stores the current user token
  const cookieStore = await cookies();
  const token = cookieStore.get('authToken')?.value;
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
          {children}
          <SyncUser token={token} /> {/* Keep the client side user variable synced with the current signed in user (using the authToken) */}
          <Toaster theme='light' />
      </body>
    </html>
  );
}