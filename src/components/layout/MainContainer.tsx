"use client";

import type { LandingData } from "@/features/home/types/landing";

type MainContainerProps = {
  data: LandingData | null;
};

export default function MainContainer({ data }: MainContainerProps) {
  if (!data) {
    return null;
  }

  return (
    <section
      id="intro"
      className="section-card home-flow__section"
      data-testid="landing-content"
    >
      <h2 className="section-title section-title--full">
        <strong>{data.title}</strong>
      </h2>
      <p className="section-copy section-copy--accent">{data.description}</p>
    </section>
  );
}
