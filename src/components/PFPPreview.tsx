"use client";

import React, { useEffect, useRef, useState } from "react";
import { renderPFP } from "@/lib/templates/pfp";
import { Loader2, Download } from "lucide-react";

interface PFPPreviewProps {
  imageUrl: string;
}

export default function PFPPreview({ imageUrl }: PFPPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [isRendering, setIsRendering] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function generate() {
      if (!canvasRef.current) return;
      setIsRendering(true);
      setError(null);
      try {
        const finalBlob = await renderPFP(canvasRef.current, imageUrl, "/branding/logo.png");
        setBlob(finalBlob);
      } catch (err: any) {
        setError("Failed to generate PFP.");
        console.error(err);
      } finally {
        setIsRendering(false);
      }
    }
    generate();
  }, [imageUrl]);

  const handleDownload = () => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "HH-Goa-2026-PFP.png";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <div className="relative w-full max-w-md aspect-square bg-[#006838] brutal-border p-2 brutal-shadow-pink">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full object-contain"
        />
        
        {isRendering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10 backdrop-blur-sm">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        )}
      </div>
      
      {error && <p className="text-secondary bg-black p-2 font-bold font-mono">{error}</p>}

      <button 
        onClick={handleDownload}
        disabled={isRendering || !blob}
        className="flex items-center gap-2 bg-primary text-black px-12 py-4 font-sans font-bold text-xl uppercase tracking-wider brutal-border brutal-shadow-yellow hover:-translate-y-1 hover:-translate-x-1 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download className="w-6 h-6" />
        Download PFP
      </button>
    </div>
  );
}
