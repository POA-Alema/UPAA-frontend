import { RichText } from "@/components/content/rich-text";
import { PageSection } from "@/components/layout/page-section";
import type { ImmigrationSection } from "../types/immigration";

type ImageProps = {
  src: string;
  alt: string;
  className?: string;
  "data-testid"?: string;
};

function Image({
  src,
  alt,
  className,
  "data-testid": testId,
}: ImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      data-testid={testId}
    />
  );
}

type ImmigrationSectionComponentProps = {
  data: ImmigrationSection | null;
};

export function ImmigrationSectionComponent({
  data,
}: ImmigrationSectionComponentProps) {
  if (!data || !data.content?.trim()) {
    return null;
  }

  return (
    <PageSection
      eyebrow={data.eyebrow}
      title={
        <>
          {"A Importância da "}
          <strong>Imigração Alemã</strong>
          {" para o Estado"}
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
              alt="Fachada do Museu de Arte do Rio Grande do Sul, edificação histórica no centro de Porto Alegre"
              className="architect-image immigration-section__image"
              data-testid="immigration-image"
            />
          </div>
        </figure>
      ) : null}
    </PageSection>
  );
}