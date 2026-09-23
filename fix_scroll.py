with open("src/app/snapshot/[id]/compare/CompareScreen.tsx", "r") as f:
    content = f.read()

# Change minHeight: '100vh' to height: '100vh'
old_wrapper = "<div style={{ minHeight: '100vh', backgroundColor: 'var(--background)', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column' }}>"
new_wrapper = "<div style={{ height: '100vh', backgroundColor: 'var(--background)', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>"

content = content.replace(old_wrapper, new_wrapper)

with open("src/app/snapshot/[id]/compare/CompareScreen.tsx", "w") as f:
    f.write(content)
