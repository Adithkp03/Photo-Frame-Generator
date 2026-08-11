import React from "react";
import { PFPStyle, BuilderTemplate, BoardingPassStyle, EditorialStyle } from "@/lib/types";

interface StyleSelectorProps {
  type: "PFP" | "BUILDER" | "PASS" | "EDITORIAL";
  activeStyle: string;
  onSelect: (style: string) => void;
}

const PFP_STYLES = [
  { id: "CORE", title: "CORE", subtitle: "Official", icon: <div className="w-8 h-8 rounded-full border-4 border-primary bg-background"></div> },
  { id: "SIGNAL", title: "SIGNAL", subtitle: "Technical", icon: <div className="w-8 h-8 rounded-full border-[2px] border-dashed border-white bg-transparent"></div> },
  { id: "SIGNAL_01", title: "SIGNAL 01", subtitle: "Poster", icon: <div className="w-8 h-8 bg-[#002B1A] border-2 border-primary flex items-center justify-center p-1"><div className="w-6 h-6 border border-primary border-dashed rounded-full"></div></div> },
  { id: "WILD", title: "WILD", subtitle: "Experimental", icon: <div className="w-8 h-8 border-4 border-black bg-secondary transform -rotate-12"></div> },
];

const BUILDER_TEMPLATES = [
  { id: "CREDENTIAL", title: "CREDENTIAL", subtitle: "Official", icon: <div className="w-6 h-8 border-2 border-black bg-primary flex flex-col items-center justify-start p-1"><div className="w-full h-3 bg-black"></div></div> },
  { id: "EDITORIAL_ID", title: "EDITORIAL", subtitle: "Poster", icon: <div className="w-6 h-8 bg-black flex items-end p-1"><div className="w-full h-2 bg-primary"></div></div> },
  { id: "TERMINAL", title: "TERMINAL", subtitle: "Cyberpunk", icon: <div className="w-6 h-8 bg-black border-2 border-green-500"><div className="w-full h-1 bg-green-500 mt-1"></div></div> },
];



export default function StyleSelector({ type, activeStyle, onSelect }: StyleSelectorProps) {
  if (type === "PASS") return null;

  const options = type === "PFP" ? PFP_STYLES : type === "BUILDER" ? BUILDER_TEMPLATES : [];

  return (
    <div className="flex flex-col gap-3">
      <label className="font-sans font-bold text-sm uppercase text-white/70 tracking-widest">Style</label>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className={`flex flex-col items-center p-3 rounded-xl text-center transition-all border ${
              activeStyle === opt.id 
                ? "bg-white/10 border-primary shadow-[0_0_15px_rgba(243,231,0,0.3)] scale-100" 
                : "bg-black/20 border-white/10 hover:bg-white/5 hover:border-white/30 scale-95"
            }`}
          >
            <div className="h-10 flex items-center justify-center mb-2">
              {opt.icon}
            </div>
            <span className={`font-mono text-[10px] font-bold tracking-wider ${activeStyle === opt.id ? "text-primary" : "text-white/80"}`}>
              {opt.title}
            </span>
            <span className="font-sans text-[8px] text-white/50 uppercase mt-0.5">
              {opt.subtitle}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
