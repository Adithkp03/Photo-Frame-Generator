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

  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-12 bg-background text-on-surface">
      <div className="w-full max-w-4xl flex flex-col gap-12 mt-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img src="/branding/logo.png" alt="HH Goa" className="w-16 h-16 brutal-border object-contain bg-white" />
            <div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary tracking-tighter uppercase leading-none">
                HH GOA 2026
              </h1>
              <p className="font-mono text-secondary uppercase font-bold mt-1 text-sm tracking-widest">
                Identity Generator
              </p>
            </div>
          </div>
          <div className="px-4 py-2 bg-tertiary text-black brutal-border brutal-shadow-pink font-sans font-bold uppercase text-sm">
            Phase 3: Upload Engine
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
                  className={`px-6 py-2 font-sans font-bold uppercase brutal-border transition-transform ${activeFormat === "A" ? "bg-primary text-black brutal-shadow-pink hover:-translate-y-1" : "bg-surface text-on-surface hover:bg-[#1a854d]"}`}
                >
                  Format A: PFP
                </button>
                <button 
                  onClick={() => setActiveFormat("B")}
                  className={`px-6 py-2 font-sans font-bold uppercase brutal-border transition-transform ${activeFormat === "B" ? "bg-primary text-black brutal-shadow-pink hover:-translate-y-1" : "bg-surface text-on-surface hover:bg-[#1a854d]"}`}
                >
                  Format B: Builder ID
                </button>
              </div>
              
              {activeFormat === "A" ? (
                <PFPPreview imageUrl={imageUrl} />
              ) : (
                <BuilderPreview imageUrl={imageUrl} />
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
