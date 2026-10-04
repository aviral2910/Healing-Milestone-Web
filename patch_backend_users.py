import re

with open('/Users/aviraldixit/self/healing_milestones_backend/app/api/endpoints/users.py', 'r') as f:
    content = f.read()

# Make sure get_current_optional_user is imported
if 'get_current_optional_user' not in content:
    content = content.replace(
        'from app.core.security import get_current_user',
        'from app.core.security import get_current_user, get_current_optional_user'
    )
    if 'from typing import ' not in content:
        content = 'from typing import Optional\n' + content
    else:
        content = content.replace('from typing import ', 'from typing import Optional, ')

# Patch the get_user_by_uid signature
old_sig = """@router.get("/{uid}", response_model=dict)
def get_user_by_uid(uid: str, db: Session = Depends(get_db)):"""

new_sig = """@router.get("/{uid}", response_model=dict)
def get_user_by_uid(
    uid: str, 
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_optional_user)
):"""

content = content.replace(old_sig, new_sig)

# Patch the return block
old_return = """    return {
        "userId": user.firebase_uid,
        "email": user.email,
        "displayName": user.display_name,
        "username": user.username,
        "profilePicture": user.profile_picture,
        "specialty": user.specialty,
        "bio": user.bio,
        "role": user.role.name if user.role else "patient",
        "isVerified": user.is_verified,
        "phoneNumber": user.phone_number,
        "bookmarkedStories": [str(b.story_id) for b in bookmarks] if bookmarks else [],"""

new_return = """    is_owner = current_user and current_user.id == user.id

    return {
        "userId": user.firebase_uid,
        "email": user.email if is_owner else None,
        "displayName": user.display_name,
        "username": user.username,
        "profilePicture": user.profile_picture,
        "specialty": user.specialty,
        "bio": user.bio,
        "role": user.role.name if user.role else "patient",
        "isVerified": user.is_verified,
        "phoneNumber": user.phone_number if is_owner else None,
        "bookmarkedStories": [str(b.story_id) for b in bookmarks] if (bookmarks and is_owner) else [],"""

content = content.replace(old_return, new_return)

with open('/Users/aviraldixit/self/healing_milestones_backend/app/api/endpoints/users.py', 'w') as f:
    f.write(content)
