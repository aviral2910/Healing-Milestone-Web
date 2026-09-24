with open('src/app/onboarding/page.tsx', 'r') as f:
    content = f.read()

# 1. Update the required attribute on the license input
old_license_input = """                    <input 
                      type="text" 
                      value={licenseNumber}
                      onChange={e => setLicenseNumber(e.target.value)}
                      placeholder=""
                      style={{ 
                        width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', 
                        backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                        color: 'var(--text-primary)', fontSize: '1rem'
                      }}
                    />"""

new_license_input = """                    <input 
                      type="text" 
                      value={licenseNumber}
                      onChange={e => setLicenseNumber(e.target.value)}
                      placeholder={applyVerification ? "Required for verification" : ""}
                      required={applyVerification}
                      style={{ 
                        width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', 
                        backgroundColor: 'rgba(255,255,255,0.05)', border: `1px solid ${applyVerification && !licenseNumber.trim() ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
                        color: 'var(--text-primary)', fontSize: '1rem'
                      }}
                    />"""
content = content.replace(old_license_input, new_license_input)

# 2. Add isFormValid helper function right before handleSubmit
form_valid_helper = """  const isFormValid = () => {
    if (usernameStatus !== 'available') return false;
    if (!displayName.trim()) return false;
    if (role !== 'member') {
      if (!specialty.trim()) return false;
      if (applyVerification && !licenseNumber.trim()) return false;
    }
    return true;
  };

  const handleSubmit"""
content = content.replace("  const handleSubmit", form_valid_helper)

# 3. Completely replace the bottom buttons wrapper
old_buttons = """              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button 
                  type="button" 
                  onClick={() => setStep(1)}
                  style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '1rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                >
                  Back
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting || usernameStatus !== 'available' || !displayName.trim() || (role !== 'member' && !specialty.trim()) || (applyVerification && !licenseNumber.trim())}
                  className="share-journey-cta" 
                  style={{ flex: 2, display: 'flex', justifyContent: 'center', padding: '1rem', opacity: (isSubmitting || usernameStatus !== 'available') ? 0.5 : 1 }}
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : 'Complete Setup'}
                </button>
              </div>"""

new_buttons = """              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '1.5rem' }}>
                <button 
                  type="submit" 
                  disabled={isSubmitting || !isFormValid()}
                  className="share-journey-cta" 
                  style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '1rem', opacity: (isSubmitting || !isFormValid()) ? 0.5 : 1, transition: 'opacity 0.2s' }}
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : 'Complete Setup'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setStep(1)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', padding: '0.75rem', cursor: 'pointer', fontWeight: 500, fontSize: '0.95rem' }}
                >
                  Cancel & Go Back
                </button>
              </div>"""
content = content.replace(old_buttons, new_buttons)

with open('src/app/onboarding/page.tsx', 'w') as f:
    f.write(content)
