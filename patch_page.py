import re

with open('src/app/page.tsx', 'r') as f:
    content = f.read()

content = content.replace("""<Link href="/connect" className="download-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', textDecoration: 'none', fontSize: '0.9rem' }}>""",
                          """<Link href="/connect" className="nav-btn">""")

content = content.replace("""<Link href="/web" className="download-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', textDecoration: 'none', fontSize: '0.9rem' }}>""",
                          """<Link href="/web" className="nav-btn">""")

with open('src/app/page.tsx', 'w') as f:
    f.write(content)
