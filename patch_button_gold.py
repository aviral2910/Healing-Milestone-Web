import re

with open('src/app/snapshot/[id]/SaveToRosterButton.tsx', 'r') as f:
    content = f.read()

old_style = """          background: hovered ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)', 
          color: hovered ? '#ef4444' : '#22c55e', 
          border: hovered ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(34, 197, 94, 0.2)',"""

new_style = """          background: hovered ? 'rgba(239, 68, 68, 0.1)' : 'rgba(212, 175, 55, 0.1)', 
          color: hovered ? '#ef4444' : 'var(--primary)', 
          border: hovered ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(212, 175, 55, 0.3)',"""

content = content.replace(old_style, new_style)

with open('src/app/snapshot/[id]/SaveToRosterButton.tsx', 'w') as f:
    f.write(content)
