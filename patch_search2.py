import re

with open("src/app/snapshot/[id]/SnapshotTimeline.tsx", "r") as f:
    content = f.read()

old_search = """      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const textMatch = item.text?.toLowerCase().includes(query);
        const titleMatch = item.title?.toLowerCase().includes(query);
        const tagMatch = item.tags?.some((t: string) => t.toLowerCase().includes(query));
        if (!textMatch && !titleMatch && !tagMatch) return false;
      }"""

new_search = """      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const textMatch = item.text?.toLowerCase().includes(query);
        const titleMatch = item.title?.toLowerCase().includes(query);
        const tagMatch = item.tags?.some((t: string) => t.toLowerCase().includes(query));
        const biomarkerMatch = item.biomarkers?.some((b: any) => 
            b.rawName?.toLowerCase().includes(query) || 
            b.valueText?.toLowerCase().includes(query)
        );
        if (!textMatch && !titleMatch && !tagMatch && !biomarkerMatch) return false;
      }"""

content = content.replace(old_search, new_search)

old_filter = """      if (filter === 'prescriptions' && (item.type !== 'report' || item.category !== 'prescription')) return false;"""

new_filter = """      if (filter === 'prescriptions' && (item.type !== 'report' || item.category !== 'prescription')) return false;
      if (filter === 'biomarkers' && (!item.biomarkers || item.biomarkers.length === 0)) return false;"""

content = content.replace(old_filter, new_filter)

with open("src/app/snapshot/[id]/SnapshotTimeline.tsx", "w") as f:
    f.write(content)
