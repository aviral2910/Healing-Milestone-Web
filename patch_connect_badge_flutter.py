import re

with open('src/app/connect/page.tsx', 'r') as f:
    content = f.read()

# Import UserBadge
if 'import { UserBadge }' not in content:
    content = content.replace("import { User, Clock, Calendar, Trash2, Eye, FileText, Loader2 } from 'lucide-react';", "import { User, Clock, Calendar, Trash2, Eye, FileText, Loader2 } from 'lucide-react';\nimport { UserBadge } from '@/components/UserBadge';")

# Replace old checkmark with new component
old_badge_usage = """{(profile?.isVerified || (profile as any)?.is_verified) && <span className="verified-badge" title="Verified">✓</span>}"""
new_badge_usage = """<UserBadge role={profile?.role} isVerified={profile?.isVerified || (profile as any)?.is_verified} size={18} />"""
content = content.replace(old_badge_usage, new_badge_usage)

with open('src/app/connect/page.tsx', 'w') as f:
    f.write(content)
