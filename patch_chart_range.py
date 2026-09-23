import re

with open("src/app/snapshot/[id]/SnapshotTimeline.tsx", "r") as f:
    content = f.read()

old_data_map = """      range: (dp.rangeLow != null && dp.rangeHigh != null) ? [dp.rangeLow, dp.rangeHigh] : null"""
new_data_map = """      range: (dp.rangeLow != null || dp.rangeHigh != null) ? [dp.rangeLow ?? 0, dp.rangeHigh ?? (dp.rangeLow ? dp.rangeLow * 2 : 100)] : null"""
content = content.replace(old_data_map, new_data_map)

old_tooltip = """if (name === 'range' && Array.isArray(value)) {
                             return [`${value[0]} - ${value[1]}`, 'Normal Range'];
                          }"""
new_tooltip = """if (name === 'range' && Array.isArray(value)) {
                             const lowStr = value[0] === 0 ? '<' : value[0] + ' -';
                             return [`${lowStr} ${value[1]}`, 'Normal Range'];
                          }"""
content = content.replace(old_tooltip, new_tooltip)

with open("src/app/snapshot/[id]/SnapshotTimeline.tsx", "w") as f:
    f.write(content)

print("patched")
