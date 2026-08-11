import { drawImageCover, drawText, drawGrid, drawCropMarks } from "../image/renderer";
import { loadImage } from "../image/loader";
import { PFPConfig } from "../types";

const COLOR_MAP: Record<string, string> = {
  GREEN: "#005C36",
  YELLOW: "#FFE500",
  PINK: "#FF0085",
  BLACK: "#050505",
  WHITE: "#F5F1E6",
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

  const WIDTH = 1080;
  const HEIGHT = 1080;
  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  const sansFont = "'Space Grotesk', sans-serif";
  const monoFont = "'Space Mono', monospace";
  const displayFont = "'Bebas Neue', sans-serif";

  const ringColor = COLOR_MAP[config.ringColor] || COLOR_MAP.YELLOW;
  
  // Background
  ctx.fillStyle = "#003B25"; // Dark Green background
  if (config.style === "GRID") ctx.fillStyle = "#050505"; // Black for grid
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Common styles
  const drawBaseGrid = () => {
     drawGrid(ctx, WIDTH, HEIGHT, 120, "rgba(245, 241, 230, 0.1)");
  };
  
  const drawCircularPhoto = async (x: number, y: number, r: number) => {
    try {
      const img = await loadImage(imageUrl);
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      drawImageCover(ctx, img, x - r, y - r, r * 2, r * 2, scale, panX, panY, config.look);
      ctx.restore();
    } catch (e) {
      console.error(e);
    }
  };

  const drawSquarePhoto = async (x: number, y: number, size: number) => {
    try {
      const img = await loadImage(imageUrl);
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, size, size);
      ctx.closePath();
      ctx.clip();
      drawImageCover(ctx, img, x, y, size, size, scale, panX, panY, config.look);
      ctx.restore();
    } catch (e) {
      console.error(e);
    }
  };

  if (config.style === "CORE") {
    // ---------------------------------------------------------
    // CORE: Large circular photo, thin ring, simple typography
    // ---------------------------------------------------------
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
    const r = 400;
    const cx = WIDTH / 2;
    const cy = HEIGHT / 2;

    // Ring
    ctx.beginPath();
    ctx.arc(cx, cy, r + 20, 0, Math.PI * 2);
    ctx.strokeStyle = ringColor;
    ctx.lineWidth = config.ringWeight;
    ctx.stroke();

    // The photo
    await drawCircularPhoto(cx, cy, r);

    // Simple branding
    drawText(ctx, "HACKER HOUSE GOA 2026", WIDTH/2, HEIGHT - 50, `bold 24px ${monoFont}`, "#F5F1E6", "center");

  } else if (config.style === "SIGNAL") {
    // ---------------------------------------------------------
    // SIGNAL: Radar-like, technical markers, neon accents
    // ---------------------------------------------------------
    const cx = WIDTH / 2;
    const cy = HEIGHT / 2;
    const r = 400;
    
    // Technical crosshairs
    ctx.strokeStyle = "rgba(255, 229, 0, 0.4)"; // Faded yellow
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(WIDTH, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, HEIGHT); ctx.stroke();
    
    // Multiple thin rings
    ctx.strokeStyle = "rgba(245, 241, 230, 0.2)";
    ctx.beginPath(); ctx.arc(cx, cy, r + 60, 0, Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, r + 120, 0, Math.PI*2); ctx.stroke();

    // Solid ring behind photo
    ctx.fillStyle = ringColor;
    ctx.beginPath(); ctx.arc(cx, cy, r + config.ringWeight, 0, Math.PI*2); ctx.fill();

    await drawCircularPhoto(cx, cy, r);

    // Accent boxes
    ctx.fillStyle = COLOR_MAP.PINK;
    ctx.fillRect(cx - 10, cy - r - 80, 20, 40);
    ctx.fillRect(cx - 10, cy + r + 40, 20, 40);

    drawText(ctx, "SIGNAL_DETECTED", 40, 60, `bold 24px ${monoFont}`, "#F5F1E6", "left");
    drawText(ctx, "HHG-26", WIDTH - 40, 60, `bold 24px ${monoFont}`, COLOR_MAP.PINK, "right");
    drawText(ctx, "15.4909° N, 73.8278° E", 40, HEIGHT - 40, `bold 24px ${monoFont}`, ringColor, "left");

  } else if (config.style === "SIGNAL_01") {
    // ---------------------------------------------------------
    // SIGNAL_01: Darker green, grid, dashed yellow circle, neon logo
    // ---------------------------------------------------------
    const r = 380;
    const cx = WIDTH / 2;
    const cy = HEIGHT / 2;

    // Darker green background
    ctx.fillStyle = "#002B1A";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Subtle texture noise
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
    drawNoise(0.04);

    // Grid
    drawGrid(ctx, WIDTH, HEIGHT, 100, "rgba(245, 241, 230, 0.15)");

    // Text Top Left
    drawText(ctx, "HHG // 2026", 40, 60, `bold 18px ${monoFont}`, ringColor, "left");
    drawText(ctx, "SIGNAL 01", 40, 90, `bold 18px ${monoFont}`, "#F5F1E6", "left");

    // The photo
    await drawCircularPhoto(cx, cy, r);

    // Dashed Ring
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r + 20, 0, Math.PI * 2);
    ctx.strokeStyle = ringColor;
    ctx.lineWidth = Math.max(10, config.ringWeight);
    ctx.setLineDash([20, 15]);
    ctx.stroke();
    ctx.restore();

    // Text Bottom Right
    drawText(ctx, "BUILD // SHIP // CREATE", WIDTH - 40, HEIGHT - 40, `bold 18px ${monoFont}`, COLOR_MAP.PINK, "right");

    // Logo Overlaid at Bottom
    try {
      const logo = await loadImage(logoUrl);
      const logoWidth = 240;
      const ratio = logo.height / logo.width;
      const logoHeight = logoWidth * ratio;
      // Draw solid block behind logo
      ctx.fillStyle = "#002B1A";
      ctx.fillRect(cx - logoWidth/2 - 20, HEIGHT - logoHeight - 20, logoWidth + 40, logoHeight + 20);
      
      ctx.drawImage(logo, cx - logoWidth/2, HEIGHT - logoHeight - 10, logoWidth, logoHeight);
    } catch (e) {
      console.error(e);
    }

  } else if (config.style === "WILD") {
    // ---------------------------------------------------------
    // WILD: Text wrapped around the ring, no background elements
    // ---------------------------------------------------------
    const cx = WIDTH / 2;
    const cy = HEIGHT / 2;
    const r = 360;

    ctx.fillStyle = "#002718";
    ctx.fillRect(0,0,WIDTH,HEIGHT);

    // Inner ring
    ctx.strokeStyle = ringColor;
    ctx.lineWidth = config.ringWeight;
    ctx.beginPath(); ctx.arc(cx, cy, r + 15, 0, Math.PI*2); ctx.stroke();

    await drawCircularPhoto(cx, cy, r);

    // Draw radial text manually
    ctx.save();
    ctx.translate(cx, cy);
    const text = " HACKER HOUSE GOA 2026 // BUILDER PROFILE // ";
    ctx.font = `bold 36px ${monoFont}`;
    ctx.fillStyle = "#F5F1E6";
    const angleStep = (Math.PI * 2) / text.length;
    for (let i = 0; i < text.length; i++) {
      ctx.save();
      ctx.rotate(i * angleStep - Math.PI / 2);
      ctx.fillText(text[i], 0, -r - 40);
      ctx.restore();
    }
    ctx.restore();

  } else if (config.style === "GRID") {
    // ---------------------------------------------------------
    // GRID: Square photo, brutalist borders, neon grid
    // ---------------------------------------------------------
    drawGrid(ctx, WIDTH, HEIGHT, 90, "rgba(255, 229, 0, 0.15)"); // Yellow faint grid

    const size = 700;
    const x = (WIDTH - size) / 2;
    const y = (HEIGHT - size) / 2;

    // Hard drop shadow
    ctx.fillStyle = ringColor;
    ctx.fillRect(x + 20, y + 20, size, size);

    await drawSquarePhoto(x, y, size);

    // Crop marks
    drawCropMarks(ctx, x, y, 30, COLOR_MAP.PINK, 4);
    drawCropMarks(ctx, x + size, y, 30, COLOR_MAP.PINK, 4);
    drawCropMarks(ctx, x, y + size, 30, COLOR_MAP.PINK, 4);
    drawCropMarks(ctx, x + size, y + size, 30, COLOR_MAP.PINK, 4);

    // Microcopy
    drawText(ctx, "SYS.ON", 40, 60, `bold 24px ${monoFont}`, "#F5F1E6", "left");
    drawText(ctx, "FRAME IN GOA", WIDTH/2, 60, `bold 24px ${monoFont}`, "#F5F1E6", "center");
    drawText(ctx, "X-COOR: 0", WIDTH - 40, 60, `bold 24px ${monoFont}`, "#F5F1E6", "right");

    drawText(ctx, "2026", 40, HEIGHT - 40, `400 80px ${displayFont}`, ringColor, "left");
    drawText(ctx, "GOA", WIDTH - 40, HEIGHT - 40, `400 80px ${displayFont}`, ringColor, "right");
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
