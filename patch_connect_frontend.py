import re

with open('src/app/connect/page.tsx', 'r') as f:
    content = f.read()

# 1. Update layout to full width
content = content.replace("display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))'", "display: 'grid', gridTemplateColumns: '1fr'")

# 2. Update author name usage
old_author_line = "{item.mix_view?.author?.display_name || item.mix_view?.user?.display_name || 'Patient Snapshot'}"
new_author_line = "{item.mix_view?.author_name || 'Patient Snapshot'}"
content = content.replace(old_author_line, new_author_line)

# Let's ensure responsiveness for the card content. 
# Previously it had a row for metadata: `flexDirection: 'column'`
# And the button container had `flex: 1` and `flex: 2`. Let's just leave it, it's responsive.

with open('src/app/connect/page.tsx', 'w') as f:
    f.write(content)
