import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Realights Online Store',
  description: 'Separated customer store and backoffice for Realights manual import commerce.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
