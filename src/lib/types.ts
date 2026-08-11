export type PhotoLook = "AS_SHOT" | "PUNCH" | "DUOTONE" | "GRAIN";
export type PFPStyle = "CORE" | "SIGNAL" | "SIGNAL_01" | "WILD" | "GRID";
export type PFPRingColor = "GREEN" | "YELLOW" | "PINK" | "BLACK" | "WHITE";
export type BuilderTemplate = "CREDENTIAL" | "EDITORIAL_ID" | "TERMINAL";
export type BoardingPassStyle = "CLASSIC" | "TERMINAL" | "AIRLINE" | "DEPARTURE" | "EXPRESS";
export type EditorialStyle = "TYPOGRAPHIC" | "IMAGE_FIRST" | "BRUTALIST" | "SWISS" | "EXPERIMENTAL";
export type Format = "PFP" | "BUILDER" | "PASS" | "PACK" | "EDITORIAL";

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
  linkedin?: string;
  email?: string;
  techStack?: string;
  builderClass?: string;
  passId?: string;
}

export interface BoardingPassConfig {
  style?: BoardingPassStyle;
  look?: PhotoLook;
  aiOverlayUrl?: string;
}

export interface EditorialConfig {
  style?: EditorialStyle;
  look?: PhotoLook;
  aiOverlayUrl?: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  format: Format;
  pfpConfig?: PFPConfig;
  builderConfig?: BuilderConfig;
  passConfig?: BoardingPassConfig;
  editorialConfig?: EditorialConfig;
  title?: string;
  thumbnail: string; // base64 mini preview for history bar
}
