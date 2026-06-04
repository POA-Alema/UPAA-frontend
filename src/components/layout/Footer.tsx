"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

type Props = { minimized?: boolean };

export default function Footer({ minimized }: Props) {
  const { i18n } = useTranslation();

  type LangBundle = {
    title: string;
    subtitle: string;
    sections: Record<string, string>;
    projectLine: string;
  };

  const translations: Record<string, LangBundle> = {
    pt: {
      title: "Uma Porto Alegre Alemã",
      subtitle: "Explorando a herança arquitetônica alemã no centro histórico de Porto Alegre.",
      sections: {
        intro: "Introdução",
        immigration: "Imigração",
        "map-preview": "Mapa",
        architects: "Arquitetos",
      },
      projectLine: "Projeto Acadêmico desenvolvido na PUCRS"
    },
    en: {
      title: "A Germanic Porto Alegre",
      subtitle: "Exploring Germanic architectural heritage in Porto Alegre historic center.",
      sections: {
        intro: "Intro",
        immigration: "Immigration",
        "map-preview": "Map",
        architects: "Architects",
      },
      projectLine: "Academic project developed at PUCRS"
    },
    de: {
      title: "Ein deutsches Porto Alegre",
      subtitle: "Erkunden des deutsch beeinflussten architektonischen Erbes im historischen Zentrum von Porto Alegre.",
      sections: {
        intro: "Einführung",
        immigration: "Immigration",
        "map-preview": "Karte",
        architects: "Architekten",
      },
      projectLine: "Akademisches Projekt an der PUCRS"
    }
  };

  const lang = i18n?.language ?? "pt";

  const sections = [
    { id: "intro" },
    { id: "immigration" },
    { id: "map-preview" },
    { id: "architects" }
  ];

  function renderNavGrid() {
    return (
      <nav className="w-full footer-nav-grid">
        <div className="grid grid-cols-3 gap-4 text-center nav-items">
          {sections.map(function (s, idx) {
            const label = (translations[lang] && translations[lang].sections && translations[lang].sections[s.id]) || s.id;
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
            const label = (translations[lang] && translations[lang].sections && translations[lang].sections[s.id]) || s.id;
            return (
              <button
                key={s.id}
                onClick={function () { handleMinClick(s.id); }}
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
          <h2 className="text-ui-accent text-center uppercase font-semibold text-2xl leading-7 tracking-wide">{(translations[lang] && translations[lang].title) || translations.pt.title}</h2>
          <p className="text-ui-primary font-light text-xs leading-5 tracking-tight text-center max-w-2xl">{(translations[lang] && translations[lang].subtitle) || translations.pt.subtitle}</p>
        </div>

        <div className="w-full">
          {renderNavGrid()}
        </div>

        <div className="w-full">
          <div className="h-px my-4" style={{ background: "var(--foreground)" }} />
        </div>

        <div className="w-full text-center text-primary text-xs leading-4 font-medium">{(translations[lang] && translations[lang].projectLine) || translations.pt.projectLine}</div>
      </div>
    </footer>
  );
};
