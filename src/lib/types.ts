export type PhotoLook = "AS_SHOT" | "PUNCH" | "DUOTONE" | "GRAIN";
export type PFPStyle = "CORE" | "SIGNAL" | "EDITORIAL" | "WILD";
export type PFPRingColor = "GREEN" | "YELLOW" | "PINK" | "BLACK" | "WHITE";
export type BuilderTemplate = "IDENTITY" | "PASSPORT" | "EDITORIAL";

export interface PFPConfig {
  style: PFPStyle;
  ringColor: PFPRingColor;
  ringWeight: number; // typically 2 to 12
  look: PhotoLook;
  aiOverlayUrl?: string;
}

export interface BuilderConfig {
  template: BuilderTemplate;
  look: PhotoLook;
  aiOverlayUrl?: string;
  location?: string;
  xHandle?: string;
  github?: string;
  portfolio?: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  format: "PFP" | "BUILDER";
  pfpConfig?: PFPConfig;
  builderConfig?: BuilderConfig;
  title?: string;
  thumbnail: string; // base64 mini preview for history bar
}
