import type { EdificacaoFormData } from '@/types/edificacao';
import { getEdificacaoById, updateEdificacao } from '@/services/edificacoes';
import { EdificacaoForm } from '@/components/admin/EdificacaoForm';
import { redirect } from 'next/navigation';
import Link from 'next/link';

interface EditEdificacaoPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditEdificacaoPage({ params }: EditEdificacaoPageProps) {
  const { id } = await params;
  const edificacao = await getEdificacaoById(id);

  if (!edificacao) {
    return (
      <section className="min-h-screen bg-background text-on-background pt-16 pb-20 px-8 font-body">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-headline font-extrabold text-3xl md:text-5xl text-on-surface tracking-tight mb-6">
            Edificação não encontrada
          </h1>
          <p className="text-on-surface/70 mb-8">A edificação que você está procurando não existe.</p>
          <Link
            href="/admin/edificacoes"
            className="bg-primary text-on-primary font-headline font-bold py-3 px-6 rounded-lg shadow-xl hover:bg-primary/90 transition-all inline-flex items-center gap-2 uppercase tracking-widest text-[10px]"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Voltar para Edificações
          </Link>
        </div>
      </section>
    );
  }

  const handleSubmit = async (data: EdificacaoFormData) => {
    'use server';
    await updateEdificacao(id, data);
    redirect('/admin/edificacoes');
  };

  return (
    <section className="min-h-screen bg-background text-on-background pt-16 pb-20 px-8 font-body">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/admin/edificacoes"
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
        <EdificacaoForm onSubmit={handleSubmit} initialData={edificacao} />
      </div>
    </section>
  );
}
