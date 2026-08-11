"use client";

import React, { useEffect, useRef, useState } from "react";
import { renderPFP } from "@/lib/templates/pfp";
import { Loader2, Download, Share2, RotateCcw } from "lucide-react";

interface PFPPreviewProps {
  imageUrl: string;
  onReset: () => void;
}

export default function PFPPreview({ imageUrl, onReset }: PFPPreviewProps) {
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

  const handleShare = async () => {
    if (!blob) return;

    const file = new File([blob], "HH-Goa-2026-PFP.png", { type: "image/png" });
    const shareData = {
      title: "HH Goa 2026 PFP",
      text: "Built my HH Goa 2026 PFP. #FrameInGoa",
      files: [file],
    };

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback: download the file and open twitter intent
      handleDownload();
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent("Built my HH Goa 2026 PFP. #FrameInGoa")}`;
      window.open(twitterUrl, "_blank");
      alert("Image downloaded! You can now attach it to your post on X.");
    }
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

      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <button 
          onClick={onReset}
          className="flex items-center justify-center gap-2 bg-surface text-on-surface px-6 py-4 font-sans font-bold text-xl uppercase tracking-wider brutal-border hover:bg-[#1a854d] transition-colors"
        >
          <RotateCcw className="w-6 h-6" />
          Start Over
        </button>
        <button 
          onClick={handleDownload}
          disabled={isRendering || !blob}
          className="flex items-center justify-center gap-2 bg-white text-black px-6 py-4 font-sans font-bold text-xl uppercase tracking-wider brutal-border hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-6 h-6" />
          Download
        </button>
        <button 
          onClick={handleShare}
          disabled={isRendering || !blob}
          className="flex-1 flex items-center justify-center gap-2 bg-primary text-black px-6 py-4 font-sans font-bold text-xl uppercase tracking-wider brutal-border brutal-shadow-yellow hover:-translate-y-1 hover:-translate-x-1 active:translate-y-0 active:translate-x-0 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Share2 className="w-6 h-6" />
          Share to X
        </button>
      </div>
    </div>
  );
}
