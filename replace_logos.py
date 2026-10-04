import os
import re

files_to_patch = [
    'src/app/page.tsx',
    'src/app/connect/page.tsx',
    'src/app/snapshot/[id]/page.tsx',
    'src/app/journey/[id]/page.tsx',
    'src/app/story/[id]/page.tsx',
    'src/app/user/[id]/page.tsx',
    'src/app/privacy/page.tsx',
    'src/app/terms/page.tsx',
    'src/components/AppBar.tsx'
]

# The regex matches <div className="banner-brand">...</div>
# We have to account for nested <div> tags. We'll just do a non-greedy match up to </div>\n        </div>
# Actually, since it's exactly one Link with nested divs, we can just match from `<div className="banner-brand">` to `</Link>\n        </div>` or `</Link>\n      </div>`

pattern = re.compile(r'<div className="banner-brand">.*?</div>\n\s*</Link>\n\s*</div>', re.DOTALL)

for filepath in files_to_patch:
    if not os.path.exists(filepath):
        print(f"Skipping {filepath}, does not exist")
        continue
        
    with open(filepath, 'r') as f:
        content = f.read()
    
    if 'AuthAwareLogo' not in content:
        # Add import
        import_stmt = "import AuthAwareLogo from '@/components/AuthAwareLogo';\n"
        # Find last import
        imports = re.findall(r'^import .*?;', content, re.MULTILINE)
        if imports:
            last_import = imports[-1]
            content = content.replace(last_import, last_import + '\n' + import_stmt)
        else:
            content = import_stmt + '\n' + content
    
    # Check if connect page to pass href="/connect"
    if 'connect/page.tsx' in filepath:
        content = pattern.sub('<AuthAwareLogo href="/connect" />', content)
    else:
        content = pattern.sub('<AuthAwareLogo />', content)
        
    with open(filepath, 'w') as f:
        f.write(content)

print("Done replacing logos")
