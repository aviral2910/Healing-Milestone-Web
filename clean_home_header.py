import re

with open('src/app/globals.css', 'r') as f:
    content = f.read()

# Match the home-header block specifically
block = """.home-header {
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
}"""

content = content.replace(block, "")

with open('src/app/globals.css', 'w') as f:
    f.write(content)
