<<<<<<< HEAD
import { ExpandableImage } from "@/components/media/ExpandableImage";
=======
"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import "@/features/i18n";
>>>>>>> 5437c96 (fix(i18n): replace hardcoded landing page content with dynamic translations)
import { RichText } from "@/components/content/rich-text";
import { FeatureAction } from "@/components/ui/feature-action";
import type { ArchitectPreviewProps } from "../types/architect";

export function ArchitectPreview({ architect }: ArchitectPreviewProps) {
  const { t } = useTranslation("common");

  if (!architect.title || !architect.bio) {
    return null;
  }

  const details = [
    {
      label: t("architect.detail_origin_label"),
      value: t("architect.detail_origin_value"),
      subValue: t("architect.detail_origin_sub"),
    },
    {
      label: t("architect.detail_death_label"),
      value: t("architect.detail_death_value"),
      subValue: t("architect.detail_death_sub"),
    },
  ];

  return (
    <article id="architects" className="section-card section-card--dark architect-preview home-flow__section">
      <section className="architect-preview__grid">
        <div className="architect-preview__copy">
          <p className="eyebrow eyebrow--light">{t("architect.eyebrow")}</p>

          <h2 className="architect-title architect-title--light">
            <strong>{architect.title}</strong>
          </h2>
          <div className="section-divider section-divider--accent"></div>

          <RichText
            className="rich-text rich-text--muted"
            content={architect.bio}
            emphasizeFirstParagraph
          />

          <div className="architect-detail-grid architect-detail-grid--compact">
            {details.map((detail) => (
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

          {architect.actions?.primary || architect.actions?.secondary ? (
            <div className="section-actions section-actions--row">
              {architect.actions?.primary ? (
                <FeatureAction
                  href={architect.actions.primary.href}
                  icon="menu_book"
                  label={t("architect.action_biography")}
                  variant="primary"
                />
              ) : null}
              {architect.actions?.secondary ? (
                <FeatureAction
                  href={architect.actions.secondary.href}
                  icon="explore"
                  label={t("architect.action_explore_works")}
                  variant="secondary"
                />
              ) : null}
            </div>
          ) : null}
        </div>

        {architect.image ? (
          <figure className="architect-preview__media">
            <div className="architect-image-frame architect-image-frame--preview">
              <ExpandableImage
                image={{ ...architect.image, alt: architect.image.alt || architect.title }}
                imageClassName="architect-image"
                priority
                sizes="(max-width: 1024px) 280px, 340px"
              />
              <div className="architect-image-overlay"></div>
            </div>

            <figcaption className="architect-caption architect-caption--light">
              {t("architect.image_caption")}
            </figcaption>
          </figure>
        ) : null}
      </section>
    </article>
  );
}
