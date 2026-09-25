import re

with open('src/app/connect/page.tsx', 'r') as f:
    content = f.read()

# 1. Update the header
old_header = """      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 40px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img src="/icon.png" alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '8px' }} />
          <div>
            <h1 style={{ margin: 0, fontSize: '1.4rem', fontFamily: "'Oswald', sans-serif", color: 'var(--primary)' }}>
              HM Connect
            </h1>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}>
              Welcome, {profile?.role === 'healthcareProfessional' ? 'Dr. ' : ''}{profile?.displayName || user.displayName}
              <UserBadge role={profile?.role} isVerified={profile?.isVerified || (profile as any)?.is_verified} size={18} />
            </div>
          </div>
        </div>"""

new_header = """      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 40px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img src="/icon.png" alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '8px' }} />
          <div>
            <h1 style={{ margin: 0, fontSize: '1.4rem', fontFamily: "'Oswald', sans-serif", color: 'var(--text-primary)' }}>
              HM Connect
            </h1>
          </div>
        </div>"""

content = content.replace(old_header, new_header)

# 2. Update the Main area to include the Welcome text
old_main = """      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', margin: '0 0 8px 0', fontFamily: "'Oswald', sans-serif" }}>Patient Roster</h2>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Manage and monitor your saved patient health snapshots.</p>
          </div>
        </div>"""

new_main = """      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px' }}>
        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
            Welcome, <strong style={{ color: 'var(--text-primary)', marginLeft: '6px' }}>{profile?.role === 'healthcareProfessional' ? 'Dr. ' : ''}{profile?.displayName || user.displayName}</strong>
            <UserBadge role={profile?.role} isVerified={profile?.isVerified || (profile as any)?.is_verified} size={22} style={{ marginLeft: '8px' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <h2 style={{ fontSize: '1.8rem', margin: '0 0 8px 0', fontFamily: "'Oswald', sans-serif" }}>Patient Roster</h2>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Manage and monitor your saved patient health snapshots.</p>
            </div>
          </div>
        </div>"""

content = content.replace(old_main, new_main)

with open('src/app/connect/page.tsx', 'w') as f:
    f.write(content)
