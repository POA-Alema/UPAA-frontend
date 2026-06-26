"use client";

import Link from "next/link";
import { PageSection } from "@/components/layout/page-section";
import type { LinksSection as LinksSectionData } from "../types/links";
import { useTranslation } from "react-i18next";
import "@/features/i18n";

type LinksSectionProps = {
  data: LinksSectionData | null;
};

export function LinksSectionComponent({ data }: LinksSectionProps) {
  const { t } = useTranslation("common");

  if (!data || data.items.length === 0) {
    return null;
  }

  return (
    <PageSection
      id="links"
      eyebrow={t("partners.eyebrow")}
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
