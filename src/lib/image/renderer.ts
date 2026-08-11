import { PhotoLook } from "../types";

/**
 * Renders an image onto a canvas using object-fit: cover logic
 */
export function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  scale: number = 1,
  panX: number = 0,
  panY: number = 0,
  look: PhotoLook = "AS_SHOT"
) {
  const imgRatio = img.width / img.height;
  const canvasRatio = w / h;
  let baseRenderWidth, baseRenderHeight;

  if (imgRatio < canvasRatio) {
    // Image is taller relative to canvas
    baseRenderWidth = w;
    baseRenderHeight = w / imgRatio;
  } else {
    // Image is wider relative to canvas
    baseRenderWidth = h * imgRatio;
    baseRenderHeight = h;
  }

  const renderWidth = baseRenderWidth * scale;
  const renderHeight = baseRenderHeight * scale;

  const offsetX = x + (w - renderWidth) / 2 + panX;
  const offsetY = y + (h - renderHeight) / 2 + panY;

  // Save context and clip to target bounds
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();

  if (look === "PUNCH") {
    ctx.filter = "contrast(1.2) saturate(1.3) brightness(1.05)";
    ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);
  } else if (look === "DUOTONE") {
    // Grayscale base
    ctx.filter = "grayscale(100%) contrast(1.2)";
    ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);
    ctx.filter = "none";
    
    // Green Screen
    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = "#006B3F"; // HH Green
    ctx.fillRect(x, y, w, h);
    
    // Yellow Multiply
    ctx.globalCompositeOperation = "multiply";
    ctx.fillStyle = "#FFF000"; // HH Yellow
    ctx.fillRect(x, y, w, h);
  } else if (look === "GRAIN") {
    // Draw normal
    ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);
    
    // Add grain overlay
    const noiseCanvas = document.createElement("canvas");
    noiseCanvas.width = 200;
    noiseCanvas.height = 200;
    const nCtx = noiseCanvas.getContext("2d");
    if (nCtx) {
      const imgData = nCtx.createImageData(200, 200);
      for (let i = 0; i < imgData.data.length; i += 4) {
        const val = Math.random() * 255;
        imgData.data[i] = val;
        imgData.data[i+1] = val;
        imgData.data[i+2] = val;
        imgData.data[i+3] = 30; // low opacity grain
      }
      nCtx.putImageData(imgData, 0, 0);
      const pattern = ctx.createPattern(noiseCanvas, "repeat");
      if (pattern) {
        ctx.globalCompositeOperation = "overlay";
        ctx.fillStyle = pattern;
        ctx.fillRect(x, y, w, h);
      }
    }
  } else {
    ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);
  }

  ctx.restore();
}

/**
 * Common text rendering utility
 */
export function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  font: string,
  color: string,
  align: CanvasTextAlign = "left",
  baseline: CanvasTextBaseline = "alphabetic"
) {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
  ctx.fillText(text, x, y);
}

/**
 * Draws a Cyber-Brutalist frame
 */
export function drawBrutalistFrame(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  borderColor: string = "#000000",
  borderWidth: number = 4,
  dashedInnerColor: string | null = null
) {
  ctx.lineWidth = borderWidth;
  ctx.strokeStyle = borderColor;
  ctx.setLineDash([]);
  ctx.strokeRect(x, y, w, h);

  if (dashedInnerColor) {
    ctx.save();
    ctx.strokeStyle = dashedInnerColor;
    ctx.lineWidth = 4;
    ctx.setLineDash([12, 12]);
    const gap = 16;
    ctx.strokeRect(x + gap, y + gap, w - gap * 2, h - gap * 2);
    ctx.restore();
  }
}
