import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArchitectBioProps } from "../types/architect";
import { PageSection } from "@/components/layout/page-section";

/**
 * Componente ArchitectBio
 * 
 * Renderiza a seção de biografia de um arquiteto seguindo o padrão visual do projeto.
 * Utiliza o componente PageSection para manter a consistência de títulos e espaçamentos.
 * 
 * @param props - Propriedades do arquiteto (eyebrow, title, bio, image, cta, details)
 */
export function ArchitectBio({
  eyebrow,
  title,
  bio,
  image,
  cta,
  details,
}: ArchitectBioProps) {
  // Critério de aceitação: Não renderizar nada caso todos os dados estejam vazios
  if (!title && !bio && !image && !eyebrow) return null;

  return (
    <article className="bg-[#151312] text-[#e7e1df] font-sans selection:bg-[#efc173]/30 overflow-hidden">
      {/* Hero Section - Image and Main Title */}
      <section className="relative px-8 py-12 flex flex-col items-center" aria-labelledby="bio-title">
        {image && (
          <div className="relative w-64 h-64 md:w-72 md:h-72 mb-12" role="img" aria-label={image.alt}>
            {/* Decorative Borders */}
            <div className="absolute inset-0 border border-[#efc173]/30 rounded-full scale-[1.15] pointer-events-none" aria-hidden="true"></div>
            <div className="absolute inset-0 border-[3px] border-[#efc173] rounded-full scale-105 pointer-events-none" aria-hidden="true"></div>
            
            {/* Image Container */}
            <div className="w-full h-full overflow-hidden rounded-full bg-[#373433] shadow-2xl relative">
              <Image
                src={image.src}
                alt="" // Alt vazio aqui pois o container já tem aria-label
                fill
                priority // Imagem de destaque na seção
                className="object-cover grayscale brightness-90"
                sizes="(max-width: 768px) 256px, 288px"
              />
              {/* Sepia Overlay Effect */}
              <div 
                className="absolute inset-0 pointer-events-none" 
                style={{
                  background: "linear-gradient(45deg, rgba(21, 19, 18, 0.6), rgba(211, 166, 91, 0.1))"
                }}
                aria-hidden="true"
              ></div>
            </div>
          </div>
        )}

        <div className="text-center max-w-2xl px-4" id="bio-title">
          <PageSection eyebrow={eyebrow} title={title} />
          <div className="w-16 h-[1px] bg-[#efc173] mx-auto opacity-40 mt-8" aria-hidden="true"></div>
        </div>
      </section>

      {/* History Section - Bio Content and Details */}
      <section className="px-8 py-12 max-w-4xl mx-auto">
        <h3 className="font-bold text-2xl mb-10 text-[#efc173] flex items-center gap-4">
          <span className="h-[2px] w-12 bg-[#efc173]" aria-hidden="true"></span> História
        </h3>
        
        <div className="relative mb-12 px-4">
          {/* Rich Text / Bio Content with Drop Cap */}
          <div className="text-lg leading-relaxed font-light text-[#e7e1df]/90 italic">
            {bio && (
              <p>
                <span className="text-5xl text-[#efc173] float-left mr-4 mt-2 leading-none font-bold select-none" aria-hidden="true">
                  {bio.charAt(0)}
                </span>
                {bio}
              </p>
            )}
          </div>
        </div>

        {/* Details Grid */}
        {details && details.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {details.map((detail, index) => (
              <div 
                key={`${detail.label}-${index}`}
                className="bg-[#373433]/40 p-6 rounded-lg border border-[#4e4538]/20 transition-colors hover:border-[#efc173]/30"
              >
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#efc173]/70 block mb-2 font-bold">
                  {detail.label}
                </span>
                <p className="font-bold text-lg text-[#e7e1df]">{detail.value}</p>
                {detail.subValue && (
                  <p className="text-xs text-[#e7e1df]/40 mt-1">{detail.subValue}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* CTA Button */}
        {cta && (
          <div className="flex justify-center mt-8">
            <Link 
              href={cta.href}
              className="bg-[#efc173] text-[#151312] font-bold py-4 px-10 rounded-lg shadow-xl hover:bg-[#efc173]/90 focus:ring-2 focus:ring-[#efc173] focus:ring-offset-2 focus:ring-offset-[#151312] outline-none transition-all flex items-center justify-center gap-3 tracking-widest text-[10px] uppercase"
              aria-label={`${cta.label} sobre ${title}`}
            >
              {cta.label}
            </Link>
          </div>
        )}
      </section>
    </article>
  );
}
