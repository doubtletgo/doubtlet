'use client';

import Script from 'next/script';

const GTM = () => {
  return (
    <Script id="gtm-script" strategy="afterInteractive">
      {`window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      gtag('js', new Date());
      gtag('config', 'G-L8LGL2JHL2');
      `}
    </Script>
  );
};

export default GTM;
