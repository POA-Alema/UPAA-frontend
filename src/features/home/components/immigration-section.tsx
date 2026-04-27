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
      title={data.title}
      className="immigration-section"
    >
      {data.image && (
        <div className="immigration-section__image-container mb-8">
          <Image
            src={data.image.src}
            alt={data.image.alt}
            width={600}
            height={600}
            className="w-full h-auto rounded-lg shadow-md"
            data-testid="immigration-image"
          />
        </div>
      )}
      <RichText
        content={data.content}
        emphasizeFirstParagraph
        className="immigration-section__content"
        data-testid="immigration-content"
      />
    </PageSection>
  );
}

