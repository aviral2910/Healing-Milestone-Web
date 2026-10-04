import re

files_to_patch = [
    'src/app/privacy/page.tsx',
    'src/app/terms/page.tsx',
    'src/components/AppBar.tsx' # used in share and share-intro
]

for filepath in files_to_patch:
    with open(filepath, 'r') as f:
        content = f.read()
    
    content = content.replace('<AuthAwareLogo />', '<AuthAwareLogo showConnect={false} />')
    
    with open(filepath, 'w') as f:
        f.write(content)
