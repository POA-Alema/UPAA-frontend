"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
  // Dimensões reais capturadas no onLoad — fazem a imagem ocupar apenas o
  // espaço da sua proporção (sem faixas pretas em retratos). Placeholder 3/2.
  const [dims, setDims] = useState<{ w: number; h: number }>({ w: 1600, h: 1067 });

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
  // O painel lateral só faz sentido quando há texto rico (descrição/referências).
  // Quando há apenas legenda/título, ela vira uma faixa discreta na base da imagem.
  const hasSidebar = Boolean(image.description || hasReferences);
  const overlayCaption = !hasSidebar ? image.title || image.caption : null;

  return createPortal(
    <div
      aria-label={heading}
      aria-modal="true"
      className="fixed inset-0 z-[20000] flex items-center justify-center p-3 sm:p-5 md:p-8"
      role="dialog"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-black/85 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[94vh] w-full max-w-[96vw] flex-col overflow-hidden rounded-2xl bg-[#1A1A1A] text-white shadow-2xl md:max-h-[88vh] md:w-auto md:flex-row">
        <button
          aria-label={t("image.close", "Fechar imagem ampliada")}
          className="group absolute right-3 top-3 z-30 flex h-11 w-11 items-center justify-center rounded-full border-0 bg-black/50 backdrop-blur-sm transition-all hover:bg-white/10"
          onClick={onClose}
          ref={closeRef}
          type="button"
        >
          <span className="material-symbols-outlined text-2xl text-[#E9C46A] transition-transform duration-300 group-hover:rotate-90">
            close
          </span>
        </button>

        <figure className="relative m-0 flex w-full shrink-0 items-center justify-center bg-black/30 md:w-auto">
          <Image
            alt={image.alt}
            className={`h-auto w-auto max-w-full object-contain md:max-h-[88vh] ${
              hasSidebar ? "max-h-[52vh]" : "max-h-[82vh]"
            }`}
            height={dims.h}
            onLoad={(event) => {
              const img = event.currentTarget;
              if (img.naturalWidth && img.naturalHeight) {
                setDims({ w: img.naturalWidth, h: img.naturalHeight });
              }
            }}
            priority
            sizes="(max-width: 768px) 96vw, 70vw"
            src={image.src}
            width={dims.w}
          />
          {overlayCaption ? (
            <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-4 pt-12 text-center text-sm font-medium text-white/90">
              {overlayCaption}
            </figcaption>
          ) : null}
        </figure>

        {hasSidebar ? (
          <aside className="flex min-h-0 w-full flex-1 flex-col gap-5 overflow-y-auto p-6 md:w-[340px] md:max-w-[340px] md:flex-none">
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
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
