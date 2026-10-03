import re

with open('src/app/globals.css', 'r') as f:
    content = f.read()

new_css = """
/* Modular Navigation Button */
.nav-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  color: var(--text-primary);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}

.nav-btn:hover {
  border-color: var(--primary);
  background: rgba(212, 175, 55, 0.1);
  color: var(--primary);
}
"""

content += new_css

with open('src/app/globals.css', 'w') as f:
    f.write(content)
