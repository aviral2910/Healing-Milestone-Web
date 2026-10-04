import re

with open('src/components/AuthAwareLogo.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'export default function AuthAwareLogo({ href = "/" }: { href?: string }) {',
    'export default function AuthAwareLogo({ href = "/", showConnect = true }: { href?: string, showConnect?: boolean }) {'
)
content = content.replace(
    '{user && <span style={{ color: \'var(--primary)\' }}> CONNECT</span>}',
    '{showConnect && user && <span style={{ color: \'var(--primary)\' }}> CONNECT</span>}'
)

with open('src/components/AuthAwareLogo.tsx', 'w') as f:
    f.write(content)

with open('src/app/page.tsx', 'r') as f:
    page_content = f.read()

page_content = page_content.replace('<AuthAwareLogo />', '<AuthAwareLogo showConnect={false} />')

with open('src/app/page.tsx', 'w') as f:
    f.write(page_content)
