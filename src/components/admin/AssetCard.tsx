'use client';
import Image from 'next/image';
import type { BuildingImage } from '@/types/building';

interface AssetCardProps {
  image: BuildingImage;
  onRemove?: (id: string) => void;
}

export default function AssetCard({ image, onRemove }: AssetCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-high/40">
      {/* `fill` lets the image size from the container (admin URLs can be local, remote S3
          or data URLs); `unoptimized` skips the optimizer so arbitrary hosts don't 403. */}
      <div className="relative h-56 w-full">
        <Image
          src={image.url}
          alt={image.alt}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

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