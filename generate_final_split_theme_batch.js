const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const QRCode = require('qrcode');

const SPLIT_ROUNDS = {
  yellow: {
    roundId: 'yellow',
    roundName: 'Yellow Round',
    lightBg: 'background-color: #fffdfa; background-image: radial-gradient(ellipse at 50% 30%, #fef3c7 0%, #fffbeb 50%, #fffdfa 100%);',
    lightBorder: '#b45309',
    lightAccent: '#d97706',
    lightText: '#1c1917',
    lightSubtext: '#292524',
    lightMuted: '#57534e',
    lightGlow: 'rgba(217, 119, 6, 0.22)',
    darkBg: 'background-color: #0c0a09; background-image: radial-gradient(ellipse at 50% 25%, #38240b 0%, #1c1308 55%, #0c0a09 100%);',
    darkBorder: '#f59e0b',
    darkAccent: '#fbbf24',
    darkText: '#ffffff',
    darkGlow: 'rgba(245, 158, 11, 0.45)',
    darkGlowLight: 'rgba(251, 191, 36, 0.3)',
    darkPlaqueBg: 'linear-gradient(135deg, rgba(30, 22, 10, 0.96) 0%, rgba(18, 14, 8, 0.98) 100%)',
    darkRibbon: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
    darkRibbonBorder: '#fef08a',
    darkFooterBg: 'rgba(26, 20, 12, 0.96)',
    darkFooterBorder: 'rgba(245, 158, 11, 0.4)',
    foldGuide: '#d97706'
  },
  green: {
    roundId: 'green',
    roundName: 'Green Round',
    lightBg: 'background-color: #fffdfa; background-image: radial-gradient(ellipse at 50% 30%, #d1fae5 0%, #ecfdf5 50%, #fffdfa 100%);',
    lightBorder: '#047857',
    lightAccent: '#059669',
    lightText: '#1c1917',
    lightSubtext: '#292524',
    lightMuted: '#57534e',
    lightGlow: 'rgba(5, 150, 105, 0.22)',
    darkBg: 'background-color: #050e09; background-image: radial-gradient(ellipse at 50% 25%, #0a3322 0%, #061c12 55%, #050e09 100%);',
    darkBorder: '#10b981',
    darkAccent: '#34d399',
    darkText: '#ffffff',
    darkGlow: 'rgba(16, 185, 129, 0.45)',
    darkGlowLight: 'rgba(52, 211, 153, 0.3)',
    darkPlaqueBg: 'linear-gradient(135deg, rgba(12, 35, 24, 0.96) 0%, rgba(8, 22, 15, 0.98) 100%)',
    darkRibbon: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    darkRibbonBorder: '#a7f3d0',
    darkFooterBg: 'rgba(10, 26, 18, 0.96)',
    darkFooterBorder: 'rgba(16, 185, 129, 0.4)',
    foldGuide: '#059669'
  },
  pink: {
    roundId: 'pink',
    roundName: 'Pink Round',
    lightBg: 'background-color: #fffdfa; background-image: radial-gradient(ellipse at 50% 30%, #fce7f3 0%, #fdf2f8 50%, #fffdfa 100%);',
    lightBorder: '#be185d',
    lightAccent: '#db2777',
    lightText: '#1c1917',
    lightSubtext: '#292524',
    lightMuted: '#57534e',
    lightGlow: 'rgba(219, 39, 119, 0.22)',
    darkBg: 'background-color: #0e0509; background-image: radial-gradient(ellipse at 50% 25%, #3b0d24 0%, #1f0714 55%, #0e0509 100%);',
    darkBorder: '#ec4899',
    darkAccent: '#f472b6',
    darkText: '#ffffff',
    darkGlow: 'rgba(236, 72, 153, 0.45)',
    darkGlowLight: 'rgba(244, 114, 182, 0.3)',
    darkPlaqueBg: 'linear-gradient(135deg, rgba(40, 12, 26, 0.96) 0%, rgba(24, 8, 16, 0.98) 100%)',
    darkRibbon: 'linear-gradient(135deg, #db2777 0%, #be185d 100%)',
    darkRibbonBorder: '#fbcfe8',
    darkFooterBg: 'rgba(28, 10, 20, 0.96)',
    darkFooterBorder: 'rgba(236, 72, 153, 0.4)',
    foldGuide: '#db2777'
  },
  red: {
    roundId: 'red',
    roundName: 'Red Round',
    lightBg: 'background-color: #fffdfa; background-image: radial-gradient(ellipse at 50% 30%, #fee2e2 0%, #fef2f2 50%, #fffdfa 100%);',
    lightBorder: '#b91c1c',
    lightAccent: '#dc2626',
    lightText: '#1c1917',
    lightSubtext: '#292524',
    lightMuted: '#57534e',
    lightGlow: 'rgba(220, 38, 38, 0.22)',
    darkBg: 'background-color: #0e0505; background-image: radial-gradient(ellipse at 50% 25%, #3b0a0a 0%, #1f0606 55%, #0e0505 100%);',
    darkBorder: '#ef4444',
    darkAccent: '#f87171',
    darkText: '#ffffff',
    darkGlow: 'rgba(239, 68, 68, 0.45)',
    darkGlowLight: 'rgba(248, 113, 113, 0.3)',
    darkPlaqueBg: 'linear-gradient(135deg, rgba(40, 10, 10, 0.96) 0%, rgba(24, 6, 6, 0.98) 100%)',
    darkRibbon: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
    darkRibbonBorder: '#fecaca',
    darkFooterBg: 'rgba(28, 8, 8, 0.96)',
    darkFooterBorder: 'rgba(239, 68, 68, 0.4)',
    foldGuide: '#dc2626'
  }
};

const QUEST_DATA = {
  yellow: [
    { step: 1, secret: "ylw1", hint: "The Speakers / DJ" },
    { step: 2, secret: "ylw2", hint: "The Haldi Bowl" },
    { step: 3, secret: "ylw3", hint: "The Photographer (or Camera)" },
    { step: 4, secret: "ylw4", hint: "Pani Puri / Chaat Stall" },
    { step: 5, secret: "ylw5", hint: "The Ice Cooler / Drinks Station" },
    { step: 6, secret: "ylw6", hint: "Aviral (The Brother)" },
    { step: 7, secret: "ylw7", hint: "The Dessert Table" },
    { step: 8, secret: "ylw8", hint: "The Welcome Sign / Floral Entrance" }
  ],
  green: [
    { step: 1, secret: "grn1", hint: "The Mehndi Cones / The Artist" },
    { step: 2, secret: "grn2", hint: "The Lemon & Sugar Mixture" },
    { step: 3, secret: "grn3", hint: "The Bangle Stall / Box" },
    { step: 4, secret: "grn4", hint: "The Chai / Tea Counter" },
    { step: 5, secret: "grn5", hint: "The Dholki / Hand Drum" },
    { step: 6, secret: "grn6", hint: "The Groom" },
    { step: 7, secret: "grn7", hint: "Marigold (Genda Phool) Decorations" },
    { step: 8, secret: "grn8", hint: "The Photographer's Lighting Umbrella" }
  ],
  pink: [
    { step: 1, secret: "pnk1", hint: "The Floral Backdrop / Stage Wall" },
    { step: 2, secret: "pnk2", hint: "The Bride's Sister" },
    { step: 3, secret: "pnk3", hint: "Traditional Umbrella Decor" },
    { step: 4, secret: "pnk4", hint: "The Groom's Mother" },
    { step: 5, secret: "pnk5", hint: "The Puja Thali / Sacred Plate" },
    { step: 6, secret: "pnk6", hint: "The Groom's Best Friend / Brother" },
    { step: 7, secret: "pnk7", hint: "The Bride Herself!" },
    { step: 8, secret: "pnk8", hint: "The Bride's Mother" }
  ],
  red: [
    { step: 1, secret: "red1", hint: "The Bride's Father" },
    { step: 2, secret: "red2", hint: "The Groom's Father" },
    { step: 3, secret: "red3", hint: "The Videographer" },
    { step: 4, secret: "red4", hint: "The Bride's Maternal Uncle (Mama)" },
    { step: 5, secret: "red5", hint: "The Bride's Best Friend / Bridesmaid" },
    { step: 6, secret: "red6", hint: "The Groom's Shoes" },
    { step: 7, secret: "red7", hint: "The Grandparents (or Eldest Relative)" },
    { step: 8, secret: "red8", hint: "The Couple's Seating (Main Thrones)" }
  ]
};

function renderUpgradedSplitCard(round, qrDataUrl, logoBase64, miniQrDataUrl, clueNum) {
  return `
  <div class="card-unit">
    <!-- LEFT HALF (LIGHT): QR CODE WITH CLUE # ABOVE AND FLOURISHES IN ALL 4 CORNERS -->
    <div class="card-half qr-half" style="${round.lightBg}">
      <div class="half-outer-border" style="border-color: ${round.lightBorder};"></div>
      <div class="half-inner-border" style="border-color: ${round.lightBorder};"></div>
      
      <!-- ALL 4 CORNERS FLOURISHES (LIGHT SIDE) -->
      <svg class="corner-flourish c-tl" viewBox="0 0 100 100"><path d="M 10 90 Q 10 10 90 10 Q 50 20 20 50 Q 10 70 10 90 Z" fill="${round.lightBorder}"/></svg>
      <svg class="corner-flourish c-tr" viewBox="0 0 100 100"><path d="M 10 90 Q 10 10 90 10 Q 50 20 20 50 Q 10 70 10 90 Z" fill="${round.lightBorder}"/></svg>
      <svg class="corner-flourish c-bl" viewBox="0 0 100 100"><path d="M 10 90 Q 10 10 90 10 Q 50 20 20 50 Q 10 70 10 90 Z" fill="${round.lightBorder}"/></svg>
      <svg class="corner-flourish c-br" viewBox="0 0 100 100"><path d="M 10 90 Q 10 10 90 10 Q 50 20 20 50 Q 10 70 10 90 Z" fill="${round.lightBorder}"/></svg>

      <!-- Top Group: Couple + Wedding Quest + CLUE # PLAQUE ABOVE QR -->
      <div class="qr-header-group">
        <div class="qr-couple-title" style="color: ${round.lightText};">Ankita &amp; Harshit</div>
        <div class="qr-quest-sub" style="color: ${round.lightBorder};">The Wedding Quest</div>
        
        <div class="clue-plaque-above" style="background: ${round.darkPlaqueBg}; border-color: ${round.lightBorder}; box-shadow: 0 4px 14px ${round.lightGlow};">
          <div class="clue-plaque-above-inner" style="border-color: ${round.lightAccent};"></div>
          <div class="clue-plaque-above-text" style="color: #ffffff; text-shadow: 0 0 10px rgba(251, 191, 36, 0.35);">CLUE #${clueNum}</div>
        </div>
      </div>

      <!-- High-Resolution QR Box with Clean Circular Logo Disc Overlay -->
      <div class="qr-code-pad" style="border-color: ${round.lightBorder}; box-shadow: 0 12px 35px ${round.lightGlow}, 0 0 16px ${round.lightGlow};">
        <div class="qr-pad-inner-ring" style="border-color: ${round.lightAccent};"></div>
        <img src="${qrDataUrl}" class="qr-code-image" alt="QR Code" />
        <div class="qr-center-disc" style="border-color: ${round.lightBorder}; box-shadow: 0 0 18px ${round.lightGlow}, 0 4px 12px rgba(0,0,0,0.5);">
          <img src="data:image/png;base64,${logoBase64}" class="qr-center-logo-img" alt="Healing Milestones Logo" />
        </div>
      </div>

      <!-- Bottom Scanning Instructions -->
      <div class="qr-footer-group">
        <div class="qr-prompt-line" style="color: ${round.lightSubtext};">Point your camera to unlock the clue</div>
        <div class="qr-prompt-sub" style="color: ${round.lightMuted};">Instant riddle scan • No app required</div>
        <div class="qr-website-url" style="color: ${round.lightBorder};">healingmilestones.in</div>
      </div>
    </div>

    <!-- RIGHT HALF (DARK): FRONT COVER WITH LOGO, AT LEAST 1.05 CM MINI QR, AND FLOURISHES IN ALL 4 CORNERS -->
    <div class="card-half front-half" style="${round.darkBg}">
      <div class="half-outer-border" style="border-color: ${round.darkBorder}; box-shadow: inset 0 0 14px ${round.darkGlowLight}, 0 0 14px ${round.darkGlowLight};"></div>
      <div class="half-inner-border" style="border-color: ${round.darkBorder}; opacity: 0.35;"></div>
      
      <!-- ALL 4 CORNERS FLOURISHES (DARK SIDE) -->
      <svg class="corner-flourish c-tl" viewBox="0 0 100 100"><path d="M 10 90 Q 10 10 90 10 Q 50 20 20 50 Q 10 70 10 90 Z" fill="${round.darkAccent}"/></svg>
      <svg class="corner-flourish c-tr" viewBox="0 0 100 100"><path d="M 10 90 Q 10 10 90 10 Q 50 20 20 50 Q 10 70 10 90 Z" fill="${round.darkAccent}"/></svg>
      <svg class="corner-flourish c-bl" viewBox="0 0 100 100"><path d="M 10 90 Q 10 10 90 10 Q 50 20 20 50 Q 10 70 10 90 Z" fill="${round.darkAccent}"/></svg>
      <svg class="corner-flourish c-br" viewBox="0 0 100 100"><path d="M 10 90 Q 10 10 90 10 Q 50 20 20 50 Q 10 70 10 90 Z" fill="${round.darkAccent}"/></svg>

      <!-- 1. Enriched Brand App-Bar Plaque Header -->
      <div class="brand-header-unit">
        <div class="brand-header-plaque" style="background: ${round.darkPlaqueBg}; border-color: ${round.darkBorder}; box-shadow: 0 10px 30px ${round.darkGlow}, 0 0 22px ${round.darkGlowLight};">
          <div class="brand-plaque-inner-ring" style="border-color: ${round.darkBorder};"></div>
          <div class="brand-logo-disc" style="border-color: ${round.darkAccent}; box-shadow: 0 0 14px ${round.darkGlowLight};">
            <img src="data:image/png;base64,${logoBase64}" class="brand-logo-img" alt="Healing Milestones Logo" />
          </div>
          <div class="brand-plaque-sep" style="background: linear-gradient(to bottom, transparent, ${round.darkBorder}, transparent);"></div>
          <div class="brand-text-col">
            <div class="brand-name-title" style="color: #ffffff;">HEALING MILESTONES</div>
            <div class="brand-app-sub" style="color: ${round.darkAccent};">Celebrate Love • Track Your Health</div>
          </div>
        </div>

        <div class="gold-divider" style="margin: 12px 0 0 0;">
          <div class="gold-divider-line" style="background: linear-gradient(90deg, transparent, ${round.darkBorder}, transparent);"></div>
          <span class="gold-divider-diamond" style="color: ${round.darkAccent};">❖</span>
          <div class="gold-divider-line" style="background: linear-gradient(90deg, transparent, ${round.darkBorder}, transparent);"></div>
        </div>
      </div>

      <!-- 2. Middle Hero: Grand Ankita & Harshit + Round Ribbon Badge -->
      <div class="middle-hero-group">
        <div class="celebrating-tag" style="color: ${round.darkAccent};">Celebrating The Wedding Of</div>
        <div class="couple-names-calligraphy" style="color: #ffffff; text-shadow: 0 0 28px ${round.darkGlowLight}, 0 2px 10px rgba(0,0,0,0.85);">Ankita &amp; Harshit</div>
        <div class="hunt-subheading" style="color: ${round.darkAccent};">Wedding Scavenger Hunt</div>

        <div class="round-ribbon-badge" style="background: ${round.darkRibbon}; border-color: ${round.darkRibbonBorder}; box-shadow: 0 8px 25px ${round.darkGlow};">
          <span>✦</span>
          <span>${round.roundName.toUpperCase()}</span>
          <span>✦</span>
        </div>
      </div>

      <!-- 3. Promotional Brand Footer with >= 1.05 CM MINI QR -->
      <div class="promo-footer-unit">
        <div class="gold-divider" style="margin: 0 0 12px 0;">
          <div class="gold-divider-line" style="background: linear-gradient(90deg, transparent, ${round.darkBorder}, transparent);"></div>
          <span class="gold-divider-diamond" style="color: ${round.darkAccent};">❖</span>
          <div class="gold-divider-line" style="background: linear-gradient(90deg, transparent, ${round.darkBorder}, transparent);"></div>
        </div>
        <div class="promo-footer-group" style="background: ${round.darkFooterBg}; border-color: ${round.darkFooterBorder};">
          <!-- Mini QR Pod: 132x132px (QR image 122x122px = 1.05 cm / 0.41 inches) -->
          <div class="mini-qr-box" style="border-color: ${round.darkBorder}; box-shadow: 0 4px 18px ${round.darkGlowLight};">
            <img src="${miniQrDataUrl}" class="mini-qr-img" alt="Mini QR" />
          </div>
          <div class="promo-text-column">
            <div class="promo-quote-line" style="color: #f5f5f4;">"Celebrate Love • Cherish Life's Milestones"</div>
            <div class="promo-sub-note" style="color: ${round.darkAccent};">Scan mini QR to explore health &amp; life journeys</div>
            <div class="brand-website-tag" style="background: rgba(18, 14, 10, 0.92); border-color: ${round.darkBorder}; color: ${round.darkAccent};">
              <span class="sparkle-accent" style="color: ${round.darkAccent};">✦</span>
              <span>healingmilestones.in</span>
              <span class="sparkle-accent" style="color: ${round.darkAccent};">✦</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Center Fold Guideline -->
    <div class="fold-guide-line" style="border-left-color: ${round.foldGuide};"></div>
  </div>`;
}

async function generateAllSplitThemeSheets() {
  const logoPath = path.join(__dirname, 'public/logo.png');
  const logoBase64 = fs.readFileSync(logoPath).toString('base64');
  const gvBase64 = fs.readFileSync(path.join(__dirname, 'fonts/GreatVibes.ttf')).toString('base64');
  const cinzelBase64 = fs.readFileSync(path.join(__dirname, 'fonts/CinzelBold.ttf')).toString('base64');
  const pfBase64 = fs.readFileSync(path.join(__dirname, 'fonts/PlayfairBold.ttf')).toString('base64');

  const miniQrDataUrl = await QRCode.toDataURL('https://healingmilestones.in', {
    margin: 1,
    color: { dark: '#121212', light: '#ffffff' },
    width: 500
  });

  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const artifactDir = '/Users/aviraldixit/.gemini/antigravity/brain/c46e5759-a13b-4cdf-a016-1ddf31424f36';

  const sharedStyles = `
  @font-face { font-family: 'GreatVibesLocal'; src: url('data:font/ttf;base64,${gvBase64}') format('truetype'); }
  @font-face { font-family: 'CinzelLocal'; src: url('data:font/ttf;base64,${cinzelBase64}') format('truetype'); font-weight: 700; }
  @font-face { font-family: 'PlayfairLocal'; src: url('data:font/ttf;base64,${pfBase64}') format('truetype'); font-weight: 700; }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  body {
    width: 3000px;
    height: 2400px;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    -webkit-font-smoothing: antialiased;
    padding: 30px;
  }

  /* 2x2 Grid for 4 Cards */
  .sheet-container {
    width: 2940px;
    height: 2340px;
    display: grid;
    grid-template-columns: 1440px 1440px;
    grid-template-rows: 1140px 1140px;
    gap: 60px 60px;
    position: relative;
  }

  /* Cut Guidelines Between Cards */
  .cut-guide-horizontal {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    border-top: 2px dashed #94a3b8;
    transform: translateY(-50%);
    pointer-events: none;
    z-index: 50;
  }
  .cut-guide-vertical {
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 1px;
    border-left: 2px dashed #94a3b8;
    transform: translateX(-50%);
    pointer-events: none;
    z-index: 50;
  }
  .cut-tag {
    position: absolute;
    background: #ffffff;
    border: 1px solid #94a3b8;
    color: #475569;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 2px;
    padding: 4px 14px;
    border-radius: 14px;
    text-transform: uppercase;
    z-index: 55;
  }
  .cut-tag-h { top: 50%; left: 50%; transform: translate(-50%, -50%); }

  /* Single Foldable Card Unit: 1440 x 1140 px */
  .card-unit {
    width: 1440px;
    height: 1140px;
    position: relative;
    display: flex;
    box-shadow: 0 10px 25px rgba(0,0,0,0.10);
    border-radius: 14px;
    overflow: hidden;
    background: #000000;
    border: 1.5px solid rgba(0, 0, 0, 0.15);
  }

  /* INCREASED TOP & BOTTOM PADDING: 48px top, 46px bottom for generous border clearance */
  .card-half {
    width: 50%;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 48px 30px 46px 30px;
    overflow: hidden;
  }

  .half-outer-border { position: absolute; inset: 18px; border: 3px solid; border-radius: 10px; pointer-events: none; }
  .half-inner-border { position: absolute; inset: 26px; border: 1.5px solid; border-radius: 6px; opacity: 0.35; pointer-events: none; }
  .fold-guide-line { position: absolute; left: 50%; top: 18px; bottom: 18px; width: 0; border-left: 2px dashed; opacity: 0.6; pointer-events: none; z-index: 10; }

  /* Flourishes in ALL 4 corners */
  .corner-flourish { position: absolute; width: 34px; height: 34px; opacity: 0.8; pointer-events: none; z-index: 5; }
  .c-tl { top: 28px; left: 28px; }
  .c-tr { top: 28px; right: 28px; transform: scaleX(-1); }
  .c-bl { bottom: 28px; left: 28px; transform: scaleY(-1); }
  .c-br { bottom: 28px; right: 28px; transform: scale(-1, -1); }

  /* Left Half: QR Elements */
  .qr-header-group { display: flex; flex-direction: column; align-items: center; text-align: center; }
  .qr-couple-title { font-family: 'GreatVibesLocal', cursive; font-size: 50px; line-height: 1.1; }
  .qr-quest-sub { font-family: 'CinzelLocal', Georgia, serif; font-size: 13px; font-weight: 700; letter-spacing: 3.5px; text-transform: uppercase; margin: 3px 0 8px 0; }
  
  .clue-plaque-above {
    padding: 6px 32px; border: 2px solid; border-radius: 24px; position: relative;
    display: inline-flex; align-items: center; justify-content: center;
  }
  .clue-plaque-above-inner { position: absolute; inset: 3px; border: 1px solid; border-radius: 20px; opacity: 0.45; pointer-events: none; }
  .clue-plaque-above-text { font-family: 'CinzelLocal', Georgia, serif; font-size: 19px; font-weight: 700; letter-spacing: 4.5px; }

  .qr-code-pad {
    width: 650px; height: 650px; background: #ffffff; border-radius: 20px; border: 3.5px solid;
    display: flex; align-items: center; justify-content: center; position: relative; padding: 10px;
  }
  .qr-pad-inner-ring { position: absolute; inset: 7px; border: 1.5px solid; border-radius: 14px; opacity: 0.45; pointer-events: none; }
  .qr-code-image { width: 630px; height: 630px; display: block; object-fit: contain; }

  /* Circular Center Logo Disc */
  .qr-center-disc {
    position: absolute;
    width: 136px;
    height: 136px;
    border-radius: 50%;
    background: #111111;
    border: 3.5px solid;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    z-index: 10;
  }
  .qr-center-logo-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .qr-footer-group { display: flex; flex-direction: column; align-items: center; text-align: center; }
  .qr-prompt-line { font-family: 'PlayfairLocal', Georgia, serif; font-size: 14.5px; font-weight: 700; letter-spacing: 0.8px; }
  .qr-prompt-sub { font-size: 11.5px; letter-spacing: 0.5px; margin-top: 2px; font-weight: 500; }
  .qr-website-url { font-family: 'CinzelLocal', Georgia, serif; font-size: 12.5px; font-weight: 700; letter-spacing: 2px; margin-top: 4px; }

  /* Right Half: Brand Header */
  .brand-header-unit { width: 100%; display: flex; flex-direction: column; align-items: center; }
  .brand-header-plaque {
    display: flex; align-items: center; padding: 10px 24px; border: 2px solid; border-radius: 44px; position: relative; max-width: 90%;
  }
  .brand-plaque-inner-ring { position: absolute; inset: 3px; border: 1px solid; border-radius: 40px; opacity: 0.35; pointer-events: none; }
  
  .brand-logo-disc {
    width: 60px; height: 60px; border-radius: 50%; border: 2.5px solid; overflow: hidden;
    background: #111111; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .brand-logo-img { width: 100%; height: 100%; object-fit: cover; display: block; border-radius: 50%; }
  
  .brand-plaque-sep { width: 1.5px; height: 40px; margin: 0 16px; }
  .brand-text-col { display: flex; flex-direction: column; align-items: flex-start; }
  .brand-name-title { font-family: 'CinzelLocal', Georgia, serif; font-size: 18px; font-weight: 700; letter-spacing: 3.2px; line-height: 1.2; }
  .brand-app-sub { font-size: 11.5px; letter-spacing: 1.5px; margin-top: 2px; font-weight: 600; }

  .gold-divider { display: flex; align-items: center; justify-content: center; width: 78%; }
  .gold-divider-line { flex: 1; height: 1px; }
  .gold-divider-diamond { margin: 0 10px; font-size: 12px; line-height: 1; }

  /* Middle Hero */
  .middle-hero-group { display: flex; flex-direction: column; align-items: center; text-align: center; margin: 8px 0; }
  .celebrating-tag { font-family: 'CinzelLocal', Georgia, serif; font-size: 13.5px; font-weight: 700; letter-spacing: 3.6px; text-transform: uppercase; }
  .couple-names-calligraphy { font-family: 'GreatVibesLocal', cursive; font-size: 86px; line-height: 1.15; margin: 8px 0 4px 0; }
  .hunt-subheading { font-family: 'CinzelLocal', Georgia, serif; font-size: 14px; font-weight: 700; letter-spacing: 3.6px; text-transform: uppercase; margin-bottom: 20px; }
  
  .round-ribbon-badge {
    padding: 9px 36px; border-radius: 26px; border: 1.5px solid;
    display: inline-flex; align-items: center; gap: 10px; color: #ffffff;
    font-family: 'CinzelLocal', Georgia, serif; font-size: 14px; font-weight: 700; letter-spacing: 3.6px;
  }

  /* Upgraded Promo Footer with >= 1.05 CM (122px) MINI QR */
  .promo-footer-unit { width: 100%; display: flex; flex-direction: column; align-items: center; }
  .promo-footer-group {
    display: flex; align-items: center; gap: 18px; padding: 12px 20px; border-radius: 16px; border: 1.5px solid; width: 90%;
  }
  .mini-qr-box {
    width: 132px; height: 132px; background: #ffffff; border-radius: 12px; border: 2px solid;
    display: flex; align-items: center; justify-content: center; padding: 5px; flex-shrink: 0;
  }
  .mini-qr-img { width: 122px; height: 122px; display: block; object-fit: contain; }
  .promo-text-column { display: flex; flex-direction: column; align-items: flex-start; flex: 1; }
  .promo-quote-line { font-family: 'PlayfairLocal', Georgia, serif; font-size: 14px; font-style: italic; font-weight: 700; letter-spacing: 0.5px; line-height: 1.3; }
  .promo-sub-note { font-size: 11px; margin: 4px 0 8px 0; font-weight: 500; }
  .brand-website-tag {
    display: inline-flex; align-items: center; gap: 6px; padding: 4px 14px; border-radius: 14px; border: 1px solid;
    font-family: 'CinzelLocal', Georgia, serif; font-size: 11px; font-weight: 700; letter-spacing: 2px;
  }
  .sparkle-accent { font-size: 10px; }
  `;

  const rounds = ['yellow', 'green', 'pink', 'red'];

  let sheetIndex = 1;

  for (const rId of rounds) {
    const roundConfig = SPLIT_ROUNDS[rId];
    const roundClues = QUEST_DATA[rId];

    console.log(`Processing Round: ${rId.toUpperCase()} (${roundClues.length} clues with circular logo medallions)`);

    // 8 clues -> 2 sheets (4 cards each)
    for (let part = 0; part < 2; part++) {
      const startClueNum = part * 4 + 1;
      const endClueNum = (part + 1) * 4;

      let cardsHtml = '';
      for (let i = 0; i < 4; i++) {
        const clueIndex = part * 4 + i;
        const clue = roundClues[clueIndex];
        const clueNum = clue.step;
        const clueUrl = `https://healingmilestones.in/q/${rId}/${clue.step}?secret=${clue.secret}`;

        // Generate Ultra High-Res Clean QR (1200x1200px, Error Correction H for central circular disc)
        const qrDataUrl = await QRCode.toDataURL(clueUrl, {
          margin: 1,
          errorCorrectionLevel: 'H',
          width: 1200,
          color: { dark: '#0a0a0a', light: '#ffffff' }
        });

        cardsHtml += renderUpgradedSplitCard(roundConfig, qrDataUrl, logoBase64, miniQrDataUrl, clueNum);
      }

      const sheetHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Wedding Quest Print Sheet - Sheet ${sheetIndex}</title>
<style>
  ${sharedStyles}
</style>
</head>
<body>

<div class="sheet-container">
  <div class="cut-guide-horizontal"></div>
  <div class="cut-guide-vertical"></div>
  <span class="cut-tag cut-tag-h">✂ Cut Sheet Along Dashed Center Lines</span>
  ${cardsHtml}
</div>

</body>
</html>`;

      const tempHtmlPath = path.join(__dirname, `temp_final_sheet_${sheetIndex}.html`);
      fs.writeFileSync(tempHtmlPath, sheetHtml);

      const fileName = `SHEET${sheetIndex}_${rId.toUpperCase()}_CLUES_${startClueNum}_TO_${endClueNum}.png`;
      const outputPath = path.join(__dirname, 'public/qr_codes_for_print', fileName);

      console.log(`Rendering Sheet ${sheetIndex} of 8: ${fileName}...`);
      const cmd = `"${chromePath}" --headless --disable-gpu --screenshot="${outputPath}" --window-size=3000,2400 "file://${tempHtmlPath}"`;
      execSync(cmd, { stdio: 'inherit' });

      // Copy to artifact directory
      fs.copyFileSync(outputPath, path.join(artifactDir, fileName));
      console.log(`✅ Saved & Copied to artifacts: ${fileName}`);

      // Clean up temp html
      try { fs.unlinkSync(tempHtmlPath); } catch (_) {}

      sheetIndex++;
    }
  }

  console.log('🎉 ALL 8 FINAL PRINT SHEETS SUCCESSFULLY GENERATED!');
}

generateAllSplitThemeSheets().catch(err => {
  console.error('Error generating final batch sheets:', err);
  process.exit(1);
});
