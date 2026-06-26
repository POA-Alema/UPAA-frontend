import { getLandingPageData } from '@/services/landingPage';
import { LandingPageEditClient } from '@/components/admin/LandingPageEditClient';
import Link from 'next/link';

export default async function AdminLandingPageEdit() {
  const landingPageData = await getLandingPageData();

  return (
    <section className="min-h-screen bg-background text-on-background pt-16 pb-20 px-8 font-body">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4 uppercase tracking-widest text-[10px] font-headline"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Voltar ao Dashboard
          </Link>

          <span className="font-label uppercase tracking-[0.3em] text-[0.65rem] text-primary block">
            Painel Administrativo
          </span>
          <h1 className="font-headline font-extrabold text-3xl md:text-5xl text-on-surface tracking-tight mt-2 animate-fade-in">
            Landing Page
          </h1>
          <p className="text-on-surface/70 mt-2">
            Edite os blocos de conteúdo multilíngues e imagens da página inicial do portal.
          </p>
          <div className="w-16 h-[1px] bg-primary mt-4 opacity-40"></div>
        </div>

        {/* Form */}
        <LandingPageEditClient initialData={landingPageData} />
      </div>
    </section>
  );
}
