"use client";

import { useTranslation } from "react-i18next";
import "@/features/i18n";
import { FeatureAction } from "@/components/ui/feature-action";

export function IntroSection() {
  const { t } = useTranslation("common");

  return (
    <div className="home-intro__lead">
      <p className="home-intro__description">
        {t(
          "landing.intro_description",
          "Explore no mapa as obras que transformaram Porto Alegre e descubra como esse legado ainda marca a paisagem da cidade.",
        )}
      </p>
      <FeatureAction
        href="/mapa"
        icon="map"
        label={t("landing.map_cta", "Explorar Mapa")}
        variant="primary"
      />
    </div>
  );
}
