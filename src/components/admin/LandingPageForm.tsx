'use client';

import { useState, useTransition } from 'react';
import type { LandingPageData, InstitutionItem } from '@/types/landingPage';
import { ConfirmationModal } from './ConfirmationModal';
import { ImageSelector } from './ImageSelector';
import { RichTextEditor } from './RichTextEditor';

interface LandingPageFormProps {
  onSubmit: (data: LandingPageData) => Promise<void>;
  initialData: LandingPageData;
}

const LANGUAGES = [
  { key: 'pt', label: 'Português' },
  { key: 'en', label: 'Inglês' },
  { key: 'de', label: 'Alemão' },
] as const;

type LangKey = (typeof LANGUAGES)[number]['key'];

export function LandingPageForm({ onSubmit, initialData }: LandingPageFormProps) {
  const [formData, setFormData] = useState<LandingPageData>(initialData);
  const [activeLang, setActiveLang] = useState<LangKey>('pt');
  
  // States for Accordions/Sections
  const [activeSection, setActiveSection] = useState<string>('header');
  
  // States for Institution Modal/Form
  const [isInstModalOpen, setIsInstModalOpen] = useState(false);
  const [editingInst, setEditingInst] = useState<Partial<InstitutionItem> | null>(null);
  const [institutionToRemove, setInstitutionToRemove] = useState<InstitutionItem | null>(null);
  const [instErrors, setInstErrors] = useState<Record<string, string>>({});

  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  // Helper to handle multilingual changes for basic fields
  const handleMultilingualChange = (
    field: 'mainTitle' | 'subtitle',
    lang: LangKey,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: value,
      },
    }));
  };

  // Helper to handle architect section changes
  const handleArchitectChange = (
    field: keyof Omit<typeof formData.architectSection, 'CTA' | 'imageSubtitle' | 'title' | 'subtitle' | 'content'>,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      architectSection: {
        ...prev.architectSection,
        [field]: value,
      },
    }));
  };

  const handleArchitectMultilingualChange = (
    field: 'title' | 'subtitle' | 'content' | 'imageSubtitle',
    lang: LangKey,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      architectSection: {
        ...prev.architectSection,
        [field]: {
          ...(prev.architectSection[field] || {}),
          [lang]: value,
        },
      },
    }));
  };

  const handleArchitectCtaChange = (
    field: 'target' | 'icon',
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      architectSection: {
        ...prev.architectSection,
        CTA: {
          ...prev.architectSection.CTA,
          [field]: value,
        },
      },
    }));
  };

  const handleArchitectCtaLabelChange = (
    lang: LangKey,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      architectSection: {
        ...prev.architectSection,
        CTA: {
          ...prev.architectSection.CTA,
          label: {
            ...prev.architectSection.CTA.label,
            [lang]: value,
          },
        },
      },
    }));
  };

  // Helper to handle immigration section changes
  const handleImmigrationChange = (
    field: 'imageURL' | 'order',
    value: string | number | undefined
  ) => {
    setFormData((prev) => ({
      ...prev,
      immigrationSection: {
        ...(prev.immigrationSection || { title: { pt: '' }, content: { pt: '' }, order: 2 }),
        [field]: value,
      },
    }));
  };

  const handleImmigrationMultilingualChange = (
    field: 'title' | 'subtitle' | 'content' | 'imgSubtitle',
    lang: LangKey,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      immigrationSection: {
        ...(prev.immigrationSection || { title: { pt: '' }, content: { pt: '' }, order: 2 }),
        [field]: {
          ...(prev.immigrationSection?.[field] || {}),
          [lang]: value,
        },
      },
    }));
  };

  // Helper to handle institutions section changes
  const handleInstitutionsTitleChange = (
    lang: LangKey,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      institutionsSection: {
        ...prev.institutionsSection,
        title: {
          ...prev.institutionsSection.title,
          [lang]: value,
        },
      },
    }));
  };

  // Institution Modal/Form Handlers
  const openAddInstitution = () => {
    setEditingInst({
      id: `inst-${Date.now()}`,
      title: { pt: '', en: '', de: '' },
      description: { pt: '', en: '', de: '' },
      CTA: {
        label: { pt: 'Ver mais', en: 'See more', de: 'Mehr sehen' },
        target: '',
        icon: 'arrow_forward',
      },
      imageURL: '',
      order: (formData.institutionsSection.institutions.length || 0) + 1,
    });
    setInstErrors({});
    setIsInstModalOpen(true);
  };

  const openEditInstitution = (inst: InstitutionItem) => {
    setEditingInst(structuredClone(inst));
    setInstErrors({});
    setIsInstModalOpen(true);
  };

  const handleSaveInstitution = () => {
    if (!editingInst) return;

    // Validate title (at least PT is required)
    if (!editingInst.title?.pt?.trim()) {
      setInstErrors({ titlePt: 'O título em Português é obrigatório' });
      return;
    }

    const itemToSave = editingInst as InstitutionItem;
    const currentList = formData.institutionsSection.institutions;
    const exists = currentList.some((item) => item.id === itemToSave.id);

    const newList = exists
      ? currentList.map((item) => (item.id === itemToSave.id ? itemToSave : item))
      : [...currentList, itemToSave];

    // Sort by order or keep list order
    newList.sort((a, b) => (a.order || 0) - (b.order || 0));

    setFormData((prev) => ({
      ...prev,
      institutionsSection: {
        ...prev.institutionsSection,
        institutions: newList,
      },
    }));

    setIsInstModalOpen(false);
    setEditingInst(null);
  };

  const handleRemoveInstitution = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      institutionsSection: {
        ...prev.institutionsSection,
        institutions: prev.institutionsSection.institutions.filter((item) => item.id !== id),
      },
    }));
    setInstitutionToRemove(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage(null);

    // Validate required fields (at least pt is required for main title and subtitle)
    if (!formData.mainTitle.pt.trim()) {
      setSubmitMessage({ type: 'error', text: 'O Título Principal em Português é obrigatório.' });
      return;
    }

    startTransition(async () => {
      try {
        await onSubmit(formData);
        setSubmitMessage({
          type: 'success',
          text: 'Landing Page atualizada com sucesso!',
        });
      } catch (error) {
        setSubmitMessage({
          type: 'error',
          text: error instanceof Error ? error.message : 'Erro ao salvar alterações.',
        });
      }
    });
  };

  const toggleSection = (sectionName: string) => {
    setActiveSection((prev) => (prev === sectionName ? '' : sectionName));
  };

  return (
    <form onSubmit={handleFormSubmit} className="mx-auto max-w-4xl font-body relative">
      {submitMessage && (
        <div
          className={`mb-8 rounded-lg border p-4 ${
            submitMessage.type === 'success'
              ? 'border-green-700/50 bg-green-900/20 text-green-200 shadow-lg'
              : 'border-red-700/50 bg-red-900/20 text-red-200 shadow-lg'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined">
              {submitMessage.type === 'success' ? 'check_circle' : 'error'}
            </span>
            {submitMessage.text}
          </div>
        </div>
      )}

      {/* Language Switcher Bar */}
      <div className="sticky top-[64px] z-10 bg-background/95 backdrop-blur border-b border-outline-variant/20 py-4 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-on-surface-variant font-label">
            Idioma de Edição ativo
          </span>
          <p className="text-xs text-on-surface/50">
            Campos multilíngues serão alternados automaticamente.
          </p>
        </div>
        <div className="flex bg-surface-container-high/40 p-1 rounded-xl border border-outline-variant/10">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.key}
              type="button"
              onClick={() => setActiveLang(lang.key)}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg font-headline text-xs font-bold uppercase tracking-wider transition-all ${
                activeLang === lang.key
                  ? 'bg-primary text-on-primary shadow'
                  : 'hover:bg-surface-container-high/60 text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-sm">translate</span>
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: HEADER (Título Principal & Subtítulo) */}
      <div className="mb-6 rounded-2xl border border-outline-variant/10 bg-surface-container-high/20 shadow-md overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('header')}
          className="w-full flex items-center justify-between p-6 text-left hover:bg-surface-container-high/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-2xl">title</span>
            <div>
              <h2 className="font-headline text-lg font-bold text-on-surface">Cabeçalho Principal</h2>
              <p className="text-xs text-on-surface/50">Título e subtítulo da landing page.</p>
            </div>
          </div>
          <span className={`material-symbols-outlined transition-transform duration-300 ${activeSection === 'header' ? 'rotate-180' : ''}`}>
            expand_more
          </span>
        </button>

        {activeSection === 'header' && (
          <div className="p-6 border-t border-outline-variant/10 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="mainTitle" className="block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
                  Título Principal ({LANGUAGES.find((l) => l.key === activeLang)?.label}) *
                </label>
                <span className="text-[10px] text-accent uppercase font-bold tracking-widest">multilíngue</span>
              </div>
              <input
                id="mainTitle"
                type="text"
                value={formData.mainTitle[activeLang] || ''}
                onChange={(e) => handleMultilingualChange('mainTitle', activeLang, e.target.value)}
                placeholder="Ex: Uma Porto Alegre alemã"
                className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-2 text-on-surface transition-all focus:outline-none focus:ring-2 focus:ring-primary"
                required={activeLang === 'pt'}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="subtitle" className="block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
                  Subtítulo ({LANGUAGES.find((l) => l.key === activeLang)?.label})
                </label>
                <span className="text-[10px] text-accent uppercase font-bold tracking-widest">multilíngue</span>
              </div>
              <textarea
                id="subtitle"
                rows={3}
                value={formData.subtitle[activeLang] || ''}
                onChange={(e) => handleMultilingualChange('subtitle', activeLang, e.target.value)}
                placeholder="Ex: Arquitetura, memória e cidade..."
                className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-2 text-on-surface transition-all focus:outline-none focus:ring-2 focus:ring-primary resize-y"
              />
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: ARQUITETO */}
      <div className="mb-6 rounded-2xl border border-outline-variant/10 bg-surface-container-high/20 shadow-md overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('architect')}
          className="w-full flex items-center justify-between p-6 text-left hover:bg-surface-container-high/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-2xl">person_edit</span>
            <div>
              <h2 className="font-headline text-lg font-bold text-on-surface">Seção do Arquiteto</h2>
              <p className="text-xs text-on-surface/50">Bloco sobre Theodor Wiederspahn.</p>
            </div>
          </div>
          <span className={`material-symbols-outlined transition-transform duration-300 ${activeSection === 'architect' ? 'rotate-180' : ''}`}>
            expand_more
          </span>
        </button>

        {activeSection === 'architect' && (
          <div className="p-6 border-t border-outline-variant/10 space-y-6">
            <ImageSelector
              label="Imagem da Seção"
              value={formData.architectSection.imageURL}
              onChange={(val) => handleArchitectChange('imageURL', val)}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="archTitle" className="block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
                    Título ({LANGUAGES.find((l) => l.key === activeLang)?.label})
                  </label>
                  <span className="text-[10px] text-accent uppercase font-bold tracking-widest">multilíngue</span>
                </div>
                <input
                  id="archTitle"
                  type="text"
                  value={formData.architectSection.title[activeLang] || ''}
                  onChange={(e) => handleArchitectMultilingualChange('title', activeLang, e.target.value)}
                  placeholder="Ex: O arquiteto"
                  className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-2 text-on-surface transition-all focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="archSubtitle" className="block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
                    Subtítulo ({LANGUAGES.find((l) => l.key === activeLang)?.label})
                  </label>
                  <span className="text-[10px] text-accent uppercase font-bold tracking-widest">multilíngue</span>
                </div>
                <input
                  id="archSubtitle"
                  type="text"
                  value={(formData.architectSection.subtitle && formData.architectSection.subtitle[activeLang]) || ''}
                  onChange={(e) => handleArchitectMultilingualChange('subtitle', activeLang, e.target.value)}
                  placeholder="Ex: Um nome central..."
                  className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-2 text-on-surface transition-all focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="archImgSubtitle" className="block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
                    Legenda/Texto Alt da Imagem ({LANGUAGES.find((l) => l.key === activeLang)?.label})
                  </label>
                  <span className="text-[10px] text-accent uppercase font-bold tracking-widest">multilíngue</span>
                </div>
                <input
                  id="archImgSubtitle"
                  type="text"
                  value={(formData.architectSection.imageSubtitle && formData.architectSection.imageSubtitle[activeLang]) || ''}
                  onChange={(e) => handleArchitectMultilingualChange('imageSubtitle', activeLang, e.target.value)}
                  placeholder="Ex: Retrato de Theodor Wiederspahn"
                  className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-2 text-on-surface transition-all focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
                  Conteúdo ({LANGUAGES.find((l) => l.key === activeLang)?.label}) (RichText)
                </label>
                <span className="text-[10px] text-accent uppercase font-bold tracking-widest">multilíngue</span>
              </div>
              <RichTextEditor
                key={`arch-editor-${activeLang}`}
                value={formData.architectSection.content[activeLang] || ''}
                onChange={(content) => handleArchitectMultilingualChange('content', activeLang, content)}
              />
            </div>

            <fieldset className="border border-outline-variant/20 rounded-xl p-4 bg-surface-container-high/10 space-y-4">
              <legend className="px-2 font-headline text-xs font-bold text-primary uppercase tracking-widest">
                Botão de Ação (CTA)
              </legend>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="archCtaLabel" className="block font-label text-[0.75rem] uppercase tracking-[0.1em] text-on-surface/70">
                      Rótulo do Botão ({LANGUAGES.find((l) => l.key === activeLang)?.label})
                    </label>
                    <span className="text-[9px] text-accent font-bold">multi</span>
                  </div>
                  <input
                    id="archCtaLabel"
                    type="text"
                    value={formData.architectSection.CTA.label[activeLang] || ''}
                    onChange={(e) => handleArchitectCtaLabelChange(activeLang, e.target.value)}
                    placeholder="Ex: Conhecer arquiteto"
                    className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-3 py-2 text-sm text-on-surface transition-all focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="archCtaTarget" className="mb-2 block font-label text-[0.75rem] uppercase tracking-[0.1em] text-on-surface/70">
                    Destino do Link (URL/Rota)
                  </label>
                  <input
                    id="archCtaTarget"
                    type="text"
                    value={formData.architectSection.CTA.target || ''}
                    onChange={(e) => handleArchitectCtaChange('target', e.target.value)}
                    placeholder="Ex: /architects/theodor-wiederspahn"
                    className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-3 py-2 text-sm text-on-surface transition-all focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="archCtaIcon" className="mb-2 block font-label text-[0.75rem] uppercase tracking-[0.1em] text-on-surface/70">
                    Ícone Material
                  </label>
                  <input
                    id="archCtaIcon"
                    type="text"
                    value={formData.architectSection.CTA.icon || ''}
                    onChange={(e) => handleArchitectCtaChange('icon', e.target.value)}
                    placeholder="Ex: user, arrow_forward"
                    className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-3 py-2 text-sm text-on-surface transition-all focus:outline-none"
                  />
                </div>
              </div>
            </fieldset>
          </div>
        )}
      </div>

      {/* SECTION 3: IMIGRAÇÃO */}
      <div className="mb-6 rounded-2xl border border-outline-variant/10 bg-surface-container-high/20 shadow-md overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('immigration')}
          className="w-full flex items-center justify-between p-6 text-left hover:bg-surface-container-high/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-2xl">explore</span>
            <div>
              <h2 className="font-headline text-lg font-bold text-on-surface">Seção de Imigração</h2>
              <p className="text-xs text-on-surface/50">Bloco sobre a imigração alemã no RS.</p>
            </div>
          </div>
          <span className={`material-symbols-outlined transition-transform duration-300 ${activeSection === 'immigration' ? 'rotate-180' : ''}`}>
            expand_more
          </span>
        </button>

        {activeSection === 'immigration' && (
          <div className="p-6 border-t border-outline-variant/10 space-y-6">
            <ImageSelector
              label="Imagem da Seção"
              value={formData.immigrationSection?.imageURL}
              onChange={(val) => handleImmigrationChange('imageURL', val)}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="immTitle" className="block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
                    Título ({LANGUAGES.find((l) => l.key === activeLang)?.label})
                  </label>
                  <span className="text-[10px] text-accent uppercase font-bold tracking-widest">multilíngue</span>
                </div>
                <input
                  id="immTitle"
                  type="text"
                  value={formData.immigrationSection?.title?.[activeLang] || ''}
                  onChange={(e) => handleImmigrationMultilingualChange('title', activeLang, e.target.value)}
                  placeholder="Ex: Imigração alemã"
                  className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-2 text-on-surface transition-all focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="immSubtitle" className="block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
                    Subtítulo ({LANGUAGES.find((l) => l.key === activeLang)?.label})
                  </label>
                  <span className="text-[10px] text-accent uppercase font-bold tracking-widest">multilíngue</span>
                </div>
                <input
                  id="immSubtitle"
                  type="text"
                  value={formData.immigrationSection?.subtitle?.[activeLang] || ''}
                  onChange={(e) => handleImmigrationMultilingualChange('subtitle', activeLang, e.target.value)}
                  placeholder="Ex: Das colônias ao Centro Histórico"
                  className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-2 text-on-surface transition-all focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="immImgSubtitle" className="block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
                    Legenda/Texto Alt da Imagem ({LANGUAGES.find((l) => l.key === activeLang)?.label})
                  </label>
                  <span className="text-[10px] text-accent uppercase font-bold tracking-widest">multilíngue</span>
                </div>
                <input
                  id="immImgSubtitle"
                  type="text"
                  value={formData.immigrationSection?.imgSubtitle?.[activeLang] || ''}
                  onChange={(e) => handleImmigrationMultilingualChange('imgSubtitle', activeLang, e.target.value)}
                  placeholder="Ex: Registros da imigração alemã..."
                  className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-2 text-on-surface transition-all focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
                  Conteúdo ({LANGUAGES.find((l) => l.key === activeLang)?.label}) (RichText)
                </label>
                <span className="text-[10px] text-accent uppercase font-bold tracking-widest">multilíngue</span>
              </div>
              <RichTextEditor
                key={`imm-editor-${activeLang}`}
                value={formData.immigrationSection?.content?.[activeLang] || ''}
                onChange={(content) => handleImmigrationMultilingualChange('content', activeLang, content)}
              />
            </div>
          </div>
        )}
      </div>

      {/* SECTION 4: INSTITUIÇÕES */}
      <div className="mb-12 rounded-2xl border border-outline-variant/10 bg-surface-container-high/20 shadow-md overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('institutions')}
          className="w-full flex items-center justify-between p-6 text-left hover:bg-surface-container-high/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-2xl">museum</span>
            <div>
              <h2 className="font-headline text-lg font-bold text-on-surface">Seção de Instituições</h2>
              <p className="text-xs text-on-surface/50">Carrossel/Lista de instituições em destaque.</p>
            </div>
          </div>
          <span className={`material-symbols-outlined transition-transform duration-300 ${activeSection === 'institutions' ? 'rotate-180' : ''}`}>
            expand_more
          </span>
        </button>

        {activeSection === 'institutions' && (
          <div className="p-6 border-t border-outline-variant/10 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="instSecTitle" className="block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
                  Título Geral da Seção ({LANGUAGES.find((l) => l.key === activeLang)?.label})
                </label>
                <span className="text-[10px] text-accent uppercase font-bold tracking-widest">multilíngue</span>
              </div>
              <input
                id="instSecTitle"
                type="text"
                value={formData.institutionsSection.title[activeLang] || ''}
                onChange={(e) => handleInstitutionsTitleChange(activeLang, e.target.value)}
                placeholder="Ex: Instituições em destaque"
                className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-2 text-on-surface transition-all focus:outline-none focus:ring-2 focus:ring-primary animate-fade-in"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
                  Lista de Instituições Cadastradas
                </label>
                <button
                  type="button"
                  onClick={openAddInstitution}
                  className="flex items-center gap-2 rounded-lg bg-primary/20 px-4 py-2 font-headline text-[10px] font-bold uppercase tracking-widest text-primary transition-all hover:bg-primary/30"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  Adicionar Instituição
                </button>
              </div>

              {formData.institutionsSection.institutions.length === 0 ? (
                <div className="rounded-xl border border-dashed border-outline-variant/30 p-8 text-center bg-surface-container-high/10">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-2">
                    corporate_fare
                  </span>
                  <p className="text-sm text-on-surface-variant">
                    Nenhuma instituição adicionada à lista ainda.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {formData.institutionsSection.institutions.map((inst) => (
                    <div
                      key={inst.id}
                      className="rounded-xl border border-outline-variant/20 bg-surface-container-high/40 p-4 flex gap-4 items-start shadow-md hover:border-primary/30 transition-all group"
                    >
                      {inst.imageURL ? (
                        <img
                          src={inst.imageURL}
                          alt={inst.title.pt}
                          className="w-20 h-20 rounded-lg object-cover bg-surface-container-high"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-lg bg-surface-container-high/80 border border-dashed border-outline-variant/30 flex flex-col items-center justify-center text-on-surface-variant/40">
                          <span className="material-symbols-outlined text-2xl">image</span>
                          <span className="text-[8px] uppercase tracking-wider mt-1 text-center px-1">sem foto</span>
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-headline font-bold text-on-surface truncate pr-2">
                            {inst.title[activeLang] || inst.title.pt || 'Instituição sem nome'}
                          </h4>
                          <span className="text-[9px] bg-primary/15 text-primary border border-primary/20 font-mono font-bold px-2 py-0.5 rounded-full">
                            Ordem: {inst.order}
                          </span>
                        </div>
                        <div
                          className="text-xs text-on-surface-variant/85 mt-1 line-clamp-2 prose prose-sm prose-invert"
                          dangerouslySetInnerHTML={{ __html: inst.description[activeLang] || inst.description.pt || '' }}
                        />
                        <div className="flex justify-between items-center mt-3">
                          <span className="text-[10px] text-accent/80 font-semibold truncate max-w-[150px]">
                            👉 {inst.CTA.target || 'Sem link'}
                          </span>
                          <div className="flex gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => openEditInstitution(inst)}
                              className="p-1 text-on-surface hover:text-primary transition-colors"
                              title="Editar"
                            >
                              <span className="material-symbols-outlined text-lg">edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setInstitutionToRemove(inst)}
                              className="p-1 text-red-400 hover:text-red-300 transition-colors"
                              title="Remover"
                            >
                              <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Button Footer */}
      <div className="flex justify-end gap-4 border-t border-outline-variant/20 pt-6">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 rounded-xl bg-primary px-10 py-4 font-headline text-xs font-bold uppercase tracking-widest text-on-primary shadow-xl transition-all hover:bg-primary/95 hover:scale-102 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-lg">
            {isPending ? 'hourglass_empty' : 'save'}
          </span>
          {isPending ? 'Salvando Alterações...' : 'Salvar Alterações'}
        </button>
      </div>

      <ConfirmationModal
        isOpen={institutionToRemove !== null}
        title="Remover instituição?"
        description={
          <>
            A instituição{' '}
            <strong className="text-on-surface">
              {institutionToRemove?.title[activeLang] || institutionToRemove?.title.pt || 'selecionada'}
            </strong>{' '}
            será removida desta seção.
          </>
        }
        confirmLabel="Remover"
        onCancel={() => setInstitutionToRemove(null)}
        onConfirm={() => {
          if (institutionToRemove) handleRemoveInstitution(institutionToRemove.id);
        }}
      />

      {/* INSTITUTION MODAL / DRAWER */}
      {isInstModalOpen && editingInst && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-2xl rounded-2xl border border-outline-variant/20 bg-surface-container-high p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">corporate_fare</span>
                <h3 className="font-headline text-xl font-bold text-on-surface">
                  {editingInst.title?.pt ? `Editar: ${editingInst.title.pt}` : 'Adicionar Instituição'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsInstModalOpen(false);
                  setEditingInst(null);
                }}
                className="text-on-surface/60 hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Body / Fields */}
            <div className="space-y-6">
              <ImageSelector
                label="Imagem ou Logo da Instituição"
                value={editingInst.imageURL}
                onChange={(val) => setEditingInst((prev) => ({ ...prev, imageURL: val }))}
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block font-label text-xs uppercase tracking-wider text-on-surface/70">
                      Nome da Instituição ({LANGUAGES.find((l) => l.key === activeLang)?.label}) *
                    </label>
                    <span className="text-[8px] text-accent uppercase font-bold tracking-widest">multilíngue</span>
                  </div>
                  <input
                    type="text"
                    value={editingInst.title?.[activeLang] || ''}
                    onChange={(e) => {
                      const text = e.target.value;
                      setEditingInst((prev) => {
                        if (!prev) return prev;
                        return {
                          ...prev,
                          title: {
                            ...(prev.title || { pt: '' }),
                            [activeLang]: text,
                          },
                        };
                      });
                    }}
                    placeholder="Ex: MARGS, Memorial do RS"
                    className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-3 py-2 text-sm text-on-surface transition-all focus:outline-none"
                  />
                  {instErrors.titlePt && activeLang === 'pt' && (
                    <p className="mt-1 text-xs text-red-400">{instErrors.titlePt}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block font-label text-xs uppercase tracking-wider text-on-surface/70">
                    Ordem de Exibição
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={editingInst.order || 1}
                    onChange={(e) => {
                      const order = parseInt(e.target.value, 10) || 1;
                      setEditingInst((prev) => prev ? { ...prev, order } : prev);
                    }}
                    className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-3 py-2 text-sm text-on-surface transition-all focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block font-label text-xs uppercase tracking-wider text-on-surface/70">
                    Descrição ({LANGUAGES.find((l) => l.key === activeLang)?.label}) (RichText)
                  </label>
                  <span className="text-[8px] text-accent uppercase font-bold tracking-widest">multilíngue</span>
                </div>
                <RichTextEditor
                  key={`inst-editor-${activeLang}`}
                  value={editingInst.description?.[activeLang] || ''}
                  onChange={(content) => {
                    setEditingInst((prev) => {
                      if (!prev) return prev;
                      return {
                        ...prev,
                        description: {
                          ...(prev.description || { pt: '' }),
                          [activeLang]: content,
                        },
                      };
                    });
                  }}
                />
              </div>

              <fieldset className="border border-outline-variant/20 rounded-xl p-4 bg-surface-container-high/10 space-y-4">
                <legend className="px-2 font-headline text-[10px] font-bold text-primary uppercase tracking-widest">
                  Botão de Ação (CTA)
                </legend>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block font-label text-[10px] uppercase tracking-wider text-on-surface/70">
                        Texto do Botão ({LANGUAGES.find((l) => l.key === activeLang)?.label})
                      </label>
                      <span className="text-[8px] text-accent">multi</span>
                    </div>
                    <input
                      type="text"
                      value={editingInst.CTA?.label?.[activeLang] || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditingInst((prev) => {
                          if (!prev) return prev;
                          const oldCta = prev.CTA || { label: { pt: '' }, target: '' };
                          return {
                            ...prev,
                            CTA: {
                              ...oldCta,
                              label: {
                                ...oldCta.label,
                                [activeLang]: val,
                              },
                            },
                          };
                        });
                      }}
                      placeholder="Ex: Ver edifício"
                      className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-3 py-2 text-xs text-on-surface transition-all focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-label text-[10px] uppercase tracking-wider text-on-surface/70">
                      Destino do Link (URL/Rota)
                    </label>
                    <input
                      type="text"
                      value={editingInst.CTA?.target || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditingInst((prev) => {
                          if (!prev) return prev;
                          const oldCta = prev.CTA || { label: { pt: '' }, target: '' };
                          return {
                            ...prev,
                            CTA: {
                              ...oldCta,
                              target: val,
                            },
                          };
                        });
                      }}
                      placeholder="Ex: /buildings/..."
                      className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-3 py-2 text-xs text-on-surface transition-all focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-label text-[10px] uppercase tracking-wider text-on-surface/70">
                      Ícone Material
                    </label>
                    <input
                      type="text"
                      value={editingInst.CTA?.icon || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditingInst((prev) => {
                          if (!prev) return prev;
                          const oldCta = prev.CTA || { label: { pt: '' }, target: '' };
                          return {
                            ...prev,
                            CTA: {
                              ...oldCta,
                              icon: val,
                            },
                          };
                        });
                      }}
                      placeholder="Ex: building, landmark"
                      className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-3 py-2 text-xs text-on-surface transition-all focus:outline-none"
                    />
                  </div>
                </div>
              </fieldset>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => {
                  setIsInstModalOpen(false);
                  setEditingInst(null);
                }}
                className="px-5 py-2.5 rounded-lg border border-outline-variant/30 text-xs uppercase tracking-wider font-headline font-bold text-on-surface hover:bg-surface-container-high/60 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveInstitution}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-on-primary text-xs uppercase tracking-wider font-headline font-bold hover:bg-primary/95 transition-all shadow"
              >
                <span className="material-symbols-outlined text-sm">check</span>
                Salvar Instituição
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
