import Image from "next/image";
import { RichText } from "@/components/content/rich-text";
import { FeatureAction } from "@/components/ui/feature-action";
import { BuildingGallery } from "./BuildingGallery";
import { buildingLabels } from "../data/building-labels";
import type { BuildingPageProps } from "../types/building";

export function BuildingPage({
  building,
  backToMapHref,
  language = "pt",
}: BuildingPageProps) {
  const labels = buildingLabels[language];
  const hasHero = Boolean(
    building.title || building.eyebrow || building.hero,
  );
  const hasTechnicalSpecs = Boolean(building.technicalSpecs?.length);
  const hasHistory = Boolean(building.history);
  const hasCharacteristics = Boolean(building.characteristics?.length);
  const hasGallery = Boolean(building.gallery?.length);
  const backToMapAction = building.actions?.backToMap;
  const resolvedBackToMapHref = backToMapHref ?? backToMapAction?.href;
  const hasBackToMap = Boolean(resolvedBackToMapHref);
  const hasArchitectCta = Boolean(building.architectCta?.description);

  if (
    !hasHero &&
    !hasTechnicalSpecs &&
    !hasHistory &&
    !hasCharacteristics &&
    !hasGallery &&
    !hasBackToMap &&
    !hasArchitectCta
  ) {
    return null;
  }

  return (
    <article className="building-page building-flow">
      {hasHero ? (
        <section className="building-hero">
          {building.hero ? (
            <div className="building-hero__media">
              <Image
                alt={building.hero.alt || building.title}
                className="building-hero__image"
                fill
                priority
                sizes="100vw"
                src={building.hero.src}
              />
              <div className="building-hero__overlay"></div>
            </div>
          ) : null}

          <div className="building-hero__copy">
            {building.eyebrow ? (
              <p className="eyebrow eyebrow--light">{building.eyebrow}</p>
            ) : null}
            {building.title ? (
              <h1 className="building-hero__title">{building.title}</h1>
            ) : null}
            {building.subtitle ? (
              <p className="building-hero__subtitle">{building.subtitle}</p>
            ) : null}
          </div>
        </section>
      ) : null}

      {hasTechnicalSpecs ? (
        <section className="building-section building-section--specs building-flow__section">
          <div className="building-section__inner">
            <div className="building-specs-grid">
              {building.technicalSpecs?.map((spec) => (
                <div
                  className="building-spec"
                  key={`${spec.label}-${spec.value}`}
                >
                  <p className="meta-line meta-line--light">{spec.label}</p>
                  <p className="building-spec__value">{spec.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {hasHistory ? (
        <section className="building-section building-section--history building-flow__section">
          <div className="building-section__inner">
            <div className="section-heading">
              <h2 className="building-section__headline">
                <span className="building-section__headline-line"></span>{" "}
                {labels.history}
              </h2>
            </div>

            <RichText
              className="rich-text rich-text--muted building-history__text"
              content={building.history}
              emphasizeFirstParagraph
            />
          </div>
        </section>
      ) : null}

      {hasCharacteristics ? (
        <section className="building-section building-section--features building-flow__section">
          <div className="building-section__inner">
            <h2 className="building-section__title building-section__title--right">
              {labels.characteristics}
            </h2>

            <div className="building-feature-stack">
              {building.characteristics?.map((characteristic, index) => (
                <article
                  className={`info-card building-feature-card building-feature-card--${index % 2 === 0 ? "left" : "right"}`}
                  key={characteristic.title}
                >
                  <span className="material-symbols-outlined building-feature-icon">
                    {characteristic.icon}
                  </span>
                  <h3>{characteristic.title}</h3>
                  <p>{characteristic.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {hasGallery && building.gallery ? (
        <section className="building-section building-section--gallery building-flow__section">
          <div className="building-section__inner building-section__inner--wide">
            <div className="building-gallery__header">
              <h2 className="building-gallery__title">{labels.gallery}</h2>
            </div>
          </div>

          <BuildingGallery items={building.gallery} language={language} />
        </section>
      ) : null}

      {hasBackToMap ? (
        <section className="building-cta building-flow__section">
          <div className="building-cta__content">
            <FeatureAction
              href={resolvedBackToMapHref}
              icon="map"
              label={backToMapAction?.label ?? labels.backToMap}
              variant="primary"
            />
          </div>
        </section>
      ) : null}

      {hasArchitectCta && building.architectCta ? (
        <section className="building-section building-section--architect-cta building-flow__section">
          <div className="building-section__inner">
            <div className="building-architect-cta">
              <h2 className="building-architect-cta__title">{labels.architect}</h2>
              <p className="building-architect-cta__copy">
                {building.architectCta.description}
              </p>
              <div className="section-actions section-actions--center">
                <FeatureAction
                  href={building.architectCta.href}
                  icon="person"
                  label={building.architectCta.label}
                  variant="primary"
                />
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </article>
  );
}
