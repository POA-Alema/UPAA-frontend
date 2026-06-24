"use client";

import { useTranslation } from "react-i18next";
import "@/features/i18n";
import type { Building } from "@/data/buildings";
import { BuildingMaterialsSection } from "./building-materials-section";

type BuildingDetailPanelProps = {
  building: Building;
};

export function BuildingDetailPanel({ building }: BuildingDetailPanelProps) {
  const { t } = useTranslation("common");

  return (
    <div className="content-grid">
      <article className="info-card">
        <p className="meta-line">
          {building.location} - {building.constructionPeriod}
        </p>
        <h3>{t("building_detail.content_title", "Edificacao")}</h3>
        <p>{building.description}</p>
      </article>
      <article className="info-card">
        <h3>{t("building_detail.map_title", "Mapa")}</h3>
        <p>
          {t(
            "building_detail.map_pending",
            "Integracao com o mapa sera conectada assim que a feature correspondente estiver disponivel.",
          )}
        </p>
      </article>
      <div className="content-grid__full">
        <BuildingMaterialsSection materials={building.materials} />
      </div>
    </div>
  );
}
