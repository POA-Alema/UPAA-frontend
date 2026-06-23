import type { BuildingFormData } from '@/types/building';
import { createBuilding } from '@/services/buildings';
import { getArchitects } from '@/services/architects';
import { BuildingForm } from '@/components/admin/BuildingForm';
import { redirect } from 'next/navigation';

export default async function NewBuildingPage() {
  const architects = await getArchitects();

  const handleSubmit = async (data: BuildingFormData) => {
    'use server';
    await createBuilding(data);
    redirect('/admin/buildings?status=created');
  };

  return (
    <section className="min-h-screen bg-background text-on-background pt-16 pb-20 px-8 font-body">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <span className="font-label uppercase tracking-[0.3em] text-[0.65rem] text-primary">
            Painel Administrativo
          </span>
          <h1 className="font-headline font-extrabold text-3xl md:text-5xl text-on-surface tracking-tight mt-2">
            Nova Edificação
          </h1>
          <div className="w-16 h-[1px] bg-primary mt-4 opacity-40"></div>
        </div>

        {/* Formulário */}
        <BuildingForm onSubmit={handleSubmit} architects={architects} />
      </div>
    </section>
  );
}
