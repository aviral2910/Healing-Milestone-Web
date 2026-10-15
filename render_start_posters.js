const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const QRCode = require('qrcode');

async function renderStartPosters() {
  const logoPath = path.join(__dirname, 'public/logo.png');
  const logoBase64 = fs.readFileSync(logoPath).toString('base64');
  const gvBase64 = fs.readFileSync(path.join(__dirname, 'fonts/GreatVibes.ttf')).toString('base64');
  const cinzelBase64 = fs.readFileSync(path.join(__dirname, 'fonts/CinzelBold.ttf')).toString('base64');
  const pfBase64 = fs.readFileSync(path.join(__dirname, 'fonts/PlayfairBold.ttf')).toString('base64');

  // Ultra High-Res Start QR (1600x1600px, Error Correction H for central disc)
  const startUrl = 'https://healingmilestones.in/q/start';
  const startQrDataUrl = await QRCode.toDataURL(startUrl, {
    margin: 1,
    errorCorrectionLevel: 'H',
    width: 1600,
    color: { dark: '#0a0a0a', light: '#ffffff' }
  });

  // Mini QR for healingmilestones.in
  const miniQrDataUrl = await QRCode.toDataURL('https://healingmilestones.in', {
    margin: 1,
    color: { dark: '#121212', light: '#ffffff' },
    width: 500
  });

  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const artifactDir = '/Users/aviraldixit/.gemini/antigravity/brain/c46e5759-a13b-4cdf-a016-1ddf31424f36';
  const outputDir = path.join(__dirname, 'public/qr_codes_for_print');

  const sharedFontStyles = `
    @font-face { font-family: 'GreatVibesLocal'; src: url('data:font/ttf;base64,${gvBase64}') format('truetype'); }
    @font-face { font-family: 'CinzelLocal'; src: url('data:font/ttf;base64,${cinzelBase64}') format('truetype'); font-weight: 700; }
    @font-face { font-family: 'PlayfairLocal'; src: url('data:font/ttf;base64,${pfBase64}') format('truetype'); font-weight: 700; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
  `;

  // =========================================================================
  // 1. UPGRADED DARK LUXURY POSTER (8 x 10 INCH = 2400 x 3000 PX @ 300 DPI)
  // =========================================================================
  const darkPosterHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>The Wedding Quest - Start Page Poster (Dark Luxury)</title>
<style>
  ${sharedFontStyles}
  body {
    width: 2400px;
    height: 3000px;
    background: #0c0a09;
    background-image: 
      radial-gradient(circle at 50% 12%, rgba(217, 119, 6, 0.28) 0%, transparent 55%),
      radial-gradient(circle at 50% 46%, rgba(245, 158, 11, 0.28) 0%, transparent 60%),
      radial-gradient(circle at 50% 86%, rgba(217, 119, 6, 0.22) 0%, transparent 55%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 60px 80px 55px 80px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    position: relative;
    overflow: hidden;
  }

  /* Royal Double Poster Border */
  .poster-outer-border {
    position: absolute;
    inset: 32px;
    border: 5.5px solid #f59e0b;
    border-radius: 28px;
    pointer-events: none;
    box-shadow: inset 0 0 35px rgba(245, 158, 11, 0.45), 0 0 35px rgba(245, 158, 11, 0.35);
  }
  .poster-inner-border {
    position: absolute;
    inset: 50px;
    border: 2px solid #fbbf24;
    border-radius: 20px;
    opacity: 0.45;
    pointer-events: none;
  }

  /* Corner Flourishes */
  .corner-flourish {
    position: absolute;
    width: 90px;
    height: 90px;
    opacity: 0.9;
    pointer-events: none;
    z-index: 5;
  }
  .c-tl { top: 56px; left: 56px; }
  .c-tr { top: 56px; right: 56px; transform: scaleX(-1); }
  .c-bl { bottom: 56px; left: 56px; transform: scaleY(-1); }
  .c-br { bottom: 56px; right: 56px; transform: scale(-1, -1); }

  /* Section 1: The Imperial Heraldic Brand Crest */
  .brand-crest-unit {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    z-index: 10;
  }
  .crest-wings-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 30px;
    width: 100%;
  }
  .crest-wing-line {
    width: 320px;
    height: 2px;
    background: linear-gradient(90deg, transparent, #f59e0b 60%, #fbbf24 100%);
  }
  .crest-wing-line.right {
    background: linear-gradient(90deg, #fbbf24 0%, #f59e0b 40%, transparent 100%);
  }
  .crest-logo-disc {
    width: 110px;
    height: 110px;
    border-radius: 50%;
    background: #111111;
    border: 4.5px solid #f59e0b;
    box-shadow: 0 0 40px rgba(245, 158, 11, 0.7), inset 0 0 20px rgba(245, 158, 11, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
    flex-shrink: 0;
  }
  .crest-logo-disc::before {
    content: '';
    position: absolute;
    inset: 5px;
    border: 1.8px solid #fbbf24;
    border-radius: 50%;
    opacity: 0.6;
    pointer-events: none;
  }
  .crest-logo-img { width: 100%; height: 100%; object-fit: cover; }
  .crest-title {
    font-family: 'CinzelLocal', Georgia, serif;
    font-size: 36px;
    font-weight: 700;
    letter-spacing: 9px;
    color: #ffffff;
    margin-top: 14px;
    text-shadow: 0 0 24px rgba(251, 191, 36, 0.6);
  }
  .crest-subline {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    font-family: 'PlayfairLocal', Georgia, serif;
    font-size: 19px;
    font-style: italic;
    letter-spacing: 2.5px;
    color: #fbbf24;
    margin-top: 5px;
  }
  .crest-subline span.diamond { font-size: 14px; font-style: normal; }

  .header-couple-divider {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60%;
    margin-top: 18px;
  }
  .h-line { flex: 1; height: 1.5px; background: linear-gradient(90deg, transparent, #f59e0b, transparent); }
  .h-diamond { margin: 0 16px; font-size: 16px; color: #fbbf24; }

  /* Section 2: Couple Hero Section */
  .couple-hero-unit {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    z-index: 10;
  }
  .celebrating-tag {
    font-family: 'CinzelLocal', Georgia, serif;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 7px;
    color: #fbbf24;
    text-transform: uppercase;
    margin-bottom: 24px;
  }
  .couple-names-calligraphy {
    font-family: 'GreatVibesLocal', cursive;
    font-size: 165px;
    line-height: 1.05;
    color: #ffffff;
    margin: 0 0 8px 0;
    text-shadow: 0 0 50px rgba(251, 191, 36, 0.65), 0 4px 20px rgba(0,0,0,0.95);
  }
  .quest-main-badge {
    display: inline-flex;
    align-items: center;
    gap: 18px;
    background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
    border: 2.8px solid #fef08a;
    padding: 12px 52px;
    border-radius: 36px;
    box-shadow: 0 12px 40px rgba(245, 158, 11, 0.55);
  }
  .quest-main-badge span {
    font-family: 'CinzelLocal', Georgia, serif;
    font-size: 26px;
    font-weight: 700;
    letter-spacing: 6px;
    color: #ffffff;
    text-transform: uppercase;
  }
  .quest-sub-tagline {
    font-family: 'PlayfairLocal', Georgia, serif;
    font-style: italic;
    font-size: 20px;
    color: #fef3c7;
    letter-spacing: 1.2px;
    margin-top: 10px;
  }

  /* Section 3: Massive Central Start QR Section (1080 x 1080 px) */
  .qr-centerpiece-unit {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    z-index: 10;
  }
  .scan-call-cartouche {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    padding: 12px 48px;
    background: linear-gradient(135deg, rgba(32, 24, 12, 0.98) 0%, rgba(18, 14, 8, 0.98) 100%);
    border: 2.5px solid #f59e0b;
    border-radius: 32px;
    box-shadow: 0 10px 30px rgba(245, 158, 11, 0.45);
    margin-bottom: 16px;
    position: relative;
  }
  .scan-call-cartouche-inner {
    position: absolute;
    inset: 4px;
    border: 1.2px solid #fbbf24;
    border-radius: 26px;
    opacity: 0.45;
    pointer-events: none;
  }
  .scan-call-text {
    font-family: 'CinzelLocal', Georgia, serif;
    font-size: 21px;
    font-weight: 700;
    letter-spacing: 4.5px;
    color: #ffffff;
    text-transform: uppercase;
    text-shadow: 0 0 16px rgba(251, 191, 36, 0.5);
  }

  .start-qr-pad {
    width: 1080px;
    height: 1080px;
    background: #ffffff;
    border-radius: 40px;
    border: 6.5px solid #f59e0b;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 24px;
    box-shadow: 0 35px 100px rgba(245, 158, 11, 0.6), 0 0 65px rgba(251, 191, 36, 0.45);
  }
  .start-qr-inner-ring {
    position: absolute;
    inset: 14px;
    border: 2.5px solid #fbbf24;
    border-radius: 28px;
    opacity: 0.45;
    pointer-events: none;
  }
  .start-qr-img {
    width: 1020px;
    height: 1020px;
    display: block;
    object-fit: contain;
  }
  .qr-center-disc {
    position: absolute;
    width: 220px;
    height: 220px;
    border-radius: 50%;
    background: #111111;
    border: 5.5px solid #f59e0b;
    box-shadow: 0 0 40px rgba(245, 158, 11, 0.8), 0 8px 26px rgba(0,0,0,0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    z-index: 20;
  }
  .qr-center-logo-img { width: 100%; height: 100%; object-fit: cover; }

  .qr-scan-instructions {
    margin-top: 18px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .qr-prompt-primary {
    font-family: 'PlayfairLocal', Georgia, serif;
    font-size: 24px;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: 0.8px;
  }
  .qr-prompt-secondary {
    font-size: 16.5px;
    color: #fbbf24;
    margin-top: 4px;
    letter-spacing: 1.4px;
    font-weight: 500;
  }
  .direct-url-pill {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    background: rgba(32, 24, 12, 0.98);
    border: 2px solid #f59e0b;
    padding: 7px 32px;
    border-radius: 26px;
    font-family: 'CinzelLocal', Georgia, serif;
    font-size: 17px;
    font-weight: 700;
    letter-spacing: 3px;
    color: #fbbf24;
    margin-top: 10px;
  }

  /* Section 4: How To Play: 3 Rich Cards */
  .how-to-play-unit {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 10;
  }
  .how-to-play-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-bottom: 14px;
  }
  .how-to-play-title {
    font-family: 'CinzelLocal', Georgia, serif;
    font-size: 22px;
    font-weight: 700;
    letter-spacing: 5px;
    color: #ffffff;
    text-transform: uppercase;
  }
  .steps-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
    width: 100%;
  }
  .step-card {
    background: linear-gradient(135deg, rgba(28, 22, 14, 0.96) 0%, rgba(16, 13, 8, 0.98) 100%);
    border: 2.2px solid rgba(245, 158, 11, 0.6);
    border-radius: 22px;
    padding: 22px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    box-shadow: 0 12px 32px rgba(0,0,0,0.6);
    position: relative;
  }
  .step-card::before {
    content: '';
    position: absolute;
    inset: 5px;
    border: 1.2px solid #fbbf24;
    opacity: 0.3;
    border-radius: 16px;
    pointer-events: none;
  }
  .step-badge {
    width: 54px;
    height: 54px;
    border-radius: 50%;
    background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
    border: 2.2px solid #fef08a;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'CinzelLocal', Georgia, serif;
    font-size: 24px;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 12px;
    box-shadow: 0 4px 14px rgba(245, 158, 11, 0.45);
  }
  .step-title {
    font-family: 'CinzelLocal', Georgia, serif;
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 2px;
    color: #ffffff;
    text-transform: uppercase;
    margin-bottom: 8px;
  }
  .step-desc {
    font-size: 15px;
    line-height: 1.45;
    color: #e7e5e4;
    font-weight: 400;
  }
  .step-highlight {
    color: #fbbf24;
    font-weight: 700;
  }

  /* Section 5: Four Quest Rounds Ribbon Badges */
  .rounds-ribbon-unit {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    width: 100%;
    z-index: 10;
  }
  .round-pill {
    padding: 10px 30px;
    border-radius: 26px;
    font-family: 'CinzelLocal', Georgia, serif;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 2.8px;
    text-transform: uppercase;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #ffffff;
    box-shadow: 0 6px 20px rgba(0,0,0,0.45);
  }
  .round-yellow { background: linear-gradient(135deg, #d97706 0%, #b45309 100%); border: 2px solid #fef08a; }
  .round-green { background: linear-gradient(135deg, #059669 0%, #047857 100%); border: 2px solid #a7f3d0; }
  .round-pink { background: linear-gradient(135deg, #db2777 0%, #be185d 100%); border: 2px solid #fbcfe8; }
  .round-red { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); border: 2px solid #fecaca; }

  /* Section 6: Promotional Footer Unit */
  .promo-footer-unit {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 10;
  }
  .promo-footer-group {
    display: flex;
    align-items: center;
    gap: 28px;
    padding: 16px 36px;
    border-radius: 24px;
    border: 2.2px solid rgba(245, 158, 11, 0.55);
    background: rgba(28, 22, 14, 0.98);
    box-shadow: 0 12px 40px rgba(0,0,0,0.7);
    width: 96%;
  }
  .mini-qr-box {
    width: 148px;
    height: 148px;
    background: #ffffff;
    border-radius: 16px;
    border: 2.5px solid #f59e0b;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
    flex-shrink: 0;
    box-shadow: 0 4px 22px rgba(251, 191, 36, 0.45);
  }
  .mini-qr-img { width: 136px; height: 136px; display: block; object-fit: contain; }
  .promo-text-column { display: flex; flex-direction: column; align-items: flex-start; flex: 1; }
  .promo-quote-line { font-family: 'PlayfairLocal', Georgia, serif; font-size: 18px; font-style: italic; font-weight: 700; color: #ffffff; letter-spacing: 0.5px; }
  .promo-sub-note { font-size: 14px; color: #fbbf24; margin: 4px 0 10px 0; font-weight: 500; }
  .brand-website-tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 24px;
    border-radius: 18px;
    border: 1.5px solid #f59e0b;
    background: rgba(18, 14, 10, 0.95);
    font-family: 'CinzelLocal', Georgia, serif;
    font-size: 14.5px;
    font-weight: 700;
    letter-spacing: 2.5px;
    color: #fbbf24;
  }
</style>
</head>
<body>

  <!-- Royal Poster Borders -->
  <div class="poster-outer-border"></div>
  <div class="poster-inner-border"></div>

  <!-- 4 Corner Flourishes -->
  <svg class="corner-flourish c-tl" viewBox="0 0 100 100"><path d="M 10 90 Q 10 10 90 10 Q 50 20 20 50 Q 10 70 10 90 Z" fill="#fbbf24"/></svg>
  <svg class="corner-flourish c-tr" viewBox="0 0 100 100"><path d="M 10 90 Q 10 10 90 10 Q 50 20 20 50 Q 10 70 10 90 Z" fill="#fbbf24"/></svg>
  <svg class="corner-flourish c-bl" viewBox="0 0 100 100"><path d="M 10 90 Q 10 10 90 10 Q 50 20 20 50 Q 10 70 10 90 Z" fill="#fbbf24"/></svg>
  <svg class="corner-flourish c-br" viewBox="0 0 100 100"><path d="M 10 90 Q 10 10 90 10 Q 50 20 20 50 Q 10 70 10 90 Z" fill="#fbbf24"/></svg>

  <!-- Section 1: The Imperial Heraldic Brand Crest -->
  <div class="brand-crest-unit">
    <div class="crest-wings-row">
      <div class="crest-wing-line"></div>
      <div class="crest-logo-disc">
        <img src="data:image/png;base64,${logoBase64}" class="crest-logo-img" alt="Healing Milestones Logo" />
      </div>
      <div class="crest-wing-line right"></div>
    </div>
    <div class="crest-title">HEALING MILESTONES</div>
    <div class="crest-subline">
      <span class="diamond">❖</span>
      <span>Celebrate Love • Track Your Health</span>
      <span class="diamond">❖</span>
    </div>

    <div class="header-couple-divider">
      <div class="h-line"></div>
      <span class="h-diamond">✦</span>
      <div class="h-line"></div>
    </div>
  </div>

  <!-- Section 2: Couple Hero Section -->
  <div class="couple-hero-unit">
    <div class="celebrating-tag">Celebrating The Wedding Of</div>
    <div class="couple-names-calligraphy">Ankita &amp; Harshit</div>
    
    <div class="quest-main-badge">
      <span>✦</span>
      <span>THE WEDDING QUEST</span>
      <span>✦</span>
    </div>
    <div class="quest-sub-tagline">An Interactive Wedding Scavenger Hunt</div>
  </div>

  <!-- Section 3: Massive Central Start QR Section (1080 x 1080 px) -->
  <div class="qr-centerpiece-unit">
    <div class="scan-call-cartouche">
      <div class="scan-call-cartouche-inner"></div>
      <div class="scan-call-text">✦ SCAN TO ENTER THE HUNT &amp; JOIN YOUR TEAM ✦</div>
    </div>

    <div class="start-qr-pad">
      <div class="start-qr-inner-ring"></div>
      <img src="${startQrDataUrl}" class="start-qr-img" alt="Start QR Code" />
      
      <!-- Central Circular Logo Disc Overlay -->
      <div class="qr-center-disc">
        <img src="data:image/png;base64,${logoBase64}" class="qr-center-logo-img" alt="Healing Milestones Logo" />
      </div>
    </div>

    <div class="qr-scan-instructions">
      <div class="qr-prompt-primary">Point your mobile camera to begin your adventure</div>
      <div class="qr-prompt-secondary">Instant Riddle Scan • Live Scoreboard • No App Download Required</div>
      <div class="direct-url-pill">
        <span>✦</span>
        <span>healingmilestones.in/q/start</span>
        <span>✦</span>
      </div>
    </div>
  </div>

  <!-- Section 4: How To Play: 3 Rich Cards -->
  <div class="how-to-play-unit">
    <div class="how-to-play-header">
      <div class="gold-divider-line" style="width: 140px; height: 1.5px; background: linear-gradient(90deg, transparent, #f59e0b);"></div>
      <div class="how-to-play-title">❖ How To Play The Quest ❖</div>
      <div class="gold-divider-line" style="width: 140px; height: 1.5px; background: linear-gradient(90deg, #f59e0b, transparent);"></div>
    </div>

    <div class="steps-grid">
      <div class="step-card">
        <div class="step-badge">1</div>
        <div class="step-title">Join Your Side</div>
        <div class="step-desc">
          Scan the QR above, enter your name &amp; choose <span class="step-highlight">Team Bride 👰</span> or <span class="step-highlight">Team Groom 🤵</span>.
        </div>
      </div>

      <div class="step-card">
        <div class="step-badge">2</div>
        <div class="step-title">Solve The Riddles</div>
        <div class="step-desc">
          Read poetic clues on your phone to hunt down <span class="step-highlight">secret spots, special items &amp; VIP guests</span>.
        </div>
      </div>

      <div class="step-card">
        <div class="step-badge">3</div>
        <div class="step-title">Scan Clues &amp; Win!</div>
        <div class="step-desc">
          Find hidden physical clue cards, scan them to advance, <span class="step-highlight">climb the live leaderboard &amp; win</span>!
        </div>
      </div>
    </div>
  </div>

  <!-- Section 5: Four Quest Rounds Ribbon Badges -->
  <div class="rounds-ribbon-unit">
    <div class="round-pill round-yellow"><span>✦</span><span>Yellow Round</span></div>
    <div class="round-pill round-green"><span>✦</span><span>Green Round</span></div>
    <div class="round-pill round-pink"><span>✦</span><span>Pink Round</span></div>
    <div class="round-pill round-red"><span>✦</span><span>Red Round</span></div>
  </div>

  <!-- Section 6: Promotional Footer Unit -->
  <div class="promo-footer-unit">
    <div class="promo-footer-group">
      <div class="mini-qr-box">
        <img src="${miniQrDataUrl}" class="mini-qr-img" alt="Healing Milestones Mini QR" />
      </div>
      <div class="promo-text-column">
        <div class="promo-quote-line">"Celebrate Love • Cherish Life's Milestones"</div>
        <div class="promo-sub-note">Scan mini QR to explore personalized health, habits &amp; life milestone journeys</div>
        <div class="brand-website-tag">
          <span style="color: #fbbf24;">✦</span>
          <span>healingmilestones.in</span>
          <span style="color: #fbbf24;">✦</span>
        </div>
      </div>
    </div>
  </div>

</body>
</html>`;

  // =========================================================================
  // 2. UPGRADED ROYAL PEARL IVORY LIGHT POSTER (8 x 10 INCH = 2400 x 3000 PX @ 300 DPI)
  // =========================================================================
  const lightPosterHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>The Wedding Quest - Start Page Poster (Royal Pearl Ivory)</title>
<style>
  ${sharedFontStyles}
  body {
    width: 2400px;
    height: 3000px;
    background-color: #fffdfa;
    background-image: 
      radial-gradient(circle at 50% 12%, #fef3c7 0%, #fffbeb 45%, #fffdfa 75%),
      radial-gradient(circle at 50% 48%, #fef3c7 0%, #fffbeb 50%, #fffdfa 80%),
      radial-gradient(circle at 50% 88%, #fef3c7 0%, #fffbeb 45%, #fffdfa 75%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 60px 80px 55px 80px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    position: relative;
    overflow: hidden;
  }

  .poster-outer-border {
    position: absolute;
    inset: 32px;
    border: 5.5px solid #b45309;
    border-radius: 28px;
    pointer-events: none;
    box-shadow: inset 0 0 25px rgba(217, 119, 6, 0.22), 0 0 20px rgba(217, 119, 6, 0.2);
  }
  .poster-inner-border {
    position: absolute;
    inset: 50px;
    border: 2px solid #d97706;
    border-radius: 20px;
    opacity: 0.45;
    pointer-events: none;
  }

  .corner-flourish {
    position: absolute;
    width: 90px;
    height: 90px;
    opacity: 0.9;
    pointer-events: none;
    z-index: 5;
  }
  .c-tl { top: 56px; left: 56px; }
  .c-tr { top: 56px; right: 56px; transform: scaleX(-1); }
  .c-bl { bottom: 56px; left: 56px; transform: scaleY(-1); }
  .c-br { bottom: 56px; right: 56px; transform: scale(-1, -1); }

  /* Section 1: The Imperial Heraldic Brand Crest (Light Edition) */
  .brand-crest-unit {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    z-index: 10;
  }
  .crest-wings-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 30px;
    width: 100%;
  }
  .crest-wing-line {
    width: 320px;
    height: 2px;
    background: linear-gradient(90deg, transparent, #b45309 60%, #d97706 100%);
  }
  .crest-wing-line.right {
    background: linear-gradient(90deg, #d97706 0%, #b45309 40%, transparent 100%);
  }
  .crest-logo-disc {
    width: 110px;
    height: 110px;
    border-radius: 50%;
    background: #111111;
    border: 4.5px solid #b45309;
    box-shadow: 0 0 35px rgba(217, 119, 6, 0.4), 0 4px 15px rgba(0,0,0,0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
    flex-shrink: 0;
  }
  .crest-logo-disc::before {
    content: '';
    position: absolute;
    inset: 5px;
    border: 1.8px solid #d97706;
    border-radius: 50%;
    opacity: 0.7;
    pointer-events: none;
  }
  .crest-logo-img { width: 100%; height: 100%; object-fit: cover; }
  .crest-title {
    font-family: 'CinzelLocal', Georgia, serif;
    font-size: 36px;
    font-weight: 700;
    letter-spacing: 9px;
    color: #1c1917;
    margin-top: 14px;
    text-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
  .crest-subline {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    font-family: 'PlayfairLocal', Georgia, serif;
    font-size: 19px;
    font-style: italic;
    letter-spacing: 2.5px;
    color: #b45309;
    margin-top: 5px;
  }
  .crest-subline span.diamond { font-size: 14px; font-style: normal; }

  .header-couple-divider {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60%;
    margin-top: 18px;
  }
  .h-line { flex: 1; height: 1.5px; background: linear-gradient(90deg, transparent, #b45309, transparent); }
  .h-diamond { margin: 0 16px; font-size: 16px; color: #b45309; }

  /* Section 2: Couple Hero Section */
  .couple-hero-unit {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    z-index: 10;
  }
  .celebrating-tag {
    font-family: 'CinzelLocal', Georgia, serif;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 7px;
    color: #b45309;
    text-transform: uppercase;
    margin-bottom: 24px;
  }
  .couple-names-calligraphy {
    font-family: 'GreatVibesLocal', cursive;
    font-size: 165px;
    line-height: 1.05;
    color: #1c1917;
    margin: 0 0 8px 0;
    text-shadow: 0 2px 14px rgba(0,0,0,0.15);
  }
  .quest-main-badge {
    display: inline-flex;
    align-items: center;
    gap: 18px;
    background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
    border: 2.8px solid #fef08a;
    padding: 12px 52px;
    border-radius: 36px;
    box-shadow: 0 12px 35px rgba(217, 119, 6, 0.4);
  }
  .quest-main-badge span {
    font-family: 'CinzelLocal', Georgia, serif;
    font-size: 26px;
    font-weight: 700;
    letter-spacing: 6px;
    color: #ffffff;
    text-transform: uppercase;
  }
  .quest-sub-tagline {
    font-family: 'PlayfairLocal', Georgia, serif;
    font-style: italic;
    font-size: 20px;
    color: #78350f;
    letter-spacing: 1.2px;
    margin-top: 10px;
    font-weight: 700;
  }

  /* Section 3: Massive Central Start QR Section (1080 x 1080 px) */
  .qr-centerpiece-unit {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    z-index: 10;
  }
  .scan-call-cartouche {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    padding: 12px 48px;
    background: #1c1917;
    border: 2.5px solid #b45309;
    border-radius: 32px;
    box-shadow: 0 10px 30px rgba(217, 119, 6, 0.3);
    margin-bottom: 16px;
    position: relative;
  }
  .scan-call-cartouche-inner {
    position: absolute;
    inset: 4px;
    border: 1.2px solid #d97706;
    border-radius: 26px;
    opacity: 0.45;
    pointer-events: none;
  }
  .scan-call-text {
    font-family: 'CinzelLocal', Georgia, serif;
    font-size: 21px;
    font-weight: 700;
    letter-spacing: 4.5px;
    color: #ffffff;
    text-transform: uppercase;
  }

  .start-qr-pad {
    width: 1080px;
    height: 1080px;
    background: #ffffff;
    border-radius: 40px;
    border: 6.5px solid #b45309;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 24px;
    box-shadow: 0 30px 85px rgba(217, 119, 6, 0.35), 0 0 45px rgba(217, 119, 6, 0.22);
  }
  .start-qr-inner-ring {
    position: absolute;
    inset: 14px;
    border: 2.5px solid #d97706;
    border-radius: 28px;
    opacity: 0.45;
    pointer-events: none;
  }
  .start-qr-img {
    width: 1020px;
    height: 1020px;
    display: block;
    object-fit: contain;
  }
  .qr-center-disc {
    position: absolute;
    width: 220px;
    height: 220px;
    border-radius: 50%;
    background: #111111;
    border: 5.5px solid #b45309;
    box-shadow: 0 0 35px rgba(217, 119, 6, 0.5), 0 8px 24px rgba(0,0,0,0.65);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    z-index: 20;
  }
  .qr-center-logo-img { width: 100%; height: 100%; object-fit: cover; }

  .qr-scan-instructions {
    margin-top: 18px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .qr-prompt-primary {
    font-family: 'PlayfairLocal', Georgia, serif;
    font-size: 24px;
    font-weight: 700;
    color: #1c1917;
    letter-spacing: 0.8px;
  }
  .qr-prompt-secondary {
    font-size: 16.5px;
    color: #b45309;
    margin-top: 4px;
    letter-spacing: 1.4px;
    font-weight: 700;
  }
  .direct-url-pill {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    background: #ffffff;
    border: 2px solid #b45309;
    padding: 7px 32px;
    border-radius: 26px;
    font-family: 'CinzelLocal', Georgia, serif;
    font-size: 17px;
    font-weight: 700;
    letter-spacing: 3px;
    color: #b45309;
    margin-top: 10px;
  }

  /* Section 4: How To Play: 3 Elegant Cards */
  .how-to-play-unit {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 10;
  }
  .how-to-play-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-bottom: 14px;
  }
  .how-to-play-title {
    font-family: 'CinzelLocal', Georgia, serif;
    font-size: 22px;
    font-weight: 700;
    letter-spacing: 5px;
    color: #1c1917;
    text-transform: uppercase;
  }
  .steps-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
    width: 100%;
  }
  .step-card {
    background: #ffffff;
    border: 2.2px solid rgba(180, 83, 9, 0.45);
    border-radius: 22px;
    padding: 22px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    box-shadow: 0 10px 28px rgba(217, 119, 6, 0.1);
    position: relative;
  }
  .step-card::before {
    content: '';
    position: absolute;
    inset: 5px;
    border: 1.2px solid #d97706;
    opacity: 0.3;
    border-radius: 16px;
    pointer-events: none;
  }
  .step-badge {
    width: 54px;
    height: 54px;
    border-radius: 50%;
    background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
    border: 2.2px solid #fef08a;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'CinzelLocal', Georgia, serif;
    font-size: 24px;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 12px;
    box-shadow: 0 4px 14px rgba(217, 119, 6, 0.4);
  }
  .step-title {
    font-family: 'CinzelLocal', Georgia, serif;
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 2px;
    color: #1c1917;
    text-transform: uppercase;
    margin-bottom: 8px;
  }
  .step-desc {
    font-size: 15px;
    line-height: 1.45;
    color: #44403c;
    font-weight: 500;
  }
  .step-highlight {
    color: #b45309;
    font-weight: 700;
  }

  /* Section 5: Four Quest Rounds Ribbon Badges */
  .rounds-ribbon-unit {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    width: 100%;
    z-index: 10;
  }
  .round-pill {
    padding: 10px 30px;
    border-radius: 26px;
    font-family: 'CinzelLocal', Georgia, serif;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 2.8px;
    text-transform: uppercase;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #ffffff;
    box-shadow: 0 4px 16px rgba(0,0,0,0.18);
  }
  .round-yellow { background: linear-gradient(135deg, #d97706 0%, #b45309 100%); border: 2px solid #fef08a; }
  .round-green { background: linear-gradient(135deg, #059669 0%, #047857 100%); border: 2px solid #a7f3d0; }
  .round-pink { background: linear-gradient(135deg, #db2777 0%, #be185d 100%); border: 2px solid #fbcfe8; }
  .round-red { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); border: 2px solid #fecaca; }

  /* Section 6: Promotional Footer Unit */
  .promo-footer-unit {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 10;
  }
  .promo-footer-group {
    display: flex;
    align-items: center;
    gap: 28px;
    padding: 16px 36px;
    border-radius: 24px;
    border: 2.2px solid rgba(180, 83, 9, 0.45);
    background: #ffffff;
    box-shadow: 0 12px 35px rgba(217, 119, 6, 0.15);
    width: 96%;
  }
  .mini-qr-box {
    width: 148px;
    height: 148px;
    background: #ffffff;
    border-radius: 16px;
    border: 2.5px solid #b45309;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
    flex-shrink: 0;
    box-shadow: 0 4px 18px rgba(217, 119, 6, 0.25);
  }
  .mini-qr-img { width: 136px; height: 136px; display: block; object-fit: contain; }
  .promo-text-column { display: flex; flex-direction: column; align-items: flex-start; flex: 1; }
  .promo-quote-line { font-family: 'PlayfairLocal', Georgia, serif; font-size: 18px; font-style: italic; font-weight: 700; color: #1c1917; letter-spacing: 0.5px; }
  .promo-sub-note { font-size: 14px; color: #b45309; margin: 4px 0 10px 0; font-weight: 600; }
  .brand-website-tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 24px;
    border-radius: 18px;
    border: 1.5px solid #b45309;
    background: #ffffff;
    font-family: 'CinzelLocal', Georgia, serif;
    font-size: 14.5px;
    font-weight: 700;
    letter-spacing: 2.5px;
    color: #b45309;
  }
</style>
</head>
<body>

  <!-- Royal Poster Borders -->
  <div class="poster-outer-border"></div>
  <div class="poster-inner-border"></div>

  <!-- 4 Corner Flourishes -->
  <svg class="corner-flourish c-tl" viewBox="0 0 100 100"><path d="M 10 90 Q 10 10 90 10 Q 50 20 20 50 Q 10 70 10 90 Z" fill="#b45309"/></svg>
  <svg class="corner-flourish c-tr" viewBox="0 0 100 100"><path d="M 10 90 Q 10 10 90 10 Q 50 20 20 50 Q 10 70 10 90 Z" fill="#b45309"/></svg>
  <svg class="corner-flourish c-bl" viewBox="0 0 100 100"><path d="M 10 90 Q 10 10 90 10 Q 50 20 20 50 Q 10 70 10 90 Z" fill="#b45309"/></svg>
  <svg class="corner-flourish c-br" viewBox="0 0 100 100"><path d="M 10 90 Q 10 10 90 10 Q 50 20 20 50 Q 10 70 10 90 Z" fill="#b45309"/></svg>

  <!-- Section 1: The Imperial Heraldic Brand Crest -->
  <div class="brand-crest-unit">
    <div class="crest-wings-row">
      <div class="crest-wing-line"></div>
      <div class="crest-logo-disc">
        <img src="data:image/png;base64,${logoBase64}" class="crest-logo-img" alt="Healing Milestones Logo" />
      </div>
      <div class="crest-wing-line right"></div>
    </div>
    <div class="crest-title">HEALING MILESTONES</div>
    <div class="crest-subline">
      <span class="diamond">❖</span>
      <span>Celebrate Love • Track Your Health</span>
      <span class="diamond">❖</span>
    </div>

    <div class="header-couple-divider">
      <div class="h-line"></div>
      <span class="h-diamond">✦</span>
      <div class="h-line"></div>
    </div>
  </div>

  <!-- Section 2: Couple Hero Section -->
  <div class="couple-hero-unit">
    <div class="celebrating-tag">Celebrating The Wedding Of</div>
    <div class="couple-names-calligraphy">Ankita &amp; Harshit</div>
    
    <div class="quest-main-badge">
      <span>✦</span>
      <span>THE WEDDING QUEST</span>
      <span>✦</span>
    </div>
    <div class="quest-sub-tagline">An Interactive Wedding Scavenger Hunt</div>
  </div>

  <!-- Section 3: Massive Central Start QR Section (1080 x 1080 px) -->
  <div class="qr-centerpiece-unit">
    <div class="scan-call-cartouche">
      <div class="scan-call-cartouche-inner"></div>
      <div class="scan-call-text">✦ SCAN TO ENTER THE HUNT &amp; JOIN YOUR TEAM ✦</div>
    </div>

    <div class="start-qr-pad">
      <div class="start-qr-inner-ring"></div>
      <img src="${startQrDataUrl}" class="start-qr-img" alt="Start QR Code" />
      
      <!-- Central Circular Logo Disc Overlay -->
      <div class="qr-center-disc">
        <img src="data:image/png;base64,${logoBase64}" class="qr-center-logo-img" alt="Healing Milestones Logo" />
      </div>
    </div>

    <div class="qr-scan-instructions">
      <div class="qr-prompt-primary">Point your mobile camera to begin your adventure</div>
      <div class="qr-prompt-secondary">Instant Riddle Scan • Live Scoreboard • No App Download Required</div>
      <div class="direct-url-pill">
        <span>✦</span>
        <span>healingmilestones.in/q/start</span>
        <span>✦</span>
      </div>
    </div>
  </div>

  <!-- Section 4: How To Play: 3 Elegant Cards -->
  <div class="how-to-play-unit">
    <div class="how-to-play-header">
      <div class="gold-divider-line" style="width: 140px; height: 1.5px; background: linear-gradient(90deg, transparent, #b45309);"></div>
      <div class="how-to-play-title">❖ How To Play The Quest ❖</div>
      <div class="gold-divider-line" style="width: 140px; height: 1.5px; background: linear-gradient(90deg, #b45309, transparent);"></div>
    </div>

    <div class="steps-grid">
      <div class="step-card">
        <div class="step-badge">1</div>
        <div class="step-title">Join Your Side</div>
        <div class="step-desc">
          Scan the QR above, enter your name &amp; choose <span class="step-highlight">Team Bride 👰</span> or <span class="step-highlight">Team Groom 🤵</span>.
        </div>
      </div>

      <div class="step-card">
        <div class="step-badge">2</div>
        <div class="step-title">Solve The Riddles</div>
        <div class="step-desc">
          Read poetic clues on your phone to hunt down <span class="step-highlight">secret spots, special items &amp; VIP guests</span>.
        </div>
      </div>

      <div class="step-card">
        <div class="step-badge">3</div>
        <div class="step-title">Scan Clues &amp; Win!</div>
        <div class="step-desc">
          Find hidden physical clue cards, scan them to advance, <span class="step-highlight">climb the live leaderboard &amp; win</span>!
        </div>
      </div>
    </div>
  </div>

  <!-- Section 5: Four Quest Rounds Ribbon Badges -->
  <div class="rounds-ribbon-unit">
    <div class="round-pill round-yellow"><span>✦</span><span>Yellow Round</span></div>
    <div class="round-pill round-green"><span>✦</span><span>Green Round</span></div>
    <div class="round-pill round-pink"><span>✦</span><span>Pink Round</span></div>
    <div class="round-pill round-red"><span>✦</span><span>Red Round</span></div>
  </div>

  <!-- Section 6: Promotional Footer Unit -->
  <div class="promo-footer-unit">
    <div class="promo-footer-group">
      <div class="mini-qr-box">
        <img src="${miniQrDataUrl}" class="mini-qr-img" alt="Healing Milestones Mini QR" />
      </div>
      <div class="promo-text-column">
        <div class="promo-quote-line">"Celebrate Love • Cherish Life's Milestones"</div>
        <div class="promo-sub-note">Scan mini QR to explore personalized health, habits &amp; life milestone journeys</div>
        <div class="brand-website-tag">
          <span style="color: #b45309;">✦</span>
          <span>healingmilestones.in</span>
          <span style="color: #b45309;">✦</span>
        </div>
      </div>
    </div>
  </div>

</body>
</html>`;

  // Render Dark Edition
  const darkHtmlPath = path.join(__dirname, 'temp_dark_poster_v3.html');
  fs.writeFileSync(darkHtmlPath, darkPosterHtml);
  const darkOutputPath = path.join(outputDir, 'START_PAGE_POSTER_8x10_PORTRAIT.png');

  console.log('Rendering Upgraded 8x10 Inch Dark Luxury Start Page Poster (2400x3000)...');
  execSync(`"${chromePath}" --headless --disable-gpu --screenshot="${darkOutputPath}" --window-size=2400,3000 "file://${darkHtmlPath}"`);
  console.log('✅ Generated Dark Start Poster:', darkOutputPath);
  fs.copyFileSync(darkOutputPath, path.join(artifactDir, 'START_PAGE_POSTER_8x10_PORTRAIT.png'));

  // Render Light Edition
  const lightHtmlPath = path.join(__dirname, 'temp_light_poster_v3.html');
  fs.writeFileSync(lightHtmlPath, lightPosterHtml);
  const lightOutputPath = path.join(outputDir, 'START_PAGE_POSTER_8x10_PORTRAIT_LIGHT.png');

  console.log('Rendering Upgraded 8x10 Inch Royal Pearl Ivory Start Page Poster (2400x3000)...');
  execSync(`"${chromePath}" --headless --disable-gpu --screenshot="${lightOutputPath}" --window-size=2400,3000 "file://${lightHtmlPath}"`);
  console.log('✅ Generated Light Start Poster:', lightOutputPath);
  fs.copyFileSync(lightOutputPath, path.join(artifactDir, 'START_PAGE_POSTER_8x10_PORTRAIT_LIGHT.png'));

  // Clean up
  try {
    fs.unlinkSync(darkHtmlPath);
    fs.unlinkSync(lightHtmlPath);
  } catch (_) {}

  console.log('🎉 Both Upgraded Dark & Light 8x10 Portrait Start Posters Successfully Rendered!');
}

renderStartPosters().catch(err => {
  console.error('Error rendering start posters:', err);
  process.exit(1);
});
