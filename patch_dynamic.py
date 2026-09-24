for file_path in ['src/app/login/page.tsx', 'src/app/connect/page.tsx']:
    with open(file_path, 'r') as f:
        content = f.read()
    
    if "export const dynamic = 'force-dynamic';" not in content:
        # insert after imports
        parts = content.split('\n\n', 1)
        if len(parts) > 1:
            content = parts[0] + "\n\nexport const dynamic = 'force-dynamic';\n\n" + parts[1]
            
        with open(file_path, 'w') as f:
            f.write(content)
