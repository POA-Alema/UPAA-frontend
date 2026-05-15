"use client";

import { useState } from "react";
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
  const [hasImageError, setHasImageError] = useState(false);

  if (!data || !data.title?.trim() || !data.content?.trim()) {
    return null;
  }

  const image = hasImageError ? immigrationMock.image : data.image ?? immigrationMock.image;

  return (
    <PageSection
      id="immigration"
      eyebrow={data.subtitle}
      title={<strong>{data.title}</strong>}
      className="home-flow__section immigration-section"
    >
      <div className="section-divider section-divider--accent"></div>
    
      <RichText
        content={data.content}
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
              alt={image.alt}
              className="architect-image immigration-section__image"
              data-testid="immigration-image"
              onError={() => setHasImageError(true)}
            />
          </div>
        </figure>
      ) : null}
    </PageSection>
  );
}
