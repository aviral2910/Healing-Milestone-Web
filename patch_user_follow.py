import re

with open('src/app/user/[id]/page.tsx', 'r') as f:
    content = f.read()

# Add import
if 'FollowButton' not in content:
    content = content.replace(
        'import ProfileTabs from "./ProfileTabs";',
        'import ProfileTabs from "./ProfileTabs";\nimport FollowButton from "@/components/FollowButton";'
    )

old_name = """          <h1 className="profile-name">
            {user.displayName}
            <UserBadge role={user.role} isVerified={user.isVerified} size={24} style={{ marginLeft: '12px' }} />
          </h1>"""

new_name = """          <h1 className="profile-name">
            {user.displayName}
            <UserBadge role={user.role} isVerified={user.isVerified} size={24} style={{ marginLeft: '12px' }} />
          </h1>
          <FollowButton targetUserId={user.userId || id} />"""

content = content.replace(old_name, new_name)

with open('src/app/user/[id]/page.tsx', 'w') as f:
    f.write(content)
