import re

with open("src/app/snapshot/[id]/SnapshotTimeline.tsx", "r") as f:
    content = f.read()

old_tooltip = """const lowStr = value[0] === 0 ? '<' : value[0] + ' -';
                             return [`${lowStr} ${value[1]}`, 'Normal Range'];"""

new_tooltip = """if (value[0] === 0) {
                               return [`< ${value[1]}`, 'Normal Range'];
                             }
                             return [`${value[0]} - ${value[1]}`, 'Normal Range'];"""
content = content.replace(old_tooltip, new_tooltip)

with open("src/app/snapshot/[id]/SnapshotTimeline.tsx", "w") as f:
    f.write(content)
