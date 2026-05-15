import React from 'react';

const Header = () => {
  return (
    <header className="w-full h-20 bg-black flex items-center justify-between px-8 text-white border-b border-zinc-800 shadow-md">
      <div className="text-xl font-bold uppercase tracking-widest">
        Uma Porto Alegre Alemã
      </div>
      <nav>
        <ul className="flex gap-8 text-sm font-medium uppercase tracking-tighter">
          <li className="hover:text-zinc-400 cursor-pointer transition-colors">Início</li>
          <li className="hover:text-zinc-400 cursor-pointer transition-colors">Mapa</li>
          <li className="hover:text-zinc-400 cursor-pointer transition-colors">Sobre</li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
