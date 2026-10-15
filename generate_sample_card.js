const { Jimp, loadFont, measureText } = require('jimp');
const path = require('path');
const fs = require('fs');

async function generateSampleCard() {
  const fontDir = path.join(__dirname, 'node_modules/@jimp/plugin-print/fonts/open-sans');
  const font64B = await loadFont(path.join(fontDir, 'open-sans-64-black/open-sans-64-black.fnt'));
  const font32B = await loadFont(path.join(fontDir, 'open-sans-32-black/open-sans-32-black.fnt'));
  const font16B = await loadFont(path.join(fontDir, 'open-sans-16-black/open-sans-16-black.fnt'));
  const font12B = await loadFont(path.join(fontDir, 'open-sans-12-black/open-sans-12-black.fnt'));

  // Standalone preview card with surrounding padding and cut guide
  const CANVAS_W = 1200;
  const CANVAS_H = 750;
  
  const canvas = new Jimp({ width: CANVAS_W, height: CANVAS_H, color: 0xf8fafcff });

  const CARD_X = 50;
  const CARD_Y = 50;
  const CARD_W = 1100;
  const CARD_H = 650;
  const HALF_W = 540;
  const BORDER_THICK = 4;
  const BORDER_COLOR = 0xeab308ff; // Yellow / Haldi

  // --- 1. LEFT HALF: QR CODE SIDE ---
  const leftOuter = new Jimp({ width: HALF_W, height: CARD_H, color: BORDER_COLOR });
  const leftInner = new Jimp({ width: HALF_W - BORDER_THICK * 2, height: CARD_H - BORDER_THICK * 2, color: 0xffffffff });
  leftOuter.composite(leftInner, BORDER_THICK, BORDER_THICK);

  // Load and composite QR Code
  const qrPath = path.join(__dirname, 'public/qr_codes_for_print/yellow_step1_the_speakers___dj.png');
  if (fs.existsSync(qrPath)) {
    const qrImage = await Jimp.read(qrPath);
    qrImage.resize({ w: 460, h: 460 });
    leftOuter.composite(qrImage, 40, 70);
  }

  // Label below QR
  const scanText = 'SCAN WITH PHONE CAMERA';
  const scanW = measureText(font16B, scanText);
  leftOuter.print({
    font: font16B,
    x: Math.floor((HALF_W - scanW) / 2),
    y: 565,
    text: scanText
  });

  canvas.composite(leftOuter, CARD_X, CARD_Y);

  // --- 2. RIGHT HALF: FOLD-BACK / BRANDING SIDE ---
  const rightX = CARD_X + HALF_W + 20; // 20px gap for fold line
  const rightOuter = new Jimp({ width: HALF_W, height: CARD_H, color: BORDER_COLOR });
  const rightInner = new Jimp({ width: HALF_W - BORDER_THICK * 2, height: CARD_H - BORDER_THICK * 2, color: 0xffffffff });
  rightOuter.composite(rightInner, BORDER_THICK, BORDER_THICK);

  // Logo
  const logoPath = path.join(__dirname, 'public/logo.png');
  if (fs.existsSync(logoPath)) {
    const logo = await Jimp.read(logoPath);
    logo.resize({ h: 68 });
    const logoX = Math.floor((HALF_W - logo.bitmap.width) / 2);
    rightOuter.composite(logo, logoX, 42);
  }

  // Brand Name
  const brandText = 'HEALING MILESTONES';
  const brandW = measureText(font32B, brandText);
  rightOuter.print({
    font: font32B,
    x: Math.floor((HALF_W - brandW) / 2),
    y: 125,
    text: brandText
  });

  // Presents
  const presText = 'P R E S E N T S';
  const presW = measureText(font12B, presText);
  rightOuter.print({
    font: font12B,
    x: Math.floor((HALF_W - presW) / 2),
    y: 170,
    text: presText
  });

  // Divider
  const div1 = new Jimp({ width: 320, height: 2, color: 0xe5e7ebff });
  rightOuter.composite(div1, Math.floor((HALF_W - 320) / 2), 198);

  // Clue Number
  const clueText = 'CLUE #1';
  const clueW = measureText(font64B, clueText);
  rightOuter.print({
    font: font64B,
    x: Math.floor((HALF_W - clueW) / 2),
    y: 220,
    text: clueText
  });

  // Wedding Scavenger Hunt
  const subText = 'Wedding Scavenger Hunt';
  const subW = measureText(font32B, subText);
  rightOuter.print({
    font: font32B,
    x: Math.floor((HALF_W - subW) / 2),
    y: 305,
    text: subText
  });

  // Round Badge Pill
  const badgeW = 300;
  const badgeH = 42;
  const badgeBg = new Jimp({ width: badgeW, height: badgeH, color: BORDER_COLOR });
  rightOuter.composite(badgeBg, Math.floor((HALF_W - badgeW) / 2), 370);

  const roundLabel = 'YELLOW / HALDI ROUND';
  const roundLabelW = measureText(font16B, roundLabel);
  rightOuter.print({
    font: font16B,
    x: Math.floor((HALF_W - roundLabelW) / 2),
    y: 382,
    text: roundLabel
  });

  // Divider 2
  const div2 = new Jimp({ width: 320, height: 2, color: 0xe5e7ebff });
  rightOuter.composite(div2, Math.floor((HALF_W - 320) / 2), 445);

  // Website
  const webText = 'healingmilestones.com';
  const webW = measureText(font16B, webText);
  rightOuter.print({
    font: font16B,
    x: Math.floor((HALF_W - webW) / 2),
    y: 565,
    text: webText
  });

  canvas.composite(rightOuter, rightX, CARD_Y);

  // --- 3. CENTER FOLD GUIDELINE ---
  const foldX = CARD_X + HALF_W + 10;
  const dashLen = 16;
  const gapLen = 12;
  const dashImg = new Jimp({ width: 2, height: dashLen, color: 0x9ca3afff });
  for (let y = CARD_Y + 30; y < CARD_Y + CARD_H - 30; y += (dashLen + gapLen)) {
    canvas.composite(dashImg, foldX, y);
  }

  const foldLabel = '-- FOLD HERE --';
  const foldLabelW = measureText(font12B, foldLabel);
  canvas.print({
    font: font12B,
    x: Math.floor(foldX - foldLabelW / 2),
    y: CARD_Y + 8,
    text: foldLabel
  });
  canvas.print({
    font: font12B,
    x: Math.floor(foldX - foldLabelW / 2),
    y: CARD_Y + CARD_H - 24,
    text: foldLabel
  });

  // --- 4. TOP TITLE & BOTTOM INSTRUCTIONS ---
  const topInstruction = 'SAMPLE DOUBLE-SIDED FOLDABLE CLUE CARD (CLUE #1 | YELLOW ROUND)';
  const topW = measureText(font16B, topInstruction);
  canvas.print({
    font: font16B,
    x: Math.floor((CANVAS_W - topW) / 2),
    y: 18,
    text: topInstruction
  });

  const botInstruction = 'Cut out along outer colored border | Fold along center dashed line to create 2-sided clue card (Front: Clue Info | Back: QR Code)';
  const botW = measureText(font12B, botInstruction);
  canvas.print({
    font: font12B,
    x: Math.floor((CANVAS_W - botW) / 2),
    y: CARD_Y + CARD_H + 18,
    text: botInstruction
  });

  const outPath = path.join(__dirname, 'public/qr_codes_for_print/SAMPLE_FOLDABLE_CARD_YELLOW_CLUE1.png');
  await canvas.write(outPath);
  console.log('✅ Generated Sample Foldable Card at:', outPath);
}

generateSampleCard().catch(console.error);
