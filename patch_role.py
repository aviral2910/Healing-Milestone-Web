import re

with open('src/app/connect/page.tsx', 'r') as f:
    content = f.read()

old_welcome = """              Welcome, {profile?.role === 'doctor' ? 'Dr. ' : ''}{profile?.displayName || user.displayName}
              {profile?.isVerified && <BadgeCheck size={16} color="#3b82f6" style={{ marginLeft: '6px' }} />}"""

new_welcome = """              Welcome, {profile?.role === 'healthcareProfessional' ? 'Dr. ' : ''}{profile?.displayName || user.displayName}
              {(profile?.isVerified || (profile as any)?.is_verified) && <BadgeCheck size={16} color="#3b82f6" style={{ marginLeft: '6px' }} />}"""

content = content.replace(old_welcome, new_welcome)

with open('src/app/connect/page.tsx', 'w') as f:
    f.write(content)

