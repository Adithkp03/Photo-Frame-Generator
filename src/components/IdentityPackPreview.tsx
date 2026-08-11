import { useEffect, useRef, useState } from "react";
import PFPPreview from './PFPPreview';
import BuilderPreview from './BuilderPreview';
import BoardingPassPreview from './BoardingPassPreview';
import { PFPConfig, BuilderConfig, BoardingPassConfig } from '../lib/types';
import { renderPFP } from '../lib/templates/pfp';
import { renderBuilderID } from '../lib/templates/builder';
import { renderBoardingPass } from '../lib/templates/boarding-pass';
import { Loader2, Share2, Download, RotateCcw } from 'lucide-react';

interface Props {
  imageUrl: string;
  name: string;
  role: string;
  title: string;
  builderNumber: string;
  scale: number;
  panX: number;
  panY: number;
  pfpConfig: PFPConfig;
  builderConfig: BuilderConfig;
  passConfig: BoardingPassConfig;
  onReset: () => void;
  onEdit: () => void;
}

const blobToBase64 = (b: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(b);
  });
};

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const i = new Image();
    i.crossOrigin = "anonymous";
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = src;
  });
};

export default function IdentityPackPreview(props: Props) {
  const [isSharing, setIsSharing] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);

  const [pfpBlob, setPfpBlob] = useState<Blob | null>(null);
  const [builderBlob, setBuilderBlob] = useState<Blob | null>(null);
  const [passBlob, setPassBlob] = useState<Blob | null>(null);

  // Hidden canvases for generating the actual blobs in parallel
  const pfpCanvas = useRef<HTMLCanvasElement>(null);
  const builderCanvas = useRef<HTMLCanvasElement>(null);
  const passCanvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const generateAll = async () => {
      if (pfpCanvas.current && builderCanvas.current && passCanvas.current) {
        try {
          const [p, b, pb] = await Promise.all([
            renderPFP(pfpCanvas.current, props.imageUrl, '/branding/logo.png', props.scale, props.panX, props.panY, props.pfpConfig),
            renderBuilderID(builderCanvas.current, props.imageUrl, "/branding/logo.png", props.name, props.role, props.title, props.scale, props.panX, props.panY, props.builderConfig),
            renderBoardingPass(passCanvas.current, props.imageUrl, "/branding/logo.png", props.name, props.role, props.scale, props.panX, props.panY, props.passConfig)
          ]);
          setPfpBlob(p);
          setBuilderBlob(b);
          setPassBlob(pb);
        } catch (err) {
          console.error("Pack generation error", err);
        }
      }
    };
    generateAll();
  }, [props]);

  const handleDownloadAll = () => {
    if (!pfpBlob || !builderBlob || !passBlob) return;
    
    // Sequential download to avoid browser blocking multiple popups
    const blobs = [
      { b: pfpBlob, n: "PFP.png" },
      { b: builderBlob, n: "Builder.png" },
      { b: passBlob, n: "Pass.png" }
    ];
    
    blobs.forEach((item, idx) => {
      setTimeout(() => {
        const url = URL.createObjectURL(item.b);
        const a = document.createElement("a");
        a.href = url;
        a.download = `HH-Goa-${props.name || "Identity"}-${item.n}`;
        a.click();
        URL.revokeObjectURL(url);
      }, idx * 500); // 500ms delay between downloads
    });
  };

  const handleSharePack = async () => {
    if (!pfpBlob || !builderBlob || !passBlob) return;
    setIsSharing(true);
    setShareError(null);

    try {
      // Create Composite Image for OG
      const compCanvas = document.createElement('canvas');
      compCanvas.width = 1200;
      compCanvas.height = 630;
      const ctx = compCanvas.getContext('2d')!;

      // Background
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, 1200, 630);
      
      ctx.fillStyle = '#111';
      for(let i=0; i<1200; i+=60) {
        ctx.fillRect(i, 0, 1, 630);
      }

      const pfpUrl = URL.createObjectURL(pfpBlob);
      const builderUrl = URL.createObjectURL(builderBlob);
      const passUrl = URL.createObjectURL(passBlob);

      const [pfpImg, builderImg, passImg] = await Promise.all([
        loadImage(pfpUrl), loadImage(builderUrl), loadImage(passUrl)
      ]);

      // Draw PFP (1080x1080 -> 400x400)
      ctx.drawImage(pfpImg, 50, 115, 400, 400);
      // Draw Builder (1080x1620 -> 333x500)
      ctx.drawImage(builderImg, 480, 65, 333, 500);
      // Draw Pass (1080x1350 -> 320x400)
      ctx.drawImage(passImg, 840, 115, 320, 400);

      ctx.fillStyle = '#FFF000';
      ctx.font = 'bold 32px sans-serif';
      ctx.fillText('HH GOA 2026 IDENTITY PACK', 50, 60);

      const compBlob = await new Promise<Blob>((resolve) => compCanvas.toBlob(b => resolve(b!), 'image/png'));
      const base64Image = await blobToBase64(compBlob);

      const response = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64Image,
          format: 'PACK',
          metadata: { name: props.name, role: props.role, title: props.title }
        }),
      });
      
      if (!response.ok) throw new Error('Share failed');
      const data = await response.json();
      
      const appUrl = window.location.origin;
      const shareUrl = `${appUrl}/share/${data.id}`;
      
      const text = encodeURIComponent(`I'm going to Hacker House Goa 2026.\n\nHere is my Identity Pack.\n#FrameInGoa\n\n`);
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`, "_blank", "noopener,noreferrer");
      
    } catch (e) {
      console.error(e);
      setShareError("Failed to create Identity Pack share link.");
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full items-center">
      
      {/* Hidden canvases for rendering the blobs for the composite */}
      <div className="hidden">
        <canvas ref={pfpCanvas} />
        <canvas ref={builderCanvas} />
        <canvas ref={passCanvas} />
      </div>

      <div className="flex flex-col md:flex-row gap-6 w-full justify-center items-center md:items-start max-w-6xl mx-auto px-4">
        <div className="w-full max-w-sm">
           <p className="font-mono text-primary font-bold uppercase tracking-widest text-sm text-center mb-4">PFP / X IDENTITY</p>
           <PFPPreview {...props} config={props.pfpConfig} showActions={false} />
        </div>
        <div className="w-full max-w-sm">
           <p className="font-mono text-primary font-bold uppercase tracking-widest text-sm text-center mb-4">BUILDER IDENTITY</p>
           <BuilderPreview {...props} config={props.builderConfig} showActions={false} />
        </div>
        <div className="w-full max-w-sm">
           <p className="font-mono text-primary font-bold uppercase tracking-widest text-sm text-center mb-4">BOARDING PASS</p>
           <BoardingPassPreview {...props} config={props.passConfig} showActions={false} />
        </div>
      </div>

      {shareError && (
        <div className="text-secondary bg-black/50 p-2 rounded font-bold font-mono text-sm border border-secondary/20">{shareError}</div>
      )}

      <div className="flex flex-col sm:flex-row flex-wrap gap-4 w-full justify-center mt-4">
        <button 
          onClick={props.onReset}
          className="flex-1 flex items-center justify-center gap-2 bg-white/10 text-white px-6 py-4 rounded-xl border border-white/20 font-sans font-bold text-sm uppercase tracking-wider hover:bg-white/20 hover:-translate-y-0.5 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Start Over
        </button>
        <button 
          onClick={props.onEdit}
          className="flex-1 flex items-center justify-center gap-2 bg-white/10 text-white px-6 py-4 rounded-xl border border-white/20 font-sans font-bold text-sm uppercase tracking-wider hover:bg-white/20 hover:-translate-y-0.5 transition-all"
        >
          Edit Identity
        </button>
        <button 
          onClick={handleDownloadAll}
          disabled={!pfpBlob || !builderBlob || !passBlob || isSharing}
          className="flex-[1.5] flex items-center justify-center gap-2 bg-white text-black px-6 py-4 rounded-xl border border-white font-sans font-bold text-sm uppercase tracking-wider hover:bg-gray-200 hover:-translate-y-0.5 transition-all disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          Download Pack (3)
        </button>
        <button 
          onClick={handleSharePack}
          disabled={!pfpBlob || !builderBlob || !passBlob || isSharing}
          className="flex-[2] flex items-center justify-center gap-2 bg-primary text-black px-6 py-4 rounded-xl border border-primary font-sans font-bold text-lg uppercase tracking-wider shadow-[0_0_20px_rgba(243,231,0,0.4)] hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(243,231,0,0.6)] transition-all disabled:opacity-50"
        >
          {isSharing ? <><Loader2 className="w-5 h-5 animate-spin" /> Creating Pack...</> : <><Share2 className="w-5 h-5" /> Share Full Pack</>}
        </button>
      </div>
    </div>
  );
}
