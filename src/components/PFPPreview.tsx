"use client";

import React, { useEffect, useRef, useState } from "react";
import { renderPFP } from "@/lib/templates/pfp";
import { Loader2, Download, Share2, RotateCcw, Shuffle } from "lucide-react";
import { PFPConfig } from "@/lib/types";

interface PFPPreviewProps {
  imageUrl: string;
  onReset: () => void;
  onEdit?: () => void;
  onRemix?: () => void;
  scale?: number;
  panX?: number;
  panY?: number;
  config: PFPConfig;
  showActions?: boolean;
  onThumbnailRendered?: (dataUrl: string) => void;
}

export default function PFPPreview({ 
  imageUrl, 
  onReset,
  onEdit,
  onRemix,
  scale = 1,
  panX = 0,
  panY = 0,
  config,
  showActions = true,
  onThumbnailRendered
}: PFPPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function doGenerate() {
      if (!canvasRef.current) return;
      
      setIsRendering(true);
      setError(null);
      
      try {
        const finalBlob = await renderPFP(canvasRef.current, imageUrl, "/branding/logo.png", scale, panX, panY, config);
        setBlob(finalBlob);
        
        if (onThumbnailRendered) {
          // Generate a low-res data url for history
          const tinyCanvas = document.createElement("canvas");
          tinyCanvas.width = 100;
          tinyCanvas.height = 100;
          const tCtx = tinyCanvas.getContext("2d");
          if (tCtx) {
            tCtx.drawImage(canvasRef.current, 0, 0, 100, 100);
            onThumbnailRendered(tinyCanvas.toDataURL("image/png", 0.5));
          }
        }
      } catch (err: any) {
        setError("Failed to generate PFP.");
        console.error(err);
      } finally {
        setIsRendering(false);
      }
    }

    const timeout = setTimeout(doGenerate, 150); // slight debounce for sliders
    return () => clearTimeout(timeout);
  }, [imageUrl, scale, panX, panY, config]);

  const [isSharing, setIsSharing] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);

  const handleDownload = () => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "HH-Goa-2026-PFP.png";
    a.click();
    URL.revokeObjectURL(url);
  };

  const blobToBase64 = (b: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(b);
    });
  };

  const handleShare = async () => {
    if (!blob) return;
    
    setIsSharing(true);
    setShareError(null);
    
    try {
      const base64Image = await blobToBase64(blob);
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64Image,
          format: 'PFP',
          metadata: { style: config.style, ring: config.ringColor }
        }),
      });
      
      if (!response.ok) throw new Error('Share failed');
      const data = await response.json();
      
      const appUrl = window.location.origin;
      const shareUrl = `${appUrl}/share/${data.id}`;
      
      const text = encodeURIComponent("Just built my HH Goa 2026 identity. #FrameInGoa\n\n");
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error(err);
      setShareError("Share link couldn't be created.");
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <div className="relative w-full max-w-md aspect-square bg-black/20 rounded-3xl border border-white/10 overflow-hidden shadow-xl p-4">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full object-contain"
        />
        
        {isRendering && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md z-10 rounded-3xl">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-3" />
            <span className="font-mono text-white font-bold uppercase tracking-widest text-sm">BUILDING...</span>
          </div>
        )}
      </div>
      
      {error && <p className="text-secondary bg-black p-2 font-bold font-mono">{error}</p>}
      {shareError && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-secondary bg-black/50 backdrop-blur-sm p-2 rounded font-bold font-mono text-sm border border-secondary/20">{shareError}</p>
          <button onClick={handleShare} className="text-primary hover:underline font-bold text-sm">TRY AGAIN</button>
        </div>
      )}

      {showActions && (
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center mt-2">
          <button 
            onClick={onReset}
            className="flex-1 flex items-center justify-center gap-2 bg-white/10 text-white px-4 py-3 rounded-xl border border-white/20 font-sans font-bold text-sm uppercase tracking-wider hover:bg-white/20 hover:border-white/40 hover:-translate-y-0.5 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          {onEdit && (
            <button 
              onClick={onEdit}
              className="flex-1 flex items-center justify-center gap-2 bg-white/10 text-white px-4 py-3 rounded-xl border border-white/20 font-sans font-bold text-sm uppercase tracking-wider hover:bg-white/20 hover:border-white/40 hover:-translate-y-0.5 transition-all"
            >
              Edit
            </button>
          )}
          <button 
            onClick={handleDownload}
            disabled={isRendering || !blob || isSharing}
            className="flex-1 flex items-center justify-center gap-2 bg-white/10 text-white px-4 py-3 rounded-xl border border-white/20 font-sans font-bold text-sm uppercase tracking-wider hover:bg-white/20 hover:border-white/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            <Download className="w-4 h-4" />
            Save
          </button>
          <button 
            onClick={handleShare}
            disabled={isRendering || !blob || isSharing}
            className="flex-[1.5] flex items-center justify-center gap-2 bg-primary text-black px-4 py-3 rounded-xl border border-primary font-sans font-bold text-sm uppercase tracking-wider shadow-[0_0_15px_rgba(243,231,0,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(243,231,0,0.5)] active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {isSharing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                Share to X
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
