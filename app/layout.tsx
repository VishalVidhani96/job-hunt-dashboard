import './globals.css';
import Link from 'next/link';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Daily CV Job Finder',
  description: 'Germany-only daily job matching dashboard.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b bg-white">
          <nav className="mx-auto flex max-w-6xl gap-6 px-4 py-4 text-sm font-medium">
            <Link href="/jobs/new">New in 24h</Link>
            <Link href="/jobs/all">All Jobs</Link>
            <Link href="/profile">Profile</Link>
          </nav>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
