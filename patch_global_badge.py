import re

with open('src/app/globals.css', 'r') as f:
    content = f.read()

if '.verified-badge' not in content:
    content += """\n
.verified-badge {
  background-color: #1DA1F2;
  color: white;
  font-size: 0.8rem;
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-left: 6px;
}
"""
    with open('src/app/globals.css', 'w') as f:
        f.write(content)
