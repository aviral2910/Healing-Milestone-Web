import re

with open('src/app/snapshot/[id]/page.tsx', 'r') as f:
    content = f.read()

# Add import
if "import { MonitorSmartphone }" not in content:
    content = content.replace('import Link from "next/link";', 
                              'import Link from "next/link";\nimport { MonitorSmartphone } from "lucide-react";')

old_banner = """        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Link href="/connect" className="download-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', textDecoration: 'none', fontSize: '0.9rem' }}>HM Connect</Link>
          <a href="https://healingmilestones.in" target="_blank" rel="noopener noreferrer">
            <button className="download-btn">Download the App</button>
          </a>
        </div>"""

new_banner = """        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Link href="/web" className="download-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', textDecoration: 'none', fontSize: '0.9rem', backgroundColor: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)' }}>
            <MonitorSmartphone size={16} /> Web Sync
          </Link>
          <Link href="/connect" className="download-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', textDecoration: 'none', fontSize: '0.9rem' }}>HM Connect</Link>
          <a href="https://healingmilestones.in" target="_blank" rel="noopener noreferrer">
            <button className="download-btn">Download the App</button>
          </a>
        </div>"""

content = content.replace(old_banner, new_banner)

with open('src/app/snapshot/[id]/page.tsx', 'w') as f:
    f.write(content)
