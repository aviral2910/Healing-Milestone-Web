with open('src/contexts/AuthContext.tsx', 'r') as f:
    content = f.read()

content = content.replace(
"""        // Auto-redirect to onboarding if trying to access secure routes
        if (requiresOnboarding && pathname && !pathname.startsWith('/onboarding') && (pathname.startsWith('/connect') || pathname.startsWith('/snapshot'))) {
          router.push('/onboarding');
        }""",
"")

content = content.replace(
"""  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await fetchProfile(firebaseUser);
      } else {
        setProfile(null);
        setNeedsOnboarding(false);
      }
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, [pathname, router]);""",
"""  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await fetchProfile(firebaseUser);
      } else {
        setProfile(null);
        setNeedsOnboarding(false);
      }
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []); // Only run once on mount

  // Watch for route changes to enforce onboarding
  useEffect(() => {
    if (!loading && user && needsOnboarding) {
      if (pathname && !pathname.startsWith('/onboarding') && (pathname.startsWith('/connect') || pathname.startsWith('/snapshot'))) {
        router.push('/onboarding');
      }
    }
  }, [loading, user, needsOnboarding, pathname, router]);"""
)

with open('src/contexts/AuthContext.tsx', 'w') as f:
    f.write(content)
