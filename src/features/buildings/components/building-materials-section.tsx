"use client";

import { useTranslation } from "react-i18next";
import "@/features/i18n";

import Image from "next/image";

import type {
  BuildingMaterial,
  BuildingMaterialType,
} from "@/types/building";

type BuildingMaterialsSectionProps = {
  materials?: BuildingMaterial[] | null;
};

const MATERIAL_META: Record<
  BuildingMaterialType,
  {
    icon: string;
    labelKey: string;
    defaultLabel: string;
  }
> = {
  plant: {
    icon: "architecture",
    labelKey: "building_materials.types.plant",
    defaultLabel: "Planta",
  },
  document: {
    icon: "description",
    labelKey: "building_materials.types.document",
    defaultLabel: "Documento",
  },
  analysis: {
    icon: "analytics",
    labelKey: "building_materials.types.analysis",
    defaultLabel: "Análise",
  },
};

export function BuildingMaterialsSection({
  materials,
}: BuildingMaterialsSectionProps) {
  const { t } = useTranslation("common");
  const hasMaterials = Boolean(materials?.length);

  return (
    <section
      aria-labelledby="building-materials-title"
      className="building-materials"
    >
      <div className="building-materials__header">
        <h2 id="building-materials-title" className="building-materials__title">
          {t("building_materials.title", "Galeria de materiais")}
        </h2>
        {hasMaterials && (
          <p className="building-materials__hint">
            <span className="material-symbols-outlined" aria-hidden="true">
              swipe
            </span>
            {t("building_materials.slide_hint", "Deslize")}
          </p>
        )}
      </div>

      {hasMaterials ? (
        <div
          aria-label={t(
            "building_materials.list_label",
            "Materiais adicionais da edificação",
          )}
          className="building-materials__rail"
          role="list"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
              e.preventDefault();
              e.currentTarget.scrollBy({
                left: e.key === "ArrowRight" ? 384 : -384,
                behavior: "smooth",
              });
            }
          }}
          tabIndex={0}
        >
          {(materials ?? []).map((material) => {
            const meta = MATERIAL_META[material.type];
            const typeLabel = t(meta.labelKey, meta.defaultLabel);
            const displayTitle =
              material.title ||
              t("building_materials.unnamed", "Material");
            const content = (
              <>
                <div className="building-materials__card-media">
                  {material.previewUrl ? (
                    <Image
                      alt={material.previewAlt ?? displayTitle}
                      className="building-materials__card-image"
                      fill
                      loading="lazy"
                      sizes="(max-width: 820px) 82vw, 360px"
                      src={material.previewUrl}
                    />
                  ) : null}
                  <span className="building-materials__type-badge">
                    <span
                      className="material-symbols-outlined"
                      aria-hidden="true"
                    >
                      {meta.icon}
                    </span>
                    {typeLabel}
                  </span>
                </div>
                <div className="building-materials__caption">
                  <strong>{displayTitle}</strong>
                  {material.description && <span>{material.description}</span>}
                </div>
              </>
            );

            if (material.url) {
              return (
                <a
                  aria-label={t(
                    "building_materials.open_label",
                    "Abrir {{type}}: {{title}}",
                    { title: displayTitle, type: typeLabel },
                  )}
                  className="building-materials__card"
                  href={material.url}
                  key={material.id}
                  rel="noopener noreferrer"
                  role="listitem"
                  target="_blank"
                >
                  {content}
                </a>
              );
            }

            return (
              <article className="building-materials__card" key={material.id} role="listitem">
                {content}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="building-materials__empty" role="status">
          <span className="material-symbols-outlined" aria-hidden="true">
            inventory_2
          </span>
          <p>
            {t(
              "building_materials.empty",
              "Nenhum material adicional cadastrado.",
            )}
          </p>
        </div>
      )}
    </section>
  );
}
