import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://kickback-collective.vercel.app'),
  title: 'Kickback Collective',
  description: 'Your real-time football chat and insights hub',
  openGraph: {
    title: 'Kickback Collective',
    description: 'Your real-time football chat and insights hub',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kickback Collective',
    description: 'Your real-time football chat and insights hub',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-dark-background text-white">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
