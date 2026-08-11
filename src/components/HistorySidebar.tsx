import React from "react";
import { HistoryItem } from "@/lib/types";

interface HistorySidebarProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}

export default function HistorySidebar({ history, onSelect }: HistorySidebarProps) {
  if (history.length === 0) return null;

  return (
    <div className="w-full pt-2">
      <h3 className="font-sans text-xl font-bold text-white tracking-widest mb-6 text-center">RECENT CREATIONS</h3>
      <div className="flex flex-row gap-6 overflow-x-auto pb-4 px-4 justify-center">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className="flex-shrink-0 w-24 flex flex-col gap-3 group items-center transition-transform hover:scale-105"
          >
            <div className="w-20 h-20 bg-black/20 rounded-xl overflow-hidden border border-white/10 group-hover:border-primary group-hover:shadow-[0_0_15px_rgba(243,231,0,0.4)] transition-all">
              {item.thumbnail ? (
                <img src={item.thumbnail} alt="History thumbnail" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-white/5"></div>
              )}
            </div>
            <span className="font-mono text-[10px] font-bold tracking-wider text-white/50 group-hover:text-primary transition-colors">
              {item.format}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
