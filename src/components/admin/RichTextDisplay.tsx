interface RichTextDisplayProps {
  content: string;
}

export function RichTextDisplay({ content }: RichTextDisplayProps) {
  return (
    <div
      className="prose prose-invert max-w-none text-on-surface/90 leading-relaxed"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
