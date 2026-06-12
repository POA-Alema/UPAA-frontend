"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ImageModal } from "@/components/media/ImageModal";
import { RichText } from "@/components/content/rich-text";
import { PageSection } from "@/components/layout/page-section";
import { immigrationMock } from "../mocks/immigration-mock";
import type { ImmigrationSection } from "../types/immigration";
import "@/features/i18n";

type ImmigrationSectionComponentProps = {
  data: ImmigrationSection | null;
};

export function ImmigrationSectionComponent({
  data,
}: ImmigrationSectionComponentProps) {
  const { t } = useTranslation("common");
  const [hasImageError, setHasImageError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
            <button
              aria-label={t("image.expand", "Ampliar imagem")}
              className="group absolute inset-0 z-20 flex cursor-zoom-in items-start justify-end p-3"
              onClick={() => setIsOpen(true)}
              type="button"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-[#E9C46A] opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                <span className="material-symbols-outlined text-xl">open_in_full</span>
              </span>
            </button>
          </div>
          {isOpen ? (
            <ImageModal
              image={{ src: image.src, alt: image.alt }}
              onClose={() => setIsOpen(false)}
            />
          ) : null}
        </figure>
      ) : null}
    </PageSection>
  );
}
