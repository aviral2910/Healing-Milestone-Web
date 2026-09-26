import re

with open('src/app/snapshot/[id]/SaveToRosterButton.tsx', 'r') as f:
    content = f.read()

old_post_block = """        if (res.ok) {
          // Re-fetch to get the ID
          const rosterRes = await fetch('https://healing-milestones-api.onrender.com/api/connect/roster?limit=100', { headers: { 'Authorization': `Bearer ${token}` }});
          if (rosterRes.ok) {
             const rosterData = await rosterRes.json();
             const items = rosterData.items || rosterData;
             const savedItem = items.find((item: any) => item.mix_view_id === mixViewId);
             if (savedItem) setRosterId(savedItem.id);
          }
          setSaved(true);
        }"""

new_post_block = """        if (res.ok) {
          const newItem = await res.json();
          setRosterId(newItem.id);
          setSaved(true);
        }"""

if old_post_block in content:
    content = content.replace(old_post_block, new_post_block)
else:
    print("Could not find old post block to replace")

with open('src/app/snapshot/[id]/SaveToRosterButton.tsx', 'w') as f:
    f.write(content)
