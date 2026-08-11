import { drawImageCover, drawText, drawGrid, drawCropMarks, drawBarcode } from "../image/renderer";
import { loadImage } from "../image/loader";
import { BuilderConfig } from "../types";

export async function renderBuilderID(
  canvas: HTMLCanvasElement,
  imageUrl: string,
  logoUrl: string,
  name: string,
  role: string,
  title: string,
  scale: number = 1,
  panX: number = 0,
  panY: number = 0,
  config: BuilderConfig = { template: "CREDENTIAL", look: "AS_SHOT" }
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

  // Base background
  ctx.fillStyle = "#F5F1E6"; // Off white base
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  
  if (config.template === "TERMINAL" || config.template === "EDITORIAL_ID") {
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }

  const isDark = ["TERMINAL", "EDITORIAL_ID"].includes(config.template);
  const textColor = isDark ? "#F5F1E6" : "#050505";
  const accentColor = isDark ? "#FFE500" : "#FF0085";

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

  const drawLogo = async (x: number, y: number, h: number) => {
    try {
      const logo = await loadImage(logoUrl);
      const ratio = logo.width / logo.height;
      ctx.drawImage(logo, x, y, h * ratio, h);
    } catch (e) {}
  };

  if (config.template === "CREDENTIAL") {
    // ---------------------------------------------------------
    // CREDENTIAL: Tech conference style, asymmetrical grid
    // ---------------------------------------------------------
    drawGrid(ctx, WIDTH, HEIGHT, 60, "rgba(5, 5, 5, 0.05)");
    
    // Header
    drawText(ctx, "HH GOA 2026", 60, 100, `400 60px ${displayFont}`, textColor, "left");
    drawText(ctx, "BUILDER CREDENTIAL", 60, 150, `400 40px ${displayFont}`, textColor, "left");
    
    await drawLogo(WIDTH - 200, 60, 80);

    // Photo Box
    const px = 60, py = 220, pw = 450, ph = 600;
    ctx.fillStyle = accentColor;
    ctx.fillRect(px + 10, py + 10, pw, ph); // Shadow
    await drawPhoto(px, py, pw, ph);
    ctx.strokeStyle = textColor; ctx.lineWidth = 4; ctx.strokeRect(px, py, pw, ph);

    // Under the Photo
    const drawUnder = (label: string, value: string | undefined, x: number, y: number) => {
      drawText(ctx, label, x, y, `bold 14px ${monoFont}`, accentColor, "left");
      let displayValue = (value || "N/A").toUpperCase();
      if (displayValue.length > 18) displayValue = displayValue.substring(0, 16) + "...";
      drawText(ctx, displayValue, x, y + 25, `bold 22px ${sansFont}`, textColor, "left");
    };
    
    drawUnder("PASSENGER / BUILDER", name, 60, 870);
    drawUnder("BUILDER ID", config.passId, 320, 870);
    drawUnder("PRIMARY ROLE", role, 60, 950);

    // Giant Title
    drawText(ctx, (title || "BUILDER").toUpperCase(), 60, 1100, `400 130px ${displayFont}`, textColor, "left");

    // Other Details to the Right of the Photo
    let ry = 260;
    const drawRight = (label: string, value: string | undefined) => {
      drawText(ctx, label, 560, ry, `bold 14px ${monoFont}`, accentColor, "left");
      let displayValue = (value || "N/A").toUpperCase();
      if (displayValue.length > 25) displayValue = displayValue.substring(0, 23) + "...";
      drawText(ctx, displayValue, 560, ry + 30, `bold 28px ${sansFont}`, textColor, "left");
      ry += 80;
    };
    
    drawRight("BUILDER CLASS", config.builderClass);
    drawRight("TECH STACK", config.techStack);
    drawRight("LOCATION", config.location);
    drawRight("TWITTER / X", config.xHandle);
    drawRight("GITHUB", config.github);
    drawRight("LINKEDIN", config.linkedin);
    drawRight("EMAIL", config.email);
    
    // Bottom Bar
    ctx.fillStyle = textColor;
    ctx.fillRect(60, 1150, WIDTH - 120, 4);
    
    drawBarcode(ctx, 60, 1180, 400, 60, textColor);
    drawText(ctx, "NON-TRANSFERABLE", WIDTH - 60, 1220, `bold 18px ${monoFont}`, textColor, "right");
    drawText(ctx, "VALID OCT 28-31", WIDTH - 60, 1240, `bold 18px ${monoFont}`, accentColor, "right");

  } else if (config.template === "EDITORIAL_ID") {
    // ---------------------------------------------------------
    // EDITORIAL_ID: Simple overlay with the photo as the background
    // ---------------------------------------------------------
    await drawPhoto(0, 0, WIDTH, HEIGHT);
    
    // Create a dark gradient overlay at the bottom for text legibility
    const grad = ctx.createLinearGradient(0, HEIGHT - 700, 0, HEIGHT);
    grad.addColorStop(0, "transparent");
    grad.addColorStop(0.5, "rgba(0,0,0,0.7)");
    grad.addColorStop(1, "rgba(0,0,0,0.95)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
    // Overlay border
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, WIDTH - 80, HEIGHT - 80);

    const txtColor = "#FFFFFF";
    const highlight = "#FFE500";
    
    // Top logos
    drawText(ctx, "HH GOA 2026", 80, 100, `bold 24px ${monoFont}`, txtColor, "left");
    drawBarcode(ctx, WIDTH - 280, 70, 200, 40, txtColor);

    // Giant name
    drawText(ctx, (name || "BUILDER").toUpperCase(), 80, HEIGHT - 380, `400 140px ${displayFont}`, txtColor, "left");
    drawText(ctx, (title || "ROLE").toUpperCase(), 80, HEIGHT - 320, `400 60px ${displayFont}`, highlight, "left");

    // Grid of metadata below name
    const sx1 = 80;
    const sx2 = 340;
    const sx3 = 600;
    const sx4 = 860;
    
    const drawEd = (label: string, value: string | undefined, x: number, y: number) => {
      drawText(ctx, label, x, y, `bold 14px ${monoFont}`, "rgba(255,255,255,0.5)", "left");
      let displayValue = (value || "N/A").toUpperCase();
      if (displayValue.length > 18) displayValue = displayValue.substring(0, 16) + "...";
      drawText(ctx, displayValue, x, y + 25, `bold 18px ${sansFont}`, txtColor, "left");
    };

    let ey = HEIGHT - 240;
    drawEd("ROLE / STACK", role, sx1, ey);
    drawEd("TECH STACK", config.techStack, sx2, ey);
    drawEd("BUILDER CLASS", config.builderClass, sx3, ey);
    drawEd("PASS ID", config.passId, sx4, ey);
    
    ey = HEIGHT - 160;
    drawEd("LOCATION", config.location, sx1, ey);
    drawEd("TWITTER / X", config.xHandle, sx2, ey);
    drawEd("GITHUB", config.github, sx3, ey);
    drawEd("LINKEDIN", config.linkedin, sx4, ey);

  } else {
    // ---------------------------------------------------------
    // TERMINAL: Hacker/Cyberpunk aesthetic, green/yellow on black
    // ---------------------------------------------------------
    drawGrid(ctx, WIDTH, HEIGHT, 40, "rgba(0, 92, 54, 0.3)");
    
    drawText(ctx, "> _INITIALIZING BUILDER PROTOCOL...", 40, 80, `bold 18px ${monoFont}`, "#00FF41", "left");
    drawText(ctx, "==========================================================================", 40, 110, `bold 18px ${monoFont}`, "#00FF41", "left");
    
    const pw = 400, ph = 400;
    const px = 40, py = 160;
    await drawPhoto(px, py, pw, ph);
    
    // Scanlines over photo
    ctx.fillStyle = "rgba(0, 255, 65, 0.1)";
    ctx.fillRect(px, py, pw, ph);
    for(let i=0; i<ph; i+=4) {
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.fillRect(px, py+i, pw, 2);
    }
    ctx.strokeStyle = "#00FF41"; ctx.lineWidth = 2; ctx.strokeRect(px, py, pw, ph);
    
    const termColor = "#00FF41";
    const termAccent = "#FFE500";

    // Under the Photo
    const drawTUnder = (label: string, value: string | undefined, x: number, y: number) => {
      drawText(ctx, `> ${label}:`, x, y, `bold 16px ${monoFont}`, termColor, "left");
      let displayValue = (value || "N/A").toUpperCase();
      if (displayValue.length > 18) displayValue = displayValue.substring(0, 16) + "...";
      drawText(ctx, displayValue, x, y + 25, `bold 22px ${monoFont}`, termAccent, "left");
    };

    drawTUnder("IDENTITY", name, 40, 620);
    drawTUnder("PASS_ID", config.passId, 280, 620);
    drawTUnder("SYS.ROLE", role, 40, 700);

    drawText(ctx, (title || "SYSTEM.READY").toUpperCase(), 40, 1100, `400 130px ${displayFont}`, termColor, "left");

    // Right of the Photo
    let ry = 180;
    const drawTRight = (label: string, value: string | undefined) => {
      drawText(ctx, `> ${label}:`, 480, ry, `bold 16px ${monoFont}`, termColor, "left");
      let displayValue = (value || "N/A").toUpperCase();
      if (displayValue.length > 25) displayValue = displayValue.substring(0, 23) + "...";
      drawText(ctx, displayValue, 480, ry + 25, `bold 24px ${monoFont}`, termAccent, "left");
      ry += 70;
    };

    drawTRight("CLASS", config.builderClass);
    drawTRight("STACK", config.techStack);
    drawTRight("SYS.LOC", config.location);
    drawTRight("X_HANDLE", config.xHandle);
    drawTRight("GITHUB", config.github);
    drawTRight("LINKEDIN", config.linkedin);
    drawTRight("EMAIL", config.email);

    drawText(ctx, `> STATUS: AUTHORIZED`, 480, ry + 20, `bold 20px ${monoFont}`, termColor, "left");
    drawBarcode(ctx, WIDTH - 440, HEIGHT - 140, 400, 60, termColor);
  }

  // AI Overlay (Full Canvas)
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
