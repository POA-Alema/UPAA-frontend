'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image'; // 1. Importado o componente do Next.js
import type { BuildingImage } from '@/types/building';

interface AssetCardProps {
  image: BuildingImage;
  onRemove?: (id: string) => void;
}

export default function AssetCard({ image, onRemove }: AssetCardProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [image.url]);

  return (
    <article className="overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-high/40">
      {/* 2. Substituído <img> por <Image /> com as propriedades necessárias */}
      <div className="relative h-56 w-full">
        <Image
          src={src}
          alt={image.alt}
          fill // Faz a imagem ocupar todo o espaço do container pai de 56px de altura
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Ajuda o Next.js a baixar o tamanho ideal de imagem
          className="object-cover"
          onError={handleError}
        />
      </div>
      {failed ? (
        <div className="flex h-56 w-full flex-col items-center justify-center gap-2 bg-surface-container-high/60 text-on-surface/40">
          <span className="material-symbols-outlined text-4xl">image_not_supported</span>
          <span className="text-xs">Imagem indisponível</span>
        </div>
      ) : (
        <img
          src={image.url}
          alt={image.alt}
          className="h-56 w-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
      <div className="space-y-3 p-4">
        <div>
          <p className="font-headline font-bold text-on-surface">{image.alt}</p>
          {image.caption && (
            <p className="mt-1 text-sm text-on-surface/70">{image.caption}</p>
          )}
        </div>

        {onRemove && (
          <button
            type="button"
            onClick={() => onRemove(image.id)}
            className="inline-flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-xs font-headline uppercase tracking-widest text-red-300 transition-colors hover:bg-red-500/20"
          >
            <span className="material-symbols-outlined text-sm">delete</span>
            Remover imagem
          </button>
        )}
      </div>
    </article>
  );
}