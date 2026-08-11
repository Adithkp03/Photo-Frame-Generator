import { drawImageCover, drawText, drawGrid, drawBarcode, drawCropMarks } from "../image/renderer";
import { loadImage } from "../image/loader";
import { EditorialStyle, PhotoLook, EditorialConfig } from "../types";

export async function renderEditorial(
  canvas: HTMLCanvasElement,
  imageUrl: string,
  logoUrl: string,
  name: string,
  role: string,
  scale: number = 1,
  panX: number = 0,
  panY: number = 0,
  config: EditorialConfig = { style: "BRUTALIST", look: "AS_SHOT" }
): Promise<Blob> {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  await document.fonts.ready;

  const WIDTH = 1080;
  const HEIGHT = 1350;
  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  const sansFont = "'Space Grotesk', sans-serif";
  const monoFont = "'Space Mono', monospace";
  const displayFont = "'Bebas Neue', sans-serif";
  const style = config.style || "BRUTALIST";

  // Helpers
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

  if (style === "TYPOGRAPHIC") {
    ctx.fillStyle = "#FFE500";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
    // Giant type
    drawText(ctx, "HH", -20, 300, `400 450px ${displayFont}`, "#050505", "left");
    drawText(ctx, "GOA", -20, 680, `400 450px ${displayFont}`, "#050505", "left");
    drawText(ctx, "2026", -20, 1060, `400 450px ${displayFont}`, "#050505", "left");
    
    // Intersecting photo
    const pw = 400, ph = 600;
    await drawPhoto(WIDTH - 440, HEIGHT - 700, pw, ph);
    ctx.strokeStyle = "#050505"; ctx.lineWidth = 4;
    ctx.strokeRect(WIDTH - 440, HEIGHT - 700, pw, ph);
    
    // Name overlapping
    ctx.save();
    ctx.translate(WIDTH - 60, HEIGHT - 700);
    ctx.rotate(Math.PI / 2);
    drawText(ctx, (name || "BUILDER").toUpperCase(), 0, 0, `bold 40px ${monoFont}`, "#050505", "left");
    ctx.restore();

  } else if (style === "IMAGE_FIRST") {
    await drawPhoto(0, 0, WIDTH, HEIGHT);
    
    // Text boxes overlapping the image
    ctx.fillStyle = "#FF0085";
    ctx.fillRect(40, HEIGHT - 300, WIDTH - 200, 120);
    drawText(ctx, "BUILD IN", 60, HEIGHT - 200, `400 120px ${displayFont}`, "#050505", "left");

    ctx.fillStyle = "#FFE500";
    ctx.fillRect(40, HEIGHT - 180, WIDTH - 400, 120);
    drawText(ctx, "GOA", 60, HEIGHT - 80, `400 120px ${displayFont}`, "#050505", "left");

    // Grid over the top
    drawGrid(ctx, WIDTH, HEIGHT, 80, "rgba(245, 241, 230, 0.4)");

  } else if (style === "BRUTALIST") {
    ctx.fillStyle = "#005C36"; // Green
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
    drawText(ctx, "28", 40, 400, `400 500px ${displayFont}`, "#FF0085", "left");
    drawText(ctx, "—", 40, 800, `400 500px ${displayFont}`, "#FFE500", "left");
    drawText(ctx, "31", 40, 1200, `400 500px ${displayFont}`, "#F5F1E6", "left");
    
    // Portrait in the middle
    await drawPhoto(WIDTH/2, 200, 400, 900);
    
    drawBarcode(ctx, WIDTH/2, HEIGHT - 100, 300, 50, "#F5F1E6");

  } else if (style === "SWISS") {
    ctx.fillStyle = "#F5F1E6";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
    // Very structured grid
    drawGrid(ctx, WIDTH, HEIGHT, 100, "rgba(5, 5, 5, 0.1)");
    
    drawText(ctx, "HACKER HOUSE GOA 2026", 100, 160, `bold 24px ${sansFont}`, "#050505", "left");
    drawText(ctx, "EDITORIAL CAMPAIGN", 100, 200, `bold 24px ${sansFont}`, "#050505", "left");
    
    await drawPhoto(100, 300, 600, 800);
    
    // Clean type on right
    drawText(ctx, (name || "BUILDER").toUpperCase(), 750, 400, `bold 48px ${sansFont}`, "#050505", "left");
    drawText(ctx, (role || "ROLE").toUpperCase(), 750, 460, `bold 24px ${monoFont}`, "#050505", "left");
    
    drawText(ctx, "LOCATION", 750, 700, `bold 16px ${monoFont}`, "#FF0085", "left");
    drawText(ctx, "GOA, IN", 750, 740, `bold 24px ${sansFont}`, "#050505", "left");

    drawText(ctx, "COORD", 750, 800, `bold 16px ${monoFont}`, "#FF0085", "left");
    drawText(ctx, "15.4909° N", 750, 840, `bold 24px ${sansFont}`, "#050505", "left");

  } else {
    // EXPERIMENTAL
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
    // Repeating text background
    ctx.fillStyle = "rgba(0, 255, 65, 0.1)";
    for (let i = 0; i < 20; i++) {
      drawText(ctx, "HACKER HOUSE GOA", Math.random() * WIDTH - 200, i * 80, `400 80px ${displayFont}`, "rgba(255,0,133,0.2)", "left");
    }
    
    await drawPhoto(140, 200, 800, 800);
    
    // Inverted overlay blocks
    ctx.fillStyle = "#FFE500";
    ctx.fillRect(80, 800, 400, 100);
    drawText(ctx, "SIGNAL", 100, 880, `400 90px ${displayFont}`, "#050505", "left");
    
    ctx.fillStyle = "#FF0085";
    ctx.fillRect(500, 950, 500, 100);
    drawText(ctx, "DETECTED", 520, 1030, `400 90px ${displayFont}`, "#050505", "left");

    drawCropMarks(ctx, 140, 200, 40, "#FFE500", 4);
    drawCropMarks(ctx, 940, 1000, 40, "#FFE500", 4);
  }

  if (config.aiOverlayUrl) {
    try {
      const aiImg = await loadImage(config.aiOverlayUrl);
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = 0.5;
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
