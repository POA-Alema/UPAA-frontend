"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import "@/features/i18n";

type Props = { minimized?: boolean };

const sections = [
  { id: "intro" },
  { id: "immigration" },
  { id: "map-preview" },
  { id: "architects" },
];

export default function Footer({ minimized }: Props) {
  const { t } = useTranslation("common");

  function renderNavGrid() {
    return (
      <nav className="w-full footer-nav-grid">
        <div className="grid grid-cols-3 gap-4 text-center nav-items">
          {sections.map(function (s, idx) {
            const label = t(`layout.sections.${s.id}`, s.id);
            const extra = idx === 3 ? "col-start-2" : "";

            return (
              <Link
                key={s.id}
                href={`/#${s.id}`}
                className={`text-accent font-semibold text-xs leading-4 tracking-wide uppercase px-2 py-1 block hover:underline transition ${extra}`}
              >
                {label}
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
          {sections.map(function (s) {
            const label = t(`layout.sections.${s.id}`, s.id);

            return (
              <button
                key={s.id}
                onClick={function () {
                  handleMinClick(s.id);
                }}
                className="text-accent font-bold uppercase text-sm px-2 py-1 bg-transparent hover:underline"
              >
                {label}
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
          <h2 className="text-ui-accent text-center uppercase font-semibold text-2xl leading-7 tracking-wide">
            {t("layout.footer_title", "Uma Porto Alegre Alema")}
          </h2>
          <p className="text-ui-primary font-light text-xs leading-5 tracking-tight text-center max-w-2xl">
            {t(
              "layout.footer_subtitle",
              "Explorando a heranca arquitetonica alema no centro historico de Porto Alegre.",
            )}
          </p>
        </div>

        <div className="w-full">{renderNavGrid()}</div>

        <div className="w-full">
          <div
            className="h-px my-4"
            style={{ background: "var(--foreground)" }}
          />
        </div>

        <div className="w-full text-center text-primary text-xs leading-4 font-medium">
          {t("layout.project_line", "Projeto Academico desenvolvido na PUCRS")}
        </div>
      </div>
    </footer>
  );
}
