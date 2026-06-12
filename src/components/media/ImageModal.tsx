"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import "@/features/i18n";
import type { ExpandableImageData } from "@/types/image";

interface ImageModalProps {
  image: ExpandableImageData;
  onClose: () => void;
}

interface MetaRowProps {
  label: string;
  value?: string;
}

function MetaRow({ label, value }: MetaRowProps) {
  if (!value) return null;

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-bold uppercase tracking-wider text-[#E9C46A]">
        {label}
      </span>
      <span className="text-sm leading-relaxed text-white/80">{value}</span>
    </div>
  );
}

export function ImageModal({ image, onClose }: ImageModalProps) {
  const { t } = useTranslation("common");
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  const heading = image.title || image.caption || image.alt;
  const showCaption = Boolean(image.caption && image.caption !== heading);
  const hasReferences = Boolean(image.source || image.reference || image.credits);

  return createPortal(
    <div
      aria-label={heading}
      aria-modal="true"
      className="fixed inset-0 z-10000 flex items-stretch justify-center sm:items-center sm:p-4 md:p-8"
      role="dialog"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-black/85 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 flex h-full w-full flex-col overflow-hidden bg-[#1A1A1A] text-white shadow-2xl md:h-auto md:max-h-[90vh] md:w-auto md:max-w-[94vw] md:flex-row md:rounded-2xl">
        <button
          aria-label={t("image.close", "Fechar imagem ampliada")}
          className="group absolute right-3 top-3 z-30 flex h-10 w-10 items-center justify-center rounded-full border-0 bg-black/50 backdrop-blur-sm transition-all hover:bg-white/10"
          onClick={onClose}
          ref={closeRef}
          type="button"
        >
          <span className="material-symbols-outlined text-2xl text-[#E9C46A] transition-transform duration-300 group-hover:rotate-90">
            close
          </span>
        </button>

        <div className="relative flex min-h-[42vh] shrink-0 items-center justify-center bg-black md:min-h-[60vh] md:w-[62vw] md:max-w-[900px]">
          <Image
            alt={image.alt}
            className="object-contain"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 62vw"
            src={image.src}
          />
        </div>

        <aside className="flex w-full flex-1 flex-col gap-5 overflow-y-auto p-6 md:w-[340px] md:max-w-[340px] md:flex-none">
          <h2 className="pr-10 text-2xl font-black leading-tight text-white">
            {heading}
          </h2>

          {showCaption ? (
            <p className="text-sm font-medium text-white/60">{image.caption}</p>
          ) : null}

          {image.description ? (
            <p className="text-sm leading-relaxed text-white/80">
              {image.description}
            </p>
          ) : null}

          {hasReferences ? (
            <div className="flex flex-col gap-4 border-t border-white/10 pt-5">
              <MetaRow label={t("image.source", "Fonte")} value={image.source} />
              <MetaRow
                label={t("image.reference", "Referência")}
                value={image.reference}
              />
              <MetaRow
                label={t("image.credits", "Créditos")}
                value={image.credits}
              />
            </div>
          ) : null}
        </aside>
      </div>
    </div>,
    document.body,
  );
}
