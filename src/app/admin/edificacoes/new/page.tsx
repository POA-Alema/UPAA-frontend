import type { EdificacaoFormData } from '@/types/edificacao';
import { createEdificacao } from '@/services/edificacoes';
import { EdificacaoForm } from '@/components/admin/EdificacaoForm';
import { redirect } from 'next/navigation';

export default function NewEdificacaoPage() {
  const handleSubmit = async (data: EdificacaoFormData) => {
    'use server';
    await createEdificacao(data);
    redirect('/admin/edificacoes');
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
        <EdificacaoForm onSubmit={handleSubmit} />
      </div>
    </section>
  );
}
