import Link from "next/link";
import Image from "next/image";
import { ArchitectPreviewProps } from "../types/architect";

export function ArchitectPreview({ architect }: ArchitectPreviewProps) {
  if (!architect.title || !architect.bio) {
    return null;
  }

  return (
    <div className="bg-[var(--dark-bg)] max-w-sm mx-auto px-6 py-10 font-sans text-[var(--dark-foreground)]">
      
      {/* 1. Rectangular Photo with Double Golden Frame */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-full max-w-[260px] aspect-[4/5] p-1.5 border border-[var(--gold-primary)]/40 rounded-lg shadow-2xl">
          <div className="relative w-full h-full border-2 border-[var(--gold-primary)] rounded-md overflow-hidden bg-[var(--dark-surface)]">
            {architect.image && (
              <Image
                src={architect.image.src}
                alt={architect.image.alt || architect.title}
                fill
                priority
                className="object-cover grayscale brightness-90"
                sizes="(max-width: 768px) 260px, 260px"
              />
            )}
            <div className="absolute inset-0 bg-[var(--gold-primary)] mix-blend-overlay opacity-10 pointer-events-none"></div>
          </div>
        </div>
      </div>

      {/* 2. Titles Section */}
      <div className="text-center w-full mb-10">
        {architect.eyebrow && (
          <span className="text-[var(--gold-primary)] text-[10px] font-bold tracking-[0.25em] uppercase block mb-6">
            {architect.eyebrow}
          </span>
        )}
        <h2 className="font-bold text-3xl md:text-4xl text-white mb-8 tracking-tight leading-tight">
          O Legado de <br /> {architect.title}
        </h2>
        <div className="w-16 h-[1px] bg-[var(--gold-primary)]/30 mx-auto"></div>
      </div>

      {/* 3. History with Drop Cap */}
      <div className="mb-10 pl-1">
        <h3 className="font-bold text-xl mb-8 text-[var(--gold-primary)] flex items-center gap-4 uppercase tracking-widest">
          <span className="h-[2px] w-8 bg-[var(--gold-primary)]"></span> História
        </h3>
        
        <div className="relative">
          <div className="text-[15px] leading-[1.9] font-light text-[var(--dark-muted)] relative z-10">
            <span className="text-[3.5rem] font-serif text-[var(--gold-primary)] float-left mr-3 mt-1 leading-[0.8]">
              {architect.bio.charAt(0)}
            </span>
            {architect.bio.slice(1)}
          </div>
        </div>
      </div>

      {/* 4. Actions (Two Buttons in Vertical Stack, Data-Driven) */}
      {architect.actions && (
        <div className="mt-6 flex flex-col gap-3">
          
          {/* Primary Button: Uses data from actions.primary */}
          <Link 
            href={architect.actions.primary.href}
            className="w-full bg-[var(--gold-primary)] text-[var(--dark-bg)] font-bold py-4 rounded-md shadow-lg hover:bg-[var(--gold-hover)] transition-all flex items-center justify-center gap-3 tracking-[0.15em] text-[11px] uppercase"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
            </svg>
            {architect.actions.primary.label}
          </Link>

          {/* Secondary Button: Uses data from actions.secondary */}
          <Link 
            href={architect.actions.secondary.href}
            className="w-full bg-[var(--dark-surface)] border border-[var(--gold-primary)]/40 text-[var(--gold-primary)] font-bold py-4 rounded-md hover:bg-[var(--dark-bg)] transition-all flex items-center justify-center gap-3 tracking-[0.15em] text-[11px] uppercase"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
            </svg>
            {architect.actions.secondary.label}
          </Link>
          
        </div>
      )}
        
      </div>
  );
}