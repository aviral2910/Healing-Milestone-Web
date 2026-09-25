import re

with open('src/app/user/[id]/page.tsx', 'r') as f:
    content = f.read()

# Import UserBadge
if 'import { UserBadge }' not in content:
    content = content.replace("import { notFound } from 'next/navigation';", "import { notFound } from 'next/navigation';\nimport { UserBadge } from '@/components/UserBadge';")

# Replace old checkmark with new component
old_badge_usage = """{user.isVerified && (
              <span className="verified-badge" title="Verified">✓</span>
            )}"""
new_badge_usage = """<UserBadge role={user.role} isVerified={user.isVerified} size={24} style={{ marginLeft: '12px' }} />"""

content = content.replace(old_badge_usage, new_badge_usage)

with open('src/app/user/[id]/page.tsx', 'w') as f:
    f.write(content)
