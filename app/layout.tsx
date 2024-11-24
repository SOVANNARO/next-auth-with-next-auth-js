import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/auth-context';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Next.js Authentication',
  description: 'Authentication system with Next.js and JWT',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}