"use client";

import { useTranslation } from "react-i18next";
import "@/features/i18n";

import { buildExternalRouteUrl } from "@/features/map/utils/external-route";

type BuildingRouteLinkProps = {
  latitude?: number | null;
  longitude?: number | null;
  className?: string;
};

export function BuildingRouteLink({
  latitude,
  longitude,
  className,
}: BuildingRouteLinkProps) {
  const { t } = useTranslation("common");
  const routeUrl = buildExternalRouteUrl({ latitude, longitude });

  if (!routeUrl) {
    return null;
  }

  return (
    <a
      href={routeUrl}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={t(
        "map.open_route_aria",
        "Abrir rota em aplicativo de navegacao",
      )}
      className={
        className ??
        "inline-flex items-center gap-2 text-accent hover:text-ui-accent font-semibold no-underline"
      }
    >
      <span className="material-symbols-outlined">route</span>
      <span>{t("map.open_route", "Abrir rota")}</span>
    </a>
  );
}
