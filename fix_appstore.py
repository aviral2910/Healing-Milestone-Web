import re

with open('src/app/page.tsx', 'r') as f:
    content = f.read()

content = content.replace('className="download-btn disabled"', 'className="nav-btn disabled"')

with open('src/app/page.tsx', 'w') as f:
    f.write(content)

with open('src/app/globals.css', 'r') as f:
    css_content = f.read()

css_content += """
.nav-btn.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}
"""
with open('src/app/globals.css', 'w') as f:
    f.write(css_content)

