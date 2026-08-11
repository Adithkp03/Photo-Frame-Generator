import { drawImageCover, drawText, drawGrid, drawBarcode, drawCropMarks } from "../image/renderer";
import { loadImage } from "../image/loader";
import { BoardingPassStyle, PhotoLook, BoardingPassConfig } from "../types";

export async function renderBoardingPass(
  canvas: HTMLCanvasElement,
  imageUrl: string,
  logoUrl: string,
  name: string,
  role: string,
  scale: number = 1,
  panX: number = 0,
  panY: number = 0,
  config: BoardingPassConfig = { style: "PREMIUM", look: "AS_SHOT" }
): Promise<Blob> {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  await document.fonts.ready;

  const WIDTH = 1080;
  const HEIGHT = 566;
  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  const sansFont = "'Space Grotesk', sans-serif";
  const monoFont = "'Space Mono', monospace";
  const displayFont = "'Bebas Neue', sans-serif";
  const style = config.style || "CLASSIC";

  // Base background
  ctx.fillStyle = "#F5F1E6"; 
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Noise texture generator
  const drawNoise = (opacity: number) => {
    const imgData = ctx.getImageData(0, 0, WIDTH, HEIGHT);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const val = Math.random() * 255;
      data[i] = (data[i] * (1 - opacity)) + (val * opacity);
      data[i+1] = (data[i+1] * (1 - opacity)) + (val * opacity);
      data[i+2] = (data[i+2] * (1 - opacity)) + (val * opacity);
    }
    ctx.putImageData(imgData, 0, 0);
  };
  
  drawNoise(0.04); // Subtle paper texture

  const drawPhoto = async (x: number, y: number, w: number, h: number) => {
    try {
      const img = await loadImage(imageUrl);
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.clip();
      drawImageCover(ctx, img, x, y, w, h, scale, panX, panY, config.look);
      ctx.restore();
    } catch (e) {
      console.error(e);
    }
  };

    // Dark premium aesthetic
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
    // Left photo block
    const pw = 400, ph = HEIGHT;
    await drawPhoto(0, 0, pw, ph);

    // Subtle gradient to blend photo into background
    const grad = ctx.createLinearGradient(pw - 60, 0, pw, 0);
    grad.addColorStop(0, "rgba(5,5,5,0)");
    grad.addColorStop(1, "rgba(5,5,5,1)");
    ctx.fillStyle = grad;
    ctx.fillRect(pw - 60, 0, 60, ph);

    // Main text layout
    const tx = pw + 60;
    
    drawText(ctx, "HACKER HOUSE GOA 2026", tx, 80, `bold 24px ${monoFont}`, "#00FF41", "left");
    
    drawText(ctx, "PASSENGER", tx, 160, `bold 14px ${monoFont}`, "rgba(255,255,255,0.5)", "left");
    drawText(ctx, (name || "BUILDER").toUpperCase(), tx, 195, `400 56px ${displayFont}`, "#FFFFFF", "left");
    
    drawText(ctx, "ROLE / STACK", tx, 260, `bold 14px ${monoFont}`, "rgba(255,255,255,0.5)", "left");
    let displayRole = (role || "BUILDER").toUpperCase();
    if (displayRole.length > 25) displayRole = displayRole.substring(0, 23) + "...";
    drawText(ctx, displayRole, tx, 290, `bold 24px ${sansFont}`, "#FFFFFF", "left");
    
    drawText(ctx, "DESTINATION", tx, 380, `bold 14px ${monoFont}`, "rgba(255,255,255,0.5)", "left");
    drawText(ctx, "GOA", tx, 460, `400 110px ${displayFont}`, "#FFE500", "left");
    
    drawText(ctx, "DATE", tx + 200, 380, `bold 14px ${monoFont}`, "rgba(255,255,255,0.5)", "left");
    drawText(ctx, "OCT 28-31", tx + 200, 410, `bold 28px ${monoFont}`, "#FFFFFF", "left");

    // Perforation line
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);
    ctx.beginPath(); ctx.moveTo(WIDTH - 200, 0); ctx.lineTo(WIDTH - 200, HEIGHT); ctx.stroke();
    ctx.setLineDash([]);

    // Tear-off right section
    const tx2 = WIDTH - 100;
    ctx.save();
    ctx.translate(tx2, 80);
    ctx.rotate(Math.PI / 2);
    drawText(ctx, "ENTRY PASS", 0, 0, `bold 20px ${monoFont}`, "#00FF41", "left");
    drawBarcode(ctx, 160, -20, 260, 60, "#FFFFFF");
    ctx.restore();

  // AI Overlay (Full Canvas)
  if (config.aiOverlayUrl) {
    try {
      const aiImg = await loadImage(config.aiOverlayUrl);
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = 0.6;
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
