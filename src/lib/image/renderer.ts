/**
 * Renders an image onto a canvas using object-fit: cover logic
 */
export function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const imgRatio = img.width / img.height;
  const canvasRatio = w / h;
  let renderWidth, renderHeight, offsetX, offsetY;

  if (imgRatio < canvasRatio) {
    // Image is taller relative to canvas
    renderWidth = w;
    renderHeight = w / imgRatio;
    offsetX = x;
    offsetY = y + (h - renderHeight) / 2;
  } else {
    // Image is wider relative to canvas
    renderWidth = h * imgRatio;
    renderHeight = h;
    offsetX = x + (w - renderWidth) / 2;
    offsetY = y;
  }

  // Save context and clip to target bounds
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);
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
