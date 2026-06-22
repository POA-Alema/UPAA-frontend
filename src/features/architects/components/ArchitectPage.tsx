"use client";

import { useTranslation } from "react-i18next";
import "@/features/i18n";
import { ExpandableImage } from "@/components/media/ExpandableImage";
import { RichText } from "@/components/content/rich-text";
import { FeatureAction } from "@/components/ui/feature-action";
import { ArchitectGallery } from "./ArchitectGallery";
import { useArchitectDetailTracking } from "../hooks";
import type { ArchitectPageProps } from "../types/architect";

export function ArchitectPage({ architect, backToMapHref }: ArchitectPageProps) {
  const { t } = useTranslation("common");
  
  // Track the page view for analytics
  useArchitectDetailTracking(architect.slug, architect.title);

  const details = architect.details?.length
    ? architect.details
    : [
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

  const characteristics = architect.characteristics?.length
    ? architect.characteristics
    : [
        {
          icon: "auto_awesome",
          title: t("architect.char_eclectic_title"),
          description: t("architect.char_eclectic_desc"),
        },
        {
          icon: "palette",
          title: t("architect.char_detail_title"),
          description: t("architect.char_detail_desc"),
        },
        {
          icon: "domain",
          title: t("architect.char_innovation_title"),
          description: t("architect.char_innovation_desc"),
        },
      ];

  const ctaDescription = architect.ctaDescription || t("architect.cta_description");

  const hasHero = Boolean(
    architect.title || architect.eyebrow || architect.image,
  );
  const hasBiography = Boolean(architect.bio);
  const hasWorks = Boolean(architect.works?.length);
  const hasCta = Boolean(architect.actions?.secondary || backToMapHref);

  if (!hasHero && !hasBiography && !hasWorks && !hasCta) {
    return null;
  }

  return (
    <article className="page-shell architect-page architect-page--dark architect-flow">
      {hasHero ? (
        <section className="architect-hero">
          <div className="architect-hero__grid">
            {architect.image ? (
              <figure className="architect-hero__media">
                <div className="architect-image-frame architect-image-frame--hero">
                  <ExpandableImage
                    image={{ ...architect.image, alt: architect.image.alt || architect.title }}
                    imageClassName="architect-image"
                    priority
                    sizes="(max-width: 768px) 260px, 260px"
                  />
                  <div className="architect-image-overlay architect-image-overlay--strong"></div>
                </div>

                {architect.image.caption ? (
                  <figcaption className="architect-caption architect-caption--light">
                    {architect.image.caption}
                  </figcaption>
                ) : null}
              </figure>
            ) : null}

            <div className="architect-hero__copy">
              <p className="eyebrow eyebrow--light">{t("architect.eyebrow")}</p>
              {architect.title ? (
                <h1 className="architect-title architect-title--light">
                  {t("architect.page_legacy_prefix")} <br /> <strong>{architect.title}</strong>
                </h1>
              ) : null}
              <div className="section-divider section-divider--accent"></div>
            </div>
          </div>
        </section>
      ) : null}

      {hasBiography ? (
        <section className="architect-section architect-section--bio architect-flow__section">
          <div className="architect-section__inner">
            <div className="section-heading">
              <h2 className="architect-section__headline">
                <span className="architect-section__headline-line"></span>{" "}
                {t("architect.page_bio_heading")}
              </h2>
            </div>

            <RichText
              className="rich-text rich-text--muted"
              content={architect.bio}
              emphasizeFirstParagraph
            />

            <div className="architect-detail-grid">
                {details.map((detail) => (
                  <article
                    className="info-card info-card--architect"
                    key={`${detail.label}-${detail.value}`}
                  >
                    <p className="meta-line meta-line--light">{detail.label}</p>
                    <h3>{detail.value}</h3>
                    {detail.subValue ? <p>{detail.subValue}</p> : null}
                  </article>
                ))}
              </div>
          </div>
        </section>
      ) : null}

      <section className="architect-section architect-section--features architect-flow__section">
        <div className="architect-section__inner">
          <h2 className="architect-section__title">
            {t("architect.page_characteristics_heading")}
          </h2>

          <div className="feature-grid">
            {characteristics.map((characteristic) => (
              <article
                className="info-card info-card--architect info-card--feature"
                key={characteristic.title}
              >
                <span className="material-symbols-outlined architect-feature-icon">
                  {characteristic.icon}
                </span>
                <h3>{characteristic.title}</h3>
                <p>{characteristic.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {hasWorks ? (
        <section className="architect-section architect-section--works architect-flow__section">
          <div className="architect-section__inner architect-section__inner--wide">
            <div className="architect-works__header">
              <h2 className="architect-works__title">{t("architect.page_works_heading")}</h2>
            </div>
          </div>

          <ArchitectGallery items={architect.works!} />
        </section>
      ) : null}

      {hasCta ? (
        <section className="architect-cta architect-flow__section">
          <div className="architect-cta__content">
            <p className="section-copy architect-cta__copy">
              {ctaDescription}
            </p>

            <div className="section-actions section-actions--row section-actions--center">
              {architect.actions?.secondary ? (
                <FeatureAction
                  href={architect.actions.secondary.href}
                  icon="explore"
                  label={t("architect.action_explore_works")}
                  variant="primary"
                />
              ) : null}
              <FeatureAction
                href={backToMapHref}
                icon="map"
                label={t("architect.page_back_to_map")}
                variant="ghost"
              />
            </div>
          </div>
        </section>
      ) : null}
    </article>
  );
}
