"use client";

import { useTranslation } from "react-i18next";
import "@/features/i18n";

import type { Building } from "@/data/buildings";
import { BuildingRouteLink } from "./building-route-link";
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
        <h3>{t("building.section_title", "Edificação")}</h3>
        <p>{building.description}</p>
      </article>
      <article className="info-card">
        <h3>{t("building.map_title", "Mapa")}</h3>
        <p>
          {t(
            "building.map_placeholder",
            "Integração com o mapa será conectada assim que a feature correspondente estiver disponível.",
          )}
        </p>
        <BuildingRouteLink
          latitude={building.latitude}
          longitude={building.longitude}
          className="mt-3 inline-flex items-center gap-2 text-accent hover:text-ui-accent font-semibold no-underline"
        />
      </article>
      <div className="content-grid__full">
        <BuildingMaterialsSection materials={building.materials} />
      </div>
    </div>
  );
}
