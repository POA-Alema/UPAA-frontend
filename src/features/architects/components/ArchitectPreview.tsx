import Image from "next/image";
import { RichText } from "@/components/content/rich-text";
import { FeatureAction } from "@/components/ui/feature-action";
import type { ArchitectPreviewProps } from "../types/architect";

export function ArchitectPreview({ architect }: ArchitectPreviewProps) {
  if (!architect.title || !architect.bio) {
    return null;
  }

  return (
    <article id="architects" className="section-card section-card--dark architect-preview home-flow__section">
      <section className="architect-preview__grid">
        <div className="architect-preview__copy">
          {architect.eyebrow ? (
            <p className="eyebrow eyebrow--light">{architect.eyebrow}</p>
          ) : null}

          <h2 className="architect-title architect-title--light">
            <strong>{architect.title}</strong>
          </h2>
          <div className="section-divider section-divider--accent"></div>

          <RichText
            className="rich-text rich-text--muted"
            content={architect.bio}
            emphasizeFirstParagraph
          />

          {architect.details?.length ? (
            <div className="architect-detail-grid architect-detail-grid--compact">
              {architect.details.map((detail) => (
                <article
                  className="info-card info-card--dark"
                  key={`${detail.label}-${detail.value}`}
                >
                  <p className="meta-line">{detail.label}</p>
                  <h3>{detail.value}</h3>
                  {detail.subValue ? <p>{detail.subValue}</p> : null}
                </article>
              ))}
            </div>
          ) : null}

          {architect.actions?.primary || architect.actions?.secondary ? (
            <div className="section-actions section-actions--row">
              {architect.actions?.primary ? (
                <FeatureAction
                  href={architect.actions.primary.href}
                  icon="menu_book"
                  label={architect.actions.primary.label}
                  variant="primary"
                />
              ) : null}
              {architect.actions?.secondary ? (
                <FeatureAction
                  href={architect.actions.secondary.href}
                  icon="explore"
                  label={architect.actions.secondary.label}
                  variant="secondary"
                />
              ) : null}
            </div>
          ) : null}
        </div>

        {architect.image ? (
          <figure className="architect-preview__media">
            <div className="architect-image-frame architect-image-frame--preview">
              <Image
                alt={architect.image.alt || architect.title}
                className="architect-image"
                fill
                priority
                sizes="(max-width: 1024px) 280px, 340px"
                src={architect.image.src}
                unoptimized 
              />
              <div className="architect-image-overlay"></div>
            </div>

            {architect.image.caption ? (
              <figcaption className="architect-caption architect-caption--light">
                {architect.image.caption}
              </figcaption>
            ) : null}
          </figure>
        ) : null}
      </section>
    </article>
  );
}