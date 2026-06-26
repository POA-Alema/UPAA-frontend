import Link from "next/link";
import { Suspense } from "react";
import AssetCard from "@/components/admin/AssetCard";
import DeleteButton from "@/components/admin/DeleteButton";
import StatusToast from "@/components/admin/StatusToast";
import { getBuildings } from "@/services/buildings";

export default async function BuildingsAdminPage() {
  const buildings = await getBuildings();

  return (
    <section className="min-h-screen bg-background px-8 pb-20 pt-16 font-body text-on-background">
      <Suspense>
        <StatusToast />
      </Suspense>

      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="font-label text-[0.65rem] uppercase tracking-[0.3em] text-primary">
              Painel Administrativo
            </span>
            <h1 className="mt-2 font-headline text-3xl font-extrabold tracking-tight text-on-surface md:text-5xl">
              Edificações
            </h1>
            <div className="mt-4 h-[1px] w-16 bg-primary opacity-40"></div>
          </div>

          <Link
            href="/admin/buildings/new"
            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-headline text-[10px] font-bold uppercase tracking-widest text-on-primary shadow-xl transition-all hover:bg-primary/90"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Nova Edificação
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {buildings.length === 0 ? (
            <div className="col-span-full py-12 text-center">
              <p className="mb-4 text-on-surface/70">Nenhuma edificação cadastrada ainda.</p>
              <Link href="/admin/buildings/new" className="text-primary hover:underline">
                Crie a primeira
              </Link>
            </div>
          ) : (
            buildings.map((building) => (
              <div
                key={building.id}
                className="rounded-xl border border-outline-variant/10 bg-surface-container-high/40 p-6 shadow-xl transition-all hover:shadow-2xl"
              >
                {(() => {
                  const mainImage =
                    building.images?.facades?.[0] ||
                    building.images?.exteriorPhotos?.[0] ||
                    building.images?.floorPlan?.[0] ||
                    building.images?.interiorPhotos?.[0];

                  return mainImage ? (
                    <div className="mb-4">
                      <AssetCard image={mainImage} />
                    </div>
                  ) : null;
                })()}

                <div className="mb-4 flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">domain</span>
                  <h3 className="font-headline text-lg font-bold text-on-surface">{building.title}</h3>
                </div>

                <p className="mb-2 text-sm text-on-surface-variant">{building.location}</p>
                {building.coordinates?.lat != null && building.coordinates?.lng != null && (
                  <p className="mb-6 text-xs text-on-surface-variant/60">
                    {building.coordinates.lat.toFixed(5)}, {building.coordinates.lng.toFixed(5)}
                  </p>
                )}

                <div className="flex items-center justify-between gap-2">
                  <Link
                    href={`/admin/buildings/${building.id}`}
                    className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary hover:underline"
                  >
                    <span className="material-symbols-outlined text-sm">visibility</span>
                    Visualizar
                  </Link>

                  <div className="flex gap-2">
                    <Link
                      href={`/admin/buildings/${building.id}/edit`}
                      className="rounded-lg bg-surface-container-high p-2 transition-colors hover:bg-surface-container-high/70"
                      aria-label="Editar edificação"
                    >
                      <span className="material-symbols-outlined text-on-surface">edit</span>
                    </Link>

                    <DeleteButton id={building.id} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
