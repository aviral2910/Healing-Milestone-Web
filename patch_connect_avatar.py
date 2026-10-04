import re

with open('src/app/connect/page.tsx', 'r') as f:
    content = f.read()

old_welcome = """          <div style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
            Welcome, <strong style={{ color: 'var(--text-primary)', marginLeft: '6px' }}>{profile?.role === 'healthcareProfessional' ? 'Dr. ' : ''}{profile?.displayName || user.displayName}</strong>
            <UserBadge role={profile?.role} isVerified={profile?.isVerified || (profile as any)?.is_verified} size={22} style={{ marginLeft: '8px' }} />
          </div>"""

new_welcome = """          <Link href={`/user/${profile?.id || user.uid}`} style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', marginBottom: '24px', gap: '12px', padding: '6px 16px 6px 6px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.05)', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(218, 165, 32, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.1rem', border: '1px solid rgba(218, 165, 32, 0.3)' }}>
              {(profile?.displayName || user.displayName || '?')[0].toUpperCase()}
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <strong style={{ color: 'var(--text-primary)', fontSize: '1.05rem' }}>{profile?.role === 'healthcareProfessional' ? 'Dr. ' : ''}{profile?.displayName || user.displayName}</strong>
              <UserBadge role={profile?.role} isVerified={profile?.isVerified || (profile as any)?.is_verified} size={18} style={{ marginLeft: '6px' }} />
            </div>
          </Link>"""

content = content.replace(old_welcome, new_welcome)

with open('src/app/connect/page.tsx', 'w') as f:
    f.write(content)
