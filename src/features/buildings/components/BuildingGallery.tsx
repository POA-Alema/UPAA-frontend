"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buildingLabels } from "../data/building-labels";
import type { BuildingLanguage } from "../data/buildings";
import { ExpandableImage } from "@/components/media/ExpandableImage";
import type { BuildingImage } from "../types/building";

interface BuildingGalleryProps {
  items: BuildingImage[];
  language?: BuildingLanguage;
}

function buildPages(count: number): number[] {
  if (count <= 4) return [0];
  const result: number[] = [];
  for (let i = 0; i + 4 <= count; i += 4) result.push(i);
  const last = count - 4;
  if (result[result.length - 1] !== last) result.push(last);
  return result;
}

export function BuildingGallery({ items, language = "pt" }: BuildingGalleryProps) {
  const labels = buildingLabels[language];
  const railRef = useRef<HTMLDivElement>(null);
  const pages = useMemo(() => buildPages(items.length), [items.length]);
  const [pageIndex, setPageIndex] = useState(0);
  const pageIndexRef = useRef(0);
  const isProgrammaticRef = useRef(false);
  const programmaticTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const scrollToItemIndex = useCallback((index: number, behavior: ScrollBehavior) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.children[index] as HTMLElement | undefined;
    if (!card) return;
    isProgrammaticRef.current = true;
    clearTimeout(programmaticTimerRef.current);
    programmaticTimerRef.current = setTimeout(() => { isProgrammaticRef.current = false; }, 600);
    rail.scrollTo({ left: card.offsetLeft, behavior });
  }, []);

  const goToPage = useCallback((pi: number) => {
    const idx = pages[pi];
    if (idx === undefined) return;
    scrollToItemIndex(idx, "smooth");
    pageIndexRef.current = pi;
    setPageIndex(pi);
  }, [pages, scrollToItemIndex]);

  const scroll = useCallback((direction: "left" | "right") => {
    const next = direction === "right"
      ? Math.min(pageIndexRef.current + 1, pages.length - 1)
      : Math.max(pageIndexRef.current - 1, 0);
    goToPage(next);
  }, [pages.length, goToPage]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const onScroll = () => {
      if (isProgrammaticRef.current) return;
      const scrollLeft = rail.scrollLeft;
      let closestPage = 0;
      let minDist = Infinity;
      pages.forEach((startIdx, pi) => {
        const card = rail.children[startIdx] as HTMLElement | undefined;
        if (!card) return;
        const dist = Math.abs(card.offsetLeft - scrollLeft);
        if (dist < minDist) { minDist = dist; closestPage = pi; }
      });
      pageIndexRef.current = closestPage;
      setPageIndex(closestPage);
    };
    rail.addEventListener("scroll", onScroll, { passive: true });
    return () => rail.removeEventListener("scroll", onScroll);
  }, [pages]);

  const isFirst = pageIndex === 0;
  const isLast = pageIndex === pages.length - 1;

  return (
    <div className="building-gallery__wrapper">
      <div className="building-gallery__rail" ref={railRef}>
        {items.map((item, index) => (
          <figure className="building-gallery-card" key={`${item.src}-${index}`}>
            <div className="building-gallery-card__media">
              <ExpandableImage
                image={item}
                imageClassName="building-gallery-card__image"
                priority={index === 0}
                sizes="(max-width: 820px) 75vw, 25vw"
                src={item.src}
                unoptimized
              />
            </div>
            {item.caption ? (
              <figcaption className="building-gallery-card__caption">
                {item.caption}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>

      <div className="building-gallery__nav">
        <button
          aria-label={labels.previous}
          className="building-gallery__nav-btn"
          disabled={isFirst}
          onClick={() => scroll("left")}
          type="button"
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>

        <div className="building-gallery__indicators" role="tablist">
          {pages.map((_, pi) => {
            const dist = Math.abs(pi - pageIndex);
            if (dist > 2) return null;
            const sizeClass =
              dist === 0
                ? "building-gallery__dot--active"
                : dist === 1
                  ? "building-gallery__dot--near"
                  : "building-gallery__dot--far";
            return (
              <button
                aria-label={labels.goToPage(pi + 1)}
                aria-selected={pi === pageIndex}
                className={`building-gallery__dot ${sizeClass}`}
                key={pi}
                onClick={() => goToPage(pi)}
                role="tab"
                type="button"
              />
            );
          })}
        </div>

        <button
          aria-label={labels.next}
          className="building-gallery__nav-btn"
          disabled={isLast}
          onClick={() => scroll("right")}
          type="button"
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </div>
  );
}
