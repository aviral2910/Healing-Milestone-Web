'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthAwareLogo({ href = "/", showConnect = true }: { href?: string, showConnect?: boolean }) {
  const { user } = useAuth();
  
  return (
    <div className="banner-brand">
      <Link href={href} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Logo" className="banner-logo" />
        <div className="banner-title">
          <div style={{ letterSpacing: '0.7px' }}>HEALING</div>
          <div style={{ letterSpacing: '0.2px' }}>
            MILESTONES 
            {showConnect && user && <span style={{ color: 'var(--primary)' }}> CONNECT</span>}
          </div>
        </div>
      </Link>
    </div>
  );
}
