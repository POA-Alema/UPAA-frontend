import { describe, it, expect, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { I18nextProvider, useTranslation } from "react-i18next";
import i18n from "@/features/i18n";

function TranslatedText() {
  const { t } = useTranslation("common");
  return (
    <div>
      <span data-testid="header-logo">{t("header.logo_line1")}</span>
      <span data-testid="nav-intro">{t("nav.section_intro")}</span>
      <span data-testid="footer-title">{t("footer.title")}</span>
      <span data-testid="home-cta">{t("home.intro_cta")}</span>
      <span data-testid="map-loading">{t("map.loading")}</span>
      <span data-testid="building-title">{t("building.section_title")}</span>
    </div>
  );
}

function renderWithI18n() {
  return render(
    <I18nextProvider i18n={i18n}>
      <TranslatedText />
    </I18nextProvider>,
  );
}

afterEach(async () => {
  await act(async () => {
    await i18n.changeLanguage("pt");
  });
});

describe("i18n provider — language switching and re-render", () => {
  it("renders Portuguese translations by default", () => {
    renderWithI18n();

    expect(screen.getByTestId("header-logo")).toHaveTextContent("Uma");
    expect(screen.getByTestId("nav-intro")).toHaveTextContent("Introdução");
    expect(screen.getByTestId("footer-title")).toHaveTextContent(
      "Uma Porto Alegre Alemã",
    );
    expect(screen.getByTestId("home-cta")).toHaveTextContent("Explorar Mapa");
    expect(screen.getByTestId("map-loading")).toHaveTextContent(
      "Carregando dados do mapa.",
    );
    expect(screen.getByTestId("building-title")).toHaveTextContent(
      "Edificação",
    );
  });

  it("switches to English without page reload", async () => {
    renderWithI18n();

    await act(async () => {
      await i18n.changeLanguage("en");
    });

    expect(screen.getByTestId("header-logo")).toHaveTextContent("A");
    expect(screen.getByTestId("nav-intro")).toHaveTextContent("Intro");
    expect(screen.getByTestId("footer-title")).toHaveTextContent(
      "A Germanic Porto Alegre",
    );
    expect(screen.getByTestId("home-cta")).toHaveTextContent("Explore Map");
    expect(screen.getByTestId("map-loading")).toHaveTextContent(
      "Loading map data.",
    );
    expect(screen.getByTestId("building-title")).toHaveTextContent("Building");
  });

  it("switches to German without page reload", async () => {
    renderWithI18n();

    await act(async () => {
      await i18n.changeLanguage("de");
    });

    expect(screen.getByTestId("header-logo")).toHaveTextContent("Ein");
    expect(screen.getByTestId("nav-intro")).toHaveTextContent("Einführung");
    expect(screen.getByTestId("footer-title")).toHaveTextContent(
      "Ein deutsches Porto Alegre",
    );
    expect(screen.getByTestId("home-cta")).toHaveTextContent("Karte Erkunden");
    expect(screen.getByTestId("map-loading")).toHaveTextContent(
      "Kartendaten werden geladen.",
    );
    expect(screen.getByTestId("building-title")).toHaveTextContent("Gebäude");
  });

  it("cycles through all languages and returns to Portuguese", async () => {
    renderWithI18n();

    await act(async () => {
      await i18n.changeLanguage("en");
    });
    expect(screen.getByTestId("home-cta")).toHaveTextContent("Explore Map");

    await act(async () => {
      await i18n.changeLanguage("de");
    });
    expect(screen.getByTestId("home-cta")).toHaveTextContent("Karte Erkunden");

    await act(async () => {
      await i18n.changeLanguage("pt");
    });
    expect(screen.getByTestId("home-cta")).toHaveTextContent("Explorar Mapa");
  });

  it("produces non-empty strings for all critical keys in every language", async () => {
    const criticalKeys = [
      "header.logo_line1",
      "header.logo_line3",
      "header.action_map",
      "header.action_home",
      "header.lang_pt",
      "header.lang_de",
      "header.lang_en",
      "nav.section_intro",
      "nav.section_immigration",
      "nav.section_map",
      "nav.section_architects",
      "footer.title",
      "footer.subtitle",
      "footer.project_line",
      "home.intro_description",
      "home.intro_cta",
      "home.map_preview_alt",
      "home.no_content",
      "map.loading",
      "map.empty",
      "map.you_are_here",
      "building.section_title",
    ] as const;

    for (const lng of ["pt", "en", "de"] as const) {
      await act(async () => {
        await i18n.changeLanguage(lng);
      });

      for (const key of criticalKeys) {
        const value = i18n.t(key, { ns: "common" });
        expect(value, `Key "${key}" is empty for language "${lng}"`).toBeTruthy();
        expect(
          value,
          `Key "${key}" returned raw key for language "${lng}"`,
        ).not.toBe(key);
      }
    }
  });
});
