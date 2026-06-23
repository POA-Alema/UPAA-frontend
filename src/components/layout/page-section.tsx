import type { ReactNode } from "react";

type PageSectionProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  children?: ReactNode;
  className?: string;
  id?: string;
};

export function PageSection({ eyebrow, title, description, children, className = "", id }: PageSectionProps) {
  return (
    <section id={id} className={["section-card", className].filter(Boolean).join(" ")}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="section-title">
        {title}
      </h2>
      {description ? <p className="section-copy">{description}</p> : null}
      {children}
    </section>
  );
}
