import re
with open('src/app/user/[id]/page.tsx', 'r') as f:
    content = f.read()
content = content.replace(
    'alt={user.displayName}',
    'alt={user.displayName || "User"}'
)
with open('src/app/user/[id]/page.tsx', 'w') as f:
    f.write(content)
