import Link from "next/link";
import { PageSection } from "@/components/layout/page-section";
import type { LinksSection as LinksSectionData } from "../types/links";

type LinksSectionProps = {
  data: LinksSectionData | null;
};

export function LinksSectionComponent({ data }: LinksSectionProps) {
  if (!data || data.items.length === 0) {
    return null;
  }

  return (
    <PageSection
      id="links"
      eyebrow="Acesse"
      title={<strong>{data.title}</strong>}
      className="home-flow__section home-links-section"
    >
      <ul className="home-links-section__list">
        {data.items.map((item) => (
          <li key={item.id} className="home-links-section__item">
            <Link
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="home-links-section__link"
            >
              <span className="home-links-section__label">{item.label}</span>
              {item.description ? (
                <span className="home-links-section__description">
                  {item.description}
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </PageSection>
  );
}