import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function MapCTA() {
  return (
    <section className="flex flex-col items-center bg-[#333333] w-full max-w-2xl mx-auto rounded-md overflow-hidden">
      
      {/* PREVIEW DO MAPA */}
      <div className="w-full h-80 relative bg-slate-200">
        <Image 
          src="/mapa-preview.jpg"
          alt="Preview do mapa de Porto Alegre Alemã"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* CTA */}
      <div className="w-full p-6 flex justify-center">
        <Link 
          href="/mapa"
          className="bg-[#d4a373] text-black font-bold py-4 px-10 rounded shadow-md flex items-center gap-2 hover:bg-[#c29569] transition-colors"
        >
          <span>🧭</span>
          EXPLORAR MAPA
        </Link>
      </div>
    </section>
  );
}