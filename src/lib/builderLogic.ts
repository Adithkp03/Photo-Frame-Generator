const TITLES: Record<string, string[]> = {
  ai: ["THE AI ALCHEMIST", "THE MODEL WHISPERER", "THE NEURAL SHIPPER", "THE PROMPT ALCHEMIST"],
  front: ["THE INTERFACE ARCHITECT", "THE PIXEL SHIPPER", "THE UI BUILDER", "THE PIXEL WIZARD"],
  back: ["THE SYSTEMS ARCHITECT", "THE API FORGER", "THE BACKEND BUILDER", "THE ARCHITECT"],
  full: ["THE PRODUCT SHIPPER", "THE FULL STACK FORGE", "THE DIGITAL BUILDER", "THE BUILDER"],
  design: ["THE EXPERIENCE ARCHITECT", "THE VISUAL ALCHEMIST", "THE PIXEL POET", "THE PIXEL WIZARD"],
  sec: ["THE SECURITY SENTINEL", "THE DIGITAL GHOST", "THE THREAT HUNTER"],
  ops: ["THE INFRASTRUCTURE PILOT", "THE DEPLOYMENT ENGINEER"],
  founder: ["THE VISIONARY", "THE FOUNDER", "THE CEO"],
  web3: ["THE DEGEN BUILDER", "THE CRYPTO NATIVE", "THE BLOCKCHAIN WIZARD"],
  general: ["THE DIGITAL BUILDER", "THE CREATIVE SHIPPER", "THE PRODUCT MAKER", "THE MAKER"]
};

export const getTitleCategory = (role: string): string => {
  const r = role.toLowerCase();
  if (r.includes("ai") || r.includes("ml") || r.includes("data")) return "ai";
  if (r.includes("front") || r.includes("ui") || r.includes("ux")) return "front";
  if (r.includes("back") || r.includes("api") || r.includes("system") || r.includes("cloud")) return "back";
  if (r.includes("full") || r.includes("stack") || r.includes("dev") || r.includes("engineer")) return "full";
  if (r.includes("design") || r.includes("art")) return "design";
  if (r.includes("sec") || r.includes("cyber")) return "sec";
  if (r.includes("ops") || r.includes("infra")) return "ops";
  if (r.includes("founder") || r.includes("ceo") || r.includes("exec")) return "founder";
  if (r.includes("web3") || r.includes("crypto") || r.includes("blockchain")) return "web3";
  return "general";
};

export const generateBuilderTitle = (role: string, seed: number = 0) => {
  const category = getTitleCategory(role);
  const options = TITLES[category];
  return options[seed % options.length];
};

export const generateBuilderNumber = (name: string, role: string) => {
  const str = `${name.toLowerCase()}-${role.toLowerCase()}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const positiveHash = Math.abs(hash);
  const number = (positiveHash % 999) + 1; // 1 to 999
  return `HHG / ${number.toString().padStart(3, '0')}`;
};
