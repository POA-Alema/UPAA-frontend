"use client";

import { useTranslation } from "react-i18next";
import "@/features/i18n";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import type {
  BuildingAttachment,
  MapMarker,
} from "@/features/map/utils/map-buildings";

const icon = new L.Icon({
  iconUrl: "/map-marker.svg",
  iconSize: [28, 40],
  iconAnchor: [14, 40],
  popupAnchor: [0, -34],
});

type Props = {
  markers: MapMarker[];
  showPopups?: boolean;
};

type MapPopupCardProps = {
  marker: MapMarker;
  variant?: "popup" | "sheet";
  onRequestClose?: () => void;
};

const MAP_POPUP_SUMMARY_CHARACTER_LIMIT = 220;

function getPopupSummaryPreview(summary: string) {
  if (summary.length <= MAP_POPUP_SUMMARY_CHARACTER_LIMIT) {
    return {
      isTruncated: false,
      text: summary,
    };
  }

  return {
    isTruncated: true,
    text: `${summary.slice(0, MAP_POPUP_SUMMARY_CHARACTER_LIMIT).trimEnd()}...`,
  };
}

function MapPopupCard({
  marker,
  variant = "popup",
  onRequestClose,
}: MapPopupCardProps) {
  const { t } = useTranslation("common");
  const [selectedAttachmentIndex, setSelectedAttachmentIndex] = useState(0);

  const selectedAttachment: BuildingAttachment | undefined =
    marker.attachments[selectedAttachmentIndex];
  const summaryPreview = marker.summary
    ? getPopupSummaryPreview(marker.summary)
    : null;

  return (
    <article
      className={`map-popup-card${
        variant === "sheet" ? " map-popup-card--sheet" : ""
      }`}
      onTouchMove={
        variant === "sheet" ? (event) => event.stopPropagation() : undefined
      }
      onWheel={
        variant === "sheet" ? (event) => event.stopPropagation() : undefined
      }
    >
      {variant === "sheet" ? (
        <div className="map-popup-card__sheet-header">
          <div
            className="map-popup-card__sheet-handle"
            aria-hidden="true"
          ></div>
          {onRequestClose ? (
            <button
              aria-label={t("map.close_details", "Fechar detalhes da edificação")}
              className="map-popup-card__sheet-close"
              onClick={onRequestClose}
              type="button"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          ) : null}
        </div>
      ) : null}

      {selectedAttachment ? (
        <a
          className="map-popup-card__media"
          href={selectedAttachment.src}
          rel="noreferrer"
          target="_blank"
        >
          <Image
            alt={selectedAttachment.alt}
            className="map-popup-card__image"
            src={selectedAttachment.src}
            fill
            sizes="320px"
          />
          <div className="map-popup-card__media-overlay"></div>
        </a>
      ) : (
        <div className="map-popup-card__media flex items-center justify-center bg-zinc-800 min-h-[200px]">
          <span className="text-sm text-zinc-400 font-medium italic">
            {t("map.image_unavailable", "Imagem indisponível")}
          </span>
        </div>
      )}

      <div className="map-popup-card__body">
        <p className="map-popup-card__eyebrow">
          {marker.district ?? t("map.mapped_building", "Edificação mapeada")}
        </p>
        <h3 className="map-popup-card__title">{marker.name}</h3>

        {summaryPreview ? (
          <p className="map-popup-card__summary">
            {summaryPreview.text}{" "}
            {summaryPreview.isTruncated ? (
              <button
                aria-disabled="true"
                className="map-popup-card__summary-link"
                title={
                  marker.routePath
                    ? `${marker.routePath}`
                    : t("map.page_unavailable", "Página da edificação ainda não disponível")
                }
                type="button"
              >
                {t("map.see_more", "Ver Mais")}
              </button>
            ) : null}
          </p>
        ) : null}

        {marker.yearLabel || marker.architectName ? (
          <div className="map-popup-card__meta">
            {marker.yearLabel ? (
              <span className="map-popup-card__meta-item">
                {t("map.year", "Ano")}: {marker.yearLabel}
              </span>
            ) : null}
            {marker.architectName ? (
              <span className="map-popup-card__meta-item">
                {t("map.author", "Autoria")}: {marker.architectName}
              </span>
            ) : null}
          </div>
        ) : null}

        {marker.routePath || marker.architectPath ? (
          <div className="map-popup-card__actions">
            {marker.routePath ? (
              <button className="map-popup-card__action" type="button">
                <span className="material-symbols-outlined map-popup-card__action-icon">
                  menu_book
                </span>
                <span>{t("map.know_work", "Conhecer a obra")}</span>
              </button>
            ) : null}

            {marker.architectPath ? (
              <Link
                className="map-popup-card__action map-popup-card__action--secondary"
                href={marker.architectPath}
              >
                <span className="material-symbols-outlined map-popup-card__action-icon">
                  account_circle
                </span>
                <span>{t("map.know_author", "Conhecer o autor")}</span>
              </Link>
            ) : null}
          </div>
        ) : null}

        {marker.attachments.length > 1 ? (
          <div className="map-popup-card__gallery">
            {marker.attachments.map((attachment, index) => (
              <button
                className={`map-popup-card__thumb${
                  index === selectedAttachmentIndex
                    ? " map-popup-card__thumb--active"
                    : ""
                }`}
                key={`${marker.id}-${attachment.src}-${index}`}
                onClick={() => setSelectedAttachmentIndex(index)}
                title={attachment.caption ?? attachment.alt}
                type="button"
              >
                <Image
                  alt={attachment.alt}
                  className="map-popup-card__thumb-image"
                  src={attachment.src}
                  fill
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        ) : null}

        {selectedAttachment?.caption ? (
          <p className="map-popup-card__caption">
            {t("map.image_label", "Imagem")}: {selectedAttachment.caption}
          </p>
        ) : null}
      </div>
    </article>
  );
}

export function MapMarkers({ markers, showPopups = true }: Props) {
  const { t } = useTranslation("common");
  const [isMobile, setIsMobile] = useState(false);
  const [selectedMarkerId, setSelectedMarkerId] = useState<number | null>(null);
  const [isSheetClosing, setIsSheetClosing] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 820px)");
    const syncViewport = () => {
      const mobile = mediaQuery.matches;

      setIsMobile(mobile);

      if (!mobile) {
        setSelectedMarkerId(null);
      }
    };

    syncViewport();
    mediaQuery.addEventListener("change", syncViewport);

    return () => {
      mediaQuery.removeEventListener("change", syncViewport);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!showPopups || !isMobile || selectedMarkerId == null) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.classList.add("map-popup-sheet-open");
    document.body.style.overflow = "hidden";

    return () => {
      document.body.classList.remove("map-popup-sheet-open");
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobile, selectedMarkerId, showPopups]);

  const selectedMarker =
    selectedMarkerId != null
      ? (markers.find((marker) => marker.id === selectedMarkerId) ?? null)
      : null;

  function openSheet(markerId: number) {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    setIsSheetClosing(false);
    setSelectedMarkerId(markerId);
  }

  function closeSheet() {
    setIsSheetClosing(true);

    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }

    closeTimeoutRef.current = setTimeout(() => {
      setSelectedMarkerId(null);
      setIsSheetClosing(false);
      closeTimeoutRef.current = null;
    }, 220);
  }

  return (
    <>
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={marker.position}
          icon={icon}
          eventHandlers={
            showPopups && isMobile
              ? {
                  click: () => {
                    openSheet(marker.id);
                  },
                }
              : undefined
          }
        >
          {showPopups && !isMobile ? (
            <Popup>
              <MapPopupCard marker={marker} />
            </Popup>
          ) : null}
        </Marker>
      ))}

      {showPopups && isMobile && selectedMarker ? (
        <div
          className={`map-popup-sheet${
            isSheetClosing ? " map-popup-sheet--closing" : ""
          }`}
          role="dialog"
          aria-modal="true"
        >
          <button
            aria-label={t("map.close_details", "Fechar detalhes da edificação")}
            className="map-popup-sheet__backdrop"
            onClick={closeSheet}
            type="button"
          ></button>

          <div className="map-popup-sheet__panel">
            <MapPopupCard
              key={selectedMarker.id}
              marker={selectedMarker}
              onRequestClose={closeSheet}
              variant="sheet"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}