import { drawImageCover, drawText } from "../image/renderer";
import { loadImage } from "../image/loader";
import { BuilderConfig } from "../types";
import { generateBuilderNumber } from "../builderLogic";

export async function renderBuilderID(
  canvas: HTMLCanvasElement,
  imageUrl: string,
  name: string,
  role: string,
  builderTitle: string,
  logoUrl: string,
  scale: number = 1,
  panX: number = 0,
  panY: number = 0,
  config: BuilderConfig = { template: "IDENTITY", look: "AS_SHOT" }
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
  
  const img = await loadImage(imageUrl);
  const monoFont = "'JetBrains Mono', monospace";
  const sansFont = "'Hanken Grotesk', sans-serif";
  const spaceFont = "Space Grotesk, monospace";
  const builderNumber = generateBuilderNumber(name, role);
  const safeName = name.trim().toUpperCase() || "BUILDER";
  const safeRole = role.trim().toUpperCase() || "HACKER";
  const safeTitle = builderTitle.toUpperCase();

  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  if (config.template === "IDENTITY") {
    // Outer frame
    ctx.lineWidth = 16;
    ctx.strokeStyle = BORDER;
    ctx.strokeRect(8, 8, WIDTH - 16, HEIGHT - 16);

    // 1. Brand Header
    ctx.fillStyle = PRIMARY;
    ctx.fillRect(24, 24, WIDTH - 48, 120);
    ctx.strokeRect(24, 24, WIDTH - 48, 120);
    drawText(ctx, "HH GOA 2026", WIDTH / 2, 100, `900 64px ${sansFont}`, BORDER, "center", "alphabetic");

    // 2. Large Photo
    const PADDING = 60;
    const photoW = 750;
    const photoH = 700;
    
    // Draw shadow
    ctx.fillStyle = SECONDARY;
    ctx.fillRect(WIDTH - photoW - PADDING + 20, 200 + 20, photoW, photoH);

    drawImageCover(ctx, img, WIDTH - photoW - PADDING, 200, photoW, photoH, scale, panX, panY, config.look);
    ctx.lineWidth = 10;
    ctx.strokeStyle = BORDER;
    ctx.strokeRect(WIDTH - photoW - PADDING, 200, photoW, photoH);

    // 3. Prominent Builder Title
    let titleFontSize = 110;
    if (safeTitle.length > 15) titleFontSize = 95;
    if (safeTitle.length > 20) titleFontSize = 80;

    drawText(ctx, safeTitle, PADDING, 1020, `900 ${titleFontSize}px ${sansFont}`, PRIMARY, "left", "alphabetic");
    ctx.lineWidth = 4;
    ctx.strokeStyle = BORDER;
    ctx.strokeText(safeTitle, PADDING, 1020);

    // 5. Overlay Text & Graphic Elements
    let nameFontSize = 64;
    if (safeName.length > 18) nameFontSize = 52;
    if (safeName.length > 22) nameFontSize = 46;

    let roleFontSize = 44;
    if (safeRole.length > 25) roleFontSize = 36;
    if (safeRole.length > 35) roleFontSize = 30;

    drawText(ctx, safeName, PADDING, 1140, `bold ${nameFontSize}px ${monoFont}`, WHITE, "left", "alphabetic");
    drawText(ctx, safeRole, PADDING, 1200, `bold ${roleFontSize}px ${monoFont}`, PRIMARY, "left", "alphabetic");
    
    // 5. Event Metadata and Hashtag
    drawText(ctx, builderNumber, PADDING, 1280, `bold 40px ${monoFont}`, WHITE, "left", "alphabetic");
    drawText(ctx, "#FrameInGoa", WIDTH - PADDING, 1280, `bold 40px ${monoFont}`, WHITE, "right", "alphabetic");

    // Decorative line
    ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(PADDING, 1250); ctx.lineTo(WIDTH - PADDING, 1250); ctx.stroke();
    
  } else if (config.template === "PASSPORT") {
    ctx.fillStyle = "#E5E5E5"; // off-white paper
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
    ctx.lineWidth = 4;
    ctx.strokeStyle = BORDER;
    ctx.strokeRect(40, 40, WIDTH - 80, HEIGHT - 80);
    
    // Perforation line
    ctx.setLineDash([15, 15]);
    ctx.beginPath(); ctx.moveTo(40, 300); ctx.lineTo(WIDTH - 40, 300); ctx.stroke();
    ctx.setLineDash([]);
    
    drawText(ctx, "HH GOA 2026", 80, 140, `900 72px ${sansFont}`, PRIMARY, "left", "alphabetic");
    ctx.lineWidth = 2;
    ctx.strokeText("HH GOA 2026", 80, 140);
    drawText(ctx, "BUILDER PASS", 80, 220, `900 64px ${sansFont}`, BORDER, "left", "alphabetic");
    
    drawText(ctx, builderNumber, WIDTH - 80, 220, `bold 48px ${monoFont}`, SECONDARY, "right", "alphabetic");

    // Photo
    const photoW = 400;
    const photoH = 500;
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(80 + 15, 380 + 15, photoW, photoH);
    drawImageCover(ctx, img, 80, 380, photoW, photoH, scale, panX, panY, config.look);
    ctx.strokeRect(80, 380, photoW, photoH);
    
    // Data fields
    const dataX = 540;
    drawText(ctx, "PASSENGER", dataX, 420, `bold 24px ${monoFont}`, "#555", "left", "alphabetic");
    drawText(ctx, safeName, dataX, 480, `900 56px ${sansFont}`, BORDER, "left", "alphabetic");
    
    drawText(ctx, "ROLE", dataX, 580, `bold 24px ${monoFont}`, "#555", "left", "alphabetic");
    drawText(ctx, safeRole, dataX, 640, `900 42px ${sansFont}`, PRIMARY, "left", "alphabetic");
    ctx.strokeText(safeRole, dataX, 640);
    
    drawText(ctx, "DESTINATION", dataX, 740, `bold 24px ${monoFont}`, "#555", "left", "alphabetic");
    drawText(ctx, "GOA", dataX, 800, `900 48px ${sansFont}`, BORDER, "left", "alphabetic");
    
    drawText(ctx, "TITLE", dataX, 900, `bold 24px ${monoFont}`, "#555", "left", "alphabetic");
    drawText(ctx, safeTitle, dataX, 960, `900 42px ${sansFont}`, SECONDARY, "left", "alphabetic");
    
    // Barcode dummy
    ctx.fillStyle = BORDER;
    for (let i = 0; i < 60; i++) {
      const w = Math.random() * 10 + 2;
      ctx.fillRect(80 + i * 15, 1100, w, 120);
    }
    
    drawText(ctx, "#FrameInGoa", WIDTH - 80, 1200, `bold 40px ${monoFont}`, BORDER, "right", "alphabetic");

  } else if (config.template === "EDITORIAL") {
    // Large Photo Base
    drawImageCover(ctx, img, 0, 0, WIDTH, HEIGHT, scale, panX, panY, config.look);
    
    // Gradient / overlay at bottom
    const grad = ctx.createLinearGradient(0, HEIGHT - 600, 0, HEIGHT);
    grad.addColorStop(0, "transparent");
    grad.addColorStop(1, "rgba(0,0,0,0.9)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, HEIGHT - 600, WIDTH, 600);
    
    // Large Typography
    drawText(ctx, "HH GOA 2026", 60, 100, `bold 32px ${monoFont}`, PRIMARY, "left", "top");
    
    const words = safeName.split(" ");
    const firstName = words[0];
    drawText(ctx, firstName, 60, HEIGHT - 280, `900 180px ${sansFont}`, WHITE, "left", "alphabetic");
    
    drawText(ctx, safeTitle, 60, HEIGHT - 180, `bold 64px ${sansFont}`, PRIMARY, "left", "alphabetic");
    drawText(ctx, safeRole, 60, HEIGHT - 100, `bold 40px ${monoFont}`, SECONDARY, "left", "alphabetic");
    
    drawText(ctx, builderNumber, WIDTH - 60, HEIGHT - 100, `bold 40px ${monoFont}`, WHITE, "right", "alphabetic");
  }

  // AI Overlay (Full Canvas) - Global for all templates
  if (config.aiOverlayUrl) {
    try {
      const aiImg = await loadImage(config.aiOverlayUrl);
      ctx.save();
      ctx.globalCompositeOperation = "screen";
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
