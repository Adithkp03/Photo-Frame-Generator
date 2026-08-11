import React from "react";
import { ZoomIn, ZoomOut, MoveUp, MoveDown, MoveLeft, MoveRight, RotateCcw } from "lucide-react";
import { PhotoLook } from "@/lib/types";

interface PhotoControlsProps {
  scale: number;
  setScale: React.Dispatch<React.SetStateAction<number>>;
  panX: number;
  setPanX: React.Dispatch<React.SetStateAction<number>>;
  panY: number;
  setPanY: React.Dispatch<React.SetStateAction<number>>;
  look: PhotoLook;
  setLook: (look: PhotoLook) => void;
}

const LOOK_LABELS: Record<PhotoLook, string> = {
  AS_SHOT: "AS SHOT",
  PUNCH: "PUNCH",
  DUOTONE: "DUOTONE",
  GRAIN: "GRAIN"
};

export default function PhotoControls({
  scale, setScale, panX, setPanX, panY, setPanY, look, setLook
}: PhotoControlsProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <label className="font-sans font-bold text-sm uppercase text-white/70">Look</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
          {(Object.keys(LOOK_LABELS) as PhotoLook[]).map((l) => (
            <button
              key={l}
              onClick={() => setLook(l)}
              className={`p-3 font-mono text-xs font-bold rounded-xl transition-all border ${
                look === l ? "bg-primary text-black border-primary shadow-[0_0_10px_rgba(243,231,0,0.5)]" : "bg-black/20 text-white/80 border-white/10 hover:bg-white/10 hover:border-white/30"
              }`}
            >
              {LOOK_LABELS[l]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="font-sans font-bold text-sm uppercase text-white/70">Zoom</label>
        <div className="flex gap-3 items-center">
          <button onClick={() => setScale(s => Math.max(0.1, s - 0.1))} className="p-3 bg-black/20 text-white rounded-full border border-white/10 hover:bg-white/10 transition-colors">
            <ZoomOut className="w-5 h-5" />
          </button>
          <input type="range" min="0.5" max="3" step="0.05" value={scale} onChange={(e) => setScale(parseFloat(e.target.value))} className="flex-1 accent-primary h-2 bg-white/20 rounded-lg appearance-none cursor-pointer" />
          <button onClick={() => setScale(s => Math.min(3, s + 0.1))} className="p-3 bg-black/20 text-white rounded-full border border-white/10 hover:bg-white/10 transition-colors">
            <ZoomIn className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="font-sans font-bold text-sm uppercase text-white/70">Position</label>
        <div className="grid grid-cols-3 gap-2 w-40 mx-auto">
          <div></div>
          <button onClick={() => setPanY(p => p - 20)} className="p-3 bg-black/20 text-white rounded-xl border border-white/10 hover:bg-white/10 transition-colors flex justify-center"><MoveUp className="w-5 h-5" /></button>
          <div></div>
          <button onClick={() => setPanX(p => p - 20)} className="p-3 bg-black/20 text-white rounded-xl border border-white/10 hover:bg-white/10 transition-colors flex justify-center"><MoveLeft className="w-5 h-5" /></button>
          <button onClick={() => { setScale(1); setPanX(0); setPanY(0); setLook("AS_SHOT"); }} className="p-3 bg-primary/20 text-primary rounded-xl border border-primary/40 hover:bg-primary/40 transition-colors flex justify-center" title="Reset Image">
            <RotateCcw className="w-5 h-5" />
          </button>
          <button onClick={() => setPanX(p => p + 20)} className="p-3 bg-black/20 text-white rounded-xl border border-white/10 hover:bg-white/10 transition-colors flex justify-center"><MoveRight className="w-5 h-5" /></button>
          <div></div>
          <button onClick={() => setPanY(p => p + 20)} className="p-3 bg-black/20 text-white rounded-xl border border-white/10 hover:bg-white/10 transition-colors flex justify-center"><MoveDown className="w-5 h-5" /></button>
          <div></div>
        </div>
      </div>
    </div>
  );
}
