"use client";

import React, { useState } from 'react';
import { useLanguage } from "@/context/LanguageContext";
import { allTranslations } from "@/data/translations";

const Header = () => {
  const { language, setLanguage } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);

  // Pega as traduções do cabeçalho baseadas no idioma atual
  const t = allTranslations.header[language];
  // Pega o título da marca baseado no idioma atual
  const brandTitle = allTranslations.brand[language];

  return (
    <header className="w-full h-20 bg-black flex items-center justify-between px-8 text-white border-b border-zinc-800 shadow-md relative z-[100]">
      <div className="text-xl font-bold uppercase tracking-widest">
        {/* AGORA O TÍTULO MUDA AUTOMATICAMENTE */}
        {brandTitle}
      </div>
      
      <nav>
        <ul className="flex gap-8 text-sm font-medium uppercase tracking-tighter items-center">
          <li className="hover:text-zinc-400 cursor-pointer transition-colors">
            {t.inicio}
          </li>
          <li className="hover:text-zinc-400 cursor-pointer transition-colors">
            {t.mapa}
          </li>
          
          {/* Seção do botão Sobre com Dropdown */}
          <li className="relative">
            <button 
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="hover:text-zinc-400 cursor-pointer transition-colors uppercase font-medium flex items-center gap-1"
            >
              {t.sobre}
              <span className="text-[10px] opacity-50">
                {showLangMenu ? '▲' : '▼'}
              </span>
            </button>

            {/* Menu de Idiomas */}
            {showLangMenu && (
              <ul className="absolute right-0 mt-4 w-32 bg-zinc-900 border border-zinc-800 rounded-md shadow-xl overflow-hidden">
                <li 
                  onClick={() => { setLanguage('pt'); setShowLangMenu(false); }}
                  className={`px-4 py-3 text-xs hover:bg-zinc-800 cursor-pointer transition-colors ${language === 'pt' ? 'text-white font-bold' : 'text-zinc-400'}`}
                >
                  Português
                </li>
                <li 
                  onClick={() => { setLanguage('en'); setShowLangMenu(false); }}
                  className={`px-4 py-3 text-xs hover:bg-zinc-800 cursor-pointer transition-colors ${language === 'en' ? 'text-white font-bold' : 'text-zinc-400'}`}
                >
                  English
                </li>
                <li 
                  onClick={() => { setLanguage('de'); setShowLangMenu(false); }}
                  className={`px-4 py-3 text-xs hover:bg-zinc-800 cursor-pointer transition-colors ${language === 'de' ? 'text-white font-bold' : 'text-zinc-400'}`}
                >
                  Deutsch
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;