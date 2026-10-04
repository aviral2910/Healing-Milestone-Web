import re

with open('src/app/page.tsx', 'r') as f:
    content = f.read()

old_header = """<header className="home-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '24px' }}>"""
new_header = """<header className="banner">"""

content = content.replace(old_header, new_header)

with open('src/app/page.tsx', 'w') as f:
    f.write(content)
