"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import "@/features/i18n";
import { RichText } from "@/components/content/rich-text";
import { PageSection } from "@/components/layout/page-section";
import type { ImmigrationSection } from "../types/immigration";

type ImmigrationSectionComponentProps = {
  data: ImmigrationSection | null;
};

export function ImmigrationSectionComponent({
  data,
}: ImmigrationSectionComponentProps) {
  const { t } = useTranslation("common");
  const [hasImageError, setHasImageError] = useState(false);

  if (!data) {
    return null;
  }

  const image = hasImageError ? undefined : data.image;

  return (
    <PageSection
      id="immigration"
      eyebrow={t("immigration.eyebrow")}
      title={<strong>{t("immigration.title")}</strong>}
      className="home-flow__section immigration-section"
    >
      <div className="section-divider section-divider--accent"></div>
    
      <RichText
        content={t("immigration.content")}
        emphasizeFirstParagraph
        className="immigration-section__content"
        data-testid="immigration-content"
      />

      {image ? (
        <figure className="immigration-section__media">
          <div className="architect-image-frame immigration-section__image-frame">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.src}
              alt={t("immigration.image_alt")}
              className="architect-image immigration-section__image"
              data-testid="immigration-image"
              onError={() => setHasImageError(true)}
              sizes="(max-width: 820px) 92vw, 1100px"
            />
          </div>
        </figure>
      ) : null}
    </PageSection>
  );
}
