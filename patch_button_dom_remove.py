import re

with open('src/app/snapshot/[id]/SaveToRosterButton.tsx', 'r') as f:
    content = f.read()

# Remove the badge manipulation logic
content = re.sub(r"const badge = document\.getElementById\('snapshot-connect-badge'\);\n\s*if \(badge\) badge\.style\.display = '.*?';\n", "", content)

with open('src/app/snapshot/[id]/SaveToRosterButton.tsx', 'w') as f:
    f.write(content)
