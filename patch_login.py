with open('src/app/login/page.tsx', 'r') as f:
    content = f.read()

content = content.replace(
"""  const { user, loading, loginWithGoogle } = useAuth();
  const router = useRouter();""",
"""  const { user, loading, needsOnboarding, loginWithGoogle } = useAuth();
  const router = useRouter();"""
)

content = content.replace(
"""  useEffect(() => {
    if (!loading && user) {
      router.push('/connect');
    }
  }, [user, loading, router]);""",
"""  useEffect(() => {
    if (!loading && user) {
      if (needsOnboarding) {
        router.push('/onboarding');
      } else {
        router.push('/connect');
      }
    }
  }, [user, loading, needsOnboarding, router]);"""
)

with open('src/app/login/page.tsx', 'w') as f:
    f.write(content)
