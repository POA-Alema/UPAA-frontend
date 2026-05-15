import React from 'react';

export default function Footer({ minimized }: { minimized?: boolean }) {
  return (
    <footer className={`w-full ${minimized ? 'h-10' : 'h-24'} bg-black flex flex-col items-center justify-center text-white text-[10px] gap-2 border-t border-zinc-800 mt-auto`}>
      <p className="uppercase tracking-[0.2em] font-bold text-zinc-300">AGES - Projeto Uma Porto Alegre Alemã</p>
    </footer>
  );
};
