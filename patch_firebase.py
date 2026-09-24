with open('src/lib/firebase.ts', 'r') as f:
    content = f.read()

content = content.replace(
    'projectId: "healingmilestones-6d4ef",',
    'projectId: "healingmilestones-6d4ef",\n  authDomain: "healingmilestones-6d4ef.firebaseapp.com",'
)

with open('src/lib/firebase.ts', 'w') as f:
    f.write(content)
