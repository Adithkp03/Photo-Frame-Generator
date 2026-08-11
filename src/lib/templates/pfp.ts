import { drawImageCover, drawText } from "../image/renderer";
import { loadImage } from "../image/loader";
import { PFPConfig } from "../types";

const COLOR_MAP = {
  GREEN: "#006838",
  YELLOW: "#f3e700",
  PINK: "#ff007f",
  BLACK: "#000000",
  WHITE: "#ffffff",
};

export async function renderPFP(
  canvas: HTMLCanvasElement,
  imageUrl: string,
  logoUrl: string,
  scale: number = 1,
  panX: number = 0,
  panY: number = 0,
  config: PFPConfig = { style: "CORE", ringColor: "YELLOW", ringWeight: 10, look: "AS_SHOT" }
): Promise<Blob> {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  await document.fonts.ready;

  const SIZE = 1080;
  canvas.width = SIZE;
  canvas.height = SIZE;

  const BG_COLOR = "#006838"; 
  const PRIMARY = "#f3e700"; 
  const SECONDARY = "#ff007f"; 
  const BORDER = "#000000"; 
  const WHITE = "#ffffff"; 
  
  const ringHex = COLOR_MAP[config.ringColor] || PRIMARY;
  const img = await loadImage(imageUrl);
  const fontFam = "var(--font-caslon), serif";
  const monoFont = "var(--font-jetbrains), monospace";

  // Background
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, SIZE, SIZE);

  if (config.style === "CORE") {
    // 2. Branding Frame
    ctx.lineWidth = 20;
    ctx.strokeStyle = BORDER;
    ctx.strokeRect(10, 10, SIZE - 20, SIZE - 20);

    drawText(ctx, "HH GOA 2026", SIZE / 2, 75, `bold 46px ${fontFam}`, PRIMARY, "center", "middle");
    
    // 3. User Photo (Hero - 80% of canvas)
    const PADDING = 120;
    const photoSize = SIZE - PADDING * 2;
    
    // Shadow for circular photo
    const offset = 24;
    ctx.fillStyle = SECONDARY;
    ctx.beginPath();
    ctx.arc(PADDING + photoSize/2 + offset, PADDING + photoSize/2 + offset, photoSize/2, 0, Math.PI * 2);
    ctx.fill();
    
    // Photo Border (Customizable)
    ctx.lineWidth = config.ringWeight;
    ctx.strokeStyle = ringHex;
    ctx.beginPath();
    ctx.arc(PADDING + photoSize/2, PADDING + photoSize/2, photoSize/2, 0, Math.PI * 2);
    ctx.stroke();

    // Photo Masking
    ctx.save();
    ctx.beginPath();
    ctx.arc(PADDING + photoSize/2, PADDING + photoSize/2, photoSize/2, 0, Math.PI * 2);
    ctx.clip();
    drawImageCover(ctx, img, PADDING, PADDING, photoSize, photoSize, scale, panX, panY, config.look);
    ctx.restore();

  } else if (config.style === "SIGNAL") {
    // Technical Grid Background
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth = 2;
    for (let i = 0; i < SIZE; i += 100) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, SIZE); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(SIZE, i); ctx.stroke();
    }
    
    const PADDING = 140;
    const photoSize = SIZE - PADDING * 2;
    const center = SIZE / 2;

    // Technical Ring
    ctx.lineWidth = config.ringWeight;
    ctx.strokeStyle = ringHex;
    ctx.setLineDash([20, 10]);
    ctx.beginPath();
    ctx.arc(center, center, photoSize/2 + 15, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Photo
    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, photoSize/2, 0, Math.PI * 2);
    ctx.clip();
    drawImageCover(ctx, img, PADDING, PADDING, photoSize, photoSize, scale, panX, panY, config.look);
    ctx.restore();

    // Labels
    drawText(ctx, "HHG // 2026", 40, 50, `bold 24px ${monoFont}`, PRIMARY, "left", "top");
    drawText(ctx, "SIGNAL 01", 40, 85, `bold 24px ${monoFont}`, WHITE, "left", "top");
    drawText(ctx, "BUILD // SHIP // CREATE", SIZE - 40, SIZE - 40, `bold 20px ${monoFont}`, SECONDARY, "right", "bottom");

  } else if (config.style === "EDITORIAL") {
    // Asymmetrical Layout
    const photoSize = 700;
    const paddingX = 80;
    const paddingY = 80;

    // Large cropped text
    drawText(ctx, "HH GOA", -20, 250, `900 200px 'Hanken Grotesk', sans-serif`, "rgba(255,255,255,0.05)", "left", "alphabetic");
    
    // Photo Square
    ctx.save();
    ctx.beginPath();
    ctx.rect(SIZE - photoSize - paddingX, SIZE - photoSize - paddingY, photoSize, photoSize);
    ctx.clip();
    drawImageCover(ctx, img, SIZE - photoSize - paddingX, SIZE - photoSize - paddingY, photoSize, photoSize, scale, panX, panY, config.look);
    ctx.restore();

    // Ring becomes a solid block decoration
    ctx.fillStyle = ringHex;
    ctx.fillRect(SIZE - photoSize - paddingX - 40, SIZE - photoSize - paddingY + 100, 40, 200);

    drawText(ctx, "EVENT POSTER", paddingX, SIZE - 120, `bold 30px ${monoFont}`, WHITE, "left", "bottom");
    drawText(ctx, "2026", paddingX, SIZE - 80, `bold 30px ${monoFont}`, PRIMARY, "left", "bottom");

  } else if (config.style === "WILD") {
    const PADDING = 100;
    const photoSize = SIZE - PADDING * 2;
    
    // Broken geometry background
    ctx.fillStyle = SECONDARY;
    ctx.fillRect(0, 0, SIZE, 400);
    ctx.fillStyle = PRIMARY;
    ctx.beginPath(); ctx.moveTo(0, 400); ctx.lineTo(SIZE, 200); ctx.lineTo(SIZE, SIZE); ctx.lineTo(0, SIZE); ctx.fill();

    // Heavy offset shadows
    ctx.fillStyle = BORDER;
    ctx.fillRect(PADDING + 40, PADDING + 40, photoSize, photoSize);

    // Photo Box
    ctx.save();
    ctx.beginPath();
    ctx.rect(PADDING, PADDING, photoSize, photoSize);
    ctx.clip();
    drawImageCover(ctx, img, PADDING, PADDING, photoSize, photoSize, scale, panX, panY, config.look);
    ctx.restore();

    // Ring becomes heavy border
    ctx.lineWidth = config.ringWeight * 2;
    ctx.strokeStyle = ringHex;
    ctx.strokeRect(PADDING, PADDING, photoSize, photoSize);

    // Typography
    drawText(ctx, "HH GOA", SIZE/2, 100, `900 120px 'Hanken Grotesk', sans-serif`, BORDER, "center", "alphabetic");
  }

  // 3.5 AI Overlay (Full Canvas)
  if (config.aiOverlayUrl) {
    try {
      const aiImg = await loadImage(config.aiOverlayUrl);
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.drawImage(aiImg, 0, 0, SIZE, SIZE);
      ctx.restore();
    } catch (e) {
      console.error("Failed to load AI overlay", e);
    }
  }

  // 4. Bottom Logo
  try {
    const logo = await loadImage(logoUrl);
    const logoW = 280;
    const logoH = (logo.height / logo.width) * logoW;
    ctx.drawImage(logo, SIZE / 2 - logoW / 2, SIZE - 90 - logoH / 2, logoW, logoH);
  } catch (e) {
    drawText(ctx, "HACKER HOUSE", SIZE / 2, SIZE - 75, `bold 42px ${fontFam}`, PRIMARY, "center", "middle");
  }

  // Export
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Canvas to Blob failed"));
    }, "image/png", 1.0);
  });
}
