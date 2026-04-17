"use client";

import Image from "next/image";
import { RichText } from "@/components/content/rich-text";
import { FeatureAction } from "@/components/ui/feature-action";
import type { ArchitectPreviewProps } from "../types/architect";
import { useLanguage } from "@/context/LanguageContext";
import { allTranslations } from "@/data/translations";

export function ArchitectPreview({ architect }: ArchitectPreviewProps) {
  const { language } = useLanguage();
  const t = allTranslations.architectsSection[language];

  if (!architect.title || !architect.bio) {
    return null;
  }

  // Função auxiliar para garantir que pegamos a string correta, 
  // seja o dado uma string direta ou um objeto de traduções
  const getTranslation = (field: any) => {
    if (typeof field === "object" && field !== null) {
      return field[language] || field["pt"]; // fallback para PT se não achar a língua
    }
    return field;
  };

  const legacyPrefix = {
    pt: "O Legado de",
    en: "The Legacy of",
    de: "Das Erbe von"
  };

  return (
    <article className="section-card section-card--dark architect-preview home-flow__section mt-12">
      <section className="architect-preview__grid">
        <div className="architect-preview__copy">
          <p className="eyebrow eyebrow--light">{t.tag}</p>

          <h2 className="architect-title architect-title--light">
            {legacyPrefix[language]} <br /> <strong>{architect.title}</strong>
          </h2>
          <div className="section-divider section-divider--accent"></div>

          {/* AGORA BUSCA A BIO TRADUZIDA */}
          <RichText 
            className="rich-text rich-text--muted" 
            content={getTranslation(architect.bio)} 
            emphasizeFirstParagraph 
          />

          {architect.details?.length ? (
            <div className="architect-detail-grid architect-detail-grid--compact">
              {architect.details.map((detail) => {
                let translatedLabel = detail.label;
                if (detail.label.toLowerCase() === "origem") translatedLabel = t.origin;
                if (detail.label.toLowerCase() === "morte") translatedLabel = t.death;

                let translatedSubValue = detail.subValue || "";
                translatedSubValue = translatedSubValue
                  .replace("Nascimento", t.born)
                  .replace("Falecimento", t.died);

                return (
                  <article className="info-card info-card--dark" key={`${detail.label}-${detail.value}`}>
                    <p className="meta-line">{translatedLabel}</p>
                    <h3>{detail.value}</h3>
                    {translatedSubValue ? <p>{translatedSubValue}</p> : null}
                  </article>
                );
              })}
            </div>
          ) : null}

          <div className="section-actions section-actions--row">
            {architect.actions?.primary && (
              <FeatureAction
                href={architect.actions.primary.href}
                icon="menu_book"
                label={t.viewMore}
                variant="primary"
              />
            )}
            {architect.actions?.secondary && (
              <FeatureAction
                href={architect.actions.secondary.href}
                icon="explore"
                label={t.exploreWorks}
                variant="secondary"
              />
            )}
          </div>
        </div>

        {architect.image && (
          <figure className="architect-preview__media">
            <div className="architect-image-frame architect-image-frame--preview">
              <Image
                alt={architect.image.alt || architect.title}
                className="architect-image"
                fill
                priority
                sizes="(max-width: 1024px) 280px, 340px"
                src={architect.image.src}
              />
              <div className="architect-image-overlay"></div>
            </div>
            {/* TRADUÇÃO DA LEGENDA DA FOTO */}
            {architect.image.caption && (
              <figcaption className="architect-caption architect-caption--light">
                {getTranslation(architect.image.caption)}
              </figcaption>
            )}
          </figure>
        )}
      </section>
    </article>
  );
}