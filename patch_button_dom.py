import re

with open('src/app/snapshot/[id]/SaveToRosterButton.tsx', 'r') as f:
    content = f.read()

# Update the initial check
old_check = """          if (savedItem) {
            setSaved(true);
            setRosterId(savedItem.id);
          }"""

new_check = """          if (savedItem) {
            setSaved(true);
            setRosterId(savedItem.id);
            const badge = document.getElementById('snapshot-connect-badge');
            if (badge) badge.style.display = 'inline';
          }"""

content = content.replace(old_check, new_check)

# Update the save toggle
old_save = """        if (res.ok) {
          const data = await res.json();
          setSaved(true);
          setRosterId(data.id);
        }"""

new_save = """        if (res.ok) {
          const data = await res.json();
          setSaved(true);
          setRosterId(data.id);
          const badge = document.getElementById('snapshot-connect-badge');
          if (badge) badge.style.display = 'inline';
        }"""

content = content.replace(old_save, new_save)

# Update the unsave toggle
old_unsave = """        if (res.ok) {
          setSaved(false);
          setRosterId(null);
        }"""

new_unsave = """        if (res.ok) {
          setSaved(false);
          setRosterId(null);
          const badge = document.getElementById('snapshot-connect-badge');
          if (badge) badge.style.display = 'none';
        }"""

content = content.replace(old_unsave, new_unsave)

with open('src/app/snapshot/[id]/SaveToRosterButton.tsx', 'w') as f:
    f.write(content)
