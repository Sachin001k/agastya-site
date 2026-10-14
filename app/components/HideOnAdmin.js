'use client';

import { usePathname } from 'next/navigation';

// Hides public-site chrome (e.g. the footer) inside the admin panel.
export default function HideOnAdmin({ children }) {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;
  return children;
}
