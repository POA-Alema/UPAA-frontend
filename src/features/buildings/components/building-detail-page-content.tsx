"use client";

import { useTranslation } from "react-i18next";
import "@/features/i18n";
import { PageSection } from "@/components/layout/page-section";
import type { Building } from "@/data/buildings";
import { BuildingDetailPanel } from "./building-detail-panel";

type BuildingDetailPageContentProps = {
  building: Building;
};

export function BuildingDetailPageContent({
  building,
}: BuildingDetailPageContentProps) {
  const { t } = useTranslation("common");

  return (
    <PageSection
      eyebrow={t("building_detail.eyebrow", "Edificacao")}
      title={building.title}
      description={t("building_detail.description", "Descricao")}
    >
      <BuildingDetailPanel building={building} />
    </PageSection>
  );
}
