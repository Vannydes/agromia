import type { Metadata } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';

export const metadata: Metadata = {
  metadataBase: new URL('https://agromia.vercel.app'),
  title: 'Agromia | Coltiva il tuo orto con semplicità',
  description: 'Prenditi cura del tuo orto senza stress. Monitora i tuoi progressi, impara dai raccolti e guarda crescere il frutto del tuo lavoro',

  openGraph: {
    title: 'Agromia',
    description: 'Dalla semina al raccolto, Agromia ti accompagna in ogni stagione. Segui la luna, il meteo e tieni d’occhio i tuoi successi.',
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
    description: 'Monitora raccolti e costi, segui i ritmi della natura e goditi i frutti della tua terra con Agromia.',
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
      {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}
    </html>
  );
}