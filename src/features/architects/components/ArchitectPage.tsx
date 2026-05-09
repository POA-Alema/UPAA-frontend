import Image from "next/image";
import { RichText } from "@/components/content/rich-text";
import { FeatureAction } from "@/components/ui/feature-action";
import type { ArchitectPageProps } from "../types/architect";

export function ArchitectPage({ architect, backToMapHref }: ArchitectPageProps) {
  const hasHero = Boolean(
    architect.title || architect.eyebrow || architect.image,
  );
  const hasBiography = Boolean(architect.bio);
  const hasDetails = Boolean(architect.details?.length);
  const hasCharacteristics = Boolean(architect.characteristics?.length);
  const hasWorks = Boolean(architect.works?.length);
  const hasCta = Boolean(
    architect.ctaDescription || architect.actions?.secondary || backToMapHref,
  );

  if (
    !hasHero &&
    !hasBiography &&
    !hasDetails &&
    !hasCharacteristics &&
    !hasWorks &&
    !hasCta
  ) {
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
                  <Image
                    alt={architect.image.alt || architect.title}
                    className="architect-image"
                    fill
                    priority
                    sizes="(max-width: 768px) 260px, 260px"
                    src={architect.image.src}
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
              {architect.eyebrow ? (
                <p className="eyebrow eyebrow--light">{architect.eyebrow}</p>
              ) : null}
              {architect.title ? (
                <h1 className="architect-title architect-title--light">
                  O Legado de <br /> <strong>{architect.title}</strong>
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
                História
              </h2>
            </div>

            <RichText
              className="rich-text rich-text--muted"
              content={architect.bio}
              emphasizeFirstParagraph
            />

            {hasDetails ? (
              <div className="architect-detail-grid">
                {architect.details?.map((detail) => (
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
            ) : null}
          </div>
        </section>
      ) : null}

      {hasCharacteristics ? (
        <section className="architect-section architect-section--features architect-flow__section">
          <div className="architect-section__inner">
            <h2 className="architect-section__title">
              Características <br /> Arquitetônicas
            </h2>

            <div className="feature-grid">
              {architect.characteristics?.map((characteristic) => (
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
      ) : null}

      {hasWorks ? (
        <section className="architect-section architect-section--works architect-flow__section">
          <div className="architect-section__inner architect-section__inner--wide">
            <div className="architect-works__header">
              <h2 className="architect-works__title">Obras Marcantes</h2>
              <span className="architect-works__hint">
                <span className="material-symbols-outlined">swipe_left</span>
                Deslize
              </span>
            </div>

            <div className="architect-works__rail">
              {architect.works?.map((work, index) => (
                <figure className="architect-work-card" key={work.title}>
                  <div className="architect-work-card__media">
                    {work.image ? (
                      <>
                        <Image
                          alt={work.image.alt}
                          className="architect-image"
                          fill
                          priority={index === 0}
                          sizes="(max-width: 768px) 288px, 288px"
                          src={work.image.src}
                        />
                      </>
                    ) : (
                      <span className="material-symbols-outlined architect-work-card__fallback">
                        image
                      </span>
                    )}
                  </div>
                  <figcaption className="architect-work-card__caption">
                    <strong>{work.title}</strong>
                    {work.image?.caption ? (
                      <span>{work.image.caption}</span>
                    ) : null}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {hasCta ? (
        <section className="architect-cta architect-flow__section">
          <div className="architect-cta__content">
            {architect.ctaDescription ? (
              <p className="section-copy architect-cta__copy">
                {architect.ctaDescription}
              </p>
            ) : null}

            <div className="section-actions section-actions--row section-actions--center">
              {architect.actions?.secondary ? (
                <FeatureAction
                  href={architect.actions.secondary.href}
                  icon="explore"
                  label={architect.actions.secondary.label}
                  variant="primary"
                />
              ) : null}
              <FeatureAction
                href={backToMapHref}
                icon="map"
                label="Voltar ao Mapa"
                variant="ghost"
              />
            </div>
          </div>
        </section>
      ) : null}
    </article>
  );
}
