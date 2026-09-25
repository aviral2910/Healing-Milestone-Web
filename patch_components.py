import re

with open('src/components/UserBadge.tsx', 'r') as f:
    content = f.read()

# Replace title="..." with <title>...</title> inside the svg
content = re.sub(r'<svg(.*?)title="(.*?)">', r'<svg\1>\n        <title>\2</title>', content)

with open('src/components/UserBadge.tsx', 'w') as f:
    f.write(content)

with open('src/app/user/[id]/page.tsx', 'r') as f:
    user_page = f.read()

if 'import { UserBadge }' not in user_page:
    user_page = "import { UserBadge } from '@/components/UserBadge';\n" + user_page

with open('src/app/user/[id]/page.tsx', 'w') as f:
    f.write(user_page)

