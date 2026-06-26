"use client";

import { useTranslation } from "react-i18next";
import "@/features/i18n";
import { PageSection } from "@/components/layout/page-section";
import { BuildingList } from "@/features/buildings/components/building-list";

export function BuildingsPageSection() {
  const { t } = useTranslation("common");

  return (
    <PageSection
      eyebrow={t("building.page_title")}
      title={t("building.page_title")}
      description={t("building.page_description")}
    >
      <BuildingList />
    </PageSection>
  );
}
