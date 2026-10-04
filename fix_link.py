import re

with open('src/app/story/[id]/page.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'className="author-badge" style={{ textDecoration: \'none\', transition: \'opacity 0.2s\' }} className="author-badge hover-opacity"',
    'className="author-badge hover-opacity" style={{ textDecoration: \'none\', transition: \'opacity 0.2s\' }}'
)

with open('src/app/story/[id]/page.tsx', 'w') as f:
    f.write(content)
