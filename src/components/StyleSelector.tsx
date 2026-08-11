import React from "react";
import { PFPStyle, BuilderTemplate } from "@/lib/types";

interface StyleSelectorProps {
  type: "PFP" | "BUILDER";
  activeStyle: string;
  onSelect: (style: string) => void;
}

const PFP_STYLES: { id: PFPStyle; title: string; subtitle: string; icon: React.ReactNode }[] = [
  { id: "CORE", title: "CORE", subtitle: "Official", icon: <div className="w-8 h-8 rounded-full border-4 border-primary bg-background"></div> },
  { id: "SIGNAL", title: "SIGNAL", subtitle: "Technical", icon: <div className="w-8 h-8 rounded-full border-[2px] border-dashed border-white bg-transparent"></div> },
  { id: "EDITORIAL", title: "EDITORIAL", subtitle: "Poster", icon: <div className="w-8 h-8 bg-surface border-2 border-white flex flex-col justify-end p-1"><div className="w-4 h-1 bg-primary"></div></div> },
  { id: "WILD", title: "WILD", subtitle: "Experimental", icon: <div className="w-8 h-8 border-4 border-black bg-secondary transform -rotate-12"></div> },
];

const BUILDER_TEMPLATES: { id: BuilderTemplate; title: string; subtitle: string; icon: React.ReactNode }[] = [
  { id: "IDENTITY", title: "IDENTITY", subtitle: "Standard", icon: <div className="w-6 h-8 border-2 border-black bg-primary flex flex-col items-center justify-start p-1"><div className="w-full h-3 bg-black"></div></div> },
  { id: "PASSPORT", title: "PASSPORT", subtitle: "Ticket", icon: <div className="w-8 h-6 border-2 border-black border-dashed bg-white"></div> },
  { id: "EDITORIAL", title: "EDITORIAL", subtitle: "Poster", icon: <div className="w-6 h-8 bg-black flex items-end p-1"><div className="w-full h-2 bg-primary"></div></div> },
];

export default function StyleSelector({ type, activeStyle, onSelect }: StyleSelectorProps) {
  const options = type === "PFP" ? PFP_STYLES : BUILDER_TEMPLATES;

  return (
    <div className="flex flex-col gap-3">
      <label className="font-sans font-bold text-sm uppercase text-white/70 tracking-widest">Style</label>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className={`flex flex-col items-center p-4 rounded-2xl text-center transition-all border ${
              activeStyle === opt.id 
                ? "bg-white/10 border-primary shadow-[0_0_15px_rgba(243,231,0,0.3)] scale-100" 
                : "bg-black/20 border-white/10 hover:bg-white/5 hover:border-white/30 scale-95"
            }`}
          >
            <div className="h-12 flex items-center justify-center mb-3">
              {opt.icon}
            </div>
            <span className={`font-mono text-xs font-bold tracking-wider ${activeStyle === opt.id ? "text-primary" : "text-white/80"}`}>
              {opt.title}
            </span>
            <span className="font-sans text-[10px] text-white/50 uppercase mt-1">
              {opt.subtitle}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
