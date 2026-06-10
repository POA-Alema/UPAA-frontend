"use client";

import { useState } from "react";
<<<<<<< HEAD
import { ExpandableImage } from "@/components/media/ExpandableImage";
=======
import { useTranslation } from "react-i18next";
import "@/features/i18n";
>>>>>>> 5437c96 (fix(i18n): replace hardcoded landing page content with dynamic translations)
import { RichText } from "@/components/content/rich-text";
import { PageSection } from "@/components/layout/page-section";
import { immigrationMock } from "../mocks/immigration-mock";
import type { ImmigrationSection } from "../types/immigration";

type ImmigrationSectionComponentProps = {
  data: ImmigrationSection | null;
};

export function ImmigrationSectionComponent({
  data,
}: ImmigrationSectionComponentProps) {
  const { t } = useTranslation("common");
  const [hasImageError, setHasImageError] = useState(false);

  if (!data || !data.title?.trim() || !data.content?.trim()) {
    return null;
  }

  const image = hasImageError ? immigrationMock.image : data.image ?? immigrationMock.image;

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
<<<<<<< HEAD
            <ExpandableImage
              image={image}
              imageClassName="architect-image immigration-section__image"
=======
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.src}
              alt={t("immigration.image_alt")}
              className="architect-image immigration-section__image"
              data-testid="immigration-image"
>>>>>>> 5437c96 (fix(i18n): replace hardcoded landing page content with dynamic translations)
              onError={() => setHasImageError(true)}
              sizes="(max-width: 820px) 92vw, 1100px"
            />
          </div>
        </figure>
      ) : null}
    </PageSection>
  );
}
