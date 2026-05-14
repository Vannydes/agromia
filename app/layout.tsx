import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { Footer } from '@/components/layout/Footer';

const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;

export const metadata: Metadata = {
  metadataBase: new URL('https://agromia.vercel.app'),
  title: 'Agromia | Coltiva il tuo orto con semplicità',
  description: 'Prenditi cura del tuo orto senza stress. Monitora i tuoi progressi, impara dai raccolti e guarda crescere il frutto del tuo lavoro',

  verification: {
    google: '3OO5mxkchyoOZwouIz9_1BcutyrR4Mu5KVqjRa0sNnY',
  },

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
      <body className="bg-primary text-primary min-h-screen flex flex-col">
        <AuthProvider>
          <div className="flex-1">{children}</div>
        </AuthProvider>
        <Footer />
        {clarityId ? (
          <Script
            id="microsoft-clarity"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, 'clarity', 'script', '${clarityId}');`,
            }}
          />
        ) : null}
      </body>
    </html>
  );
}