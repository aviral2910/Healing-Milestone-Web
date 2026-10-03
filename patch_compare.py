import re

with open('src/app/snapshot/[id]/compare/CompareScreen.tsx', 'r') as f:
    content = f.read()

old_filter = """  const filteredTrends = biomarkerTrends.filter((t: any) => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );"""

new_filter = """  const filteredTrends = biomarkerTrends.filter((t: any) => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a: any, b: any) => {
    const aSelected = comparing.includes(a.name);
    const bSelected = comparing.includes(b.name);
    if (aSelected && !bSelected) return -1;
    if (!aSelected && bSelected) return 1;
    return 0;
  });"""

content = content.replace(old_filter, new_filter)

with open('src/app/snapshot/[id]/compare/CompareScreen.tsx', 'w') as f:
    f.write(content)
