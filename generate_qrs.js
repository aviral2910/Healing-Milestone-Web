const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const { Jimp } = require('jimp');

const domain = 'https://healingmilestones.in';

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

const outputDir = path.join(__dirname, 'public', 'qr_codes_for_print');
const logoPath = path.join(__dirname, 'public', 'logo.png');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function createQRWithLogo(url, outputPath) {
  // Generate QR code to a buffer with high error correction (so logo doesn't break it)
  const qrBuffer = await QRCode.toBuffer(url, {
    width: 800,
    margin: 2,
    errorCorrectionLevel: 'H',
    color: { dark: '#000000', light: '#ffffff' }
  });

  if (fs.existsSync(logoPath)) {
    try {
      // Read both images
      const qrImage = await Jimp.read(qrBuffer);
      const logo = await Jimp.read(logoPath);
      
      // Resize logo to 25% of QR width
      const logoSize = Math.floor(qrImage.bitmap.width * 0.25);
      logo.resize({ w: logoSize });
      
      // Calculate center position
      const x = (qrImage.bitmap.width - logo.bitmap.width) / 2;
      const y = (qrImage.bitmap.height - logo.bitmap.height) / 2;
      
      // Composite and save
      qrImage.composite(logo, x, y);
      await qrImage.write(outputPath);
      return;
    } catch (e) {
      console.log("Failed to add logo, falling back to standard QR...", e.message);
    }
  }
  
  // Fallback if logo doesn't exist or fails
  fs.writeFileSync(outputPath, qrBuffer);
}

async function generateAllQRCodes() {
  console.log('Generating QR codes with Healing Milestones logo...');

  // 1. Start Page
  const startUrl = `${domain}/q/start`;
  const startFilename = path.join(outputDir, '00_START_PAGE.png');
  await createQRWithLogo(startUrl, startFilename);
  console.log(`✅ Generated: 00_START_PAGE.png`);

  // 2. Riddle QRs
  for (const [color, riddles] of Object.entries(QUEST_DATA)) {
    for (const riddle of riddles) {
      const url = `${domain}/q/${color}/${riddle.step}?secret=${riddle.secret}`;
      const safeHint = riddle.hint.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const filename = path.join(outputDir, `${color}_step${riddle.step}_${safeHint}.png`);
      
      await createQRWithLogo(url, filename);
      console.log(`✅ Generated: ${path.basename(filename)}`);
    }
  }
  
  console.log(`\n🎉 All QR codes successfully generated in: ${outputDir}`);
}

generateAllQRCodes().catch(console.error);
