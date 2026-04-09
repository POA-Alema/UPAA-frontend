import Image from "next/image";
import Link from "next/link";
import type { ArchitectPreviewProps } from "../types/architect";

export function ArchitectPreview({ architect }: ArchitectPreviewProps) {
  if (!architect.title || !architect.bio) {
    return null;
  }

  return (
    <article className="overflow-hidden rounded-[32px] bg-[var(--dark-bg)] text-[var(--dark-foreground)] shadow-2xl">
      <section className="grid gap-10 px-6 py-10 sm:px-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,360px)] lg:items-center lg:px-12 lg:py-14">
        <div className="order-2 lg:order-1">
          {architect.eyebrow && (
            <span className="mb-4 block text-[0.65rem] font-bold uppercase tracking-[0.3em] text-[var(--gold-primary)]">
              {architect.eyebrow}
            </span>
          )}

          <h2 className="mb-6 font-[var(--font-headline)] text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
            O Legado de <br /> {architect.title}
          </h2>

          <div className="mb-8 h-px w-20 bg-[var(--gold-primary)]/40"></div>

          <div className="max-w-3xl text-base leading-8 text-[var(--dark-muted)] sm:text-lg">
            <span className="float-left mr-4 mt-2 font-[var(--font-headline)] text-5xl leading-none text-[var(--gold-primary)] sm:text-6xl">
              {architect.bio.charAt(0)}
            </span>
            {architect.bio.slice(1)}
          </div>

          {architect.details && architect.details.length > 0 && (
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {architect.details.map((detail, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-white/8 bg-white/5 p-5"
                >
                  <span className="mb-2 block text-[0.6rem] font-bold uppercase tracking-[0.22em] text-[var(--gold-primary)]/80">
                    {detail.label}
                  </span>
                  <p className="text-lg font-bold text-white">{detail.value}</p>
                  {detail.subValue && (
                    <p className="mt-1 text-sm text-[var(--dark-muted)]">
                      {detail.subValue}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {architect.actions && (
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href={architect.actions.primary.href}
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-xl bg-[var(--gold-primary)] px-6 py-4 text-center text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[var(--dark-bg)] transition-all hover:bg-[var(--gold-hover)]"
              >
                <span className="material-symbols-outlined text-lg">menu_book</span>
                {architect.actions.primary.label}
              </Link>

              <Link
                href={architect.actions.secondary.href}
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-xl border border-[var(--gold-primary)]/35 bg-transparent px-6 py-4 text-center text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[var(--gold-primary)] transition-all hover:bg-white/5"
              >
                <span className="material-symbols-outlined text-lg">explore</span>
                {architect.actions.secondary.label}
              </Link>
            </div>
          )}
        </div>

        {architect.image && (
          <figure className="order-1 m-0 flex flex-col items-center lg:order-2">
            <div className="relative aspect-[4/5] w-full max-w-[240px] rounded-2xl border border-[var(--gold-primary)]/40 bg-[var(--dark-surface)] p-1.5 shadow-2xl sm:max-w-[280px] lg:max-w-[340px]">
              <div className="relative h-full w-full overflow-hidden rounded-xl border-2 border-[var(--gold-primary)]">
                <Image
                  src={architect.image.src}
                  alt={architect.image.alt || architect.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 280px, 340px"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(45deg, rgba(21, 19, 18, 0.88), rgba(211, 166, 91, 0.12))",
                  }}
                ></div>
              </div>
            </div>

            {architect.image.caption && (
              <figcaption className="mt-4 max-w-xs text-center text-[0.65rem] uppercase tracking-[0.2em] text-[var(--dark-muted)]">
                {architect.image.caption}
              </figcaption>
            )}
          </figure>
        )}
      </section>
    </article>
  );
}
