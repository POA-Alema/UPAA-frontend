"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { RichText } from "@/components/content/rich-text";
import "@/features/i18n";
import type { ExpandableImageData } from "@/types/image";

interface ImageModalProps {
  image: ExpandableImageData;
  onClose: () => void;
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
  // O painel lateral aparece quando há texto livre (descrição). Quando há apenas
  // legenda/título, ela vira uma faixa discreta na base da imagem.
  const hasSidebar = Boolean(image.description);
  const overlayCaption = !hasSidebar ? image.title || image.caption : null;

  return createPortal(
    <div
      aria-label={heading}
      aria-modal="true"
      className="fixed inset-0 z-[20000] flex items-center justify-center p-3 sm:p-6"
      role="dialog"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-black/15 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Container de tamanho fixo: o modal tem sempre o mesmo tamanho,
          independentemente da proporção da imagem (object-contain centraliza). */}
      <div className="relative z-10 flex h-[90vh] w-[94vw] max-w-[1200px] flex-col overflow-hidden rounded-2xl border-2 border-[#E9C46A] bg-[#1A1A1A]/80 text-white shadow-2xl md:h-[85vh] md:flex-row">
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

        <figure className="relative m-0 h-[44vh] shrink-0 bg-black/20 md:h-auto md:min-h-0 md:flex-1">
          <Image
            alt={image.alt}
            className="object-contain"
            fill
            priority
            sizes="(max-width: 768px) 94vw, 70vw"
            src={image.src}
          />
          {overlayCaption ? (
            <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-4 pt-12 text-center text-sm font-medium text-white/90">
              {overlayCaption}
            </figcaption>
          ) : null}
        </figure>

        {hasSidebar ? (
          <aside className="flex min-h-0 w-full flex-1 flex-col gap-5 overflow-y-auto p-6 md:h-full md:w-[360px] md:flex-none">
            <h2 className="pr-10 text-2xl font-black leading-tight text-white">
              {heading}
            </h2>

            {showCaption ? (
              <p className="text-sm font-medium text-white/60">{image.caption}</p>
            ) : null}

            {image.description ? (
              <RichText
                className="rich-text rich-text--muted image-modal__text"
                content={image.description}
              />
            ) : null}
          </aside>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
