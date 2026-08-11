"use client";

import React, { useEffect, useRef, useState } from "react";
import { renderBuilderID } from "@/lib/templates/builder";
import { Loader2, Download, Share2, RotateCcw } from "lucide-react";

interface BuilderPreviewProps {
  imageUrl: string;
  onReset: () => void;
}

const generateBuilderTitle = (role: string) => {
  const r = role.toLowerCase();
  if (r.includes("ai") || r.includes("ml") || r.includes("data")) return "THE AI ALCHEMIST";
  if (r.includes("front") || r.includes("ui") || r.includes("design")) return "THE PIXEL WIZARD";
  if (r.includes("back") || r.includes("api") || r.includes("system") || r.includes("cloud")) return "THE ARCHITECT";
  if (r.includes("full") || r.includes("stack") || r.includes("dev") || r.includes("engineer")) return "THE BUILDER";
  if (r.includes("product") || r.includes("manager") || r.includes("pm")) return "THE PRODUCT SHIPPER";
  if (r.includes("founder") || r.includes("ceo") || r.includes("exec")) return "THE VISIONARY";
  if (r.includes("web3") || r.includes("crypto") || r.includes("blockchain")) return "THE DEGEN BUILDER";
  return "THE MAKER";
};

export default function BuilderPreview({ imageUrl, onReset }: BuilderPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [isGenerated, setIsGenerated] = useState(false);

  const generate = () => {
    if (!name.trim() || !role.trim()) {
      setError("Please fill in both your Name and Stack / Role.");
      return;
    }
    setError(null);
    setIsGenerated(true);
  };

  useEffect(() => {
    async function doGenerate() {
      if (!isGenerated || !canvasRef.current) return;
      
      setIsRendering(true);
      setError(null);
      
      try {
        const title = generateBuilderTitle(role);
        const finalBlob = await renderBuilderID(canvasRef.current, imageUrl, name, role, title, "/branding/logo.png");
        setBlob(finalBlob);
      } catch (err: any) {
        setError("Failed to generate Builder ID.");
        console.error(err);
      } finally {
        setIsRendering(false);
      }
    }

    if (isGenerated) {
      doGenerate();
    }
  }, [isGenerated, imageUrl, name, role]);

  const handleDownload = () => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "HH-Goa-2026-Builder-ID.png";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (!blob) return;

    const file = new File([blob], "HH-Goa-2026-Builder-ID.png", { type: "image/png" });
    const shareData = {
      title: "HH Goa 2026 Builder ID",
      text: "Built my HH Goa 2026 builder card. #FrameInGoa",
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
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent("Built my HH Goa 2026 builder card. #FrameInGoa")}`;
      window.open(twitterUrl, "_blank");
      alert("Image downloaded! You can now attach it to your post on X.");
    }
  };

  // When switching formats, if not generated yet, don't show canvas
  return (
    <div className="w-full flex flex-col items-center gap-6">
      {!isGenerated ? (
        <div className="w-full max-w-md bg-surface p-6 brutal-border brutal-shadow-yellow space-y-6">
          <h3 className="font-serif text-2xl font-bold text-primary mb-2">Builder Details</h3>
          
          <div className="space-y-2">
            <label className="font-mono text-sm uppercase font-bold text-on-surface">Name</label>
            <input 
              type="text" 
              maxLength={25}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Adith K P"
              className="w-full bg-white text-black p-3 brutal-border font-sans font-bold placeholder:font-normal placeholder:opacity-50 focus:outline-none focus:ring-4 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="font-mono text-sm uppercase font-bold text-on-surface">Stack / Role (Max 40 chars)</label>
            <input 
              type="text" 
              maxLength={40}
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. AI / Full Stack"
              className="w-full bg-white text-black p-3 brutal-border font-sans font-bold placeholder:font-normal placeholder:opacity-50 focus:outline-none focus:ring-4 focus:ring-primary"
            />
          </div>

          {error && <p className="text-secondary font-bold text-sm bg-black p-2">{error}</p>}

          <button 
            onClick={generate}
            className="w-full bg-primary text-black py-4 font-sans font-bold uppercase tracking-widest brutal-border brutal-shadow-pink hover:-translate-y-1 hover:-translate-x-1 hover:bg-secondary hover:text-white active:translate-y-0 active:translate-x-0 active:shadow-none transition-all"
          >
            Generate Builder ID
          </button>
        </div>
      ) : (
        <>
          <div className="relative w-full max-w-sm aspect-[4/5] bg-surface brutal-border p-2 brutal-shadow-yellow">
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

          <div className="flex flex-col sm:flex-row flex-wrap gap-4 w-full">
            <button 
              onClick={onReset}
              className="flex items-center justify-center gap-2 bg-surface text-on-surface px-6 py-4 font-sans font-bold uppercase tracking-wider brutal-border hover:bg-[#1a854d] transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              Start Over
            </button>
            <button 
              onClick={() => setIsGenerated(false)}
              className="flex items-center justify-center gap-2 bg-white text-black px-6 py-4 font-sans font-bold uppercase tracking-wider brutal-border hover:bg-gray-200 transition-colors"
            >
              Edit
            </button>
            <button 
              onClick={handleDownload}
              disabled={isRendering || !blob}
              className="flex items-center justify-center gap-2 bg-white text-black px-6 py-4 font-sans font-bold uppercase tracking-wider brutal-border hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-5 h-5" />
              Download
            </button>
            <button 
              onClick={handleShare}
              disabled={isRendering || !blob}
              className="flex-1 flex items-center justify-center gap-2 bg-primary text-black px-6 py-4 font-sans font-bold uppercase tracking-wider brutal-border brutal-shadow-pink hover:-translate-y-1 hover:-translate-x-1 active:translate-y-0 active:translate-x-0 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Share2 className="w-5 h-5" />
              Share
            </button>
          </div>
        </>
      )}
    </div>
  );
}
