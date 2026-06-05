import type { HTMLAttributes } from "react";

type RichTextProps = HTMLAttributes<HTMLDivElement> & {
  content: string;
  emphasizeFirstParagraph?: boolean;
};

export function RichText({
  content,
  emphasizeFirstParagraph = false,
  className = "",
  ...props
}: RichTextProps) {
  const processedContent = content
    .replace(/<\/p>\s*<p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "");

  const paragraphs = processedContent
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) {
    return null;
  }

  return (
    <div className={className} {...props}>
      {paragraphs.map((paragraph, index) => {
        const isLead = emphasizeFirstParagraph && index === 0;

        if (!isLead) {
          return (
            <p className="rich-text__paragraph" key={`${paragraph.slice(0, 24)}-${index}`}>
              {paragraph}
            </p>
          );
        }

        return (
          <p className="rich-text__paragraph rich-text__paragraph--lead" key={`${paragraph.slice(0, 24)}-${index}`}>
            <span aria-hidden="true" className="rich-text__dropcap">
              {paragraph.charAt(0)}
            </span>
            {paragraph.slice(1)}
          </p>
        );
      })}
    </div>
  );
}
