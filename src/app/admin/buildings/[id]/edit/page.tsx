import { getBuildingById } from '@/services/buildings';
import { getArchitects } from '@/services/architects';
import { BuildingEditClient } from '@/components/admin/BuildingEditClient';
import Link from 'next/link';

interface EditBuildingPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditBuildingPage({ params }: EditBuildingPageProps) {
  const { id } = await params;
  const [building, architects] = await Promise.all([getBuildingById(id), getArchitects()]);

  if (!building) {
    return (
      <section className="min-h-screen bg-background text-on-background pt-16 pb-20 px-8 font-body">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-headline font-extrabold text-3xl md:text-5xl text-on-surface tracking-tight mb-6">
            Edificação não encontrada
          </h1>
          <p className="text-on-surface/70 mb-8">A edificação que você está procurando não existe.</p>
          <Link
            href="/admin/buildings"
            className="bg-primary text-on-primary font-headline font-bold py-3 px-6 rounded-lg shadow-xl hover:bg-primary/90 transition-all inline-flex items-center gap-2 uppercase tracking-widest text-[10px]"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Voltar para Edificações
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-background text-on-background pt-16 pb-20 px-8 font-body">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/admin/buildings"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4 uppercase tracking-widest text-[10px] font-headline"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Voltar
          </Link>

          <span className="font-label uppercase tracking-[0.3em] text-[0.65rem] text-primary block">
            Painel Administrativo
          </span>
          <h1 className="font-headline font-extrabold text-3xl md:text-5xl text-on-surface tracking-tight mt-2">
            Editar Edificação
          </h1>
          <p className="text-on-surface/70 mt-2">ID: {id}</p>
          <div className="w-16 h-[1px] bg-primary mt-4 opacity-40"></div>
        </div>

        {/* Formulário */}
        <BuildingEditClient id={id} building={building} architects={architects} />
      </div>
    </section>
  );
}
