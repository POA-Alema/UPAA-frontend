"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import MenuToggle from '@/components/ui/MenuToggle';
const Header = function Header() {
  const pathname = usePathname() || '/';
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  type LangBundle = {
    logoParts: string[];
    actions: Record<string, string>;
    sections: Record<string, string>;
    languages: Record<string, string>;
  };

  const translations: Record<string, LangBundle> = {
    pt: {
      logoParts: ['Uma', 'Porto Alegre', 'Alemã'],
      actions: {
        map: 'Mapa',
        home: 'Home',
      },
      sections: {
        intro: 'Introdução',
        immigration: 'Imigração',
        'map-preview': 'Mapa',
        architects: 'Arquitetos',
      },
      languages: {
        pt: 'Português',
        de: 'Deutsch',
        en: 'English',
      }
    },
    en: {
      logoParts: ['A', 'Porto Alegre', 'German'],
      actions: {
        map: 'Map',
        home: 'Home',
      },
      sections: {
        intro: 'Intro',
        immigration: 'Immigration',
        'map-preview': 'Map',
        architects: 'Architects',
      },
      languages: {
        pt: 'Português',
        de: 'Deutsch',
        en: 'English',
      }
    },
    de: {
      logoParts: ['Ein', 'Porto Alegre', 'Deutsch'],
      actions: {
        map: 'Karte',
        home: 'Start',
      },
      sections: {
        intro: 'Einführung',
        immigration: 'Immigration',
        'map-preview': 'Karte',
        architects: 'Architekten',
      },
      languages: {
        pt: 'Português',
        de: 'Deutsch',
        en: 'English',
      }
    }
  };

  const lang = i18n?.language ?? 'pt';

  const isLanding = pathname === '/';
  const actionHref = isLanding ? '/mapa' : '/';
  const actionLabel = isLanding ? (translations[lang]?.actions?.map || 'Mapa') : (translations[lang]?.actions?.home || 'Home');

  const sections = [
    { id: 'intro' },
    { id: 'immigration' },
    { id: 'map-preview' },
    { id: 'architects' }
  ];

  function changeLang(lng: string) {
    if (i18n?.changeLanguage) {
      i18n.changeLanguage(lng).catch(function () {});
    }
    try {
      localStorage.setItem('i18nextLng', lng);
    } catch {
      // TODO: Handle error (e.g. show notification to user).
      // This can fail if the user has disabled localStorage or in private browsing mode.
      console.warn('Could not save language preference');
    }
  };

  function scrollToSection(id: string) {
    setOpen(false);
    if (typeof window === 'undefined') {
      return;
    }
    const el = document.getElementById(id);
    if (!el) {
      window.location.href = `/#${id}`;
      return;
    }
    el.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
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
      if (e.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    document.addEventListener('keydown', handleKeydown);
    return function () {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [open]);

  return (
    <header className="w-full sticky top-0 z-50 bg-ui-surface text-white border-b border-zinc-800 shadow-md backdrop-blur-sm">
      <div className="relative max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex flex-col leading-tight">
            {['Uma','Porto Alegre','Alemã'].map(function (part: string, idx: number) {
              const cls = idx === 2 ? 'text-ui-accent' : 'text-ui-primary';
              return (
                <span key={idx} className={`${cls} font-light text-sm md:text-base`}>{part}</span>
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

        {/* Floating menu */}
          <div ref={menuRef} className={`absolute right-6 top-full z-50 origin-top-right ${open ? 'pointer-events-auto opacity-100 scale-y-100' : 'pointer-events-none opacity-0 scale-y-0'} transition-[transform,opacity] duration-500`}>
            <div className="min-w-55 bg-ui-surface border border-white/10 rounded-md p-4 shadow-xl transform-origin-top-right">
              <div className="flex flex-col gap-2 pb-3">
                {sections.map(function (s) {
                  const label = (translations[lang] && translations[lang].sections && translations[lang].sections[s.id]) || s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => { scrollToSection(s.id); }}
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
                  onClick={() => { changeLang('pt'); }}
                  className="flex-1 text-xs uppercase py-2 px-2 rounded bg-white/5 hover:bg-white/10 transition transform hover:scale-105"
                  aria-pressed={i18n.language === 'pt'}
                >
                  {(translations[lang] && translations[lang].languages && translations[lang].languages.pt) || 'Português'}
                </button>
                <button
                  onClick={() => { changeLang('de'); }}
                  className="flex-1 text-xs uppercase py-2 px-2 rounded bg-white/5 hover:bg-white/10 transition transform hover:scale-105"
                  aria-pressed={i18n.language === 'de'}
                >
                  {(translations[lang] && translations[lang].languages && translations[lang].languages.de) || 'Deutsch'}
                </button>
                <button
                  onClick={() => { changeLang('en'); }}
                  className="flex-1 text-xs uppercase py-2 px-2 rounded bg-white/5 hover:bg-white/10 transition transform hover:scale-105"
                  aria-pressed={i18n.language === 'en'}
                >
                  {(translations[lang] && translations[lang].languages && translations[lang].languages.en) || 'English'}
                </button>
              </div>
            </div>
          </div>
      </div>
    </header>
  );
};

export default Header;
