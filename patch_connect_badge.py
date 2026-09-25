import re

with open('src/app/connect/page.tsx', 'r') as f:
    content = f.read()

# Replace the BadgeCheck usage with the span
old_badge = "{(profile?.isVerified || (profile as any)?.is_verified) && <BadgeCheck size={16} color=\"#3b82f6\" style={{ marginLeft: '6px' }} />}"
new_badge = "{(profile?.isVerified || (profile as any)?.is_verified) && <span className=\"verified-badge\" title=\"Verified\">✓</span>}"

content = content.replace(old_badge, new_badge)

# Also let's remove BadgeCheck from imports if it's there
content = content.replace(", BadgeCheck }", " }")

with open('src/app/connect/page.tsx', 'w') as f:
    f.write(content)

