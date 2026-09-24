import os

target = """<a href="https://healingmilestones.in" target="_blank" rel="noopener noreferrer">
          <button className="download-btn">Download the App</button>
        </a>"""
replacement = """<div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Link href="/connect" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none', fontSize: '0.95rem', letterSpacing: '0.5px' }}>HM Connect</Link>
          <a href="https://healingmilestones.in" target="_blank" rel="noopener noreferrer">
            <button className="download-btn">Download the App</button>
          </a>
        </div>"""

for file_path in ['src/app/snapshot/[id]/page.tsx', 'src/app/snapshot/[id]/compare/page.tsx']:
    if os.path.exists(file_path):
        with open(file_path, 'r') as f:
            content = f.read()
        content = content.replace(target, replacement)
        with open(file_path, 'w') as f:
            f.write(content)
