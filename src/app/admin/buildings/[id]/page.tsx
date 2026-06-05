import Link from 'next/link';
import { notFound } from 'next/navigation';
import AssetCard from '@/components/admin/AssetCard';
import { RichTextDisplay } from '@/components/admin/RichTextDisplay';
import { getBuildingById } from '@/services/buildings';
import MapViewer from '@/components/admin/MapViewer';

const DETAIL_FIELDS = [
  { key: 'location',              label: 'Endereço' },
  { key: 'constructionPeriod',    label: 'Período de construção' },
  { key: 'architect',             label: 'Arquiteto' },
  { key: 'constructor',           label: 'Construtora / Empresa' },
  { key: 'ornamentsAuthor',       label: 'Ornamentos e esculturas' },
  { key: 'builtArea',             label: 'Área construída' },
  { key: 'currentOccupation',     label: 'Ocupação atual' },
  { key: 'restorationAndHeritage',label: 'Projeto de restauração' },
  { key: 'heritage',              label: 'Tombamento' },
] as const;

const IMAGE_CATEGORIES = [
  { key: 'floorPlan',      label: 'Planta baixa' },
  { key: 'facades',        label: 'Fachadas' },
  { key: 'exteriorPhotos', label: 'Fotos externas' },
  { key: 'interiorPhotos', label: 'Fotos internas' },
] as const;

interface BuildingPageProps {
  params: Promise<{ id: string }>;
}

export default async function BuildingDetailPage({ params }: BuildingPageProps) {
  const { id } = await params;
  const building = await getBuildingById(id);

  if (!building) notFound();

  const hasCoords = building.coordinates?.lat != null && building.coordinates?.lng != null;

  return (
    <section className="min-h-screen bg-background px-8 pb-20 pt-16 font-body text-on-background">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/admin/buildings"
          className="mb-8 inline-flex items-center gap-2 font-headline text-[10px] uppercase tracking-widest text-primary transition-colors hover:text-primary/80"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Voltar para Edificações
        </Link>

        {/* Cabeçalho */}
        <div className="mb-12">
          <span className="font-label text-[0.65rem] uppercase tracking-[0.3em] text-primary">Visualizar</span>
          <h1 className="mt-2 font-headline text-3xl font-extrabold tracking-tight text-on-surface md:text-5xl">
            {building.title}
          </h1>
          <div className="mt-4 h-[1px] w-16 bg-primary opacity-40" />
        </div>

        <div className="space-y-8">

          {/* Informações Básicas */}
          <div className="rounded-lg border border-outline-variant/20 bg-surface-container-high/40 p-6">
            <h2 className="mb-6 flex items-center gap-4 font-headline text-2xl font-bold text-primary">
              <span className="h-[2px] w-12 bg-primary" />
              Informações Básicas
            </h2>

            <dl className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {DETAIL_FIELDS.map(({ key, label }) => {
                const value = building[key as keyof typeof building] as string | undefined;
                if (!value) return null;
                return (
                  <div key={key}>
                    <dt className="font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
                      {label}
                    </dt>
                    <dd className="mt-2 text-lg text-on-surface">{value}</dd>
                  </div>
                );
              })}

              {hasCoords && (
                <div className="md:col-span-2">
                  <dt className="mb-2 font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
                    Localização no Mapa
                  </dt>
                  <dd>
                    <MapViewer coords={building.coordinates as { lat: number; lng: number }} />
                    <p className="mt-2 font-mono text-xs text-on-surface/40">
                      {(building.coordinates as { lat: number; lng: number }).lat.toFixed(6)},{' '}
                      {(building.coordinates as { lat: number; lng: number }).lng.toFixed(6)}
                    </p>
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Histórico */}
          {building.history && (
            <div className="rounded-lg border border-outline-variant/20 bg-surface-container-high/40 p-6">
              <h2 className="mb-4 flex items-center gap-4 font-headline text-2xl font-bold text-primary">
                <span className="h-[2px] w-12 bg-primary" />
                Histórico
              </h2>
              <RichTextDisplay content={building.history} />
            </div>
          )}

          {/* Descrição */}
          {building.description && (
            <div className="rounded-lg border border-outline-variant/20 bg-surface-container-high/40 p-6">
              <h2 className="mb-4 flex items-center gap-4 font-headline text-2xl font-bold text-primary">
                <span className="h-[2px] w-12 bg-primary" />
                Descrição
              </h2>
              <RichTextDisplay content={building.description} />
            </div>
          )}

          {/* Fontes */}
          {building.sources && building.sources.length > 0 && (
            <div className="rounded-lg border border-outline-variant/20 bg-surface-container-high/40 p-6">
              <h2 className="mb-4 flex items-center gap-4 font-headline text-2xl font-bold text-primary">
                <span className="h-[2px] w-12 bg-primary" />
                Fontes
              </h2>
              <ul className="space-y-3">
                {building.sources.map((source) => (
                  <li key={source.id} className="text-on-surface">
                    <strong>{source.title}</strong>
                    {source.author && ` — ${source.author}`}
                    {source.url && (
                      <>
                        {' '}
                        <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          (acessar)
                        </a>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Imagens */}
          <div className="rounded-lg border border-outline-variant/20 bg-surface-container-high/40 p-6">
            <h2 className="mb-6 flex items-center gap-4 font-headline text-2xl font-bold text-primary">
              <span className="h-[2px] w-12 bg-primary" />
              Imagens
            </h2>
            <div className="space-y-8">
              {IMAGE_CATEGORIES.map(({ key, label }) => {
                const images = building.images?.[key] ?? [];
                return (
                  <section key={key}>
                    <h3 className="mb-3 font-headline text-lg font-bold text-on-surface">{label}</h3>
                    {images.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-outline-variant/30 px-4 py-5 text-sm text-on-surface/50">
                        Nenhuma imagem cadastrada nesta categoria.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {images.map((image) => (
                          <AssetCard key={image.id} image={image} />
                        ))}
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-end">
          <Link
            href={`/admin/buildings/${id}/edit`}
            className="flex items-center gap-2 rounded-lg bg-primary px-8 py-3 font-headline text-[10px] font-bold uppercase tracking-widest text-on-primary shadow-xl transition-all hover:bg-primary/90"
          >
            <span className="material-symbols-outlined text-lg">edit</span>
            Editar Edificação
          </Link>
        </div>
      </div>
    </section>
  );
}
