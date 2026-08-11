import { PFPConfig, BuilderConfig, PFPStyle, PFPRingColor, PhotoLook, BuilderTemplate } from "./types";

interface PFPCombo {
  style: PFPStyle;
  ringColor: PFPRingColor;
  look: PhotoLook;
  ringWeight: number;
}

interface BuilderCombo {
  template: BuilderTemplate;
  look: PhotoLook;
}

// Curated valid visual combinations for PFP
const CURATED_PFP_COMBOS: PFPCombo[] = [
  { style: "CORE", ringColor: "YELLOW", look: "PUNCH", ringWeight: 10 },
  { style: "SIGNAL", ringColor: "PINK", look: "GRAIN", ringWeight: 6 },
  { style: "EDITORIAL", ringColor: "GREEN", look: "DUOTONE", ringWeight: 4 },
  { style: "WILD", ringColor: "BLACK", look: "PUNCH", ringWeight: 12 },
  { style: "CORE", ringColor: "GREEN", look: "AS_SHOT", ringWeight: 8 },
  { style: "SIGNAL", ringColor: "WHITE", look: "DUOTONE", ringWeight: 4 },
  { style: "EDITORIAL", ringColor: "YELLOW", look: "GRAIN", ringWeight: 6 },
  { style: "WILD", ringColor: "PINK", look: "DUOTONE", ringWeight: 12 },
];

// Curated combinations for Builder
const CURATED_BUILDER_COMBOS: BuilderCombo[] = [
  { template: "IDENTITY", look: "PUNCH" },
  { template: "PASSPORT", look: "GRAIN" },
  { template: "EDITORIAL", look: "DUOTONE" },
  { template: "IDENTITY", look: "AS_SHOT" },
  { template: "PASSPORT", look: "DUOTONE" },
  { template: "EDITORIAL", look: "PUNCH" },
];

export function getRandomPFPConfig(currentConfig?: PFPConfig): PFPConfig {
  let nextCombos = CURATED_PFP_COMBOS;
  
  if (currentConfig) {
    nextCombos = CURATED_PFP_COMBOS.filter(
      c => c.style !== currentConfig.style || c.look !== currentConfig.look || c.ringColor !== currentConfig.ringColor
    );
  }
  
  const selected = nextCombos[Math.floor(Math.random() * nextCombos.length)];
  return { ...selected };
}

export function getRandomBuilderConfig(currentConfig?: BuilderConfig): BuilderConfig {
  let nextCombos = CURATED_BUILDER_COMBOS;
  
  if (currentConfig) {
    nextCombos = CURATED_BUILDER_COMBOS.filter(
      c => c.template !== currentConfig.template || c.look !== currentConfig.look
    );
  }
  
  const selected = nextCombos[Math.floor(Math.random() * nextCombos.length)];
  return { ...selected };
}
