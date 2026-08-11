"use client";

import React, { useEffect, useRef, useState } from "react";
import { renderEditorial } from "@/lib/templates/editorial";
import { EditorialConfig } from "@/lib/types";
import { Loader2, Download, Share2, RotateCcw } from "lucide-react";

interface EditorialPreviewProps {
  imageUrl: string;
  onReset: () => void;
  name?: string;
  role?: string;
  scale?: number;
  panX?: number;
  panY?: number;
  config: EditorialConfig;
}

export default function EditorialPreview({ 
  imageUrl, 
  onReset,
  name = "BUILDER",
  role = "ROLE",
  scale = 1,
  panX = 0,
  panY = 0,
  config
}: EditorialPreviewProps) {
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
        const b = await renderEditorial(
          canvasRef.current,
          imageUrl,
          "/branding/logo.png",
          name,
          role,
          scale,
          panX,
          panY,
          config
        );
        setBlob(b);
      } catch (err: any) {
        console.error("Editorial render error", err);
        setError("Failed to generate editorial layout. Try a different photo.");
      } finally {
        setIsRendering(false);
      }
    }
    doGenerate();
  }, [imageUrl, name, role, scale, panX, panY, config]);

  const [isSharing, setIsSharing] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);

  const handleDownload = () => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `HH-Goa-Editorial-${Date.now()}.png`;
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
          format: 'EDITORIAL',
          metadata: { name, role, template: config.style }
        }),
      });
      if (!response.ok) throw new Error('Share failed');
      const data = await response.json();
      
      const appUrl = window.location.origin;
      const shareUrl = `${appUrl}/share/${data.id}`;
      
      const text = encodeURIComponent(`I just created my Hacker House Goa 2026 Editorial Poster.\n\n#FrameInGoa #HackerHouseGoa\n`);
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error(err);
      setShareError("Share link couldn't be created.");
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-2xl mx-auto">
      <div className="relative w-full aspect-[4/5] bg-surface rounded-sm overflow-hidden brutal-border brutal-shadow-pink">
        <canvas ref={canvasRef} className="w-full h-full object-contain" />
        
        {isRendering && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-6 text-center">
            <p className="text-secondary font-sans font-bold mb-4 uppercase tracking-widest">{error}</p>
            <button onClick={() => window.location.reload()} className="px-6 py-2 border-2 border-primary text-primary font-bold hover:bg-primary hover:text-black">
              Try Again
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        <button onClick={onReset} className="flex items-center justify-center gap-2 px-6 py-4 bg-transparent border-2 border-primary text-primary font-bold font-sans uppercase tracking-widest hover:bg-primary hover:text-black transition-colors rounded-sm brutal-border">
          <RotateCcw className="w-5 h-5" /> Reset
        </button>
        <button onClick={handleDownload} disabled={!blob || isRendering} className="flex items-center justify-center gap-2 px-6 py-4 bg-tertiary text-white border-2 border-transparent font-bold font-sans uppercase tracking-widest hover:bg-white hover:text-black transition-colors rounded-sm brutal-border brutal-shadow-yellow disabled:opacity-50 disabled:cursor-not-allowed">
          <Download className="w-5 h-5" /> Save
        </button>
        <button onClick={handleShare} disabled={!blob || isRendering || isSharing} className="flex items-center justify-center gap-2 px-6 py-4 bg-primary text-black font-bold font-sans uppercase tracking-widest hover:bg-white transition-colors rounded-sm brutal-border brutal-shadow-pink disabled:opacity-50 disabled:cursor-not-allowed">
          {isSharing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Share2 className="w-5 h-5" />} Share to X
        </button>
      </div>

      {shareError && (
        <p className="text-secondary font-sans font-bold text-sm uppercase tracking-widest bg-secondary/10 px-4 py-2 rounded-sm border border-secondary">
          {shareError}
        </p>
      )}
    </div>
  );
}
