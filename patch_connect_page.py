import re

with open('src/app/connect/page.tsx', 'r') as f:
    content = f.read()

# Add usePathname
content = content.replace(
    "import { useRouter } from 'next/navigation';",
    "import { useRouter, usePathname } from 'next/navigation';"
)

# Add useEffect to clear loading state
use_effect_code = """  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);"""

new_use_effect_code = """  const pathname = usePathname();
  
  useEffect(() => {
    // Clear loading state when pathname changes (e.g., when returning to this page via back button)
    setLoadingSnapshotId(null);
  }, [pathname]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);"""

content = content.replace(use_effect_code, new_use_effect_code)


# Make avatar clickable
avatar_original = """<div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.02) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.2rem', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                        {initial}
                      </div>"""

avatar_new = """<div 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          if (item.mix_view?.author_id) {
                            router.push(`/user/${item.mix_view.author_id}`);
                          }
                        }}
                        style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.02) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.2rem', border: '1px solid rgba(212, 175, 55, 0.2)', cursor: item.mix_view?.author_id ? 'pointer' : 'default', transition: 'all 0.2s' }}
                        onMouseOver={(e) => { if (item.mix_view?.author_id) { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.2)'; } }}
                        onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
                        title={item.mix_view?.author_id ? "View Profile" : undefined}
                      >
                        {initial}
                      </div>"""

content = content.replace(avatar_original, avatar_new)

with open('src/app/connect/page.tsx', 'w') as f:
    f.write(content)

