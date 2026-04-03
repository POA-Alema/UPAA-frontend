import Image from "next/image";
import Link from "next/link";
import { ArchitectPageProps } from "../types/architect";

export function ArchitectPage({ architect }: ArchitectPageProps) {
  if (!architect.title && !architect.bio && !architect.image) {
    return null;
  }

  return (
    <article className="pb-16 pt-8 font-sans bg-[var(--dark-bg)] text-[var(--dark-foreground)] min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="relative flex flex-col items-center px-4 mb-16">
        {architect.image && (
          <figure className="flex flex-col items-center mb-12 mt-4 m-0">
            {/* Container da Imagem */}
            <div className="relative w-64 h-64 md:w-72 md:h-72">
              <div className="absolute inset-0 border border-[var(--gold-primary)] rounded-full scale-[1.15] opacity-30"></div>
              <div className="absolute inset-0 border-[3px] border-[var(--gold-primary)] rounded-full scale-105 opacity-80"></div>
              
              <div className="w-full h-full overflow-hidden rounded-full bg-[var(--dark-surface)] shadow-2xl relative z-10">
                <Image
                  src={architect.image.src}
                  alt={architect.image.alt || architect.title}
                  fill
                  priority
                  className="object-cover grayscale brightness-90"
                  sizes="(max-width: 768px) 256px, 288px"
                />
                <div className="absolute inset-0 bg-[var(--gold-primary)] mix-blend-overlay opacity-10 pointer-events-none"></div>
              </div>
            </div>
            
            {/* Legenda da Imagem */}
            {architect.image.caption && (
              <figcaption className="mt-6 text-[10px] uppercase tracking-widest text-[var(--dark-muted)] text-center max-w-xs">
                {architect.image.caption}
              </figcaption>
            )}
          </figure>
        )}

        <div className="text-center max-w-2xl px-4">
          {architect.eyebrow && (
            <span className="text-[var(--gold-primary)] text-[11px] md:text-xs font-bold tracking-[0.3em] uppercase block mb-4">
              {architect.eyebrow}
            </span>
          )}
          <h1 className="font-bold text-4xl md:text-5xl text-white mb-6 tracking-tight leading-tight">
            O Legado de <br /> {architect.title}
          </h1>
          <div className="w-16 h-[2px] bg-[var(--gold-primary)] mx-auto opacity-40"></div>
        </div>
      </section>

      {/* 2. HISTORY SECTION */}
      {architect.bio && (
        <section className="px-4 md:px-8 py-8 max-w-lg mx-auto md:mx-0 md:max-w-4xl">
          <h2 className="font-bold text-xl md:text-2xl mb-10 text-[var(--gold-primary)] flex items-center gap-4 uppercase tracking-widest">
            <span className="h-[2px] w-12 bg-[var(--gold-primary)]"></span> História
          </h2>
          
          <div className="relative mb-10 pl-2">
            <div className="absolute -top-3 -left-2 opacity-10 pointer-events-none select-none">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--gold-primary)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l-5.5 9.5h11z"></path>
                <path d="M12 22A10 10 0 1 0 12 2a10 10 0 0 0 0 20z"></path>
              </svg>
            </div>
            
            <div className="text-lg md:text-xl leading-[1.8] font-light text-[var(--dark-muted)] relative z-10">
              <span className="text-[3.5rem] md:text-[4.5rem] font-serif text-[var(--gold-primary)] float-left mr-4 mt-2 leading-[0.8]">
                {architect.bio.charAt(0)}
              </span>
              {architect.bio.slice(1)}
            </div>
          </div>

          {/* Botão VER OBRAS (Consumindo actions.secondary) */}
          {architect.actions?.secondary && (
            <div className="mt-8 mb-12">
               <Link 
                  href={architect.actions.secondary.href}
                  className="w-full bg-[var(--gold-primary)] text-[var(--dark-bg)] font-bold py-4 px-8 rounded-md shadow-lg hover:bg-[var(--gold-hover)] transition-all flex items-center justify-center gap-3 tracking-[0.15em] text-xs uppercase"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
                  </svg>
                  {architect.actions.secondary.label}
                </Link>
            </div>
          )}

          {/* Grid de Detalhes */}
          {architect.details && architect.details.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {architect.details.map((detail, index) => (
                <div key={index} className="bg-[var(--dark-surface)] p-6 rounded-xl border border-[var(--dark-border)] shadow-sm">
                  <span className="text-[var(--gold-primary)] text-[11px] uppercase tracking-widest font-bold block mb-2">{detail.label}</span>
                  <p className="font-bold text-lg text-white">{detail.value}</p>
                  {detail.subValue && (
                    <p className="text-sm text-[var(--dark-muted)] mt-1">{detail.subValue}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 3. CARACTERÍSTICAS ARQUITETÔNICAS */}
      <section className="px-4 md:px-8 py-16 max-w-4xl mx-auto">
        <h2 className="font-bold text-3xl mb-12 text-[var(--gold-primary)] md:text-right leading-tight tracking-tight">
          Características<br />Arquitetônicas
        </h2>
        
        <div className="space-y-6">
          <div className="bg-[var(--dark-surface)] p-8 rounded-xl border border-[var(--dark-border)] flex flex-col md:flex-row gap-6 items-start shadow-xl">
            <span className="material-symbols-outlined text-[var(--gold-primary)] text-4xl">auto_awesome</span>
            <div>
              <h3 className="font-bold mb-3 text-white text-xl">Ecletismo Monumental</h3>
              <p className="text-sm text-[var(--dark-muted)] leading-relaxed">
                Sua obra é caracterizada pela fusão harmônica entre o neoclássico e o barroco, definindo o horizonte da capital gaúcha através de proporções imponentes e riqueza ornamental.
              </p>
            </div>
          </div>

          <div className="bg-[var(--dark-surface)] p-8 rounded-xl border border-[var(--dark-border)] flex flex-col md:flex-row gap-6 items-start shadow-xl">
            <span className="material-symbols-outlined text-[var(--gold-primary)] text-4xl">palette</span>
            <div>
              <h3 className="font-bold mb-3 text-white text-xl">Riqueza de Detalhes</h3>
              <p className="text-sm text-[var(--dark-muted)] leading-relaxed">
                Colaboração constante com artistas e escultores como Alfred Adloff, resultando em fachadas com figuras alegóricas e elementos decorativos de alta qualidade técnica.
              </p>
            </div>
          </div>

          <div className="bg-[var(--dark-surface)] p-8 rounded-xl border border-[var(--dark-border)] flex flex-col md:flex-row gap-6 items-start shadow-xl">
            <span className="material-symbols-outlined text-[var(--gold-primary)] text-4xl">domain</span>
            <div>
              <h3 className="font-bold mb-3 text-white text-xl">Inovação Estrutural</h3>
              <p className="text-sm text-[var(--dark-muted)] leading-relaxed">
                Pioneiro no uso de novas tecnologias construtivas para a época, como grandes vãos, claraboias zenitais e estruturas que permitiam ambientes amplos e iluminados.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. OBRAS MARCANTES */}
      <section className="py-8">
        <div className="px-4 md:px-8 max-w-4xl mx-auto mb-8 flex justify-between items-end">
          <h2 className="font-bold text-2xl uppercase tracking-widest text-[var(--gold-primary)]">
            Obras Marcantes
          </h2>
          <span className="text-[var(--dark-muted)] text-[10px] uppercase tracking-widest flex items-center gap-2 font-bold">
            <span className="material-symbols-outlined text-sm">swipe_left</span>
            Deslize
          </span>
        </div>
        
        <div className="flex overflow-x-auto gap-6 px-4 md:px-8 pb-8 snap-x snap-mandatory scrollbar-hide max-w-6xl mx-auto">
          <div className="flex-none w-72 snap-center">
            <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-2xl mb-4 border border-[var(--dark-border)] bg-[#211f1e] flex items-center justify-center text-[var(--dark-muted)]">
              <span className="material-symbols-outlined text-4xl">image</span>
            </div>
            <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--dark-muted)] text-center font-bold px-2">
              Museu de Arte do RS (Antiga Delegacia Fiscal)
            </p>
          </div>

          <div className="flex-none w-72 snap-center">
            <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-2xl mb-4 border border-[var(--dark-border)] bg-[#211f1e] flex items-center justify-center text-[var(--dark-muted)]">
              <span className="material-symbols-outlined text-4xl">image</span>
            </div>
            <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--dark-muted)] text-center font-bold px-2">
              Memorial do RS (Antigos Correios e Telégrafos)
            </p>
          </div>
        </div>
      </section>

      {/* 5. RODAPÉ DA PÁGINA */}
      <section className="px-4 py-16 text-center">
        <div className="max-w-xl mx-auto">
          <p className="text-[var(--dark-muted)] leading-relaxed text-lg font-light mb-10">
            A herança de Wiederspahn está espalhada pelo centro de Porto Alegre, esperando para ser descoberta em cada detalhe de suas fachadas.
          </p>
          
          <div className="flex flex-col gap-4 max-w-xs mx-auto">
            <Link 
              href="/mapa"
              className="bg-[var(--dark-surface)] text-white font-bold py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-3 tracking-[0.15em] text-[11px] uppercase border border-[var(--dark-border)] hover:bg-[var(--dark-bg)] shadow-md"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
                <line x1="9" y1="3" x2="9" y2="21"></line>
                <line x1="15" y1="3" x2="15" y2="21"></line>
              </svg>
              Voltar ao Mapa
            </Link>
          </div>
        </div>
      </section>

    </article>
  );
}