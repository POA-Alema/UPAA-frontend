import Image from "next/image";
import Link from "next/link";
import { ArchitectPageProps } from "../types/architect";

export function ArchitectPage({ architect }: ArchitectPageProps) {
  if (!architect.title && !architect.bio && !architect.image) {
    return null;
  }

  return (
    <article className="pb-12 pt-16 font-body bg-background text-on-background min-h-screen">
      
      {/* Hero Section - Visual Identity */}
      <section className="relative flex flex-col items-center px-8 mb-12">
        {architect.image && (
          <figure className="flex flex-col items-center mb-12 mt-4 m-0">
            <div className="relative w-full max-w-[260px] aspect-[4/5] p-1.5 border border-primary/40 rounded-lg shadow-2xl mb-4 antialiased">
              <div className="relative w-full h-full border-2 border-primary rounded-md overflow-hidden bg-surface-container-high z-10 antialiased">
                <Image
                  src={architect.image.src}
                  alt={architect.image.alt || architect.title}
                  fill
                  priority
                  className="object-cover grayscale brightness-90"
                  sizes="(max-width: 768px) 260px, 260px"
                />
                <div 
                  className="absolute inset-0 pointer-events-none" 
                  style={{ background: 'linear-gradient(45deg, rgba(21, 19, 18, 0.9), rgba(211, 166, 91, 0.1))' }}
                ></div>
              </div>
            </div>
            
            <figcaption className="mt-4 text-[10px] uppercase tracking-widest text-on-surface-variant text-center max-w-xs">
              {architect.image.caption}
            </figcaption>
          </figure>
        )}

        <div className="text-center max-w-2xl px-4 antialiased">
          {architect.eyebrow && (
            <span className="font-label uppercase tracking-[0.3em] text-[0.65rem] text-primary mb-4 block">
              {architect.eyebrow}
            </span>
          )}
          <h1 className="font-headline font-extrabold text-3xl md:text-5xl text-on-surface mb-6 tracking-tight">
            O Legado de <br /> {architect.title}
          </h1>
          <div className="w-16 h-[1px] bg-primary mx-auto opacity-40"></div>
        </div>
      </section>

      {/* History and Biography Section */}
      {architect.bio && (
        <section className="px-8 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-headline font-bold text-2xl mb-12 text-primary flex items-center gap-4 antialiased">
              <span className="h-[2px] w-12 bg-primary"></span> História
            </h2>
            
            <div className="relative mb-16 antialiased">
              <div className="text-lg leading-[1.8] font-light text-on-surface/90 italic antialiased">
                <span className="text-5xl font-headline text-primary float-left mr-4 mt-2 leading-none">
                  {architect.bio.charAt(0)}
                </span>
                {architect.bio.slice(1)}
              </div>
            </div>

            {/* Technical Information Grid */}
            {architect.details && architect.details.length > 0 && (
              <div className="grid grid-cols-1 gap-4 antialiased">
                {architect.details.map((detail, index) => (
                  <div key={index} className="bg-surface-container-high/40 p-6 rounded-lg border border-outline-variant/10">
                    <span className="font-label text-[9px] uppercase tracking-[0.2em] text-primary/70 block mb-2">
                      {detail.label}
                    </span>
                    <p className="font-headline font-bold text-lg text-on-surface">{detail.value}</p>
                    {detail.subValue && (
                      <p className="text-xs text-on-surface/40 mt-1">{detail.subValue}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Architectural Characteristics Section */}
      {architect.characteristics && architect.characteristics.length > 0 && (
        <section className="px-8 py-16">
          <div className="max-w-4xl mx-auto antialiased">
            <h2 className="font-headline font-bold text-3xl mb-12 text-primary md:text-right leading-tight tracking-tight">
              Características<br />Arquitetônicas
            </h2>
            
            <div className="space-y-6">
              {architect.characteristics.map((char, index) => (
                <div key={index} className="bg-surface-container-high/30 p-8 rounded-xl border border-outline-variant/10 flex flex-col items-start">
                  <span className="material-symbols-outlined text-primary mb-6 text-3xl">
                    {char.icon}
                  </span>
                  <div className="antialiased">
                    <h3 className="font-headline font-bold mb-4 text-on-surface text-xl">
                      {char.title}
                    </h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      {char.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Portfolio Section - Notable Works */}
      {architect.works && architect.works.length > 0 && (
        <section className="py-16">
          <div className="px-8 max-w-4xl mx-auto mb-10 flex justify-between items-end antialiased">
            <h2 className="font-headline font-extrabold text-2xl uppercase tracking-widest text-primary">
              Obras Marcantes
            </h2>
            <span className="text-outline font-label text-[9px] uppercase tracking-widest flex items-center gap-2 font-bold">
              <span className="material-symbols-outlined text-sm">swipe_left</span>
              Deslize
            </span>
          </div>
          
          <div className="flex overflow-x-auto gap-6 px-8 pb-8 snap-x snap-mandatory scrollbar-hide max-w-6xl mx-auto">
            {architect.works.map((work, index) => (
              <figure key={index} className="flex-none w-72 snap-center m-0 antialiased">
                <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-2xl mb-6 border border-outline-variant/20 bg-surface-container-high flex items-center justify-center relative">
                  {work.image ? (
                    <Image
                      src={work.image.src}
                      alt={work.image.alt}
                      fill
                      priority={index === 0}
                      className="object-cover antialiased"
                      sizes="(max-width: 768px) 288px, 288px"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-4xl text-on-surface-variant">image</span>
                  )}
                </div>
                <figcaption className="text-center px-2">
                  <strong className="block text-[11px] uppercase tracking-[0.15em] text-primary mb-1">
                    {work.title}
                  </strong>
                  {work.image && (
                    <span className="text-[9px] uppercase tracking-[0.15em] text-outline">
                      {work.image.caption}
                    </span>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* Call to Action (CTA) Section */}
      <section className="px-8 py-20 text-center antialiased">
        <div className="max-w-xl mx-auto">
          {architect.ctaDescription && (
            <p className="text-on-surface-variant leading-relaxed text-lg font-light mb-12">
              {architect.ctaDescription}
            </p>
          )}
          
          <div className="flex flex-col gap-4 max-w-xs mx-auto">
            {architect.actions?.secondary && (
              <Link 
                href={architect.actions.secondary.href}
                className="bg-primary text-[#151312] font-headline font-bold py-5 px-10 rounded-lg shadow-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-3 tracking-widest text-[10px] uppercase border border-transparent"
              >
                <span className="material-symbols-outlined text-lg">explore</span>
                {architect.actions.secondary.label}
              </Link>
            )}

            <Link 
              href="/mapa"
              className="bg-surface-container-high/50 text-on-surface font-headline font-bold py-5 px-10 rounded-lg transition-all flex items-center justify-center gap-3 tracking-widest text-[10px] uppercase border border-outline-variant/10 hover:bg-surface-container-high"
            >
              <span className="material-symbols-outlined text-lg">map</span>
              Voltar ao Mapa
            </Link>
          </div>
        </div>
      </section>

    </article>
  );
}