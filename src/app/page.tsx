"use client";

import { useState, useEffect } from "react";
import ImageUploader from "@/components/ImageUploader";
import PFPPreview from "@/components/PFPPreview";
import BuilderPreview from "@/components/BuilderPreview";
import IdentityPackPreview from "@/components/IdentityPackPreview";
import BoardingPassPreview from "@/components/BoardingPassPreview";
import AIFrameLab from "@/components/AIFrameLab";
import StyleSelector from "@/components/StyleSelector";
import PhotoControls from "@/components/PhotoControls";
import HistorySidebar from "@/components/HistorySidebar";
import { getRandomPFPConfig, getRandomBuilderConfig } from "@/lib/randomizer";
import { generateBuilderTitle } from "@/lib/builderLogic";
import { PFPConfig, BuilderConfig, HistoryItem, PFPRingColor } from "@/lib/types";
import { BoardingPassConfig } from "@/lib/templates/boarding-pass";
import { Loader2, Shuffle, ArrowRight, Home as HomeIcon } from "lucide-react";

type Format = "PFP" | "BUILDER" | "PASS" | "PACK";
type AppState = "LANDING" | "UPLOAD" | "EDITOR";

const RING_COLORS: PFPRingColor[] = ["YELLOW", "GREEN", "PINK", "WHITE", "BLACK"];

export default function Home() {
  const [appState, setAppState] = useState<AppState>("LANDING");
  const [activeFormat, setActiveFormat] = useState<Format>("PFP");
  
  // Shared state
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [builderTitle, setBuilderTitle] = useState("THE MAKER");
  const [titleSeed, setTitleSeed] = useState(0);
  
  // Editor state (Photo)
  const [scale, setScale] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);

  // Config State
  const [pfpConfig, setPfpConfig] = useState<PFPConfig>({ style: "CORE", ringColor: "YELLOW", ringWeight: 10, look: "AS_SHOT" });
  const [builderConfig, setBuilderConfig] = useState<BuilderConfig>({ template: "IDENTITY", look: "AS_SHOT" });
  const [passConfig, setPassConfig] = useState<BoardingPassConfig>({ look: "AS_SHOT" });
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Update Title on Role change
  useEffect(() => {
    if (activeFormat === "BUILDER" && role.trim().length > 0) {
      setBuilderTitle(generateBuilderTitle(role, titleSeed));
    }
  }, [role, titleSeed, activeFormat]);

  const handleImageReady = (url: string, uploadedFile: File) => {
    setImageUrl(url);
    setFile(uploadedFile);
    setAppState("EDITOR");
  };

  const handleStartOver = () => {
    setAppState("LANDING");
    setImageUrl(null);
    setFile(null);
    setName("");
    setRole("");
    setScale(1);
    setPanX(0);
    setPanY(0);
    setPfpConfig({ style: "CORE", ringColor: "YELLOW", ringWeight: 10, look: "AS_SHOT" });
    setBuilderConfig({ template: "IDENTITY", look: "AS_SHOT" });
  };

  const handleFormatSelect = (format: Format) => {
    setActiveFormat(format);
    if (imageUrl) {
      setAppState("EDITOR");
    } else {
      setAppState("UPLOAD");
    }
  };

  const handleSurpriseMe = () => {
    if (activeFormat === "PFP") {
      setPfpConfig(getRandomPFPConfig(pfpConfig));
    } else {
      setBuilderConfig(getRandomBuilderConfig(builderConfig));
      setTitleSeed(s => s + 1);
    }
  };

  const handleThumbnailRendered = (dataUrl: string) => {
    // Save to history when a thumbnail is rendered
    setHistory(prev => {
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        format: activeFormat,
        pfpConfig: activeFormat === "PFP" ? { ...pfpConfig } : undefined,
        builderConfig: activeFormat === "BUILDER" ? { ...builderConfig } : undefined,
        title: activeFormat === "BUILDER" ? builderTitle : undefined,
        thumbnail: dataUrl
      };
      
      // Avoid immediate duplicates in history
      const last = prev[0];
      if (last && last.thumbnail === dataUrl) return prev;
      
      return [newItem, ...prev].slice(0, 8); // keep last 8
    });
  };

  const applyHistoryItem = (item: HistoryItem) => {
    setActiveFormat(item.format);
    if (item.format === "PFP" && item.pfpConfig) setPfpConfig(item.pfpConfig);
    if (item.format === "BUILDER" && item.builderConfig) {
      setBuilderConfig(item.builderConfig);
      if (item.title) setBuilderTitle(item.title);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-12 bg-background text-on-surface">
      <div className="w-full max-w-6xl flex flex-col gap-8 mt-4">
        
        {/* Header - Only visible on Landing/Upload */}
        {appState !== "EDITOR" && (
          <div className="flex flex-col items-center w-max max-w-full mx-auto mb-4 cursor-pointer" onClick={() => setAppState("LANDING")}>
            <div className="relative text-center w-full flex justify-center items-center pt-8 pb-4">
              <h1 className="font-bodoni text-[11vw] md:text-[120px] font-bold text-primary tracking-tighter leading-none whitespace-nowrap drop-shadow-[5px_0px_0_rgba(0,0,0,1)]" style={{ transform: "scaleY(1.4)" }}>
                HACKER<span className="opacity-0 px-0 md:px-1"> </span>HOUSE
              </h1>
              <div className="absolute left-1/2 top-1/2 animate-oscillate z-10">
                <span className="font-hindi text-primary text-2xl md:text-6xl tracking-wider pt-2 goa-stroke">
                  गोवा
                </span>
              </div>
            </div>
            <div className="flex justify-between w-full text-primary font-space text-[9px] md:text-sm uppercase font-bold tracking-widest mt-4 md:mt-8 px-1">
              <span className="text-left">GOA, INDIA &bull; 28 - 31 OCT 2026</span>
              <span className="text-right">2:47 PM STUDIO</span>
            </div>
          </div>
        )}

        {/* Dynamic Content */}
        <div className="w-full">
          {appState === "LANDING" && (
            <div className="flex flex-col items-center gap-12 text-center max-w-2xl mx-auto mt-8">
              <div className="space-y-4">
                <h2 className="font-serif text-4xl font-bold text-primary">IDENTITY STUDIO</h2>
                <p className="font-sans text-xl font-bold opacity-90 text-on-surface">Create your official HH Goa 2026 PFP or Builder Identity.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-8 w-full justify-center">
                <button onClick={() => handleFormatSelect("PFP")} className="group flex-1 flex flex-col items-center p-8 bg-black/20 backdrop-blur-xl rounded-[2rem] border border-white/10 hover:border-white/30 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(243,231,0,0.3)] transition-all text-left">
                  <div className="w-32 h-32 rounded-full border-4 border-white/20 group-hover:border-primary group-hover:shadow-[0_0_20px_rgba(243,231,0,0.4)] bg-black/40 mb-6 flex items-center justify-center overflow-hidden transition-all"><span className="font-sans font-bold text-primary tracking-widest">PFP</span></div>
                  <h4 className="font-sans font-bold text-2xl text-white uppercase w-full text-center tracking-widest">PFP FRAME</h4>
                  <p className="font-mono text-sm text-white/50 mt-2 text-center">Your X profile picture</p>
                </button>
                <button onClick={() => handleFormatSelect("BUILDER")} className="group flex-1 flex flex-col items-center p-8 bg-black/20 backdrop-blur-xl rounded-[2rem] border border-white/10 hover:border-white/30 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(255,0,127,0.3)] transition-all text-left">
                  <div className="w-24 h-32 border border-white/20 group-hover:border-secondary group-hover:shadow-[0_0_20px_rgba(255,0,127,0.4)] bg-black/40 mb-6 flex flex-col items-center justify-start p-3 rounded-xl transition-all">
                    <div className="w-full h-12 bg-white/10 rounded mb-3"></div>
                    <div className="w-full h-2 bg-white/20 rounded mb-2"></div>
                    <div className="w-1/2 h-2 bg-white/20 rounded self-start"></div>
                  </div>
                  <h4 className="font-sans font-bold text-2xl text-white uppercase w-full text-center tracking-widest">BUILDER ID</h4>
                  <p className="font-mono text-sm text-white/50 mt-2 text-center">Your HH Goa digital identity</p>
                </button>
              </div>
              <div className="flex flex-col sm:flex-row gap-8 w-full justify-center">
                <button onClick={() => handleFormatSelect("PASS")} className="group flex-1 flex flex-col items-center p-8 bg-black/20 backdrop-blur-xl rounded-[2rem] border border-white/10 hover:border-white/30 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(255,240,0,0.3)] transition-all text-left">
                  <div className="w-24 h-32 border border-white/20 group-hover:border-primary group-hover:shadow-[0_0_20px_rgba(255,240,0,0.4)] bg-black/40 mb-6 flex flex-col items-center justify-start p-3 rounded-xl transition-all">
                    <div className="w-full h-8 bg-primary rounded mb-3"></div>
                    <div className="w-full h-2 bg-white/20 rounded mb-2"></div>
                    <div className="w-1/2 h-2 bg-white/20 rounded self-start"></div>
                  </div>
                  <h4 className="font-sans font-bold text-2xl text-white uppercase w-full text-center tracking-widest">BOARDING PASS</h4>
                  <p className="font-mono text-sm text-white/50 mt-2 text-center">Your event entry pass</p>
                </button>
                <button onClick={() => handleFormatSelect("PACK")} className="group flex-1 flex flex-col items-center p-8 bg-black/20 backdrop-blur-xl rounded-[2rem] border border-primary hover:border-primary hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(255,240,0,0.3)] transition-all text-left">
                  <div className="w-24 h-32 border border-primary/50 group-hover:border-primary group-hover:shadow-[0_0_20px_rgba(255,240,0,0.4)] bg-primary/10 mb-6 flex items-center justify-center p-3 rounded-xl transition-all relative">
                    <div className="w-10 h-14 bg-white/20 absolute -left-2 top-4 rotate-[-15deg] rounded"></div>
                    <div className="w-10 h-14 bg-white/20 absolute -right-2 top-4 rotate-[15deg] rounded"></div>
                    <div className="w-14 h-20 bg-primary rounded z-10 border border-black shadow-lg"></div>
                  </div>
                  <h4 className="font-sans font-bold text-2xl text-primary uppercase w-full text-center tracking-widest">IDENTITY PACK</h4>
                  <p className="font-mono text-sm text-primary/70 mt-2 text-center">Get all three at once</p>
                </button>
              </div>
            </div>
          )}

          {appState === "UPLOAD" && (
            <div className="flex flex-col items-center gap-8 max-w-2xl mx-auto">
              <div className="w-full flex justify-between items-center mb-4">
                <button onClick={() => setAppState("LANDING")} className="font-mono text-sm uppercase font-bold hover:text-primary transition-colors flex gap-2 items-center">&larr; Back to formats</button>
                <div className="font-sans font-bold text-primary uppercase border-2 border-primary px-3 py-1 text-sm">{activeFormat === "PFP" ? "PFP FRAME" : activeFormat === "BUILDER" ? "BUILDER ID" : activeFormat === "PASS" ? "BOARDING PASS" : "IDENTITY PACK"}</div>
              </div>
              <ImageUploader onImageReady={handleImageReady} currentImageUrl={imageUrl} />
            </div>
          )}

          {appState === "EDITOR" && imageUrl && (
            <div className="w-full flex flex-col gap-6">
              
              {/* Navbar */}
              <div className="w-full flex justify-between items-center bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-4 px-6 shadow-lg mb-2 sticky top-4 z-50">
                <div className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity" onClick={handleStartOver}>
                  <div className="font-bodoni font-bold text-primary text-2xl tracking-tighter leading-none" style={{ transform: "scaleY(1.2)" }}>HH GOA</div>
                  <div className="hidden md:block w-px h-6 bg-white/20"></div>
                  <div className="hidden md:block font-space text-[10px] uppercase text-white/50 tracking-widest">Identity Studio</div>
                </div>
                <button onClick={handleStartOver} className="flex gap-2 items-center bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-xl text-white font-sans text-sm font-bold tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                  <HomeIcon className="w-4 h-4" /> <span className="hidden sm:inline">Home</span>
                </button>
              </div>

              <div className="w-full flex flex-col lg:flex-row gap-10 items-start">
              
              {/* LEFT: Live Preview (Only if not PACK) */}
              {activeFormat !== "PACK" && (
                <div className="w-full lg:w-[45%] flex flex-col items-center justify-center bg-black/10 backdrop-blur-xl p-4 lg:p-8 rounded-[2rem] border border-white/10 relative lg:sticky lg:top-8 shadow-2xl">
                   {activeFormat === "PFP" && (
                     <PFPPreview 
                       imageUrl={imageUrl} 
                       onReset={handleStartOver} 
                       scale={scale} panX={panX} panY={panY} 
                       config={pfpConfig} 
                       showActions={true} 
                       onRemix={handleSurpriseMe}
                       onThumbnailRendered={handleThumbnailRendered}
                     />
                   )}
                   {activeFormat === "BUILDER" && (
                     <BuilderPreview 
                       imageUrl={imageUrl} 
                       onReset={handleStartOver} 
                       name={name} role={role} title={builderTitle}
                       scale={scale} panX={panX} panY={panY} 
                       config={builderConfig} 
                       showActions={true}
                       onRemix={handleSurpriseMe}
                       onThumbnailRendered={handleThumbnailRendered}
                     />
                   )}
                   {activeFormat === "PASS" && (
                     <BoardingPassPreview 
                       imageUrl={imageUrl} 
                       onReset={handleStartOver} 
                       name={name} role={role} title={builderTitle} builderNumber="HHG / 024"
                       scale={scale} panX={panX} panY={panY} 
                       config={passConfig} 
                       showActions={true}
                     />
                   )}
                </div>
              )}
              
              {activeFormat === "PACK" && (
                <div className="w-full flex flex-col items-center justify-center p-4">
                  <IdentityPackPreview 
                     imageUrl={imageUrl} 
                     name={name} role={role} title={builderTitle} builderNumber="HHG / 024"
                     scale={scale} panX={panX} panY={panY} 
                     pfpConfig={pfpConfig} 
                     builderConfig={builderConfig} 
                     passConfig={passConfig}
                     onReset={handleStartOver} 
                     onEdit={() => setActiveFormat("PFP")}
                  />
                </div>
              )}

              {/* RIGHT: Editor Controls */}
              {activeFormat !== "PACK" && (
                <div className="w-full lg:w-[55%] flex flex-col gap-8 bg-black/20 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-[8px_8px_0_0_#000000] p-6 md:p-10 h-fit">
                <div className="flex justify-between items-center border-b border-white/10 pb-6">
                  <h3 className="font-sans text-2xl font-bold text-white tracking-widest">STUDIO CONTROLS</h3>
                  <button onClick={handleSurpriseMe} className="flex gap-2 items-center bg-primary text-black px-5 py-2.5 rounded-full font-bold font-sans uppercase shadow-[4px_4px_0_0_#000000] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000000] transition-all">
                    <Shuffle className="w-4 h-4" /> Surprise Me
                  </button>
                </div>

                {activeFormat !== "PASS" && (
                  <StyleSelector 
                    type={activeFormat as "PFP" | "BUILDER"} 
                    activeStyle={activeFormat === "PFP" ? pfpConfig.style : builderConfig.template}
                    onSelect={(s) => activeFormat === "PFP" ? setPfpConfig({ ...pfpConfig, style: s as any }) : setBuilderConfig({ ...builderConfig, template: s as any })} 
                  />
                )}

                {/* Builder Form */}
                {activeFormat === "BUILDER" && (
                  <div className="space-y-6 pt-4 border-t border-white/10">
                    <h4 className="font-mono text-sm uppercase font-bold text-primary tracking-widest">Personal Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="font-sans font-bold text-sm uppercase text-white/70">Your Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} maxLength={25} className="bg-white/5 border border-white/20 rounded-xl p-4 font-sans text-lg font-bold text-white placeholder:text-white/30 focus:outline-none focus:border-primary focus:bg-white/10 transition-colors" placeholder="JOHN DOE" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="font-sans font-bold text-sm uppercase text-white/70">Role / Stack</label>
                        <input type="text" value={role} onChange={(e) => setRole(e.target.value)} maxLength={35} className="bg-white/5 border border-white/20 rounded-xl p-4 font-sans text-lg font-bold text-white placeholder:text-white/30 focus:outline-none focus:border-primary focus:bg-white/10 transition-colors" placeholder="FULLSTACK DEV" />
                      </div>
                    </div>
                    {role.trim() && (
                      <div className="flex justify-between items-center p-4 bg-primary/10 rounded-xl border border-primary/20">
                        <div className="flex flex-col">
                          <span className="font-mono text-[10px] text-white/50 uppercase">Generated Title</span>
                          <span className="font-sans font-bold text-primary text-lg">{builderTitle}</span>
                        </div>
                        <button onClick={() => setTitleSeed(s => s + 1)} className="text-white hover:text-primary p-2 bg-black/20 rounded-full transition-colors"><Shuffle className="w-4 h-4" /></button>
                      </div>
                    )}
                  </div>
                )}

                {/* PFP Customization */}
                {activeFormat === "PFP" && (
                  <div className="space-y-6 pt-4 border-t border-white/10">
                    <h4 className="font-mono text-sm uppercase font-bold text-primary tracking-widest">Ring Customization</h4>
                    <div className="flex flex-col gap-3">
                      <label className="font-sans font-bold text-sm uppercase text-white/70">Ring Color</label>
                      <div className="flex gap-4">
                        {RING_COLORS.map(c => (
                          <button key={c} onClick={() => setPfpConfig({ ...pfpConfig, ringColor: c })}
                            className={`w-12 h-12 rounded-full border-4 transition-transform ${pfpConfig.ringColor === c ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`}
                            style={{ backgroundColor: c === "YELLOW" ? "#f3e700" : c === "GREEN" ? "#006838" : c === "PINK" ? "#ff007f" : c === "WHITE" ? "#ffffff" : "#000000" }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 pt-2">
                      <label className="font-sans font-bold text-sm uppercase text-white/70">Ring Weight</label>
                      <input type="range" min="0" max="24" step="2" value={pfpConfig.ringWeight} onChange={(e) => setPfpConfig({ ...pfpConfig, ringWeight: parseInt(e.target.value) })} className="w-full accent-primary h-2 bg-white/20 rounded-lg appearance-none cursor-pointer" />
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-white/10">
                  <h4 className="font-mono text-sm uppercase font-bold text-primary tracking-widest mb-6">Photo Tweaks</h4>
                  <PhotoControls 
                    scale={scale} setScale={setScale} 
                    panX={panX} setPanX={setPanX} 
                    panY={panY} setPanY={setPanY} 
                    look={activeFormat === "PFP" ? pfpConfig.look : builderConfig.look}
                    setLook={(l) => activeFormat === "PFP" ? setPfpConfig({ ...pfpConfig, look: l }) : setBuilderConfig({ ...builderConfig, look: l })}
                  />
                </div>
                
                <AIFrameLab 
                  isGenerating={isGeneratingAi}
                  setIsGenerating={setIsGeneratingAi}
                  onGenerate={(url) => {
                    setPfpConfig({...pfpConfig, aiOverlayUrl: url || undefined});
                    setBuilderConfig({...builderConfig, aiOverlayUrl: url || undefined});
                    setPassConfig({...passConfig, aiOverlayUrl: url || undefined});
                  }}
                />

                <div className="pt-4 border-t border-white/10 flex flex-col items-center">
                  <p className="font-mono text-sm uppercase text-white/50 mb-4">Want the full set?</p>
                  <button onClick={() => handleFormatSelect("PACK")} className="px-6 py-4 bg-transparent border border-primary text-primary font-bold font-sans uppercase tracking-widest hover:bg-primary hover:text-black transition-colors rounded-xl w-full">
                    Create Identity Pack
                  </button>
                </div>
              </div>
            )}
            </div>
          </div>
        )}

          {appState === "EDITOR" && (
             <div className="w-full mt-12 bg-black/10 backdrop-blur-lg rounded-[2rem] border border-white/10 p-6 shadow-xl">
               <HistorySidebar history={history} onSelect={applyHistoryItem} />
             </div>
          )}

        </div>
      </div>
    </main>
  );
}
