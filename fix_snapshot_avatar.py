import re

with open('src/app/snapshot/[id]/page.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}",
    'className="hover-opacity"'
)

with open('src/app/snapshot/[id]/page.tsx', 'w') as f:
    f.write(content)
