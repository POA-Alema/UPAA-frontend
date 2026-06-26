"use client";

import { useTranslation } from "react-i18next";
import "@/features/i18n";
import type { LandingData } from "@/features/home/types/landing";

type MainContainerProps = {
  data: LandingData | null;
};

export default function MainContainer({ data }: MainContainerProps) {
  const { t } = useTranslation("common");

  if (!data) {
    return (
      <section
        className="section-card home-flow__section"
        data-testid="landing-fallback"
      >
        <span className="text-zinc-500 italic uppercase text-xs tracking-widest select-none">
          {t("home.no_content")}
        </span>
      </section>
    );
  }

  return (
    <section
      id="intro"
      className="section-card home-flow__section"
      data-testid="landing-content"
    >
      <h2 className="section-title section-title--full">
        <strong>{t("landing.title")}</strong>
      </h2>
      <p className="section-copy section-copy--accent">{t("landing.description")}</p>
    </section>
  );
}
