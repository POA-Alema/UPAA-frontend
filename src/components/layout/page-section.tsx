import type { ReactNode } from 'react';

type PageSectionProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
};

export function PageSection({
  eyebrow,
  title,
  description,
  children
}: PageSectionProps) {
  return (
    <section className="section-card">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2>{title}</h2>
      {description ? <p className="section-copy">{description}</p> : null}
      {children}
    </section>
  );
}
