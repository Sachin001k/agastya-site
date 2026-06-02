'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';

export default function AdminAuthCheck({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session && pathname !== '/admin/login') {
        router.replace('/admin/login');
      } else {
        setAuthed(true);
      }
      setChecking(false);
    });
  }, [pathname, router]);

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#060f0b' }}>
        <p style={{ color: '#7aaa8e', fontSize: '14px' }}>Loading...</p>
      </div>
    );
  }

  if (!authed && pathname !== '/admin/login') return null;

  return children;
}
