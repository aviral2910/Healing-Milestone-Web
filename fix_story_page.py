import re

with open('src/app/story/[id]/page.tsx', 'r') as f:
    content = f.read()

content = content.replace("const authorName = story.authorName || \"User\";", "const authorName = story.author?.displayName || story.authorName || \"User\";")
content = content.replace("const authorPicture = story.authorPicture || \"\";", "const authorPicture = story.author?.profilePicture || story.authorPicture || \"\";")
content = content.replace("const reactions = story.reactions || {};", "const reactions = story.reactionCounts || story.reactions || {};")
content = content.replace("const likesCount = story.likesCount || 0;", "const likesCount = Object.values(reactions).reduce((a, b) => (a as number) + (b as number), 0) || story.likesCount || 0;")

with open('src/app/story/[id]/page.tsx', 'w') as f:
    f.write(content)
