import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Footer from './components/Footer';
import HideOnAdmin from './components/HideOnAdmin';
import './globals.css';

// Prefer the real domain: per-deployment *.vercel.app URLs can be password-protected,
// which breaks link-preview images on WhatsApp/LinkedIn.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL
  || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : null)
  || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
const DESCRIPTION = 'Research, essays and conversations on the economics of energy and India\'s clean-energy transition.';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Agastya Khanna — Economics & Energy',
    template: '%s · Agastya Khanna',
  },
  description: DESCRIPTION,
  openGraph: {
    type: 'website',
    siteName: 'Agastya Khanna',
    title: 'Agastya Khanna — Economics & Energy',
    description: DESCRIPTION,
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agastya Khanna — Economics & Energy',
    description: DESCRIPTION,
  },
  icons: {
    icon: '/images/FullLogo_Transparent_NoBuffer.png',
    apple: '/images/FullLogo_Transparent_NoBuffer.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <HideOnAdmin><Footer /></HideOnAdmin>
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#0d2318',
              color: '#fdfcf8',
              border: '1px solid #1a4a2a',
            },
          }}
        />
      </body>
    </html>
  );
}