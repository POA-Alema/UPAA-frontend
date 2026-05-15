'use client';

import { useState, useTransition } from 'react';
import type { BuildingFormData, BuildingSource } from '@/types/building';
import AssetCard from './AssetCard';
import { RichTextEditor } from './RichTextEditor';

interface BuildingFormProps {
  onSubmit: (data: BuildingFormData) => Promise<void>;
  initialData?: BuildingFormData;
  isLoading?: boolean;
}

const IMAGE_CATEGORIES = [
  { key: 'floorPlan', label: 'Planta baixa' },
  { key: 'facades', label: 'Fachadas' },
  { key: 'exteriorPhotos', label: 'Fotos externas' },
  { key: 'interiorPhotos', label: 'Fotos internas' },
] as const;

function createInitialData(initialData?: BuildingFormData): BuildingFormData {
  return (
    initialData || {
      title: '',
      location: '',
      constructionPeriod: '',
      architect: '',
      constructor: '',
      ornamentsAuthor: '',
      builtArea: '',
      currentOccupation: '',
      restorationAndHeritage: '',
      heritage: '',
      description: '',
      author: '',
      sources: [],
      images: {
        floorPlan: [],
        facades: [],
        exteriorPhotos: [],
        interiorPhotos: [],
      },
    }
  );
}

export function BuildingForm({ onSubmit, initialData, isLoading = false }: BuildingFormProps) {
  const [formData, setFormData] = useState<BuildingFormData>(createInitialData(initialData));
  const [sourceTemp, setSourceTemp] = useState<Partial<BuildingSource>>({});
  const [imagemTemp, setImagemTemp] = useState<
    Record<(typeof IMAGE_CATEGORIES)[number]['key'], { url: string; alt: string; caption: string }>
  >({
    floorPlan: { url: '', alt: '', caption: '' },
    facades: { url: '', alt: '', caption: '' },
    exteriorPhotos: { url: '', alt: '', caption: '' },
    interiorPhotos: { url: '', alt: '', caption: '' },
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSource = () => {
    if (!sourceTemp.title?.trim()) {
      setErrors((prev) => ({
        ...prev,
        sourceTemp: 'Título da fonte é obrigatório',
      }));
      return;
    }

    const newSource: BuildingSource = {
      id: `fonte-${Date.now()}`,
      title: sourceTemp.title,
      author: sourceTemp.author || undefined,
      url: sourceTemp.url || undefined,
    };

    setFormData((prev) => ({
      ...prev,
      sources: [...(prev.sources || []), newSource],
    }));

    setSourceTemp({});
    if (errors.sourceTemp) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.sourceTemp;
        return newErrors;
      });
    }
  };

  const handleRemoveSource = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      sources: (prev.sources || []).filter((source) => source.id !== id),
    }));
  };

  const handleRemoveImage = (category: (typeof IMAGE_CATEGORIES)[number]['key'], imageId: string) => {
    setFormData((prev) => ({
      ...prev,
      images: {
        floorPlan: prev.images?.floorPlan || [],
        facades: prev.images?.facades || [],
        exteriorPhotos: prev.images?.exteriorPhotos || [],
        interiorPhotos: prev.images?.interiorPhotos || [],
        [category]: (prev.images?.[category] || []).filter((image) => image.id !== imageId),
      },
    }));
  };

  const handleImageInputChange = (
    category: (typeof IMAGE_CATEGORIES)[number]['key'],
    field: 'url' | 'alt' | 'caption',
    value: string
  ) => {
    setImagemTemp((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));

    const errorKey = `imagem-${category}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const handleAddImage = (category: (typeof IMAGE_CATEGORIES)[number]['key']) => {
    const draft = imagemTemp[category];
    const errorKey = `imagem-${category}`;

    if (!draft.url.trim() || !draft.alt.trim()) {
      setErrors((prev) => ({
        ...prev,
        [errorKey]: 'URL e texto alternativo são obrigatórios para adicionar uma imagem.',
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      images: {
        floorPlan: prev.images?.floorPlan || [],
        facades: prev.images?.facades || [],
        exteriorPhotos: prev.images?.exteriorPhotos || [],
        interiorPhotos: prev.images?.interiorPhotos || [],
        [category]: [
          ...(prev.images?.[category] || []),
          {
            id: `image-${category}-${Date.now()}`,
            url: draft.url.trim(),
            alt: draft.alt.trim(),
            caption: draft.caption.trim() || undefined,
          },
        ],
      },
    }));

    setImagemTemp((prev) => ({
      ...prev,
      [category]: { url: '', alt: '', caption: '' },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage(null);

    if (!validateForm()) {
      return;
    }

    startTransition(async () => {
      try {
        await onSubmit(formData);
        setSubmitMessage({
          type: 'success',
          text: initialData ? 'Edificação atualizada com sucesso!' : 'Edificação criada com sucesso!',
        });

        if (!initialData) {
          setFormData(createInitialData());
        }
      } catch (error) {
        setSubmitMessage({
          type: 'error',
          text: error instanceof Error ? error.message : 'Erro ao salvar edificação',
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-4xl font-body">
      {submitMessage && (
        <div
          className={`mb-8 rounded-lg border p-4 ${
            submitMessage.type === 'success'
              ? 'border-green-700/50 bg-green-900/20 text-green-200'
              : 'border-red-700/50 bg-red-900/20 text-red-200'
          }`}
        >
          {submitMessage.text}
        </div>
      )}

      <fieldset className="mb-12 border-b border-outline-variant/20 pb-12">
        <legend className="mb-8 flex items-center gap-4 font-headline text-2xl font-bold text-primary">
          <span className="h-[2px] w-12 bg-primary"></span>
          Informações Básicas
        </legend>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="title" className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
              Título *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full rounded-lg border px-4 py-2 text-on-surface transition-all focus:outline-none focus:ring-2 ${
                errors.title
                  ? 'border-red-500/50 bg-surface-container-high/50 focus:ring-red-500'
                  : 'border-outline-variant/30 bg-surface-container-high/50 focus:ring-primary'
              }`}
              required
            />
            {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="location" className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
              Localização
            </label>
            <input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleInputChange}
              className={`w-full rounded-lg border px-4 py-2 text-on-surface transition-all focus:outline-none focus:ring-2 ${
                errors.location
                  ? 'border-red-500/50 bg-surface-container-high/50 focus:ring-red-500'
                  : 'border-outline-variant/30 bg-surface-container-high/50 focus:ring-primary'
              }`}
            />
            {errors.location && <p className="mt-1 text-sm text-red-400">{errors.location}</p>}
          </div>

          <div>
            <label htmlFor="constructionPeriod" className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
              Data
            </label>
            <input
              id="constructionPeriod"
              name="constructionPeriod"
              type="text"
              placeholder="Ex: 1900"
              value={formData.constructionPeriod}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-2 text-on-surface transition-all focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="architect" className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
              Projeto
            </label>
            <input
              id="architect"
              name="architect"
              type="text"
              value={formData.architect}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-2 text-on-surface transition-all focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="constructor" className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
              Construção
            </label>
            <input
              id="constructor"
              name="constructor"
              type="text"
              value={formData.constructor}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-2 text-on-surface transition-all focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="ornamentsAuthor" className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
              Conjunto de ornamentos e esculturas
            </label>
            <input
              id="ornamentsAuthor"
              name="ornamentsAuthor"
              type="text"
              value={formData.ornamentsAuthor}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-2 text-on-surface transition-all focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="builtArea" className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
              Área construída
            </label>
            <input
              id="builtArea"
              name="builtArea"
              type="text"
              value={formData.builtArea}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-2 text-on-surface transition-all focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="currentOccupation" className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
              Ocupação atual
            </label>
            <input
              id="currentOccupation"
              name="currentOccupation"
              type="text"
              value={formData.currentOccupation}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-2 text-on-surface transition-all focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="restorationAndHeritage" className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
              Projeto de restauração
            </label>
            <input
              id="restorationAndHeritage"
              name="restorationAndHeritage"
              type="text"
              value={formData.restorationAndHeritage}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-2 text-on-surface transition-all focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="heritage" className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
              Tombamento
            </label>
            <input
              id="heritage"
              name="heritage"
              type="text"
              value={formData.heritage}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-2 text-on-surface transition-all focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="author" className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
              Autor
            </label>
            <input
              id="author"
              name="author"
              type="text"
              value={formData.author}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-2 text-on-surface transition-all focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="mb-12 border-b border-outline-variant/20 pb-12">
        <legend className="mb-8 flex items-center gap-4 font-headline text-2xl font-bold text-primary">
          <span className="h-[2px] w-12 bg-primary"></span>
          Descrição
        </legend>

        <div>
          <label className="mb-4 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
            Descrição da Edificação (RichText)
          </label>
          <RichTextEditor
            value={formData.description}
            onChange={(content) =>
              setFormData((prev) => ({
                ...prev,
                description: content,
              }))
            }
          />
        </div>
      </fieldset>

      <fieldset className="mb-12 border-b border-outline-variant/20 pb-12">
        <legend className="mb-8 flex items-center gap-4 font-headline text-2xl font-bold text-primary">
          <span className="h-[2px] w-12 bg-primary"></span>
          Fontes
        </legend>

        <div className="mb-6 rounded-lg border border-outline-variant/20 bg-surface-container-high/30 p-6">
          <h3 className="mb-4 font-headline text-lg font-bold">Adicionar Fonte</h3>

          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="sourceTitle" className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
                Título *
              </label>
              <input
                id="sourceTitle"
                type="text"
                value={sourceTemp.title || ''}
                onChange={(e) =>
                  setSourceTemp((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                className={`w-full rounded-lg border px-4 py-2 text-on-surface transition-all focus:outline-none focus:ring-2 ${
                  errors.sourceTemp
                    ? 'border-red-500/50 bg-surface-container-high/50 focus:ring-red-500'
                    : 'border-outline-variant/30 bg-surface-container-high/50 focus:ring-primary'
                }`}
              />
            </div>

            <div>
              <label htmlFor="sourceAuthor" className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
                Autor
              </label>
              <input
                id="sourceAuthor"
                type="text"
                value={sourceTemp.author || ''}
                onChange={(e) =>
                  setSourceTemp((prev) => ({
                    ...prev,
                    author: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-2 text-on-surface transition-all focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="sourceUrl" className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
                URL
              </label>
              <input
                id="sourceUrl"
                type="text"
                value={sourceTemp.url || ''}
                onChange={(e) =>
                  setSourceTemp((prev) => ({
                    ...prev,
                    url: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-2 text-on-surface transition-all focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {errors.sourceTemp && <p className="mb-4 text-sm text-red-400">{errors.sourceTemp}</p>}

          <button
            type="button"
            onClick={handleAddSource}
            className="flex items-center gap-2 rounded-lg bg-primary/20 px-4 py-2 font-headline text-[10px] font-bold uppercase tracking-widest text-primary transition-all hover:bg-primary/30"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Adicionar Fonte
          </button>
        </div>

        {formData.sources && formData.sources.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-headline text-lg font-bold">Fontes Adicionadas:</h3>
            {formData.sources.map((source) => (
              <div
                key={source.id}
                className="flex items-start justify-between gap-4 rounded-lg border border-outline-variant/30 bg-surface-container-high/40 p-4"
              >
                <div>
                  <p className="font-headline font-bold text-on-surface">{source.title}</p>
                  {source.author && <p className="text-sm text-on-surface/70">Por: {source.author}</p>}
                  {source.url && (
                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                      Acessar
                    </a>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSource(source.id)}
                  className="text-red-400 transition-colors hover:text-red-300"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </fieldset>

      <fieldset className="mb-12 border-b border-outline-variant/20 pb-12">
        <legend className="mb-8 flex items-center gap-4 font-headline text-2xl font-bold text-primary">
          <span className="h-[2px] w-12 bg-primary"></span>
          Seções de Imagens
        </legend>

        <div className="space-y-8">
          {IMAGE_CATEGORIES.map(({ key, label }) => {
            const images = formData.images?.[key] || [];
            const draftImage = imagemTemp[key];
            const previewImage =
              draftImage.url.trim() && draftImage.alt.trim()
                ? {
                    id: `preview-${key}`,
                    url: draftImage.url.trim(),
                    alt: draftImage.alt.trim(),
                    caption: draftImage.caption.trim() || undefined,
                    fallbackUrl:
                      key === 'facades' || key === 'exteriorPhotos'
                        ? '/images/Margs.jpg'
                        : key === 'interiorPhotos'
                          ? '/images/Memorial RS.jpg'
                          : '/images/Margs.jpg',
                  }
                : null;

            return (
              <section key={key} className="rounded-lg border border-outline-variant/20 bg-surface-container-high/30 p-6">
                <div className="mb-4">
                  <h3 className="font-headline text-lg font-bold text-on-surface">{label}</h3>
                  <p className="text-sm text-on-surface/60">
                    {images.length > 0
                      ? `${images.length} imagem(ns) disponível(is) nesta categoria`
                      : 'Nenhuma imagem cadastrada. O formulário continua podendo ser salvo sem imagens.'}
                  </p>
                </div>

                <div className="mb-6 grid grid-cols-1 gap-4 rounded-lg border border-outline-variant/20 bg-surface-container-high/20 p-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
                      URL da imagem *
                    </label>
                    <input
                      type="text"
                      value={imagemTemp[key].url}
                      onChange={(e) => handleImageInputChange(key, 'url', e.target.value)}
                      placeholder="/images/Margs.jpg ou URL externa"
                      className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-2 text-on-surface transition-all focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
                      Texto alternativo *
                    </label>
                    <input
                      type="text"
                      value={imagemTemp[key].alt}
                      onChange={(e) => handleImageInputChange(key, 'alt', e.target.value)}
                      className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-2 text-on-surface transition-all focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
                      Legenda
                    </label>
                    <input
                      type="text"
                      value={imagemTemp[key].caption}
                      onChange={(e) => handleImageInputChange(key, 'caption', e.target.value)}
                      className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-2 text-on-surface transition-all focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {errors[`imagem-${key}`] && (
                    <p className="md:col-span-2 text-sm text-red-400">{errors[`imagem-${key}`]}</p>
                  )}

                  <div className="md:col-span-2">
                    <button
                      type="button"
                      onClick={() => handleAddImage(key)}
                      className="flex items-center gap-2 rounded-lg bg-primary/20 px-4 py-2 font-headline text-[10px] font-bold uppercase tracking-widest text-primary transition-all hover:bg-primary/30"
                    >
                      <span className="material-symbols-outlined text-sm">add_photo_alternate</span>
                      Adicionar imagem
                    </button>
                  </div>
                </div>

                {previewImage && (
                  <div className="mb-6">
                    <p className="mb-3 font-label text-[0.75rem] uppercase tracking-[0.2em] text-on-surface/60">
                      Pré-visualização
                    </p>
                    <div className="max-w-md">
                      <AssetCard image={previewImage} />
                    </div>
                  </div>
                )}

                {images.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {images.map((image) => (
                      <AssetCard
                        key={image.id}
                        image={image}
                        onRemove={() => handleRemoveImage(key, image.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-outline-variant/30 px-4 py-6 text-sm text-on-surface/50">
                    Categoria vazia.
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </fieldset>

      <div className="flex justify-end gap-4">
        <button
          type="submit"
          disabled={isLoading || isPending}
          className="flex items-center gap-2 rounded-lg bg-primary px-8 py-3 font-headline text-[10px] font-bold uppercase tracking-widest text-on-primary shadow-xl transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-lg">
            {isLoading || isPending ? 'hourglass_empty' : 'check'}
          </span>
          {isLoading || isPending ? 'Salvando...' : initialData ? 'Atualizar Edificação' : 'Criar Edificação'}
        </button>
      </div>
    </form>
  );
}
