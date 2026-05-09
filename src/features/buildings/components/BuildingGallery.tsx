"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { BuildingImage } from "../types/building";

interface BuildingGalleryProps {
  items: BuildingImage[];
}

export function BuildingGallery({ items }: BuildingGalleryProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToIndex = useCallback((index: number) => {
    const rail = railRef.current;
    if (!rail) return;
    const cards = rail.querySelectorAll<HTMLElement>("figure");
    const card = cards[index];
    if (!card) return;
    rail.scrollTo({ left: card.offsetLeft - rail.offsetLeft, behavior: "smooth" });
  }, []);

  function scroll(direction: "left" | "right") {
    const next = direction === "right"
      ? (activeIndex + 1) % items.length
      : (activeIndex - 1 + items.length) % items.length;
    scrollToIndex(next);
  }

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    function onScroll() {
      if (!rail) return;
      const cards = rail.querySelectorAll<HTMLElement>("figure");
      let closest = 0;
      let minDist = Infinity;
      cards.forEach((card, i) => {
        const dist = Math.abs(card.offsetLeft - rail.offsetLeft - rail.scrollLeft);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      setActiveIndex(closest);
    }

    rail.addEventListener("scroll", onScroll, { passive: true });
    return () => rail.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="building-gallery__wrapper">
      <div className="building-gallery__rail" ref={railRef}>
        {items.map((item, index) => (
          <figure className="building-gallery-card" key={`${item.src}-${index}`}>
            <div className="building-gallery-card__media">
              <Image
                alt={item.alt}
                className="building-gallery-card__image"
                fill
                priority={index === 0}
                sizes="(max-width: 768px) 80vw, 360px"
                src={item.src}
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
          aria-label="Anterior"
          className="building-gallery__nav-btn"
          onClick={() => scroll("left")}
          type="button"
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>

        <div className="building-gallery__indicators" role="tablist">
          {items.map((_, index) => (
            <button
              aria-label={`Ir para foto ${index + 1}`}
              aria-selected={index === activeIndex}
              className={`building-gallery__dot${index === activeIndex ? " building-gallery__dot--active" : ""}`}
              key={index}
              onClick={() => scrollToIndex(index)}
              role="tab"
              type="button"
            />
          ))}
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
