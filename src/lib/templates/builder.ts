import { drawImageCover, drawText } from "../image/renderer";
import { loadImage } from "../image/loader";

export async function renderBuilderID(
  canvas: HTMLCanvasElement,
  imageUrl: string,
  name: string,
  role: string,
  builderTitle: string,
  logoUrl: string
): Promise<Blob> {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  await document.fonts.ready;

  const WIDTH = 1080;
  const HEIGHT = 1350;
  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  const BG_COLOR = "#006838"; 
  const PRIMARY = "#f3e700"; 
  const SECONDARY = "#ff007f"; 
  const BORDER = "#000000"; 
  const WHITE = "#ffffff";

  // Background
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  
  // Outer frame
  ctx.lineWidth = 16;
  ctx.strokeStyle = BORDER;
  ctx.strokeRect(8, 8, WIDTH - 16, HEIGHT - 16);

  // 1. Brand Header
  ctx.fillStyle = PRIMARY;
  ctx.fillRect(24, 24, WIDTH - 48, 120);
  ctx.strokeRect(24, 24, WIDTH - 48, 120);
  drawText(ctx, "HH GOA 2026", WIDTH / 2, 100, "900 64px 'Hanken Grotesk', sans-serif", BORDER, "center", "alphabetic");

  // 2. Large Photo (offset)
  const PADDING = 60;
  const photoW = 750;
  const photoH = 700;
  
  // Draw shadow
  ctx.fillStyle = SECONDARY;
  ctx.fillRect(WIDTH - photoW - PADDING + 20, 200 + 20, photoW, photoH);

  const img = await loadImage(imageUrl);
  drawImageCover(ctx, img, WIDTH - photoW - PADDING, 200, photoW, photoH);
  ctx.lineWidth = 10;
  ctx.strokeStyle = BORDER;
  ctx.strokeRect(WIDTH - photoW - PADDING, 200, photoW, photoH);

  // 3. Prominent Builder Title
  let titleFontSize = 110;
  if (builderTitle.length > 15) titleFontSize = 95;
  if (builderTitle.length > 20) titleFontSize = 80;

  drawText(ctx, builderTitle.toUpperCase(), PADDING, 1020, `900 ${titleFontSize}px 'Hanken Grotesk', sans-serif`, PRIMARY, "left", "alphabetic");
  ctx.lineWidth = 4;
  ctx.strokeStyle = BORDER;
  ctx.strokeText(builderTitle.toUpperCase(), PADDING, 1020);

  // 4. Name and Role
  let nameFontSize = 64;
  if (name.length > 18) nameFontSize = 52;
  if (name.length > 22) nameFontSize = 46;

  let roleFontSize = 44;
  if (role.length > 25) roleFontSize = 36;
  if (role.length > 35) roleFontSize = 30;

  drawText(ctx, name.toUpperCase(), PADDING, 1140, `bold ${nameFontSize}px 'JetBrains Mono', monospace`, WHITE, "left", "alphabetic");
  drawText(ctx, role.toUpperCase(), PADDING, 1200, `bold ${roleFontSize}px 'JetBrains Mono', monospace`, PRIMARY, "left", "alphabetic");

  // 5. Event Metadata and Hashtag
  drawText(ctx, "#FrameInGoa", WIDTH - PADDING, 1280, "bold 40px 'JetBrains Mono', monospace", WHITE, "right", "alphabetic");
  
  // Decorative line
  ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(PADDING, 1250); ctx.lineTo(WIDTH - PADDING, 1250); ctx.stroke();

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Canvas to Blob failed"));
    }, "image/png", 1.0);
  });
}
