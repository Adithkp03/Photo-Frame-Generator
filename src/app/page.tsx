"use client";

import { useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import PFPPreview from "@/components/PFPPreview";
import BuilderPreview from "@/components/BuilderPreview";

export default function Home() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [activeFormat, setActiveFormat] = useState<"A" | "B">("A");

  const handleImageReady = (url: string, uploadedFile: File) => {
    setImageUrl(url);
    setFile(uploadedFile);
  };

  const handleReset = () => {
    setImageUrl(null);
    setFile(null);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-12 bg-background text-on-surface">
      <div className="w-full max-w-4xl flex flex-col gap-12 mt-8">
        
        {/* Header */}
        <div className="flex flex-col items-center w-full mb-4">
          <div className="relative text-center w-full flex justify-center items-center py-8">
            <h1 className="font-bodoni text-[10vw] md:text-[120px] font-bold text-primary tracking-tighter leading-none whitespace-nowrap drop-shadow-[5px_0px_0_rgba(0,0,0,1)]" style={{ transform: "scaleY(1.4) scaleX(0.95)" }}>
              HACKER<span className="opacity-0 px-0 md:px-1"> </span>HOUSE
            </h1>
            <div className="absolute left-1/2 top-1/2 animate-oscillate z-7">
              <span className="font-hindi text-primary text-2xl md:text-6xl tracking-wider pt-2" style={{ WebkitTextStroke: "6px var(--color-secondary)", paintOrder: "stroke fill" }}>
                गोवा
              </span>
            </div>
          </div>
          <div className="flex justify-between w-full text-primary font-space text-xs md:text-sm px-2 uppercase font-bold tracking-widest mt-4">
            <span>GOA, INDIA &bull; 28 - 31 OCT 2026</span>
            <span>2:47 PM STUDIO</span>
          </div>
        </div>

        <div className="flex justify-center w-full mb-8">
          <div className="px-4 py-2 bg-tertiary text-black brutal-border brutal-shadow-pink font-sans font-bold uppercase text-sm">
            Ready to Launch 🚀
          </div>
        </div>

        {/* Upload Section */}
        <div className="w-full max-w-2xl mx-auto flex flex-col gap-8">
          <div className="text-center space-y-4">
            <h2 className="font-serif text-3xl font-bold text-primary">Create Your Event Identity</h2>
            <p className="font-sans text-lg opacity-90 text-on-surface">Upload your photo to start. Supported formats: JPG, PNG, HEIC.</p>
          </div>

          <div className="w-full">
            <ImageUploader onImageReady={handleImageReady} currentImageUrl={imageUrl} />
          </div>

          {/* Generated Previews */}
          {imageUrl && (
            <div className="w-full mt-8 flex flex-col items-center gap-6">
              <div className="w-full flex items-center justify-center gap-4 border-b-4 border-black pb-4">
                <button 
                  onClick={() => setActiveFormat("A")}
                  className={`px-6 py-2 font-sans font-bold uppercase brutal-border transition-all ${activeFormat === "A" ? "bg-primary text-black brutal-shadow-pink hover:-translate-y-1 active:translate-y-0 active:translate-x-0 active:shadow-none" : "bg-surface text-on-surface hover:bg-[#1a854d]"}`}
                >
                  Format A: PFP
                </button>
                <button 
                  onClick={() => setActiveFormat("B")}
                  className={`px-6 py-2 font-sans font-bold uppercase brutal-border transition-all ${activeFormat === "B" ? "bg-primary text-black brutal-shadow-pink hover:-translate-y-1 active:translate-y-0 active:translate-x-0 active:shadow-none" : "bg-surface text-on-surface hover:bg-[#1a854d]"}`}
                >
                  Format B: Builder ID
                </button>
              </div>
              
              {activeFormat === "A" ? (
                <PFPPreview imageUrl={imageUrl} onReset={handleReset} />
              ) : (
                <BuilderPreview imageUrl={imageUrl} onReset={handleReset} />
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
