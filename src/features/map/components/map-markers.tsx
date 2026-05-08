"use client";

import { useTranslation } from "react-i18next";
import "@/features/i18n";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import L from "leaflet";
import { Marker, useMap, Tooltip } from "react-leaflet";
import { useRouter } from "next/navigation";
import type {
  BuildingAttachment,
  MapMarker,
} from "@/features/map/utils/map-buildings";

// Ícones
const defaultIcon = new L.Icon({
  iconUrl: "/map-marker.svg",
  iconSize: [28, 40],
  iconAnchor: [14, 40],
  popupAnchor: [0, -34],
});

const selectedIcon = new L.Icon({
  iconUrl: "/map-marker.svg",
  iconSize: [44, 60],
  iconAnchor: [22, 60],
  popupAnchor: [0, -52],
  className: "filter drop-shadow-[0_0_12px_rgba(233,196,106,1)] transition-all duration-300",
});

function MapPopupCard({
  marker,
  variant = "popup",
  onRequestClose,
}: {
  marker: MapMarker;
  variant?: "popup" | "sheet" | "sidebar";
  onRequestClose?: () => void;
}) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const map = useMap();
  const [selectedAttachmentIndex, setSelectedAttachmentIndex] = useState(0);

  const selectedAttachment: BuildingAttachment | undefined =
    marker.attachments[selectedAttachmentIndex];

  const handleSeeMore = () => {
    if (marker.routePath) router.push(marker.routePath);
  };

  useEffect(() => {
    if (!map) return;
    map.scrollWheelZoom.disable();
    map.dragging.disable();
    return () => {
      map.scrollWheelZoom.enable();
      map.dragging.enable();
    };
  }, [map]);

  return (
    <article
      className="flex flex-col h-full w-full bg-[#1A1A1A] text-white shadow-2xl pointer-events-auto selection:bg-[#E9C46A] selection:text-[#1A1A1A]"
      onWheel={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-white/5 bg-[#1A1A1A]/80 backdrop-blur-md shrink-0 sticky top-0 z-20">
        <div className="flex flex-col overflow-hidden mr-2">
          <h2 className="text-xl font-bold text-[#E9C46A] !no-underline tracking-tight leading-tight line-clamp-2">
            {variant === "sidebar" ? marker.name : t("map.mapped_building", "Edificação")}
          </h2>
          <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-medium mt-0.5">Patrimônio Histórico</span>
        </div>
        {onRequestClose && (
          <button
            onClick={onRequestClose}
            className="group p-2 hover:bg-white/10 transition-all flex items-center justify-center rounded-full border-none bg-transparent shrink-0"
          >
            <span className="material-symbols-outlined text-[#E9C46A] text-2xl group-hover:rotate-90 transition-transform duration-300">close</span>
          </button>
        )}
      </div>

      {/* Área de Scroll */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-[#E9C46A]/20 hover:scrollbar-thumb-[#E9C46A]/40 scrollbar-track-transparent">
        <div className="relative w-full aspect-[16/10] overflow-hidden group">
          {selectedAttachment ? (
            <>
              <Image alt={selectedAttachment.alt} src={selectedAttachment.src} fill className="object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-out" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent opacity-60" />
            </>
          ) : (
            <div className="w-full h-full bg-[#222] animate-pulse flex items-center justify-center">
              <span className="text-white/20 italic text-sm">{t("map.image_unavailable", "Imagem indisponível")}</span>
            </div>
          )}
        </div>

        <div className="p-8 space-y-8">
          <section className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-8 h-[1px] bg-[#E9C46A]/50"></span>
              <span className="text-[11px] font-bold text-[#E9C46A] uppercase tracking-[0.25em]">{marker.district || "Porto Alegre"}</span>
            </div>
            <h1 className="text-3xl font-black text-white leading-tight">{marker.name}</h1>
          </section>

          {marker.summary && <p className="text-white/70 leading-relaxed text-base font-light">{marker.summary}</p>}

          {/* REESTABELECIDO: Badges de Informação */}
          <div className="flex flex-wrap gap-3">
            {marker.yearLabel && (
              <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-xs text-white/80">
                <span className="text-[#E9C46A] font-bold mr-2">{t("map.year", "Ano")}:</span>
                {marker.yearLabel}
              </div>
            )}
            {marker.architectName && (
              <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-xs text-white/80">
                <span className="text-[#E9C46A] font-bold mr-2">{t("map.author", "Arquiteto")}:</span>
                {marker.architectName}
              </div>
            )}
          </div>

          {/* REESTABELECIDO: Ambos os Botões com cores fixas */}
          <div className="flex flex-col gap-4 pt-4">
            {marker.routePath && (
              <button 
                onClick={handleSeeMore} 
                className="group w-full bg-[#E9C46A] text-[#1A1A1A] !text-[#1A1A1A] font-black py-4 px-6 rounded-xl flex items-center justify-between shadow-lg border-none active:scale-95 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined font-bold !text-[#1A1A1A]">menu_book</span>
                  <span className="uppercase tracking-wider text-sm !text-[#1A1A1A] !no-underline">{t("map.know_work", "Explorar Obra")}</span>
                </div>
                <span className="material-symbols-outlined !text-[#1A1A1A] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            )}

            {marker.architectPath && (
              <Link
                href={marker.architectPath}
                className="group w-full border border-[#E9C46A]/50 text-[#E9C46A] !text-[#E9C46A] font-bold py-4 px-6 rounded-xl flex items-center justify-between hover:bg-[#E9C46A]/10 active:scale-95 !no-underline transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined !text-[#E9C46A]">account_circle</span>
                  <span className="uppercase tracking-wider text-sm !text-[#E9C46A] !no-underline">{t("map.know_author", "Sobre o Autor")}</span>
                </div>
                <span className="material-symbols-outlined text-[#E9C46A]/40 group-hover:text-[#E9C46A] group-hover:translate-x-1 transition-all">arrow_forward</span>
              </Link>
            )}
          </div>

          {/* REESTABELECIDO: Galeria de Miniaturas */}
          {marker.attachments.length > 1 && (
            <div className="space-y-3 pt-4 border-t border-white/5 pb-8">
              <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Galeria de Imagens</span>
              <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                {marker.attachments.map((att, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedAttachmentIndex(idx)}
                    className={`relative shrink-0 w-28 h-20 rounded-lg overflow-hidden transition-all duration-300 bg-transparent p-0 border-none ${
                      idx === selectedAttachmentIndex 
                      ? "ring-2 ring-[#E9C46A] ring-offset-2 ring-offset-[#1A1A1A] scale-95 opacity-100" 
                      : "opacity-40 hover:opacity-70"
                    }`}
                  >
                    <Image src={att.src} alt={att.alt} fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

type MapMarkersProps = {
  markers: MapMarker[];
  showPopups?: boolean;
};

export function MapMarkers({ markers, showPopups = true }: MapMarkersProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedMarkerId, setSelectedMarkerId] = useState<number | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 820px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const closePanel = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedMarkerId(null);
      setIsClosing(false);
    }, 400);
  };

  const selectedMarker = selectedMarkerId 
    ? markers.find((m: MapMarker) => m.id === selectedMarkerId) 
    : null;

  const sheet = showPopups && isMobile && selectedMarker
    ? createPortal(
        <div className={`fixed inset-0 z-[10000] flex items-end justify-center pointer-events-none`}>
          <div 
            className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-500 pointer-events-auto ${isClosing ? 'opacity-0' : 'opacity-100'}`} 
            onClick={closePanel} 
          />
          <aside 
            className={`pointer-events-auto bg-[#1A1A1A] w-full h-[92vh] rounded-t-[32px] transition-all duration-500 flex flex-col shadow-2xl ${isClosing ? 'translate-y-full' : 'translate-y-0'}`}
          >
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mt-4 mb-2 shrink-0" />
            <MapPopupCard marker={selectedMarker} onRequestClose={closePanel} variant="sheet" />
          </aside>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      {markers.map((m: MapMarker) => {
        const isSelected = selectedMarkerId === m.id;
        return (
          <Marker
            key={m.id}
            position={m.position}
            icon={isSelected ? selectedIcon : defaultIcon}
            eventHandlers={{ click: () => { setIsClosing(false); setSelectedMarkerId(m.id); } }}
          >
            {isSelected && (
              <Tooltip permanent direction="top" offset={[0, -28]} opacity={1} className="!bg-transparent !border-none !shadow-none !p-0">
                <span className="text-[13px] font-black tracking-tight text-black uppercase" style={{ textShadow: "0px 0px 4px rgba(255, 255, 255, 1)" }}>
                  {m.name}
                </span>
              </Tooltip>
            )}
          </Marker>
        );
      })}

      {showPopups && !isMobile && selectedMarker && (
        <div className="fixed inset-0 z-[10000] pointer-events-none flex justify-end">
          <aside 
            className={`pointer-events-auto bg-[#1A1A1A] w-[450px] h-screen transition-all duration-500 flex flex-col shadow-2xl ${isClosing ? 'translate-x-full' : 'translate-x-0'}`}
          >
            <MapPopupCard marker={selectedMarker} onRequestClose={closePanel} variant="sidebar" />
          </aside>
        </div>
      )}

      {sheet}
    </>
  );
}