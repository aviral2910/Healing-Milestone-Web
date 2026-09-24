with open('src/app/onboarding/page.tsx', 'r') as f:
    content = f.read()

# Update the label to be dynamic based on applyVerification
old_license_label = """                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      Medical License / Registration Number <span style={{ opacity: 0.5 }}>(Optional)</span>
                    </label>"""

new_license_label = """                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      Medical License / Registration Number {applyVerification ? <span style={{ color: '#ef4444' }}>*</span> : <span style={{ opacity: 0.5 }}>(Optional)</span>}
                    </label>"""

content = content.replace(old_license_label, new_license_label)

# Update the Submit button disabled condition
old_submit = """                  disabled={isSubmitting || usernameStatus !== 'available' || !displayName.trim() || (role !== 'member' && !specialty.trim())}"""

new_submit = """                  disabled={isSubmitting || usernameStatus !== 'available' || !displayName.trim() || (role !== 'member' && !specialty.trim()) || (applyVerification && !licenseNumber.trim())}"""

content = content.replace(old_submit, new_submit)

with open('src/app/onboarding/page.tsx', 'w') as f:
    f.write(content)
