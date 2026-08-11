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
  } else if (config.template === "FIELD_PASS") {
    ctx.fillStyle = "#003B25";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }

  const isDark = ["TERMINAL", "EDITORIAL_ID", "FIELD_PASS"].includes(config.template);
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

    // Metadata Right Side
    const mx = 560;
    let my = 260;
    const drawField = (label: string, value: string) => {
      drawText(ctx, label, mx, my, `bold 16px ${monoFont}`, accentColor, "left");
      drawText(ctx, (value || "UNKNOWN").toUpperCase(), mx, my + 30, `bold 28px ${sansFont}`, textColor, "left");
      my += 80;
    };
    
    drawField("PASSENGER / BUILDER", name);
    drawField("PRIMARY ROLE", role);
    drawField("DESTINATION", "GOA / INDIA");
    drawField("BUILDER ID", `HHG-${Math.floor(Math.random()*9000)+1000}`);
    drawField("ACCESS LEVEL", "ALL AREAS");

    // Giant Title
    drawText(ctx, (title || "BUILDER").toUpperCase(), 60, 1000, `400 130px ${displayFont}`, textColor, "left");
    
    // Bottom Bar
    ctx.fillStyle = textColor;
    ctx.fillRect(60, 1150, WIDTH - 120, 4);
    
    drawBarcode(ctx, 60, 1180, 400, 60, textColor);
    drawText(ctx, "NON-TRANSFERABLE", WIDTH - 60, 1220, `bold 18px ${monoFont}`, textColor, "right");
    drawText(ctx, "VALID OCT 28-31", WIDTH - 60, 1240, `bold 18px ${monoFont}`, accentColor, "right");

  } else if (config.template === "PASSPORT") {
    // ---------------------------------------------------------
    // PASSPORT: Travel document aesthetic, stamps
    // ---------------------------------------------------------
    drawGrid(ctx, WIDTH, HEIGHT, 100, "rgba(0, 92, 54, 0.1)");
    
    // Top layout
    ctx.fillStyle = "#005C36";
    ctx.fillRect(0, 0, WIDTH, 160);
    drawText(ctx, "REPUBLIC OF BUILDERS", WIDTH/2, 80, `400 48px ${displayFont}`, "#F5F1E6", "center");
    drawText(ctx, "OFFICIAL PASSPORT ENTRY", WIDTH/2, 120, `400 32px ${displayFont}`, "#F5F1E6", "center");

    // Left photo
    const px = 80, py = 240, pw = 360, ph = 480;
    await drawPhoto(px, py, pw, ph);
    drawCropMarks(ctx, px, py, 20, "#005C36", 3);
    drawCropMarks(ctx, px+pw, py+ph, 20, "#005C36", 3);

    // Right details
    const mx = 480;
    let my = 220;
    const drawPField = (label: string, value: string | undefined, xOffset: number = 0) => {
      drawText(ctx, label, mx + xOffset, my, `bold 12px ${monoFont}`, "#005C36", "left");
      // Truncate long values so they don't overlap
      let displayValue = (value || "N/A").toUpperCase();
      if (displayValue.length > 20 && xOffset > 0) displayValue = displayValue.substring(0, 18) + "...";
      drawText(ctx, displayValue, mx + xOffset, my + 20, `bold 18px ${monoFont}`, "#050505", "left");
    };
    
    drawPField("SURNAME, GIVEN NAMES", name);
    my += 50;
    drawPField("PROFESSION / STACK", role);
    my += 50;
    drawPField("DESIGNATION", title);
    my += 50;
    drawPField("TECH STACK", config.techStack);
    my += 50;
    drawPField("LOCATION", config.location);
    drawPField("BUILDER CLASS", config.builderClass, 280);
    my += 50;
    drawPField("TWITTER / X", config.xHandle);
    drawPField("GITHUB", config.github, 280);
    my += 50;
    drawPField("EMAIL", config.email);
    drawPField("LINKEDIN", config.linkedin, 280);
    my += 50;
    drawPField("DATE OF ARRIVAL", "28 OCT 2026");
    drawPField("PASS ID", config.passId, 280);

    // Machine readable zone
    ctx.fillStyle = "#F5F1E6";
    ctx.fillRect(0, HEIGHT - 180, WIDTH, 180);
    const mrz = `P<HHG${(name || 'BUILDER').replace(/\s+/g, '<').substring(0,25)}<<<<<<<<<<<<<<<<<<<\n0123456789IND2810260M3110260<<<<<<<<<<<<<<04`;
    const lines = mrz.split('\n');
    drawText(ctx, lines[0], 60, HEIGHT - 120, `bold 32px ${monoFont}`, "#050505", "left");
    drawText(ctx, lines[1], 60, HEIGHT - 60, `bold 32px ${monoFont}`, "#050505", "left");

  } else if (config.template === "EDITORIAL_ID") {
    // ---------------------------------------------------------
    // EDITORIAL_ID: Huge type, photo overlap, brutalist editorial
    // ---------------------------------------------------------
    // Giant background text
    ctx.save();
    ctx.translate(100, HEIGHT - 200);
    ctx.rotate(-Math.PI / 2);
    drawText(ctx, "HACKER HOUSE", 0, 0, `400 240px ${displayFont}`, "rgba(255,255,255,0.05)", "left");
    drawText(ctx, "GOA 2026", 0, 180, `400 240px ${displayFont}`, "rgba(255,255,255,0.05)", "left");
    ctx.restore();

    // Photo centered, oversized
    const pw = 800, ph = 600;
    const px = (WIDTH - pw) / 2, py = 200;
    
    ctx.fillStyle = accentColor;
    ctx.fillRect(px + 20, py + 20, pw, ph);
    await drawPhoto(px, py, pw, ph);
    
    // Overlapping typography
    drawText(ctx, (name || "BUILDER").toUpperCase(), WIDTH/2, py + ph + 80, `400 120px ${displayFont}`, accentColor, "center");
    drawText(ctx, (title || "ROLE").toUpperCase(), WIDTH/2, py + ph + 160, `400 60px ${displayFont}`, textColor, "center");
    
    // Editorial metadata blocks
    if (config.xHandle || config.location) {
      drawText(ctx, (config.xHandle || config.location || "").toUpperCase(), 40, HEIGHT - 180, `bold 24px ${monoFont}`, textColor, "left");
    }
    if (config.techStack) {
      drawText(ctx, (config.techStack || "").toUpperCase(), WIDTH - 40, HEIGHT - 180, `bold 24px ${monoFont}`, textColor, "right");
    }
    
    drawBarcode(ctx, WIDTH/2 - 200, HEIGHT - 120, 400, 60, textColor);
    
  } else if (config.template === "TERMINAL") {
    // ---------------------------------------------------------
    // TERMINAL: Hacker/Cyberpunk aesthetic, green/yellow on black
    // ---------------------------------------------------------
    drawGrid(ctx, WIDTH, HEIGHT, 40, "rgba(0, 92, 54, 0.3)");
    
    drawText(ctx, "> _INITIALIZING BUILDER PROTOCOL...", 40, 80, `bold 18px ${monoFont}`, "#00FF41", "left");
    drawText(ctx, "================================================", 40, 110, `bold 18px ${monoFont}`, "#00FF41", "left");
    
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
    
    const mx = 480;
    let my = 180;
    const drawTField = (label: string, value: string) => {
      drawText(ctx, `> ${label}:`, mx, my, `bold 18px ${monoFont}`, "#00FF41", "left");
      drawText(ctx, (value || "N/A").toUpperCase(), mx, my + 30, `bold 24px ${monoFont}`, accentColor, "left");
      my += 70;
    };
    
    drawTField("IDENTITY", name);
    drawTField("CLASS", role);
    drawTField("ALIAS", title);
    drawTField("STATUS", "AUTHORIZED");
    
    drawText(ctx, "SYSTEM.READY", 40, HEIGHT - 80, `400 150px ${displayFont}`, "#00FF41", "left");
    
  } else {
    // ---------------------------------------------------------
    // FIELD_PASS: Utilitarian, heavy blocks, functional
    // ---------------------------------------------------------
    ctx.fillStyle = "#FFE500";
    ctx.fillRect(40, 40, WIDTH - 80, HEIGHT - 80);
    
    const pw = 500, ph = 500;
    const px = 80, py = 80;
    
    ctx.fillStyle = "#050505";
    ctx.fillRect(px + 15, py + 15, pw, ph);
    await drawPhoto(px, py, pw, ph);
    
    drawText(ctx, "FIELD PASS", WIDTH - 80, 140, `400 80px ${displayFont}`, "#050505", "right");
    drawText(ctx, "HHG-26", WIDTH - 80, 200, `bold 24px ${monoFont}`, "#005C36", "right");
    
    drawText(ctx, (name || "BUILDER").toUpperCase(), 80, 700, `400 110px ${displayFont}`, "#050505", "left");
    drawText(ctx, (title || "ROLE").toUpperCase(), 80, 780, `400 60px ${displayFont}`, "#005C36", "left");
    drawText(ctx, (role || "ROLE").toUpperCase(), 80, 840, `bold 24px ${monoFont}`, "#050505", "left");
    
    ctx.fillStyle = "#050505";
    ctx.fillRect(80, 950, WIDTH - 160, 4);
    
    drawBarcode(ctx, 80, 1000, 500, 100, "#050505");
    drawText(ctx, "ACCESS: ALL", WIDTH - 80, 1050, `bold 32px ${monoFont}`, "#050505", "right");
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
