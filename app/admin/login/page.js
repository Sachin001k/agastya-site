'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase-client';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError('Invalid email or password.');
      setLoading(false);
    } else {
      router.replace('/admin');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#060f0b', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Image
            src="/images/FullLogo_Transparent_NoBuffer.png"
            alt="Agastya Khanna"
            width={72}
            height={72}
            style={{ height: '72px', width: 'auto', margin: '0 auto 16px' }}
          />
          <p style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#477e67' }}>Admin Panel</p>
        </div>

        <form onSubmit={handleLogin} style={{ background: '#0d2318', borderRadius: '20px', border: '1px solid #1a4a2a', padding: '36px' }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: '600', color: '#fdfcf8', marginBottom: '8px', textAlign: 'center' }}>
            Sign in
          </h1>
          <p style={{ fontSize: '14px', color: '#7aaa8e', textAlign: 'center', marginBottom: '32px' }}>
            Admin access only
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#fdfcf8', marginBottom: '8px' }}>Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #1a4a2a', background: 'rgba(255,255,255,0.05)', color: '#fdfcf8', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#fdfcf8', marginBottom: '8px' }}>Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #1a4a2a', background: 'rgba(255,255,255,0.05)', color: '#fdfcf8', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {error && (
              <p style={{ fontSize: '13px', color: '#f87171', padding: '10px 14px', background: 'rgba(248,113,113,0.1)', borderRadius: '8px', border: '1px solid rgba(248,113,113,0.2)' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ padding: '14px', borderRadius: '999px', background: '#f59e0b', color: '#060f0b', fontSize: '14px', fontWeight: '700', border: 'none', cursor: 'pointer', marginTop: '8px' }}
            >
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
