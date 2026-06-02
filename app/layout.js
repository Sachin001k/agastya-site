import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Footer from './components/Footer';
import './globals.css';

export const metadata = {
  title: {
    default: 'Agastya Khanna — Economics & Energy',
    template: '%s · Agastya Khanna',
  },
  description: 'Research, writing, and conversations on the economics of energy and India\'s clean-energy transition.',
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
        <Footer />
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