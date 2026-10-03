import re

with open('src/app/connect/page.tsx', 'r') as f:
    content = f.read()

old_logo = """        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img src="/icon.png" alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '8px' }} />
          <div>
            <h1 style={{ margin: 0, fontSize: '1.4rem', fontFamily: "'Oswald', sans-serif", color: 'var(--text-primary)' }}>
              HM Connect
            </h1>
          </div>
        </div>"""

new_logo = """        <div className="banner-brand">
          <Link href="/connect" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Logo" className="banner-logo" />
            <div className="banner-title">
              <div style={{ letterSpacing: '0.7px' }}>HEALING</div>
              <div style={{ letterSpacing: '0.2px' }}>MILESTONES <span style={{ color: 'var(--primary)' }}>CONNECT</span></div>
            </div>
          </Link>
        </div>"""

content = content.replace(old_logo, new_logo)

with open('src/app/connect/page.tsx', 'w') as f:
    f.write(content)
