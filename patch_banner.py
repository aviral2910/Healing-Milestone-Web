import re

with open('src/app/globals.css', 'r') as f:
    content = f.read()

old_banner = """.banner {
  background: rgba(9, 9, 11, 0.85);
  border-bottom: 1px solid var(--border);
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 50;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
}"""

new_banner = """.banner {
  background: transparent;
  border-bottom: none;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 50;
}"""

content = content.replace(old_banner, new_banner)

with open('src/app/globals.css', 'w') as f:
    f.write(content)
