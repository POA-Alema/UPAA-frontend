"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import "@/features/i18n";
import MenuToggle from "@/components/ui/MenuToggle";

const sections = [
  { id: "intro" },
  { id: "immigration" },
  { id: "map-preview" },
  { id: "architects" },
];

const Header = function Header() {
  const pathname = usePathname() || "/";
  const { t, i18n } = useTranslation("common");
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  const isLanding = pathname === "/";
  const actionHref = isLanding ? "/mapa" : "/";
  const actionLabel = isLanding
    ? t("layout.actions.map", "Mapa")
    : t("layout.actions.home", "Home");
  const logoParts = t("layout.logo_parts", {
    defaultValue: ["Uma", "Porto Alegre", "Alema"],
    returnObjects: true,
  }) as unknown as string[];

  function changeLang(lng: string) {
    if (i18n?.changeLanguage) {
      i18n.changeLanguage(lng).catch(function () {});
    }

    try {
      localStorage.setItem("i18nextLng", lng);
      document.documentElement.lang = lng;
    } catch {
      console.warn("Could not save language preference");
    }
  }

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
  }

  useEffect(
    function syncHtmlLang() {
      document.documentElement.lang = i18n.language;
    },
    [i18n.language],
  );

  useEffect(
    function bindMenuCloseHandlers() {
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
        if (e.key === "Escape") {
          setOpen(false);
        }
      }

      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("touchstart", handleOutsideClick);
      document.addEventListener("keydown", handleKeydown);

      return function () {
        document.removeEventListener("mousedown", handleOutsideClick);
        document.removeEventListener("touchstart", handleOutsideClick);
        document.removeEventListener("keydown", handleKeydown);
      };
    },
    [open],
  );

  return (
    <header className="w-full sticky top-0 z-50 bg-ui-surface text-white border-b border-zinc-800 shadow-md backdrop-blur-sm">
      <div className="relative max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex flex-col leading-tight">
            {logoParts.map(function (part: string, idx: number) {
              const cls = idx === 2 ? "text-ui-accent" : "text-ui-primary";

              return (
                <span
                  key={part}
                  className={`${cls} font-light text-sm md:text-base`}
                >
                  {part}
                </span>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href={actionHref}
            className="inline-flex items-center px-2 py-1 hover:bg-white/5 transition-colors rounded text-sm font-medium uppercase"
          >
            {actionLabel}
          </Link>

          <button
            aria-label={t("layout.menu_label", "Menu")}
            aria-expanded={open}
            ref={toggleRef}
            onClick={() => {
              setOpen((open) => !open);
            }}
            className="w-8 h-8 rounded-md flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/40 hover:bg-white/5"
          >
            <MenuToggle open={open} />
          </button>
        </div>

        <div
          ref={menuRef}
          className={`absolute right-6 top-full z-50 origin-top-right ${
            open
              ? "pointer-events-auto opacity-100 scale-y-100"
              : "pointer-events-none opacity-0 scale-y-0"
          } transition-[transform,opacity] duration-500`}
        >
          <div className="min-w-55 bg-ui-surface border border-white/10 rounded-md p-4 shadow-xl transform-origin-top-right">
            <div className="flex flex-col gap-2 pb-3">
              {sections.map(function (s) {
                const label = t(`layout.sections.${s.id}`, s.id);

                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      scrollToSection(s.id);
                    }}
                    className="w-full text-left text-sm font-semibold text-ui-primary px-2 py-2 rounded hover:bg-white/5 transition-transform duration-500 hover:translate-x-1 uppercase"
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <div className="h-px bg-white/60 my-2" />

            <div className="flex items-center justify-between gap-1">
              <button
                onClick={() => {
                  changeLang("pt");
                }}
                className="flex-1 text-xs uppercase py-2 px-2 rounded bg-white/5 hover:bg-white/10 transition transform hover:scale-105"
                aria-pressed={i18n.language === "pt"}
              >
                {t("layout.languages.pt", "Portugues")}
              </button>
              <button
                onClick={() => {
                  changeLang("de");
                }}
                className="flex-1 text-xs uppercase py-2 px-2 rounded bg-white/5 hover:bg-white/10 transition transform hover:scale-105"
                aria-pressed={i18n.language === "de"}
              >
                {t("layout.languages.de", "Deutsch")}
              </button>
              <button
                onClick={() => {
                  changeLang("en");
                }}
                className="flex-1 text-xs uppercase py-2 px-2 rounded bg-white/5 hover:bg-white/10 transition transform hover:scale-105"
                aria-pressed={i18n.language === "en"}
              >
                {t("layout.languages.en", "English")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
