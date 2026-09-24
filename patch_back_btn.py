with open('src/app/onboarding/page.tsx', 'r') as f:
    content = f.read()

# Add a top back button as well for better UX
new_form_start = """            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <button 
                type="button" 
                onClick={() => setStep(1)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: 0, fontSize: '0.9rem', width: 'fit-content' }}
              >
                ← Back to Roles
              </button>
"""

content = content.replace("            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>", new_form_start)

# Improve the bottom back button
old_bottom_back = """                <button 
                  type="button" 
                  onClick={() => setStep(1)}
                  className="download-btn" 
                  style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '1rem' }}
                >
                  Back
                </button>"""

new_bottom_back = """                <button 
                  type="button" 
                  onClick={() => setStep(1)}
                  style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '1rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                >
                  Back
                </button>"""

content = content.replace(old_bottom_back, new_bottom_back)

with open('src/app/onboarding/page.tsx', 'w') as f:
    f.write(content)
