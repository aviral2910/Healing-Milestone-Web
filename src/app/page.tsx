export default function Home() {
  return (
    <>
      <div className="banner">
        <div className="banner-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Logo" className="banner-logo" />
          <div className="banner-title">
            <div style={{ letterSpacing: '0.7px' }}>HEALING</div>
            <div style={{ letterSpacing: '0.2px' }}>MILESTONES</div>
          </div>
        </div>
      </div>
      <main className="story-container" style={{ textAlign: "center", marginTop: "10vh" }}>
        <h1 className="story-title" style={{ marginBottom: "24px" }}>Healing Milestones</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.2rem", marginBottom: "40px" }}>
          Your journey to mental and emotional wellness.
        </p>
        <a href="https://healingmilestones.in" target="_blank" rel="noopener noreferrer">
          <button className="download-btn" style={{ fontSize: "1.1rem", padding: "14px 32px" }}>
            Download the App
          </button>
        </a>
      </main>
    </>
  );
}
