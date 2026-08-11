import { useState } from 'react';
import { Loader2, Wand2 } from 'lucide-react';

const PRESETS = [
  "Goa Hacker",
  "Underground Rave",
  "Digital Brutalism",
  "Future Goa",
  "Terminal Mode",
  "Editorial Chaos"
];

interface Props {
  onGenerate: (url: string | null) => void;
  isGenerating: boolean;
  setIsGenerating: (v: boolean) => void;
}

export default function AIFrameLab({ onGenerate, isGenerating, setIsGenerating }: Props) {
  const [customPrompt, setCustomPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (prompt: string) => {
    setIsGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      if (!res.ok) throw new Error('Generation failed');
      const data = await res.json();
      if (data.imageUrl) {
        onGenerate(data.imageUrl);
      } else {
        throw new Error('No image returned');
      }
    } catch (err) {
      console.error(err);
      setError("FRAME//LAB couldn't create this variation.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full bg-black/20 p-4 border border-white/10 rounded-2xl flex flex-col gap-4 mt-6">
      <div className="flex items-center gap-2 text-primary font-mono font-bold uppercase tracking-widest text-sm">
        <Wand2 className="w-4 h-4" />
        FRAME//LAB
      </div>
      
      <p className="text-white/70 text-sm font-sans">
        Generate a unique decorative cyber-brutalist layer for your identity.
      </p>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map(preset => (
          <button
            key={preset}
            onClick={() => handleGenerate(preset)}
            disabled={isGenerating}
            className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-white/90 hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            {preset}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input 
          type="text" 
          value={customPrompt}
          onChange={e => setCustomPrompt(e.target.value)}
          placeholder="Describe your vibe..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm font-sans text-white focus:outline-none focus:border-primary"
          disabled={isGenerating}
          onKeyDown={e => {
            if (e.key === 'Enter' && customPrompt.trim()) {
              handleGenerate(customPrompt);
            }
          }}
        />
        <button 
          onClick={() => handleGenerate(customPrompt)}
          disabled={isGenerating || !customPrompt.trim()}
          className="px-4 py-2 bg-primary/20 text-primary border border-primary/50 rounded-xl font-bold font-sans text-sm hover:bg-primary/30 transition-colors disabled:opacity-50"
        >
          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Go"}
        </button>
      </div>

      {error && (
        <div className="text-secondary text-xs font-mono font-bold bg-secondary/10 p-2 rounded">
          {error}
          <button onClick={() => onGenerate(null)} className="ml-2 underline text-white">Use Curated Frame</button>
        </div>
      )}
    </div>
  );
}
