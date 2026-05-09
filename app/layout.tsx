import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';

export const metadata: Metadata = {
  title: 'Agromia',
  description: 'Gestionale SaaS per l orto',

  openGraph: {
    title: 'Agromia',
    description: 'Gestisci il tuo orto con dashboard, raccolti e costi.',
    url: 'https://agromia.vercel.app',
    siteName: 'Agromia',
    images: [
      {
        url: '/imgwat.png',
        width: 1200,
        height: 630,
      }
    ],
    locale: 'it_IT',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Agromia',
    description: 'Gestisci il tuo orto con dashboard, raccolti e costi.',
    images: ['/imgwat.png'],
  },

  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" data-theme="light">
      <body className="bg-primary text-primary">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}