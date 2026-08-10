"use client";

import React, { useState, useRef, useCallback } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { convertHeicToPng } from "@/lib/image/heic";

interface ImageUploaderProps {
  onImageReady: (imageUrl: string, file: File) => void;
  currentImageUrl?: string | null;
}

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

export default function ImageUploader({ onImageReady, currentImageUrl }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setError(null);
    if (file.size > MAX_FILE_SIZE) {
      setError("This photo is too large. Please choose a smaller image (under 20MB).");
      return;
    }
    const validTypes = ["image/jpeg", "image/png", "image/heic", "image/heif"];
    const extension = file.name.split(".").pop()?.toLowerCase();
    const isValidExt = ["jpg", "jpeg", "png", "heic", "heif"].includes(extension || "");
    
    if (!validTypes.includes(file.type) && !isValidExt) {
      setError("This image format isn't supported. Try JPG, PNG, or HEIC.");
      return;
    }

    setIsProcessing(true);
    try {
      let finalFile = file;
      if (file.type === "image/heic" || extension === "heic" || extension === "heif") {
        finalFile = await convertHeicToPng(file);
      }
      const imageUrl = URL.createObjectURL(finalFile);
      onImageReady(imageUrl, finalFile);
    } catch (err: any) {
      setError(err.message || "We couldn't read this photo. Try another image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(true);
  }, []);
  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
  }, []);
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) processFile(e.dataTransfer.files[0]);
  }, []);

  return (
    <div className="w-full flex flex-col gap-4">
      <div 
        className={`relative w-full h-72 brutal-border transition-all flex flex-col items-center justify-center p-4 text-center cursor-pointer overflow-hidden
          ${isDragging ? "bg-primary text-black translate-x-1 -translate-y-1 brutal-shadow-yellow" : "bg-surface text-on-surface"}
        `}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
      >
        <div className="absolute inset-2 border-2 border-dashed border-secondary pointer-events-none" />
        
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={(e) => { if (e.target.files && e.target.files.length > 0) processFile(e.target.files[0]); }}
          accept="image/jpeg,image/png,image/heic,image/heif,.jpg,.jpeg,.png,.heic,.heif"
          className="hidden"
        />

        {isProcessing ? (
          <div className="flex flex-col items-center gap-4 z-10">
            <div className="bg-primary text-black p-3 brutal-border animate-pulse">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <p className="font-sans font-bold text-lg text-primary uppercase">Processing...</p>
          </div>
        ) : currentImageUrl ? (
          <>
            <img src={currentImageUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity hover:mix-blend-normal transition-all" />
            <div className="relative z-10 bg-secondary text-black p-3 brutal-border brutal-shadow-yellow flex items-center gap-2 hover:-translate-y-1 hover:-translate-x-1 transition-transform">
              <ImageIcon className="w-5 h-5" />
              <span className="font-sans font-bold uppercase tracking-wider">Change Photo</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 z-10">
            <div className="bg-primary text-black p-4 brutal-border brutal-shadow-pink hover:-translate-y-1 hover:-translate-x-1 transition-transform">
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold mb-1 text-primary">UPLOAD PHOTO</h3>
              <p className="font-mono text-sm uppercase opacity-90 text-on-surface">JPG, PNG, HEIC (Max 20MB)</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-[#ffb4ab] text-[#690005] p-3 brutal-border font-sans font-bold flex items-start justify-between gap-2 shadow-[4px_4px_0px_0px_#93000a]">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="hover:text-black">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
