import re

with open('src/app/globals.css', 'r') as f:
    content = f.read()

bad_css = """
.download-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  color: var(--text-primary);
  backdrop-filter: blur(10px);
}

.download-btn.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.download-btn:not(.disabled):hover {
  border-color: var(--primary);
  background: rgba(212, 175, 55, 0.1);
}"""

content = content.replace(bad_css, "")

with open('src/app/globals.css', 'w') as f:
    f.write(content)
