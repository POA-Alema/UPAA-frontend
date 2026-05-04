import Image from "next/image";
import { RichText } from "@/components/content/rich-text";
import { FeatureAction } from "@/components/ui/feature-action";
import type { BuildingPageProps } from "../types/building";

export function BuildingPage({ building }: BuildingPageProps) {
  const hasHero = Boolean(
    building.title || building.eyebrow || building.hero,
  );
  const hasTechnicalSpecs = Boolean(building.technicalSpecs?.length);
  const hasHistory = Boolean(building.history);
  const hasCharacteristics = Boolean(building.characteristics?.length);
  const hasGallery = Boolean(building.gallery?.length);
  const hasBackToMap = Boolean(building.actions?.backToMap);
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
              <p className="eyebrow">{building.eyebrow}</p>
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
                  <p className="meta-line">{spec.label}</p>
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
                Histórico
              </h2>
            </div>

            <RichText
              className="rich-text rich-text--muted building-history__text"
              content={building.history}
            />
          </div>
        </section>
      ) : null}

      {hasCharacteristics ? (
        <section className="building-section building-section--features building-flow__section">
          <div className="building-section__inner">
            <h2 className="building-section__title building-section__title--right">
              Características <br /> Arquitetônicas
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

      {hasGallery ? (
        <section className="building-section building-section--gallery building-flow__section">
          <div className="building-section__inner building-section__inner--wide">
            <div className="building-gallery__header">
              <h2 className="building-gallery__title">Galeria de Fotos</h2>
              <span className="building-gallery__hint">
                <span className="material-symbols-outlined">swipe_left</span>
                Deslize
              </span>
            </div>

            <div className="building-gallery__rail">
              {building.gallery?.map((item, index) => (
                <figure className="building-gallery-card" key={item.src}>
                  <div className="building-gallery-card__media">
                    <Image
                      alt={item.alt}
                      className="building-gallery-card__image"
                      fill
                      priority={index === 0}
                      sizes="(max-width: 768px) 80vw, 320px"
                      src={item.src}
                    />
                  </div>
                  {item.caption ? (
                    <figcaption className="building-gallery-card__caption">
                      {item.caption}
                    </figcaption>
                  ) : null}
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {hasBackToMap && building.actions?.backToMap ? (
        <section className="building-cta building-flow__section">
          <div className="building-cta__content">
            <FeatureAction
              href={building.actions.backToMap.href}
              icon="map"
              label={building.actions.backToMap.label}
              variant="primary"
            />
          </div>
        </section>
      ) : null}

      {hasArchitectCta && building.architectCta ? (
        <section className="building-section building-section--architect-cta building-flow__section">
          <div className="building-section__inner">
            <div className="building-architect-cta">
              <h2 className="building-architect-cta__title">O Arquiteto</h2>
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
