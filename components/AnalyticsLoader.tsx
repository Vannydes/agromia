'use client';

import { useEffect } from 'react';
import Script from 'next/script';

const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;
const gaId = process.env.NEXT_PUBLIC_GA_ID;

export function AnalyticsLoader() {
  useEffect(() => {
    console.log('[Hydration] Analytics loader mounted', { clarityId, gaId });
  }, []);

  if (!clarityId && !gaId) {
    return null;
  }

  return (
    <>
      {gaId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
            onLoad={() => console.log('[Hydration] Google Analytics loaded')}
            onError={(error) => console.error('[Hydration] Google Analytics failed to load', error)}
          />
          <Script
            id="ga-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${gaId}', { page_path: window.location.pathname });`,
            }}
          />
        </>
      ) : null}

      {clarityId ? (
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, 'clarity', 'script', '${clarityId}');`,
          }}
          onLoad={() => console.log('[Hydration] Microsoft Clarity loaded')}
          onError={(error) => console.error('[Hydration] Microsoft Clarity failed to load', error)}
        />
      ) : null}
    </>
  );
}
