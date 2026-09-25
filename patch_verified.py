import re

with open('src/app/connect/page.tsx', 'r') as f:
    content = f.read()

# 1. Update imports
if 'BadgeCheck' not in content:
    content = content.replace("import { User, Clock, Calendar, Trash2, Eye, FileText, Loader2 }", "import { User, Clock, Calendar, Trash2, Eye, FileText, Loader2, BadgeCheck }")

# 2. Add `profile` to useAuth
content = content.replace("const { user, loading, needsOnboarding, logout } = useAuth();", "const { user, profile, loading, needsOnboarding, logout } = useAuth();")

# 3. Update the Welcome message
old_welcome = """            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Welcome, {user.displayName}
            </div>"""

new_welcome = """            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}>
              Welcome, {profile?.role === 'doctor' ? 'Dr. ' : ''}{profile?.displayName || user.displayName}
              {profile?.isVerified && <BadgeCheck size={16} color="#3b82f6" style={{ marginLeft: '6px' }} />}
            </div>"""

content = content.replace(old_welcome, new_welcome)

with open('src/app/connect/page.tsx', 'w') as f:
    f.write(content)

