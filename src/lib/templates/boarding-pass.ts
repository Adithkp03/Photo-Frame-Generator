import { drawImageCover, drawText } from "../image/renderer";

export interface BoardingPassConfig {
  aiOverlayUrl?: string;
  look?: 'AS_SHOT' | 'PUNCH' | 'DUOTONE' | 'GRAIN';
}

const WIDTH = 1080;
const HEIGHT = 1350;
const PADDING = 60;
const PRIMARY = "#FFF000"; // Yellow
const SECONDARY = "#FF007A"; // Pink
const BORDER = "#050505"; // Black
const WHITE = "#FFFFFF";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const i = new Image();
    i.crossOrigin = "anonymous";
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = src;
  });
}

export async function renderBoardingPass(
  canvas: HTMLCanvasElement,
  imageUrl: string,
  name: string,
  role: string,
  title: string,
  builderNumber: string,
  scale: number = 1,
  panX: number = 0,
  panY: number = 0,
  config: BoardingPassConfig = {}
): Promise<Blob> {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get context");

  await document.fonts.ready;
  
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  
  const sansFont = "'Inter', sans-serif";
  const monoFont = "'Space Mono', monospace";

  const safeName = name.trim().toUpperCase() || "BUILDER";
  const safeRole = role.trim().toUpperCase() || "HACKER";
  const safeTitle = title.trim().toUpperCase() || "THE UNKNOWN";

  // 1. Base Background
  ctx.fillStyle = WHITE;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  
  // 2. Brutalist Borders
  ctx.lineWidth = 10;
  ctx.strokeStyle = BORDER;
  ctx.strokeRect(PADDING, PADDING, WIDTH - PADDING * 2, HEIGHT - PADDING * 2);

  // Top header area
  ctx.fillStyle = PRIMARY;
  ctx.fillRect(PADDING + 5, PADDING + 5, WIDTH - PADDING * 2 - 10, 160);
  
  drawText(ctx, "HH GOA 2026", PADDING + 30, PADDING + 110, `900 80px ${sansFont}`, BORDER, "left", "alphabetic");
  drawText(ctx, "BUILDER PASS", WIDTH - PADDING - 30, PADDING + 110, `900 40px ${monoFont}`, BORDER, "right", "alphabetic");

  // Perforation Line
  ctx.beginPath();
  ctx.setLineDash([15, 15]);
  ctx.moveTo(PADDING, 280);
  ctx.lineTo(WIDTH - PADDING, 280);
  ctx.stroke();
  ctx.setLineDash([]); // reset
  
  // Cutout circles for perforation effect
  ctx.fillStyle = BORDER;
  ctx.beginPath();
  ctx.arc(PADDING, 280, 25, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(WIDTH - PADDING, 280, 25, 0, Math.PI * 2);
  ctx.fill();

  // Photo
  try {
    const img = await loadImage(imageUrl);

    const photoX = PADDING + 40;
    const photoY = 320;
    const photoW = 400;
    const photoH = 500;
    
    // Photo shadow
    ctx.fillStyle = BORDER;
    ctx.fillRect(photoX + 15, photoY + 15, photoW, photoH);
    
    // Photo draw
    drawImageCover(ctx, img, photoX, photoY, photoW, photoH, scale, panX, panY, config.look || "AS_SHOT");
    
    // Photo border
    ctx.lineWidth = 6;
    ctx.strokeRect(photoX, photoY, photoW, photoH);

    // Data Columns
    const dataX = photoX + photoW + 60;
    let currentY = 360;
    
    drawText(ctx, "PASSENGER", dataX, currentY, `bold 24px ${monoFont}`, "#555", "left");
    drawText(ctx, safeName, dataX, currentY + 50, `900 48px ${sansFont}`, BORDER, "left");
    
    currentY += 120;
    drawText(ctx, "ROLE", dataX, currentY, `bold 24px ${monoFont}`, "#555", "left");
    drawText(ctx, safeRole, dataX, currentY + 50, `900 48px ${sansFont}`, SECONDARY, "left");
    
    currentY += 120;
    drawText(ctx, "TITLE", dataX, currentY, `bold 24px ${monoFont}`, "#555", "left");
    
    // Handle very long title
    let titleFontSize = 48;
    if (safeTitle.length > 15) titleFontSize = 36;
    if (safeTitle.length > 22) titleFontSize = 30;
    drawText(ctx, safeTitle, dataX, currentY + 50, `900 ${titleFontSize}px ${sansFont}`, BORDER, "left");

    currentY += 120;
    drawText(ctx, "DESTINATION", dataX, currentY, `bold 24px ${monoFont}`, "#555", "left");
    drawText(ctx, "GOA", dataX, currentY + 50, `900 48px ${sansFont}`, PRIMARY, "left");
    ctx.lineWidth = 2;
    ctx.strokeText("GOA", dataX, currentY + 50);
    
    // Bottom Section (Barcode & Extra)
    const bottomY = 900;
    
    drawText(ctx, "BUILDER ID", PADDING + 40, bottomY, `bold 24px ${monoFont}`, "#555", "left");
    drawText(ctx, builderNumber || "HHG / 000", PADDING + 40, bottomY + 60, `900 54px ${sansFont}`, BORDER, "left");
    
    drawText(ctx, "FLIGHT", PADDING + 40, bottomY + 150, `bold 24px ${monoFont}`, "#555", "left");
    drawText(ctx, "HH-2026", PADDING + 40, bottomY + 200, `900 48px ${sansFont}`, BORDER, "left");
    
    // Barcode dummy
    ctx.fillStyle = BORDER;
    const barcodeX = PADDING + 40;
    const barcodeY = bottomY + 260;
    for (let i = 0; i < 48; i++) {
      const w = Math.random() * 8 + 2;
      ctx.fillRect(barcodeX + i * 18, barcodeY, w, 80);
    }
    
    drawText(ctx, "#FrameInGoa", WIDTH - PADDING - 40, barcodeY + 60, `bold 42px ${monoFont}`, SECONDARY, "right");

  } catch (err) {
    console.error("Boarding Pass rendering error", err);
  }

  // AI Overlay (Full Canvas) - Global for all templates
  if (config.aiOverlayUrl) {
    try {
      const aiImg = await loadImage(config.aiOverlayUrl);
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = 0.8;
      ctx.drawImage(aiImg, 0, 0, WIDTH, HEIGHT);
      ctx.restore();
    } catch (e) {
      console.error("Failed to load AI overlay", e);
    }
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Canvas to Blob failed"));
    }, "image/png", 1.0);
  });
}
