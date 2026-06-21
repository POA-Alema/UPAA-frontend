"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import "@/features/i18n";
import MenuToggle from "@/components/ui/MenuToggle";
import { resolveLocale, toI18nLanguage } from "@/lib/language";
import { useLanguage } from "@/lib/use-language";
import { SECTION_IDS, SECTION_KEYS } from "@/lib/nav-sections";

const LANGUAGES = [
  { code: "pt", labelKey: "header.lang_pt" },
  { code: "de", labelKey: "header.lang_de" },
  { code: "en", labelKey: "header.lang_en" },
] as const;

const Header = function Header() {
  const pathname = usePathname() || "/";
  const { t } = useTranslation("common");
  const { locale, setLocale, source } = useLanguage();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  const lang = toI18nLanguage(locale);

  const isLanding = pathname === "/";
  const actionHref = isLanding ? "/mapa" : "/";
  const actionLabel = isLanding
    ? t("header.action_map")
    : t("header.action_home");

  function changeLang(lng: string) {
    setLocale(resolveLocale(lng));
    setOpen(false);
  };

  function scrollToSection(id: string) {
    setOpen(false);
    if (typeof window === "undefined") {
      return;
    }
    const el = document.getElementById(id);
    if (!el) {
      window.location.href = `/#${id}`;
      return;
    }
    el.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(function () {
    function handleOutsideClick(e: MouseEvent | TouchEvent) {
      if (!open) {
        return;
      }
      const target = e.target as Node | null;
      if (!target) {
        return;
      }
      if (menuRef.current && menuRef.current.contains(target)) {
        return;
      }
      if (toggleRef.current && toggleRef.current.contains(target)) {
        return;
      }
      setOpen(false);
    }

    function handleKeydown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    document.addEventListener("keydown", handleKeydown);
    return function () {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [open]);

  const logoLines = [
    { key: "header.logo_line1" as const, accent: false },
    { key: "header.logo_line2" as const, accent: false },
    { key: "header.logo_line3" as const, accent: true },
  ];

  return (
    <header className="w-full sticky top-0 z-50 bg-ui-surface text-white border-b border-zinc-800 shadow-md backdrop-blur-sm">
      <div className="relative max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex flex-col leading-tight">
            {logoLines.map(function (line, idx) {
              const cls = line.accent ? "text-ui-accent" : "text-ui-primary";
              return (
                <span key={idx} className={`${cls} font-light text-sm md:text-base`}>{t(line.key)}</span>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href={actionHref} className="inline-flex items-center px-2 py-1 hover:bg-white/5 transition-colors rounded text-sm font-medium uppercase">
            {actionLabel}
          </Link>

          <button
            aria-label="menu"
            aria-expanded={open}
            ref={toggleRef}
            onClick={() => {setOpen(open => !open)} }
            className="w-8 h-8 rounded-md flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/40 hover:bg-white/5"
          >
            <MenuToggle open={open} />
          </button>
        </div>

          <div ref={menuRef} className={`absolute right-6 top-full z-50 origin-top-right ${open ? "pointer-events-auto opacity-100 scale-y-100" : "pointer-events-none opacity-0 scale-y-0"} transition-[transform,opacity] duration-500`}>
            <div className="min-w-55 bg-ui-surface border border-white/10 rounded-md p-4 shadow-xl transform-origin-top-right">
              <div className="flex flex-col gap-2 pb-3">
                {SECTION_IDS.map(function (id) {
                  return (
                    <button
                      key={id}
                      onClick={() => { scrollToSection(id); }}
                      className="w-full text-left text-sm font-semibold text-ui-primary px-2 py-2 rounded hover:bg-white/5 transition-transform duration-500 hover:translate-x-1 uppercase"
                    >
                      {t(SECTION_KEYS[id])}
                    </button>
                  );
                })}
              </div>

              <div className="h-px bg-white/60 my-2" />

              <div className="flex items-center justify-between gap-1">
                {LANGUAGES.map(({ code, labelKey }) => (
                  <button
                    key={code}
                    onClick={() => { changeLang(code); }}
                    className={`flex-1 text-xs uppercase py-2 px-2 rounded bg-white/5 hover:bg-white/10 transition transform hover:scale-105 ${lang === code ? "ring-2 ring-ui-accent" : ""}`}
                    aria-describedby="language-source"
                    aria-pressed={lang === code}
                  >
                    {t(labelKey)}
                  </button>
                ))}
              </div>
              <span className="sr-only" id="language-source">
                {source === "persisted"
                  ? t("header.language_source_persisted")
                  : source === "browser"
                    ? t("header.language_source_browser")
                    : t("header.language_source_default")}
              </span>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
