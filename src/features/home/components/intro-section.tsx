"use client";

import { useTranslation } from "react-i18next";
import "@/features/i18n";
import { FeatureAction } from "@/components/ui/feature-action";

export function IntroSection() {
  const { t } = useTranslation("common");

  return (
      <div className="home-intro__lead">
        <p className="home-intro__description">
          {t("home.intro_description")}
        </p>
        <FeatureAction
          href="/mapa"
          icon="map"
          label={t("home.intro_cta")}
          variant="primary"
        />
      </div>
  );
}
