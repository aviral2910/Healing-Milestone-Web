import re

with open('src/app/connect/page.tsx', 'r') as f:
    content = f.read()

old_header = """<header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 40px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>"""
new_header = """<header className="banner">"""

content = content.replace(old_header, new_header)

with open('src/app/connect/page.tsx', 'w') as f:
    f.write(content)
