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
  config: BoardingPassConfig = { style: "CLASSIC", look: "AS_SHOT" }
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
  
  if (style !== "TERMINAL") {
    drawNoise(0.04); // Subtle paper texture
  }

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

  if (style === "CLASSIC") {
    // Left photo block, Right tear-off
    const pw = 400, ph = HEIGHT;
    await drawPhoto(0, 0, pw, ph);

    // Perforation line
    ctx.strokeStyle = "#050505";
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath(); ctx.moveTo(WIDTH - 250, 0); ctx.lineTo(WIDTH - 250, HEIGHT); ctx.stroke();
    ctx.setLineDash([]);
    
    // Main ticket section
    drawText(ctx, "HACKER HOUSE GOA 2026", 440, 60, `bold 24px ${monoFont}`, "#005C36", "left");
    
    drawText(ctx, "PASSENGER", 440, 140, `bold 16px ${monoFont}`, "#FF0085", "left");
    drawText(ctx, (name || "BUILDER").toUpperCase(), 440, 180, `400 60px ${displayFont}`, "#050505", "left");
    
    drawText(ctx, "ROLE", 440, 240, `bold 16px ${monoFont}`, "#FF0085", "left");
    drawText(ctx, (role || "ROLE").toUpperCase(), 440, 270, `bold 28px ${sansFont}`, "#050505", "left");
    
    drawText(ctx, "DESTINATION", 440, 360, `bold 16px ${monoFont}`, "#FF0085", "left");
    drawText(ctx, "GOA", 440, 480, `400 160px ${displayFont}`, "#FFE500", "left");
    // Outline to GOA
    ctx.strokeStyle = "#050505"; ctx.lineWidth = 4;
    ctx.strokeText("GOA", 440, 480);

    drawText(ctx, "DATE", 700, 360, `bold 16px ${monoFont}`, "#FF0085", "left");
    drawText(ctx, "OCT 28-31", 700, 390, `bold 28px ${monoFont}`, "#050505", "left");

    // Tear-off right section
    drawText(ctx, "BOARDING PASS", WIDTH - 40, 60, `bold 20px ${monoFont}`, "#050505", "right");
    drawBarcode(ctx, WIDTH - 220, 120, 180, 80, "#050505");
    
    ctx.save();
    ctx.translate(WIDTH - 80, 250);
    ctx.rotate(Math.PI / 2);
    drawText(ctx, (name || "BUILDER").toUpperCase(), 0, 0, `bold 24px ${monoFont}`, "#050505", "left");
    drawText(ctx, "HHG-26", 0, 40, `bold 24px ${monoFont}`, "#005C36", "left");
    ctx.restore();

  } else if (style === "TERMINAL") {
    // Dark mode terminal aesthetic
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    drawGrid(ctx, WIDTH, HEIGHT, 40, "rgba(0, 255, 65, 0.2)");
    
    await drawPhoto(40, 40, 300, 300);
    
    const termGreen = "#00FF41";
    drawText(ctx, "HHG//DEPARTURE_TERMINAL", 380, 80, `bold 24px ${monoFont}`, termGreen, "left");
    
    drawText(ctx, `> USER: ${name.toUpperCase()}`, 380, 150, `bold 32px ${monoFont}`, "#F5F1E6", "left");
    drawText(ctx, `> CLASS: ${role.toUpperCase()}`, 380, 200, `bold 24px ${monoFont}`, "#F5F1E6", "left");
    drawText(ctx, `> DEST: GOA_INDIA_2026`, 380, 250, `bold 24px ${monoFont}`, "#FFE500", "left");
    
    drawBarcode(ctx, 40, HEIGHT - 140, 400, 100, termGreen);
    drawText(ctx, "SYS.ON - BOARDING COMPLETE", WIDTH - 40, HEIGHT - 60, `bold 24px ${monoFont}`, termGreen, "right");

  } else if (style === "AIRLINE") {
    // Classic Airline Ticket
    ctx.fillStyle = "#003B25";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
    // Top Bar
    ctx.fillStyle = "#FFE500";
    ctx.fillRect(0, 0, WIDTH, 80);
    drawText(ctx, "HACKER AIRLINES", 40, 50, `bold 28px ${monoFont}`, "#050505", "left");
    drawText(ctx, "FLIGHT HH26", WIDTH - 40, 50, `bold 28px ${monoFont}`, "#050505", "right");
    
    const pw = 280, ph = 280;
    const px = 60, py = 120;
    ctx.fillStyle = "#FF0085"; ctx.fillRect(px+10, py+10, pw, ph);
    await drawPhoto(px, py, pw, ph);
    
    const cx = 400;
    drawText(ctx, "NAME OF PASSENGER", cx, 150, `bold 16px ${monoFont}`, "#FFE500", "left");
    drawText(ctx, name.toUpperCase(), cx, 190, `400 60px ${displayFont}`, "#F5F1E6", "left");
    
    drawText(ctx, "FROM", cx, 280, `bold 16px ${monoFont}`, "#FFE500", "left");
    drawText(ctx, "ANYWHERE", cx, 320, `400 48px ${displayFont}`, "#F5F1E6", "left");
    
    drawText(ctx, "TO", cx + 240, 280, `bold 16px ${monoFont}`, "#FFE500", "left");
    drawText(ctx, "GOA (HHG)", cx + 240, 320, `400 48px ${displayFont}`, "#F5F1E6", "left");

    drawText(ctx, "CLASS / STACK", cx, 400, `bold 16px ${monoFont}`, "#FFE500", "left");
    drawText(ctx, role.toUpperCase(), cx, 440, `bold 24px ${monoFont}`, "#F5F1E6", "left");

    // Perforation
    ctx.strokeStyle = "#F5F1E6"; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
    ctx.beginPath(); ctx.moveTo(WIDTH - 200, 80); ctx.lineTo(WIDTH - 200, HEIGHT); ctx.stroke();
    
    drawBarcode(ctx, WIDTH - 180, 120, 140, 300, "#F5F1E6");
    
  } else if (style === "DEPARTURE") {
    // Image heavy, typography overlapping
    await drawPhoto(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "rgba(0, 39, 24, 0.7)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
    drawText(ctx, "DEPARTURE", 40, 160, `400 180px ${displayFont}`, "#FFE500", "left");
    drawText(ctx, name.toUpperCase(), 40, 280, `400 80px ${displayFont}`, "#F5F1E6", "left");
    drawText(ctx, "HHG-26", 40, HEIGHT - 60, `bold 60px ${monoFont}`, "#FF0085", "left");
    
    drawBarcode(ctx, WIDTH - 440, HEIGHT - 140, 400, 100, "#F5F1E6");
    drawCropMarks(ctx, 40, 40, 20, "#FFE500", 2);
    drawCropMarks(ctx, WIDTH - 40, HEIGHT - 40, 20, "#FFE500", 2);

  } else {
    // EXPRESS style
    ctx.fillStyle = "#FF0085"; // Hot pink base
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
    drawGrid(ctx, WIDTH, HEIGHT, 80, "rgba(5, 5, 5, 0.2)");
    
    ctx.fillStyle = "#050505";
    ctx.fillRect(40, 40, 300, HEIGHT - 80);
    await drawPhoto(40, 40, 300, HEIGHT - 80);
    
    drawText(ctx, "EXPRESS ENTRY", 380, 100, `400 80px ${displayFont}`, "#050505", "left");
    
    drawText(ctx, (name || "BUILDER").toUpperCase(), 380, 220, `bold 32px ${monoFont}`, "#F5F1E6", "left");
    drawText(ctx, (role || "ROLE").toUpperCase(), 380, 280, `bold 24px ${monoFont}`, "#050505", "left");
    
    drawText(ctx, "BOARDING", 380, 420, `bold 16px ${monoFont}`, "#050505", "left");
    drawText(ctx, "NOW", 380, 500, `400 100px ${displayFont}`, "#F5F1E6", "left");
    
    ctx.strokeStyle = "#050505"; ctx.lineWidth = 4;
    ctx.strokeRect(380, 440, 140, 80);
    
    drawBarcode(ctx, WIDTH - 300, HEIGHT - 160, 260, 120, "#050505");
  }

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
