export default function Loading() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'var(--background)', 
      color: 'var(--text-primary)', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid rgba(218, 165, 32, 0.2)',
        borderTop: '3px solid var(--primary)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Loading comparison data...</p>
    </div>
  );
}
