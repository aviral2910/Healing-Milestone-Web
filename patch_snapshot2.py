import re

with open('src/app/snapshot/[id]/page.tsx', 'r') as f:
    content = f.read()

# Replace Web Sync
content = content.replace("""<Link href="/web" className="download-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', textDecoration: 'none', fontSize: '0.9rem', backgroundColor: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)' }}>""",
                          """<Link href="/web" className="nav-btn">""")

# Replace HM Connect
content = content.replace("""<Link href="/connect" className="download-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', textDecoration: 'none', fontSize: '0.9rem' }}>""",
                          """<Link href="/connect" className="nav-btn">""")

# Replace Download the App (keep it as .nav-btn so it matches)
content = content.replace("""<button className="download-btn">Download the App</button>""",
                          """<button className="nav-btn">Download the App</button>""")

with open('src/app/snapshot/[id]/page.tsx', 'w') as f:
    f.write(content)
