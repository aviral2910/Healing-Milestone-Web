const { Jimp, loadFont, measureText } = require('jimp');
const path = require('path');
const fs = require('fs');

const QUEST_DATA = {
  yellow: {
    name: 'YELLOW (HALDI)',
    badge: 'YELLOW ROUND',
    ceremony: 'Haldi Ceremony',
    colorHex: 0xeab308ff,
    darkHex: 0xca8a04ff,
    lightHex: 0xfef9c3ff,
    badgeTextDark: true,
    riddles: [
      { step: 1, secret: "ylw1", hint: "The Speakers / DJ" },
      { step: 2, secret: "ylw2", hint: "The Haldi Bowl" },
      { step: 3, secret: "ylw3", hint: "The Photographer (or Camera)" },
      { step: 4, secret: "ylw4", hint: "Pani Puri / Chaat Stall" },
      { step: 5, secret: "ylw5", hint: "The Ice Cooler / Drinks Station" },
      { step: 6, secret: "ylw6", hint: "Aviral (The Brother)" },
      { step: 7, secret: "ylw7", hint: "The Dessert Table" },
      { step: 8, secret: "ylw8", hint: "The Welcome Sign / Floral Entrance" }
    ]
  },
  green: {
    name: 'GREEN (MEHNDI)',
    badge: 'GREEN ROUND',
    ceremony: 'Mehndi Ceremony',
    colorHex: 0x22c55eff,
    darkHex: 0x16a34aff,
    lightHex: 0xdcfce7ff,
    badgeTextDark: false,
    riddles: [
      { step: 1, secret: "grn1", hint: "The Mehndi Cones / The Artist" },
      { step: 2, secret: "grn2", hint: "The Lemon & Sugar Mixture" },
      { step: 3, secret: "grn3", hint: "The Bangle Stall / Box" },
      { step: 4, secret: "grn4", hint: "The Chai / Tea Counter" },
      { step: 5, secret: "grn5", hint: "The Dholki / Hand Drum" },
      { step: 6, secret: "grn6", hint: "The Groom" },
      { step: 7, secret: "grn7", hint: "Marigold (Genda Phool) Decorations" },
      { step: 8, secret: "grn8", hint: "The Photographer's Lighting Umbrella" }
    ]
  },
  pink: {
    name: 'PINK (SANGEET)',
    badge: 'PINK ROUND',
    ceremony: 'Sangeet Night',
    colorHex: 0xec4899ff,
    darkHex: 0xdb2777ff,
    lightHex: 0xfce7f3ff,
    badgeTextDark: false,
    riddles: [
      { step: 1, secret: "pnk1", hint: "The Floral Backdrop / Stage Wall" },
      { step: 2, secret: "pnk2", hint: "The Bride's Sister" },
      { step: 3, secret: "pnk3", hint: "Traditional Umbrella Decor" },
      { step: 4, secret: "pnk4", hint: "The Groom's Mother" },
      { step: 5, secret: "pnk5", hint: "The Puja Thali / Sacred Plate" },
      { step: 6, secret: "pnk6", hint: "The Groom's Best Friend / Brother" },
      { step: 7, secret: "pnk7", hint: "The Bride Herself!" },
      { step: 8, secret: "pnk8", hint: "The Bride's Mother" }
    ]
  },
  red: {
    name: 'RED (WEDDING)',
    badge: 'RED ROUND',
    ceremony: 'Wedding Ceremony',
    colorHex: 0xef4444ff,
    darkHex: 0xdc2626ff,
    lightHex: 0xfee2e2ff,
    badgeTextDark: false,
    riddles: [
      { step: 1, secret: "red1", hint: "The Bride's Father" },
      { step: 2, secret: "red2", hint: "The Groom's Father" },
      { step: 3, secret: "red3", hint: "The Videographer" },
      { step: 4, secret: "red4", hint: "The Bride's Maternal Uncle (Mama)" },
      { step: 5, secret: "red5", hint: "The Bride's Best Friend / Bridesmaid" },
      { step: 6, secret: "red6", hint: "The Groom's Shoes" },
      { step: 7, secret: "red7", hint: "The Grandparents (or Eldest Relative)" },
      { step: 8, secret: "red8", hint: "The Couple's Seating (Main Thrones)" }
    ]
  }
};

const outputDir = path.join(__dirname, 'public', 'qr_codes_for_print');
const logoPath = path.join(__dirname, 'public', 'logo.png');

async function drawDashedVLine(sheet, x, startY, endY, colorHex) {
  const dashLen = 22;
  const gapLen = 16;
  const dashImg = new Jimp({ width: 2, height: dashLen, color: colorHex });
  for (let y = startY; y < endY; y += (dashLen + gapLen)) {
    sheet.composite(dashImg, x, y);
  }
}

async function drawDashedHLine(sheet, y, startX, endX, colorHex) {
  const dashLen = 22;
  const gapLen = 16;
  const dashImg = new Jimp({ width: dashLen, height: 2, color: colorHex });
  for (let x = startX; x < endX; x += (dashLen + gapLen)) {
    sheet.composite(dashImg, x, y);
  }
}

async function createRoundSheet(colorKey, roundData, fonts) {
  const { font64B, font32B, font16B, font12B, font64W, font32W, font16W } = fonts;
  
  // 8 x 10 inches at 300 DPI = 2400 x 3000 pixels
  const SHEET_W = 2400;
  const SHEET_H = 3000;
  
  const sheet = new Jimp({ width: SHEET_W, height: SHEET_H, color: 0xffffffff });
  
  // 1. TOP HEADER BANNER (Height: 215px)
  const headerBar = new Jimp({ width: SHEET_W, height: 215, color: 0x0f172aff });
  sheet.composite(headerBar, 0, 0);

  // Round Accent Line under Header
  const accentLine = new Jimp({ width: SHEET_W, height: 8, color: roundData.colorHex });
  sheet.composite(accentLine, 0, 215);

  // Composite Logo in Header
  if (fs.existsSync(logoPath)) {
    try {
      const logo = await Jimp.read(logoPath);
      logo.resize({ h: 140 });
      sheet.composite(logo, 60, 38);
    } catch(e) {
      console.log('Error compositing logo:', e.message);
    }
  }

  // Header Text
  sheet.print({
    font: font16W,
    x: 230,
    y: 40,
    text: 'HEALING MILESTONES PRESENTS'
  });

  sheet.print({
    font: font64W,
    x: 230,
    y: 65,
    text: `WEDDING QUEST - ${roundData.name}`
  });

  sheet.print({
    font: font16W,
    x: 230,
    y: 155,
    text: `8x10 INCH PRINT SHEET | 8 CLUES | 300 DPI | CUT ALONG DASHED GUIDELINES FOR 8 SEPARATE CARDS`
  });

  // Top right badge in header
  const printPillW = 320;
  const printPillH = 44;
  const printPill = new Jimp({ width: printPillW, height: printPillH, color: roundData.colorHex });
  sheet.composite(printPill, SHEET_W - printPillW - 60, 85);
  sheet.print({
    font: roundData.badgeTextDark ? font16B : font16W,
    x: SHEET_W - printPillW - 40,
    y: 98,
    text: 'PHOTO PRINT 8x10"'
  });

  // 2. GRID CONFIGURATION (2 columns x 4 rows)
  const MARGIN_X = 55;
  const GAP_X = 50;
  const CARD_W = 1090;
  
  const START_Y = 250;
  const GAP_Y = 32;
  const CARD_H = 645;

  const existingFiles = fs.readdirSync(outputDir);

  for (let i = 0; i < roundData.riddles.length; i++) {
    const riddle = roundData.riddles[i];
    const colIndex = i % 2;
    const rowIndex = Math.floor(i / 2);

    const cardX = MARGIN_X + colIndex * (CARD_W + GAP_X + 20);
    const cardY = START_Y + rowIndex * (CARD_H + GAP_Y);

    // --- Build Card ---
    // Outer Border
    const borderThick = 3;
    const cardOuter = new Jimp({ width: CARD_W, height: CARD_H, color: roundData.darkHex });
    const cardInner = new Jimp({ width: CARD_W - borderThick * 2, height: CARD_H - borderThick * 2, color: 0xffffffff });
    cardOuter.composite(cardInner, borderThick, borderThick);

    // Subtle colored left strip
    const leftStrip = new Jimp({ width: 12, height: CARD_H - borderThick * 2, color: roundData.colorHex });
    cardOuter.composite(leftStrip, borderThick, borderThick);

    // Load QR Code
    const prefix = `${colorKey}_step${riddle.step}_`;
    const matchedFile = existingFiles.find(f => f.startsWith(prefix) && f.endsWith('.png'));

    if (matchedFile) {
      const qrPath = path.join(outputDir, matchedFile);
      const qrImage = await Jimp.read(qrPath);
      // Resize QR to fit nicely: 560 x 560 px
      qrImage.resize({ w: 560, h: 560 });
      cardOuter.composite(qrImage, 35, 42);
    }

    // Right Side Info Area: X offset = 625
    const textStartX = 625;

    // A. Round Badge Pill
    const badgeW = 280;
    const badgeH = 38;
    const badgeBg = new Jimp({ width: badgeW, height: badgeH, color: roundData.colorHex });
    cardOuter.composite(badgeBg, textStartX, 45);
    
    cardOuter.print({
      font: roundData.badgeTextDark ? font16B : font16W,
      x: textStartX + 16,
      y: 54,
      text: `${roundData.badge}`
    });

    // B. Clue Number
    cardOuter.print({
      font: font64B,
      x: textStartX,
      y: 100,
      text: `CLUE #${riddle.step}`
    });

    // C. Wedding Quest Subtitle
    cardOuter.print({
      font: font16B,
      x: textStartX,
      y: 175,
      text: `Wedding Scavenger Hunt | ${roundData.ceremony}`
    });

    // D. Dividing line
    const divider1 = new Jimp({ width: 420, height: 2, color: 0xe5e7ebff });
    cardOuter.composite(divider1, textStartX, 208);

    // E. Location / Target Hide Instruction
    cardOuter.print({
      font: font16B,
      x: textStartX,
      y: 225,
      text: `HIDE AT / TARGET LOCATION:`
    });

    cardOuter.print({
      font: font32B,
      x: textStartX,
      y: 255,
      text: riddle.hint,
      maxWidth: 430
    });

    // F. Divider 2
    const divider2 = new Jimp({ width: 420, height: 2, color: 0xe5e7ebff });
    cardOuter.composite(divider2, textStartX, 440);

    // G. Secret code tag & Instruction
    cardOuter.print({
      font: font16B,
      x: textStartX,
      y: 458,
      text: `Secret Key: [ ${riddle.secret} ]`
    });

    cardOuter.print({
      font: font16B,
      x: textStartX,
      y: 492,
      text: riddle.step < 8 
        ? `Scan to decrypt Clue #${riddle.step + 1}` 
        : `FINAL CLUE! Scan to win the Quest!`
    });

    // H. URL branding
    cardOuter.print({
      font: font12B,
      x: textStartX,
      y: 550,
      text: `healingmilestones.in/q/${colorKey}/${riddle.step}`
    });

    // Composite card into sheet
    sheet.composite(cardOuter, cardX, cardY);
  }

  // 3. CUT GUIDELINES (Dashed Lines between cards)
  const cutColor = 0x9ca3afff;
  // Center vertical cut guideline
  const centerX = 1200;
  await drawDashedVLine(sheet, centerX, 240, 2940, cutColor);
  sheet.print({
    font: font12B,
    x: centerX - 35,
    y: 232,
    text: '-- CUT --'
  });
  sheet.print({
    font: font12B,
    x: centerX - 35,
    y: 2942,
    text: '-- CUT --'
  });

  // Horizontal cut guidelines between rows
  for (let r = 1; r < 4; r++) {
    const cutY = START_Y + r * CARD_H + (r - 0.5) * GAP_Y;
    await drawDashedHLine(sheet, cutY, 40, 2360, cutColor);
    sheet.print({
      font: font12B,
      x: 8,
      y: cutY - 7,
      text: 'CUT'
    });
    sheet.print({
      font: font12B,
      x: 2365,
      y: cutY - 7,
      text: 'CUT'
    });
  }

  // 4. FOOTER (Bottom note)
  const footerText = 'HEALING MILESTONES | 8x10 INCH SHEET (2400x3000 PX) | 300 DPI PRINT READY | CUT ALONG DASHED LINES';
  const textW = measureText(font12B, footerText);
  sheet.print({
    font: font12B,
    x: Math.floor((SHEET_W - textW) / 2),
    y: 2968,
    text: footerText
  });

  const outFilename = path.join(outputDir, `SHEET_8x10_${colorKey.toUpperCase()}_ROUND.png`);
  await sheet.write(outFilename);
  console.log(`✅ Generated 8x10 Sheet: ${path.basename(outFilename)}`);
}

async function run() {
  console.log('Loading fonts for 8x10 print sheets...');
  const fontDir = path.join(__dirname, 'node_modules/@jimp/plugin-print/fonts/open-sans');
  const fonts = {
    font64B: await loadFont(path.join(fontDir, 'open-sans-64-black/open-sans-64-black.fnt')),
    font32B: await loadFont(path.join(fontDir, 'open-sans-32-black/open-sans-32-black.fnt')),
    font16B: await loadFont(path.join(fontDir, 'open-sans-16-black/open-sans-16-black.fnt')),
    font12B: await loadFont(path.join(fontDir, 'open-sans-12-black/open-sans-12-black.fnt')),
    font64W: await loadFont(path.join(fontDir, 'open-sans-64-white/open-sans-64-white.fnt')),
    font32W: await loadFont(path.join(fontDir, 'open-sans-32-white/open-sans-32-white.fnt')),
    font16W: await loadFont(path.join(fontDir, 'open-sans-16-white/open-sans-16-white.fnt'))
  };

  for (const [colorKey, roundData] of Object.entries(QUEST_DATA)) {
    console.log(`Generating sheet for ${colorKey} round...`);
    await createRoundSheet(colorKey, roundData, fonts);
  }

  console.log('\n🎉 All 4 round sheets (8x10 inch, 300 DPI) generated successfully!');
}

run().catch(console.error);
