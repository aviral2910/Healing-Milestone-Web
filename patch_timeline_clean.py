import re

with open("src/app/snapshot/[id]/SnapshotTimeline.tsx", "r") as f:
    content = f.read()

# Remove showCompareModal and comparing state from SnapshotTimeline
content = re.sub(r'const \[showCompareModal, setShowCompareModal\] = useState\(false\);\n?', '', content)
content = re.sub(r'const \[comparing, setComparing\] = useState<string\[\]>\(\[\]\);\n?', '', content)

# Change onCompare in InlineBiomarkerCard usage
old_on_compare = """onCompare={() => {
                                    setComparing([b.rawName]);
                                    setShowCompareModal(true);
                                  }}"""
new_on_compare = """onCompare={() => {
                                    window.location.href = `/snapshot/${params.id}/compare?base=${encodeURIComponent(b.rawName)}`;
                                  }}"""
content = content.replace(old_on_compare, new_on_compare)

# Remove the entire Compare Modal block
modal_start = content.find("{/* COMPARE MODAL */}")
if modal_start != -1:
    content = content[:modal_start] + "      \n    </div>\n  );\n}\n"

with open("src/app/snapshot/[id]/SnapshotTimeline.tsx", "w") as f:
    f.write(content)

print("patched")
