"use client";

import React from 'react';

interface MainContainerProps {
  data: any;
  children?: React.ReactNode;
}

export default function MainContainer({ data, children }: MainContainerProps) {
  // Se não houver dados, não renderiza nada
  if (!data) return null;

  return (
    <section className="section-card home-flow__section">
      {/* IMPORTANTE: Note que NÃO temos <h2> ou <p> aqui. 
          Ele apenas renderiza o que estiver dentro das tags dele lá no LandingContent.
      */}
      {children}
    </section>
  );
}