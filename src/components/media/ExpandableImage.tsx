"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import "@/features/i18n";
import { ImageModal } from "./ImageModal";
import type { ExpandableImageData } from "@/types/image";

interface ExpandableImageProps {
  image: ExpandableImageData;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
}

export function ExpandableImage({
  image,
  imageClassName,
  sizes,
  priority,
}: ExpandableImageProps) {
  const { t } = useTranslation("common");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Image
        alt={image.alt}
        className={imageClassName}
        fill
        priority={priority}
        sizes={sizes}
        src={image.src}
      />
      <button
        aria-label={t("image.expand", "Ampliar imagem")}
        className="group absolute inset-0 z-20 flex cursor-zoom-in items-start justify-end p-3"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-[#E9C46A] opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
          <span className="material-symbols-outlined text-xl">open_in_full</span>
        </span>
      </button>
      {isOpen ? (
        <ImageModal image={image} onClose={() => setIsOpen(false)} />
      ) : null}
    </>
  );
}
