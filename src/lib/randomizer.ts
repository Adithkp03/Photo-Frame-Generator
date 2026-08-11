import { PFPConfig, BuilderConfig, PFPStyle, PFPRingColor, PhotoLook, BuilderTemplate, BoardingPassStyle, EditorialStyle, BoardingPassConfig, EditorialConfig } from "./types";

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

interface PassCombo {
  style: BoardingPassStyle;
  look: PhotoLook;
}

interface EditorialCombo {
  style: EditorialStyle;
  look: PhotoLook;
}

// Curated valid visual combinations for PFP
const CURATED_PFP_COMBOS: PFPCombo[] = [
  { style: "CORE", ringColor: "YELLOW", look: "PUNCH", ringWeight: 10 },
  { style: "SIGNAL", ringColor: "PINK", look: "GRAIN", ringWeight: 6 },
  { style: "GRID", ringColor: "GREEN", look: "DUOTONE", ringWeight: 4 },
  { style: "WILD", ringColor: "BLACK", look: "PUNCH", ringWeight: 12 },
  { style: "CORE", ringColor: "GREEN", look: "AS_SHOT", ringWeight: 8 },
  { style: "SIGNAL", ringColor: "WHITE", look: "DUOTONE", ringWeight: 4 },
  { style: "GRID", ringColor: "YELLOW", look: "GRAIN", ringWeight: 6 },
  { style: "WILD", ringColor: "PINK", look: "DUOTONE", ringWeight: 12 },
];

// Curated combinations for Builder
const CURATED_BUILDER_COMBOS: BuilderCombo[] = [
  { template: "CREDENTIAL", look: "PUNCH" },
  { template: "PASSPORT", look: "GRAIN" },
  { template: "EDITORIAL_ID", look: "DUOTONE" },
  { template: "TERMINAL", look: "AS_SHOT" },
  { template: "FIELD_PASS", look: "DUOTONE" },
  { template: "CREDENTIAL", look: "AS_SHOT" },
];

const CURATED_PASS_COMBOS: PassCombo[] = [
  { style: "CLASSIC", look: "PUNCH" },
  { style: "TERMINAL", look: "GRAIN" },
  { style: "AIRLINE", look: "AS_SHOT" },
  { style: "DEPARTURE", look: "DUOTONE" },
  { style: "EXPRESS", look: "PUNCH" },
];

const CURATED_EDITORIAL_COMBOS: EditorialCombo[] = [
  { style: "TYPOGRAPHIC", look: "GRAIN" },
  { style: "IMAGE_FIRST", look: "AS_SHOT" },
  { style: "BRUTALIST", look: "DUOTONE" },
  { style: "SWISS", look: "PUNCH" },
  { style: "EXPERIMENTAL", look: "GRAIN" },
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

export function getRandomBoardingPassConfig(currentConfig?: BoardingPassConfig): BoardingPassConfig {
  let nextCombos = CURATED_PASS_COMBOS;
  
  if (currentConfig) {
    nextCombos = CURATED_PASS_COMBOS.filter(
      c => c.style !== currentConfig.style || c.look !== currentConfig.look
    );
  }
  
  const selected = nextCombos[Math.floor(Math.random() * nextCombos.length)];
  return { ...selected };
}

export function getRandomEditorialConfig(currentConfig?: EditorialConfig): EditorialConfig {
  let nextCombos = CURATED_EDITORIAL_COMBOS;
  
  if (currentConfig) {
    nextCombos = CURATED_EDITORIAL_COMBOS.filter(
      c => c.style !== currentConfig.style || c.look !== currentConfig.look
    );
  }
  
  const selected = nextCombos[Math.floor(Math.random() * nextCombos.length)];
  return { ...selected };
}
