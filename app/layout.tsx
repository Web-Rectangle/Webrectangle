import './globals.css';

import type { Metadata } from 'next';

import { inter } from '@/lib/fonts';

export const metadata: Metadata = {
  title: 'WebRectangle',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
