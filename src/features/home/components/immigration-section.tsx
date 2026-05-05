import Image from "next/image";
import { RichText } from "@/components/content/rich-text";
import { PageSection } from "@/components/layout/page-section";
import type { ImmigrationSection } from "../types/immigration";

type ImmigrationSectionComponentProps = {
  data: ImmigrationSection | null;
};

export function ImmigrationSectionComponent({
  data,
}: ImmigrationSectionComponentProps) {
  if (!data || (!data.title && !data.content)) {
    return null;
  }

  return (
    <PageSection
      eyebrow={data.eyebrow}
      title={
        <>
          A Importância da <strong>Imigração Alemã</strong> para o Estado
        </>
      }
      className="home-flow__section immigration-section"
    >
      <div className="section-divider section-divider--accent"></div>

      <RichText
        content={data.content}
        emphasizeFirstParagraph
        className="immigration-section__content"
        data-testid="immigration-content"
      />

      {data.image ? (
        <figure className="immigration-section__media">
          <div className="architect-image-frame immigration-section__image-frame">
            <Image
              src={data.image.src}
              alt={data.image.alt}
              width={900}
              height={675}
              className="architect-image immigration-section__image"
              data-testid="immigration-image"
            />
          </div>
        </figure>
      ) : null}
    </PageSection>
  );
}
