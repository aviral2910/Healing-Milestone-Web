import re

with open('src/app/snapshot/[id]/SaveToRosterButton.tsx', 'r') as f:
    content = f.read()

# Fix checkRoster
old_fetch1 = """        const res = await fetch('https://healing-milestones-api.onrender.com/api/connect/roster', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const roster = await res.json();
          const savedItem = roster.find((item: any) => item.mix_view_id === mixViewId);"""

new_fetch1 = """        const res = await fetch('https://healing-milestones-api.onrender.com/api/connect/roster?limit=100', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const rosterData = await res.json();
          const items = rosterData.items || rosterData;
          const savedItem = items.find((item: any) => item.mix_view_id === mixViewId);"""

content = content.replace(old_fetch1, new_fetch1)


# Fix toggleSave refetch
old_fetch2 = """          // Re-fetch to get the ID
          const rosterRes = await fetch('https://healing-milestones-api.onrender.com/api/connect/roster', { headers: { 'Authorization': `Bearer ${token}` }});
          if (rosterRes.ok) {
             const roster = await rosterRes.json();
             const savedItem = roster.find((item: any) => item.mix_view_id === mixViewId);"""

new_fetch2 = """          // Re-fetch to get the ID
          const rosterRes = await fetch('https://healing-milestones-api.onrender.com/api/connect/roster?limit=100', { headers: { 'Authorization': `Bearer ${token}` }});
          if (rosterRes.ok) {
             const rosterData = await rosterRes.json();
             const items = rosterData.items || rosterData;
             const savedItem = items.find((item: any) => item.mix_view_id === mixViewId);"""

content = content.replace(old_fetch2, new_fetch2)

with open('src/app/snapshot/[id]/SaveToRosterButton.tsx', 'w') as f:
    f.write(content)
