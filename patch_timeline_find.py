import re

with open("src/app/snapshot/[id]/SnapshotTimeline.tsx", "r") as f:
    content = f.read()

old_find = """                                  trend={biomarkerTrends.find(t => t.name === b.rawName)}"""
new_find = """                                  trend={biomarkerTrends.find(t => t.name === b.rawName || (t.rawNames && t.rawNames.includes(b.rawName)))}"""

content = content.replace(old_find, new_find)

with open("src/app/snapshot/[id]/SnapshotTimeline.tsx", "w") as f:
    f.write(content)

print("Frontend patched")
