"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ArchitectWork } from "../types/architect";

interface ArchitectGalleryProps {
  items: ArchitectWork[];
}

export function ArchitectGallery({ items }: ArchitectGalleryProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const isProgrammaticRef = useRef(false);
  const programmaticTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const scrollToIndex = useCallback((index: number, behavior: ScrollBehavior = "smooth") => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.children[index] as HTMLElement | undefined;
    if (!card) return;
    const targetLeft = card.offsetLeft - (rail.clientWidth - card.offsetWidth) / 2;
    isProgrammaticRef.current = true;
    clearTimeout(programmaticTimerRef.current);
    programmaticTimerRef.current = setTimeout(() => {
      isProgrammaticRef.current = false;
    }, 600);
    rail.scrollTo({ left: Math.max(0, targetLeft), behavior });
    activeIndexRef.current = index;
    setActiveIndex(index);
  }, []);

  const scroll = useCallback((direction: "left" | "right") => {
    const next =
      direction === "right"
        ? (activeIndexRef.current + 1) % items.length
        : (activeIndexRef.current - 1 + items.length) % items.length;
    scrollToIndex(next, "instant");
  }, [items.length, scrollToIndex]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const onScroll = () => {
      if (isProgrammaticRef.current) return;
      const railRect = rail.getBoundingClientRect();
      const railCenter = railRect.left + railRect.width / 2;
      let closest = 0;
      let minDist = Infinity;
      Array.from(rail.children).forEach((child, i) => {
        const cardRect = child.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const dist = Math.abs(cardCenter - railCenter);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      activeIndexRef.current = closest;
      setActiveIndex(closest);
    };

    rail.addEventListener("scroll", onScroll, { passive: true });
    return () => rail.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="building-gallery__wrapper">
      <div className="architect-works__rail" ref={railRef}>
        {items.map((work, index) => {
          const cardInner = (
            <>
              <div className="architect-work-card__media">
                {work.image ? (
                  <Image
                    alt={work.image.alt}
                    className="architect-image"
                    fill
                    priority={index === 0}
                    sizes="(max-width: 768px) 82vw, 288px"
                    src={work.image.src}
                  />
                ) : (
                  <span className="material-symbols-outlined architect-work-card__fallback">
                    image
                  </span>
                )}
              </div>
              <figcaption className="architect-work-card__caption">
                <strong>{work.title}</strong>
                {work.image?.caption ? (
                  <span>{work.image.caption}</span>
                ) : null}
              </figcaption>
            </>
          );

          return work.href ? (
            <Link
              className="architect-work-card architect-work-card--link"
              href={work.href}
              key={`${work.title}-${index}`}
            >
              {cardInner}
            </Link>
          ) : (
            <figure className="architect-work-card" key={`${work.title}-${index}`}>
              {cardInner}
            </figure>
          );
        })}
      </div>

      <div className="building-gallery__nav">
        <button
          aria-label="Anterior"
          className="building-gallery__nav-btn"
          onClick={() => scroll("left")}
          type="button"
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>

        <div className="building-gallery__indicators" role="tablist">
          {items.map((_, index) => {
            const dist = Math.abs(index - activeIndex);
            if (dist > 2) return null;
            const sizeClass =
              dist === 0
                ? "building-gallery__dot--active"
                : dist === 1
                  ? "building-gallery__dot--near"
                  : "building-gallery__dot--far";
            return (
              <button
                aria-label={`Ir para obra ${index + 1}`}
                aria-selected={index === activeIndex}
                className={`building-gallery__dot ${sizeClass}`}
                key={index}
                onClick={() => scrollToIndex(index)}
                role="tab"
                type="button"
              />
            );
          })}
        </div>

        <button
          aria-label="Próximo"
          className="building-gallery__nav-btn"
          onClick={() => scroll("right")}
          type="button"
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </div>
  );
}
