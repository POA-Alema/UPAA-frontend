"use client";

import { useTranslation } from "react-i18next";
import "@/features/i18n";

import type { Building } from "@/data/buildings";
<<<<<<< HEAD
import { BuildingRouteLink } from "./building-route-link";
=======
import { BuildingMaterialsSection } from "./building-materials-section";
>>>>>>> aef6f16 (US19-FE76 adiciona secao de materiais das edificacoes)

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
<<<<<<< HEAD
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
=======
        <h3>Edificacao</h3>
        <p>{building.description}</p>
      </article>
      <article className="info-card">
        <h3>Mapa</h3>
        <p>
          Integracao com o mapa sera conectada assim que a feature
          correspondente estiver disponivel.
        </p>
>>>>>>> aef6f16 (US19-FE76 adiciona secao de materiais das edificacoes)
      </article>
      <div className="content-grid__full">
        <BuildingMaterialsSection materials={building.materials} />
      </div>
    </div>
  );
}
