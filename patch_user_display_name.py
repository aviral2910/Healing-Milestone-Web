import re

with open('src/app/user/[id]/page.tsx', 'r') as f:
    content = f.read()

# Replace user.displayName with (user.displayName || 'Unknown')
content = content.replace(
    '{user.displayName.charAt(0)}',
    '{(user.displayName || "?").charAt(0).toUpperCase()}'
)
content = content.replace(
    'authorName={user.displayName}',
    'authorName={user.displayName || "Unknown"}'
)

content = content.replace(
    'title: `${user.displayName}\'s Profile | Healing Milestones`',
    'title: `${user.displayName || "User"}\'s Profile | Healing Milestones`'
)

content = content.replace(
    'description: user.bio || `Check out ${user.displayName}\'s profile',
    'description: user.bio || `Check out ${user.displayName || "User"}\'s profile'
)

content = content.replace(
    '{user.displayName}\n            <UserBadge',
    '{user.displayName || "Unknown"}\n            <UserBadge'
)

with open('src/app/user/[id]/page.tsx', 'w') as f:
    f.write(content)
