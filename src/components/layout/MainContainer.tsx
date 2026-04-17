import type { LandingData } from "@/features/home/types/landing";

type MainContainerProps = {
  data: LandingData | null;
};

export default function MainContainer({ data }: MainContainerProps) {
  if (!data || (!data.title && !data.description)) {
    return (
      <section
        className="section-card home-flow__section"
        data-testid="landing-fallback"
      >
        <span className="text-zinc-500 italic uppercase text-xs tracking-widest select-none">
          Nenhum conteúdo disponível no momento
        </span>
      </section>
    );
  }

  return (
    <section
      className="section-card home-flow__section"
      data-testid="landing-content"
    >
      <p className="eyebrow">Introdução</p>
      <h2 className="section-title" style={{ maxWidth: "none" }}>{data.title}</h2>
      <p className="section-copy" style={{ color: "var(--accent)", maxWidth: "none" }}>{data.description}</p>
    </section>
  );
}
