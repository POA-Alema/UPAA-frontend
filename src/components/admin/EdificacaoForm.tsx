'use client';

import { useState, useTransition } from 'react';
import type { EdificacaoFormData, FonteEdificacao } from '@/types/edificacao';
import AssetCard from './AssetCard';
import { RichTextEditor } from './RichTextEditor';

interface EdificacaoFormProps {
  onSubmit: (data: EdificacaoFormData) => Promise<void>;
  initialData?: EdificacaoFormData;
  isLoading?: boolean;
}

const IMAGE_CATEGORIES = [
  { key: 'plantaBaixa', label: 'Planta baixa' },
  { key: 'fachadas', label: 'Fachadas' },
  { key: 'fotosExternas', label: 'Fotos externas' },
  { key: 'fotosInternas', label: 'Fotos internas' },
] as const;

function createInitialData(initialData?: EdificacaoFormData): EdificacaoFormData {
  return (
    initialData || {
      titulo: '',
      localizacao: '',
      data: '',
      projeto: '',
      construcao: '',
      ornamentosEsculturas: '',
      areaConstituida: '',
      ocupacaoAtual: '',
      projetoRestauracao: '',
      tombamento: '',
      descricao: '',
      autor: '',
      fontes: [],
      imagens: {
        plantaBaixa: [],
        fachadas: [],
        fotosExternas: [],
        fotosInternas: [],
      },
    }
  );
}

export function EdificacaoForm({ onSubmit, initialData, isLoading = false }: EdificacaoFormProps) {
  const [formData, setFormData] = useState<EdificacaoFormData>(createInitialData(initialData));
  const [fonteTemp, setFonteTemp] = useState<Partial<FonteEdificacao>>({});
  const [imagemTemp, setImagemTemp] = useState<
    Record<(typeof IMAGE_CATEGORIES)[number]['key'], { url: string; alt: string; legenda: string }>
  >({
    plantaBaixa: { url: '', alt: '', legenda: '' },
    fachadas: { url: '', alt: '', legenda: '' },
    fotosExternas: { url: '', alt: '', legenda: '' },
    fotosInternas: { url: '', alt: '', legenda: '' },
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

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'Título é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddFonte = () => {
    if (!fonteTemp.titulo?.trim()) {
      setErrors((prev) => ({
        ...prev,
        fonteTemp: 'Título da fonte é obrigatório',
      }));
      return;
    }

    const novaFonte: FonteEdificacao = {
      id: `fonte-${Date.now()}`,
      titulo: fonteTemp.titulo,
      autor: fonteTemp.autor || undefined,
      url: fonteTemp.url || undefined,
    };

    setFormData((prev) => ({
      ...prev,
      fontes: [...(prev.fontes || []), novaFonte],
    }));

    setFonteTemp({});
    if (errors.fonteTemp) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.fonteTemp;
        return newErrors;
      });
    }
  };

  const handleRemoveFonte = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      fontes: (prev.fontes || []).filter((fonte) => fonte.id !== id),
    }));
  };

  const handleRemoveImage = (category: (typeof IMAGE_CATEGORIES)[number]['key'], imageId: string) => {
    setFormData((prev) => ({
      ...prev,
      imagens: {
        plantaBaixa: prev.imagens?.plantaBaixa || [],
        fachadas: prev.imagens?.fachadas || [],
        fotosExternas: prev.imagens?.fotosExternas || [],
        fotosInternas: prev.imagens?.fotosInternas || [],
        [category]: (prev.imagens?.[category] || []).filter((imagem) => imagem.id !== imageId),
      },
    }));
  };

  const handleImageInputChange = (
    category: (typeof IMAGE_CATEGORIES)[number]['key'],
    field: 'url' | 'alt' | 'legenda',
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
      imagens: {
        plantaBaixa: prev.imagens?.plantaBaixa || [],
        fachadas: prev.imagens?.fachadas || [],
        fotosExternas: prev.imagens?.fotosExternas || [],
        fotosInternas: prev.imagens?.fotosInternas || [],
        [category]: [
          ...(prev.imagens?.[category] || []),
          {
            id: `imagem-${category}-${Date.now()}`,
            url: draft.url.trim(),
            alt: draft.alt.trim(),
            legenda: draft.legenda.trim() || undefined,
          },
        ],
      },
    }));

    setImagemTemp((prev) => ({
      ...prev,
      [category]: { url: '', alt: '', legenda: '' },
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
            <label htmlFor="titulo" className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
              Título *
            </label>
            <input
              id="titulo"
              name="titulo"
              type="text"
              value={formData.titulo}
              onChange={handleInputChange}
              className={`w-full rounded-lg border px-4 py-2 text-on-surface transition-all focus:outline-none focus:ring-2 ${
                errors.titulo
                  ? 'border-red-500/50 bg-surface-container-high/50 focus:ring-red-500'
                  : 'border-outline-variant/30 bg-surface-container-high/50 focus:ring-primary'
              }`}
              required
            />
            {errors.titulo && <p className="mt-1 text-sm text-red-400">{errors.titulo}</p>}
          </div>

          <div>
            <label htmlFor="localizacao" className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
              Localização
            </label>
            <input
              id="localizacao"
              name="localizacao"
              type="text"
              value={formData.localizacao}
              onChange={handleInputChange}
              className={`w-full rounded-lg border px-4 py-2 text-on-surface transition-all focus:outline-none focus:ring-2 ${
                errors.localizacao
                  ? 'border-red-500/50 bg-surface-container-high/50 focus:ring-red-500'
                  : 'border-outline-variant/30 bg-surface-container-high/50 focus:ring-primary'
              }`}
            />
            {errors.localizacao && <p className="mt-1 text-sm text-red-400">{errors.localizacao}</p>}
          </div>

          <div>
            <label htmlFor="data" className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
              Data
            </label>
            <input
              id="data"
              name="data"
              type="text"
              placeholder="Ex: 1900"
              value={formData.data}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-2 text-on-surface transition-all focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="projeto" className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
              Projeto
            </label>
            <input
              id="projeto"
              name="projeto"
              type="text"
              value={formData.projeto}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-2 text-on-surface transition-all focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="construcao" className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
              Construção
            </label>
            <input
              id="construcao"
              name="construcao"
              type="text"
              value={formData.construcao}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-2 text-on-surface transition-all focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="ornamentosEsculturas" className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
              Conjunto de ornamentos e esculturas
            </label>
            <input
              id="ornamentosEsculturas"
              name="ornamentosEsculturas"
              type="text"
              value={formData.ornamentosEsculturas}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-2 text-on-surface transition-all focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="areaConstituida" className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
              Área construída
            </label>
            <input
              id="areaConstituida"
              name="areaConstituida"
              type="text"
              value={formData.areaConstituida}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-2 text-on-surface transition-all focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="ocupacaoAtual" className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
              Ocupação atual
            </label>
            <input
              id="ocupacaoAtual"
              name="ocupacaoAtual"
              type="text"
              value={formData.ocupacaoAtual}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-2 text-on-surface transition-all focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="projetoRestauracao" className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
              Projeto de restauração
            </label>
            <input
              id="projetoRestauracao"
              name="projetoRestauracao"
              type="text"
              value={formData.projetoRestauracao}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-2 text-on-surface transition-all focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="tombamento" className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
              Tombamento
            </label>
            <input
              id="tombamento"
              name="tombamento"
              type="text"
              value={formData.tombamento}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-2 text-on-surface transition-all focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="autor" className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
              Autor
            </label>
            <input
              id="autor"
              name="autor"
              type="text"
              value={formData.autor}
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
            value={formData.descricao}
            onChange={(content) =>
              setFormData((prev) => ({
                ...prev,
                descricao: content,
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
              <label htmlFor="fonteTitulo" className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
                Título *
              </label>
              <input
                id="fonteTitulo"
                type="text"
                value={fonteTemp.titulo || ''}
                onChange={(e) =>
                  setFonteTemp((prev) => ({
                    ...prev,
                    titulo: e.target.value,
                  }))
                }
                className={`w-full rounded-lg border px-4 py-2 text-on-surface transition-all focus:outline-none focus:ring-2 ${
                  errors.fonteTemp
                    ? 'border-red-500/50 bg-surface-container-high/50 focus:ring-red-500'
                    : 'border-outline-variant/30 bg-surface-container-high/50 focus:ring-primary'
                }`}
              />
            </div>

            <div>
              <label htmlFor="fonteAutor" className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
                Autor
              </label>
              <input
                id="fonteAutor"
                type="text"
                value={fonteTemp.autor || ''}
                onChange={(e) =>
                  setFonteTemp((prev) => ({
                    ...prev,
                    autor: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-2 text-on-surface transition-all focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="fonteUrl" className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
                URL
              </label>
              <input
                id="fonteUrl"
                type="text"
                value={fonteTemp.url || ''}
                onChange={(e) =>
                  setFonteTemp((prev) => ({
                    ...prev,
                    url: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-2 text-on-surface transition-all focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {errors.fonteTemp && <p className="mb-4 text-sm text-red-400">{errors.fonteTemp}</p>}

          <button
            type="button"
            onClick={handleAddFonte}
            className="flex items-center gap-2 rounded-lg bg-primary/20 px-4 py-2 font-headline text-[10px] font-bold uppercase tracking-widest text-primary transition-all hover:bg-primary/30"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Adicionar Fonte
          </button>
        </div>

        {formData.fontes && formData.fontes.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-headline text-lg font-bold">Fontes Adicionadas:</h3>
            {formData.fontes.map((fonte) => (
              <div
                key={fonte.id}
                className="flex items-start justify-between gap-4 rounded-lg border border-outline-variant/30 bg-surface-container-high/40 p-4"
              >
                <div>
                  <p className="font-headline font-bold text-on-surface">{fonte.titulo}</p>
                  {fonte.autor && <p className="text-sm text-on-surface/70">Por: {fonte.autor}</p>}
                  {fonte.url && (
                    <a href={fonte.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                      Acessar
                    </a>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveFonte(fonte.id)}
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
            const imagens = formData.imagens?.[key] || [];
            const draftImage = imagemTemp[key];
            const previewImage =
              draftImage.url.trim() && draftImage.alt.trim()
                ? {
                    id: `preview-${key}`,
                    url: draftImage.url.trim(),
                    alt: draftImage.alt.trim(),
                    legenda: draftImage.legenda.trim() || undefined,
                    fallbackUrl:
                      key === 'fachadas' || key === 'fotosExternas'
                        ? '/images/Margs.jpg'
                        : key === 'fotosInternas'
                          ? '/images/Memorial RS.jpg'
                          : '/images/Margs.jpg',
                  }
                : null;

            return (
              <section key={key} className="rounded-lg border border-outline-variant/20 bg-surface-container-high/30 p-6">
                <div className="mb-4">
                  <h3 className="font-headline text-lg font-bold text-on-surface">{label}</h3>
                  <p className="text-sm text-on-surface/60">
                    {imagens.length > 0
                      ? `${imagens.length} imagem(ns) disponível(is) nesta categoria`
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
                      value={imagemTemp[key].legenda}
                      onChange={(e) => handleImageInputChange(key, 'legenda', e.target.value)}
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

                {imagens.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {imagens.map((imagem) => (
                      <AssetCard
                        key={imagem.id}
                        image={imagem}
                        onRemove={() => handleRemoveImage(key, imagem.id)}
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
