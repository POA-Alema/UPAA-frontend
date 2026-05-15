export default function MainContainerSkeleton() {
  return (
    <section
      className="w-full py-12 flex flex-col items-center gap-4 animate-pulse"
      data-testid="landing-loading"
    >
      <div className="h-9 w-2/3 bg-zinc-800 rounded" />
      <div className="h-5 w-1/3 bg-zinc-800 rounded" />
    </section>
  );
}
