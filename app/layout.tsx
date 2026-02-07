import { Overpass } from 'next/font/google';
import './globals.scss';
import { GoogleTagManager } from '@next/third-parties/google';
import GTM from '../components/GTM';
import { Metadata } from 'next';

const overPass = Overpass({
  subsets: ['latin'],
  display: 'swap',
  style: 'normal',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Doubtlet || Home',
  publisher: 'Doubtlet',
  referrer: 'origin',
  authors: [{ name: 'Neetesh Kumar' }],
  description:
    'Doubtlet.com provides step-by-step solutions for mathematical problems, including Pre Algebra, Algebra, Pre Calculus, Calculus, Geometry, Discrete Maths, Linear Algebra, Linear Programming, Probability & Statistics, and Finance. Solve math problems online with detailed explanations and easy-to-use calculators.',
  keywords: [
    'calculator',
    'algebra',
    'calculator with steps',
    'doubtlet',
    'step-by-step math solutions',
    'math problem solver',
    'online math calculator',
    'algebra problem solver',
    'pre algebra calculator',
    'pre calculus solutions',
    'calculus solutions',
    'geometry help',
    'discrete maths calculator',
    'linear algebra solver',
    'linear programming calculator',
    'probability and statistics calculator',
    'finance calculator',
    'solve math problems online',
    'math homework help',
    'math formula sheet',
    'detailed math explanations',
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
          integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <meta
          name="google-site-verification"
          content="i5NoSs57ANTKNFSKb1X2xFiXwsgDsepSiUbwjZnrIh8"
        />
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/uicons-regular-rounded/css/uicons-regular-rounded.css"
        ></link>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7951628967835372"
          crossOrigin="anonymous"
        ></script>
        <GoogleTagManager gtmId="G-L8LGL2JHL2" />
        <GTM />
      </head>
      <body className={`${overPass.className}`}>
        <div className="no-print">{children}</div>
      </body>
    </html>
  );
}
