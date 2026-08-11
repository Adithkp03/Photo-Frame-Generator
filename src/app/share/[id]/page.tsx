import { Metadata, ResolvingMetadata } from 'next';
import { getShare } from '@/lib/storage';
import { notFound } from 'next/navigation';
import Link from 'next/link';

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const share = await getShare(resolvedParams.id);
  
  if (!share) {
    return { title: 'Not Found' };
  }

  const name = share.metadata?.name || 'A Hacker';
  const title = `${name}'s HH Goa 2026 Identity`;
  const description = 'Created with HH Goa 2026 Identity Studio.';
  
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const imageUrl = `${appUrl}${share.imageUrl}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [imageUrl],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function SharePage({ params }: Props) {
  const resolvedParams = await params;
  const share = await getShare(resolvedParams.id);
  
  if (!share) {
    notFound();
  }
  
  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-12 bg-background text-on-surface">
      <div className="w-full max-w-4xl flex flex-col items-center gap-12 mt-4">
        
        <div className="flex flex-col items-center w-max max-w-full mx-auto">
          <div className="relative text-center w-full flex justify-center items-center pt-8 pb-4">
            <h1 className="font-bodoni text-[11vw] md:text-[80px] font-bold text-primary tracking-tighter leading-none whitespace-nowrap drop-shadow-[5px_0px_0_rgba(0,0,0,1)]" style={{ transform: "scaleY(1.4)" }}>
              HACKER<span className="opacity-0 px-0 md:px-1"> </span>HOUSE
            </h1>
          </div>
          <h2 className="font-serif text-3xl font-bold text-primary mt-6">IDENTITY STUDIO</h2>
        </div>
        
        <div className="w-full max-w-lg bg-black/20 p-4 rounded-[2rem] border border-white/10 shadow-2xl relative flex flex-col items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={share.imageUrl} 
            alt={`${share.metadata?.name || 'User'}'s Identity`}
            className="w-full h-auto object-contain rounded-xl"
          />
        </div>
        
        <div className="flex flex-col items-center gap-4 text-center">
          {share.metadata?.name && (
            <h3 className="font-sans font-bold text-3xl text-white tracking-wider">{share.metadata.name}</h3>
          )}
          {share.metadata?.title && (
            <p className="font-sans font-bold text-xl text-primary">{share.metadata.title}</p>
          )}
          {share.metadata?.role && (
            <p className="font-mono text-sm text-white/70 uppercase tracking-widest">{share.metadata.role}</p>
          )}
          <p className="font-mono text-secondary font-bold mt-4">#FrameInGoa</p>
        </div>
        
        <Link 
          href="/"
          className="mt-8 px-8 py-4 bg-primary text-black font-sans font-bold text-xl uppercase tracking-wider rounded-2xl shadow-[0_0_20px_rgba(243,231,0,0.4)] hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(243,231,0,0.6)] transition-all"
        >
          Create Your Own Identity
        </Link>
      </div>
    </main>
  );
}
