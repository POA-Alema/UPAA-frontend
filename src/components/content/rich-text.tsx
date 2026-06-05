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
  if (!content) return null;

  // Check if content has HTML paragraph tags
  const hasParagraphTags = /<p>/i.test(content);

  let paragraphs: string[] = [];
  if (hasParagraphTags) {
    // Extract contents of each <p>...</p> block while preserving internal tags
    const matches = content.match(/<p>([\s\S]*?)<\/p>/gi);
    if (matches) {
      paragraphs = matches.map((p) => p.replace(/^<p>/i, "").replace(/<\/p>$/i, "").trim());
    } else {
      paragraphs = [content.trim()];
    }
  } else {
    // Fallback for plain text or text without <p> tags
    paragraphs = content
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
  }

  if (paragraphs.length === 0) {
    return null;
  }

  return (
    <div className={className} {...props}>
      {paragraphs.map((paragraph, index) => {
        const isLead = emphasizeFirstParagraph && index === 0;
        const startsWithTag = paragraph.trim().startsWith("<");

        if (!isLead) {
          return (
            <p
              className="rich-text__paragraph"
              key={`${paragraph.slice(0, 24)}-${index}`}
              dangerouslySetInnerHTML={{ __html: paragraph }}
            />
          );
        }

        if (startsWithTag) {
          return (
            <p
              className="rich-text__paragraph rich-text__paragraph--lead"
              key={`${paragraph.slice(0, 24)}-${index}`}
              dangerouslySetInnerHTML={{ __html: paragraph }}
            />
          );
        }

        return (
          <p
            className="rich-text__paragraph rich-text__paragraph--lead"
            key={`${paragraph.slice(0, 24)}-${index}`}
          >
            <span aria-hidden="true" className="rich-text__dropcap">
              {paragraph.charAt(0)}
            </span>
            <span dangerouslySetInnerHTML={{ __html: paragraph.slice(1) }} />
          </p>
        );
      })}
    </div>
  );
}
