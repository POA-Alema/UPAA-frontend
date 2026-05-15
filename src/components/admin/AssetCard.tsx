'use client';

import { useEffect, useState } from 'react';
import type { BuildingImage } from '@/types/building';

interface AssetCardProps {
  image: BuildingImage;
  onRemove?: (id: string) => void;
}

export default function AssetCard({ image, onRemove }: AssetCardProps) {
  const [src, setSrc] = useState(image.url);

  useEffect(() => {
    setSrc(image.url);
  }, [image.url]);

  const handleError = () => {
    if (image.fallbackUrl && src !== image.fallbackUrl) {
      setSrc(image.fallbackUrl);
    }
  };

  return (
    <article className="overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-high/40">
      <img
        src={src}
        alt={image.alt}
        className="h-56 w-full object-cover"
        onError={handleError}
      />

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
