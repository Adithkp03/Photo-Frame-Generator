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
        className={`group relative w-full aspect-square md:aspect-video rounded-[2rem] border border-white/20 flex flex-col items-center justify-center p-8 text-center transition-all cursor-pointer overflow-hidden shadow-2xl ${
          isDragging 
            ? "bg-white/20 backdrop-blur-xl text-white border-primary shadow-[0_0_40px_rgba(243,231,0,0.3)] scale-[1.02]" 
            : "bg-black/10 backdrop-blur-xl text-white hover:bg-black/20 hover:border-white/40"
        }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
      >
        
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={(e) => { if (e.target.files && e.target.files.length > 0) processFile(e.target.files[0]); }}
          accept="image/jpeg,image/png,image/heic,image/heif,.jpg,.jpeg,.png,.heic,.heif"
          className="hidden"
        />

        {isProcessing ? (
          <div className="flex flex-col items-center gap-4 z-10">
            <div className="bg-white/10 text-primary p-5 rounded-full border border-white/20 shadow-[0_0_30px_rgba(243,231,0,0.2)] animate-pulse">
              <Loader2 className="w-10 h-10 animate-spin" />
            </div>
            <p className="font-sans font-bold text-xl text-white uppercase tracking-widest">Processing...</p>
          </div>
        ) : currentImageUrl ? (
          <>
            <img src={currentImageUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-500" />
            <div className="relative z-10 bg-black/40 backdrop-blur-xl text-white px-6 py-4 rounded-2xl border border-white/20 shadow-xl flex items-center gap-3 group-hover:-translate-y-2 group-hover:bg-black/60 group-hover:border-white/40 group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all">
              <ImageIcon className="w-6 h-6 text-primary" />
              <span className="font-sans font-bold uppercase tracking-widest text-sm text-primary">Change Photo</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-6 z-10">
            <div className="bg-white/5 text-primary p-6 rounded-full border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)] group-hover:shadow-[0_0_40px_rgba(243,231,0,0.2)] group-hover:border-primary/40 group-hover:-translate-y-2 group-hover:scale-110 transition-all duration-500">
              <Upload className="w-10 h-10" />
            </div>
            <div>
              <h3 className="font-sans text-2xl font-bold mb-2 text-white tracking-widest">UPLOAD PHOTO</h3>
              <p className="font-mono text-sm uppercase text-white/50 tracking-wider">JPG, PNG, HEIC (Max 20MB)</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-500/20 backdrop-blur-md text-red-100 p-4 rounded-xl border border-red-500/30 font-sans font-bold flex items-start justify-between gap-3 shadow-lg">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
