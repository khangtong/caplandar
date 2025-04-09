import type { Metadata } from 'next';
import { Lexend } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';

import './globals.css';
import './fonts/font-awesome-6.3.0-pro-main/font-awesome-6.3.0-pro-main/css/all.css';

const lexend = Lexend({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | Caplandar',
    default: 'Caplandar',
  },
  description: 'Schedule management application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lexend.className} antialiased`}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
