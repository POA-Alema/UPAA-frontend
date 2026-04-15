'use client';

import { useState, useEffect } from 'react';

const i18n = {
  pt: {
    loading: 'Carregando mapa...',
    label: 'Mapa interativo',
    location: 'Centro Histórico',
    city: 'Porto Alegre, RS',
  },
  en: {
    loading: 'Loading map...',
    label: 'Interactive map',
    location: 'Historic Center',
    city: 'Porto Alegre, RS',
  },
  de: {
    loading: 'Karte wird geladen...',
    label: 'Interaktive Karte',
    location: 'Historisches Zentrum',
    city: 'Porto Alegre, RS',
  },
};

type Lang = keyof typeof i18n;

interface MapViewProps {
  lang?: Lang;
}

export function MapView({ lang = 'pt' }: MapViewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const t = i18n[lang] ?? i18n.pt;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="map-view-wrapper" aria-label={t.label} data-testid="map-container">
      {isLoading ? (
        <div className="map-view-loading" aria-busy="true" data-testid="map-loading">
          <span>{t.loading}</span>
        </div>
      ) : (
        <div className="map-view-mock" data-testid="map-mock">
          <div className="map-view-mock__pin" aria-hidden="true">
            <span className="map-view-mock__pin-dot" />
          </div>
          <div className="map-view-mock__label">
            <strong>{t.location}</strong>
            <span>{t.city}</span>
          </div>
        </div>
      )}
    </div>
  );
}
