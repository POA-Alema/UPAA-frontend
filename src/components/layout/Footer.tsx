"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import "@/features/i18n";

const SECTION_IDS = ["intro", "immigration", "map-preview", "architects"] as const;

const SECTION_KEYS: Record<string, string> = {
  intro: "nav.section_intro",
  immigration: "nav.section_immigration",
  "map-preview": "nav.section_map",
  architects: "nav.section_architects",
};

type Props = { minimized?: boolean };

export default function Footer({ minimized }: Props) {
  const { t } = useTranslation("common");

  function renderNavGrid() {
    return (
      <nav className="w-full footer-nav-grid">
        <div className="grid grid-cols-3 gap-4 text-center nav-items">
          {SECTION_IDS.map(function (id, idx) {
            const extra = idx === 3 ? "col-start-2" : "";
            return (
              <Link
                key={id}
                href={`/#${id}`}
                className={`text-accent font-semibold text-xs leading-4 tracking-wide uppercase px-2 py-1 block hover:underline transition ${extra}`}
              >
                {t(SECTION_KEYS[id])}
              </Link>
            );
          })}
        </div>
      </nav>
    );
  }

  function handleMinClick(id: string) {
    if (typeof window === "undefined") {
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    window.location.href = `/#${id}`;
  }

  if (minimized) {
    return (
      <footer className="w-full bg-ui-surface border-t border-zinc-800 mt-auto py-4">
        <div className="w-full px-4 flex flex-wrap gap-2 justify-center">
          {SECTION_IDS.map(function (id) {
            return (
              <button
                key={id}
                onClick={function () { handleMinClick(id); }}
                className="text-accent font-bold uppercase text-sm px-2 py-1 bg-transparent hover:underline"
              >
                {t(SECTION_KEYS[id])}
              </button>
            );
          })}
        </div>
      </footer>
    );
  }

  return (
    <footer className="w-full bg-ui-surface text-white border-t border-zinc-800 mt-auto">
      <div className="w-full mx-auto px-6 py-10 flex flex-col items-center gap-5">
        <div className="w-full flex flex-col items-center gap-5">
          <h2 className="text-ui-accent text-center uppercase font-semibold text-2xl leading-7 tracking-wide">{t("footer.title")}</h2>
          <p className="text-ui-primary font-light text-xs leading-5 tracking-tight text-center max-w-2xl">{t("footer.subtitle")}</p>
        </div>

        <div className="w-full">
          {renderNavGrid()}
        </div>

        <div className="w-full">
          <div className="h-px my-4" style={{ background: "var(--foreground)" }} />
        </div>

        <div className="w-full text-center text-primary text-xs leading-4 font-medium">{t("footer.project_line")}</div>
      </div>
    </footer>
  );
};
