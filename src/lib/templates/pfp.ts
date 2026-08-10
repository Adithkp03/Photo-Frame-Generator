import { drawImageCover, drawText } from "../image/renderer";
import { loadImage } from "../image/loader";

export async function renderPFP(
  canvas: HTMLCanvasElement,
  imageUrl: string,
  logoUrl: string
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

  // 1. Background
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // 2. Branding Frame
  ctx.lineWidth = 20;
  ctx.strokeStyle = BORDER;
  ctx.strokeRect(10, 10, SIZE - 20, SIZE - 20);

  // Top Text
  const fontFam = "var(--font-caslon), serif";
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
  
  // Photo Border
  ctx.lineWidth = 10;
  ctx.strokeStyle = BORDER;
  ctx.beginPath();
  ctx.arc(PADDING + photoSize/2, PADDING + photoSize/2, photoSize/2, 0, Math.PI * 2);
  ctx.stroke();

  // Photo Masking
  const img = await loadImage(imageUrl);
  ctx.save();
  ctx.beginPath();
  ctx.arc(PADDING + photoSize/2, PADDING + photoSize/2, photoSize/2, 0, Math.PI * 2);
  ctx.clip();
  drawImageCover(ctx, img, PADDING, PADDING, photoSize, photoSize);
  ctx.restore();

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
