'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { BuildingFormData, BuildingSource } from '@/types/building';
import type { ArchitectOption } from '@/services/architects';
import { uploadBuildingImage } from '@/services/buildings';
import AssetCard from './AssetCard';
import { RichTextEditor } from './RichTextEditor';

const MapPicker = dynamic(() => import('./MapPicker'), { ssr: false });

interface BuildingFormProps {
  onSubmit: (data: BuildingFormData) => Promise<void>;
  initialData?: BuildingFormData;
  isLoading?: boolean;
  architects?: ArchitectOption[];
}

interface MetaData {
  qrCodeKey?: string;
  history?: string;
  createdById?: string;
  updatedById?: string;
}



const IMAGE_CATEGORIES = [
  { key: 'floorPlan', label: 'Planta baixa', type: 'planta_baixa' },
  { key: 'facades', label: 'Fachadas', type: 'fachada' },
  { key: 'exteriorPhotos', label: 'Fotos externas', type: 'externa' },
  { key: 'interiorPhotos', label: 'Fotos internas', type: 'interna' },
] as const;

function createInitialData(initialData?: BuildingFormData): BuildingFormData {
  return (
    initialData || {
      title: '',
      location: '',
      coordinates: undefined,
      constructionPeriod: '',
      architect: '',
      constructor: '',
      ornamentsAuthor: '',
      builtArea: '',
      currentOccupation: '',
      restorationAndHeritage: '',
      heritage: '',
      description: '',
      history: '',
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

function ArchitectSelect({
  architects,
  value,
  onChange,
  hasError,
}: {
  architects: ArchitectOption[];
  value: string;
  onChange: (id: string, name: string) => void;
  hasError: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const selected = architects.find((a) => a.id === value);
  const border = hasError ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.1)';

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{ background: '#2c2928', border }}
        className="flex w-full items-center justify-between rounded-lg px-4 py-2 text-left transition-all focus:outline-none focus:ring-2 focus:ring-white/20"
      >
        <span style={{ color: selected ? 'var(--foreground)' : 'rgba(231,225,223,0.35)' }}>
          {selected ? selected.name : '— Selecione um arquiteto —'}
        </span>
        <span
          className="material-symbols-outlined text-base transition-transform duration-200"
          style={{ color: 'rgba(231,225,223,0.4)', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          expand_more
        </span>
      </button>

      {open && (
        <ul
          className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg shadow-xl"
          style={{ background: '#1e1c1b', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <li>
            <button
              type="button"
              onClick={() => { onChange('', ''); setOpen(false); }}
              className="w-full px-4 py-2 text-left text-sm transition-colors"
              style={{ color: 'rgba(231,225,223,0.35)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              — Selecione um arquiteto —
            </button>
          </li>
          {architects.map((a) => (
            <li key={a.id} style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <button
                type="button"
                onClick={() => { onChange(a.id, a.name); setOpen(false); }}
                className="w-full px-4 py-2 text-left text-sm transition-colors"
                style={{
                  color: a.id === value ? 'var(--accent-strong)' : 'var(--foreground)',
                  background: a.id === value ? 'rgba(209,166,91,0.1)' : 'transparent',
                  fontWeight: a.id === value ? 600 : 400,
                }}
                onMouseEnter={(e) => { if (a.id !== value) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = a.id === value ? 'rgba(209,166,91,0.1)' : 'transparent'; }}
              >
                {a.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function BuildingForm({ onSubmit, initialData, isLoading = false, architects = [] }: BuildingFormProps) {
  const [formData, setFormData] = useState<BuildingFormData>(createInitialData(initialData));
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [meta, setMeta] = useState<MetaData>({
    qrCodeKey: undefined,
    history: undefined,
    createdById: undefined,
    updatedById: undefined,
  });
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
  const [uploadingCategory, setUploadingCategory] = useState<string | null>(null);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const submitMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (submitMessage) {
      submitMessageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [submitMessage]);

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

  const ERROR_FIELD_IDS: Record<string, string> = {
    title: 'field-title',
    architectId: 'field-architect',
    location: 'field-location',
    coordinates: 'field-coordinates',
    constructionPeriod: 'field-constructionPeriod',
    history: 'field-history',
    description: 'field-description',
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }

    if (architects.length > 0 && !formData.architectId) {
      newErrors.architectId = 'Selecione um arquiteto';
    }

    if (!formData.location?.trim()) {
      newErrors.location = 'Endereço é obrigatório';
    }

    if (formData.coordinates?.lat == null || formData.coordinates?.lng == null) {
      newErrors.coordinates = 'Latitude e Longitude são obrigatórias';
    }

    if (!formData.constructionPeriod?.trim()) {
      newErrors.constructionPeriod = 'Data de construção é obrigatória';
    }

    const descriptionText = (formData.description ?? '').replace(/<[^>]*>/g, '').trim();
    if (!descriptionText) {
      newErrors.description = 'Descrição é obrigatória';
    }

    const historyText = (formData.history ?? '').replace(/<[^>]*>/g, '').trim();
    if (!historyText) {
      newErrors.history = 'Histórico é obrigatório';
    }

    setErrors(newErrors);

    const firstKey = Object.keys(newErrors)[0];
    if (firstKey) {
      const el = document.getElementById(ERROR_FIELD_IDS[firstKey] ?? firstKey);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

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

  const handleUploadFile = async (
    category: (typeof IMAGE_CATEGORIES)[number]['key'],
    type: string,
    file: File
  ) => {
    const errorKey = `imagem-${category}`;
    setUploadingCategory(category);
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[errorKey];
      return newErrors;
    });

    try {
      const url = await uploadBuildingImage(file, type);
      setImagemTemp((prev) => ({
        ...prev,
        [category]: { ...prev[category], url },
      }));
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        [errorKey]: error instanceof Error ? error.message : 'Falha ao enviar a imagem.',
      }));
    } finally {
      setUploadingCategory(null);
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
        const cleanMeta: Record<string, unknown> = {};
        (Object.keys(meta) as (keyof MetaData)[]).forEach((key) => {
          const value = meta[key];
          if (value === undefined) return;
          if (typeof value === 'string' && value.trim() === '') return;
          cleanMeta[key] = value;
        });

        const payload = { ...(formData as object), ...cleanMeta } as unknown as BuildingFormData;
        await onSubmit(payload as BuildingFormData);
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
      <p className="mb-8 text-sm text-on-surface/50">
        Campos marcados com <span className="text-primary">*</span> são obrigatórios.
      </p>

      {submitMessage && (
        <div
          ref={submitMessageRef}
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
          <div id="field-title" className="md:col-span-2">
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

          <div id="field-location" className="md:col-span-2">
            <label htmlFor="location" className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
              Endereço / Localização *
            </label>
            <input
              id="location"
              name="location"
              type="text"
              placeholder="Ex: Praça da Alfândega, s/n - Centro Histórico, Porto Alegre"
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

          <div id="field-coordinates" className="md:col-span-2">
            <label className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
              Localização no Mapa *{' '}
              <span className="normal-case tracking-normal font-body text-on-surface/40">clique para marcar o ponto</span>
            </label>
            <div className={`overflow-hidden rounded-lg border ${errors.coordinates ? 'border-red-500/50' : 'border-outline-variant/30'}`}>
              <MapPicker
                initialCoords={
                  formData.coordinates?.lat != null && formData.coordinates?.lng != null
                    ? (formData.coordinates as { lat: number; lng: number })
                    : undefined
                }
                onChange={(coords) => {
                  setFormData((prev) => ({ ...prev, coordinates: coords }));
                  if (errors.coordinates) setErrors((prev) => { const e = { ...prev }; delete e.coordinates; return e; });
                }}
              />
            </div>
            {errors.coordinates && <p className="mt-1 text-sm text-red-400">{errors.coordinates}</p>}
            <div className="mt-2 grid grid-cols-2 gap-3">
              <div>
                <p className="mb-1 font-label text-[0.7rem] uppercase tracking-[0.15em] text-on-surface/40">Latitude</p>
                <input
                  readOnly
                  value={formData.coordinates?.lat != null ? formData.coordinates.lat.toFixed(6) : ''}
                  placeholder="—"
                  className="w-full rounded-lg border border-outline-variant/20 bg-surface-container-high/20 px-3 py-2 text-sm text-on-surface/60 cursor-default select-all"
                />
              </div>
              <div>
                <p className="mb-1 font-label text-[0.7rem] uppercase tracking-[0.15em] text-on-surface/40">Longitude</p>
                <input
                  readOnly
                  value={formData.coordinates?.lng != null ? formData.coordinates.lng.toFixed(6) : ''}
                  placeholder="—"
                  className="w-full rounded-lg border border-outline-variant/20 bg-surface-container-high/20 px-3 py-2 text-sm text-on-surface/60 cursor-default select-all"
                />
              </div>
            </div>
          </div>

          <div id="field-constructionPeriod">
            <label htmlFor="constructionPeriod" className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
              Período de Construção *
            </label>
            <input
              id="constructionPeriod"
              name="constructionPeriod"
              type="text"
              placeholder="Ex: 1913  ou  1890–1910"
              value={formData.constructionPeriod ?? ''}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^0-9\-–\s]/g, '');
                setFormData((prev) => ({ ...prev, constructionPeriod: raw }));
                if (errors.constructionPeriod) setErrors((prev) => { const ne = { ...prev }; delete ne.constructionPeriod; return ne; });
              }}
              className={`w-full rounded-lg border px-4 py-2 text-on-surface transition-all focus:outline-none focus:ring-2 ${
                errors.constructionPeriod
                  ? 'border-red-500/50 bg-surface-container-high/50 focus:ring-red-500'
                  : 'border-outline-variant/30 bg-surface-container-high/50 focus:ring-primary'
              }`}
            />
            <p className="mt-1 text-xs text-on-surface/40">Ano (ex: 1913) ou intervalo (ex: 1890–1910)</p>
            {errors.constructionPeriod && <p className="mt-1 text-sm text-red-400">{errors.constructionPeriod}</p>}
          </div>

          <div id="field-architect">
            <label className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
              Arquiteto *
            </label>
            <ArchitectSelect
              architects={architects}
              value={formData.architectId ?? ''}
              onChange={(id, name) => {
                setFormData((prev) => ({ ...prev, architect: name, architectId: id || undefined }));
                if (errors.architectId) setErrors((prev) => { const e = { ...prev }; delete e.architectId; return e; });
              }}
              hasError={!!errors.architectId}
            />
            {errors.architectId && <p className="mt-1 text-sm text-red-400">{errors.architectId}</p>}
            {architects.length === 0 && (
              <p className="mt-1 text-xs text-on-surface/50">Nenhum arquiteto cadastrado no sistema.</p>
            )}
          </div>

          <div>
            <label htmlFor="constructor" className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
              Construtora / Empresa
            </label>
            <input
              id="constructor"
              name="constructor"
              type="text"
              placeholder="Nome da empresa ou responsável pela construção"
              value={formData.constructor ?? ''}
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
              placeholder="Ex: João Fahrion (pinturas murais e esculturas)"
              value={formData.ornamentsAuthor}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-2 text-on-surface transition-all focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="builtArea" className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
              Ýrea construída
            </label>
            <div className="relative">
              <input
                id="builtArea"
                name="builtArea"
                type="text"
                placeholder="Ex: 5.000"
                value={formData.builtArea}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 py-2 pl-4 pr-14 text-on-surface transition-all focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-on-surface/40">
                m²
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="currentOccupation" className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
              Ocupação atual
            </label>
            <input
              id="currentOccupation"
              name="currentOccupation"
              type="text"
              placeholder="Ex: Museu de Arte do Rio Grande do Sul"
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
              placeholder="Ex: Restauração em 1980 pelo IPHAE"
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
              placeholder="Ex: Tombado pelo IPHAN em 1974"
              value={formData.heritage}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-2 text-on-surface transition-all focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

        </div>
      </fieldset>

      <fieldset className="mb-12 border-b border-outline-variant/20 pb-12">
        <legend className="mb-8 flex items-center gap-4 font-headline text-2xl font-bold text-primary">
          <span className="h-[2px] w-12 bg-primary"></span>
          Histórico
        </legend>

        <div id="field-history">
          <label className="mb-4 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
            Histórico da Edificação *
          </label>
          <RichTextEditor
            value={formData.history ?? ''}
            onChange={(content) => {
              setFormData((prev) => ({ ...prev, history: content }));
              if (errors.history) setErrors((prev) => { const e = { ...prev }; delete e.history; return e; });
            }}
          />
          {errors.history && <p className="mt-2 text-sm text-red-400">{errors.history}</p>}
        </div>
      </fieldset>

      <fieldset className="mb-12 border-b border-outline-variant/20 pb-12">
        <legend className="mb-8 flex items-center gap-4 font-headline text-2xl font-bold text-primary">
          <span className="h-[2px] w-12 bg-primary"></span>
          Campos Avançados (opcional)
        </legend>

        <div className="mb-6">
          <button
            type="button"
            onClick={() => setShowAdvanced((s) => !s)}
            className="mb-4 rounded-lg bg-primary/10 px-3 py-2 text-primary"
          >
            {showAdvanced ? 'Ocultar campos avançados' : 'Mostrar campos avançados'}
          </button>

          {showAdvanced && (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">QR Code Key</label>
                <input
                  type="text"
                  value={meta.qrCodeKey ?? ''}
                  onChange={(e) => setMeta((m) => ({ ...m, qrCodeKey: e.target.value }))}
                  className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-2"
                />
              </div>

              <div>
                <label className="mb-4 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">Histórico (RichText)</label>
                <RichTextEditor
                  value={meta.history ?? ''}
                  onChange={(content) => setMeta((m) => ({ ...m, history: content }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">Created By ID</label>
                  <input
                    type="text"
                    value={meta.createdById ?? ''}
                    onChange={(e) => setMeta((m) => ({ ...m, createdById: e.target.value }))}
                    className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-2"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">Updated By ID</label>
                  <input
                    type="text"
                    value={meta.updatedById ?? ''}
                    onChange={(e) => setMeta((m) => ({ ...m, updatedById: e.target.value }))}
                    className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-2"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </fieldset>

      <fieldset className="mb-12 border-b border-outline-variant/20 pb-12">
        <legend className="mb-8 flex items-center gap-4 font-headline text-2xl font-bold text-primary">
          <span className="h-[2px] w-12 bg-primary"></span>
          Descrição
        </legend>

        <div id="field-description">
          <label className="mb-4 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
            Descrição da Edificação *
          </label>
          <RichTextEditor
            value={formData.description}
            onChange={(content) => {
              setFormData((prev) => ({ ...prev, description: content }));
              if (errors.description) setErrors((prev) => { const e = { ...prev }; delete e.description; return e; });
            }}
          />
          {errors.description && <p className="mt-2 text-sm text-red-400">{errors.description}</p>}
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
          {IMAGE_CATEGORIES.map(({ key, label, type }) => {
            const images = formData.images?.[key] || [];
            const draftImage = imagemTemp[key];
            const previewImage =
              draftImage.url.trim() && draftImage.alt.trim()
                ? {
                    id: `preview-${key}`,
                    url: draftImage.url.trim(),
                    alt: draftImage.alt.trim(),
                    caption: draftImage.caption.trim() || undefined,
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
                      placeholder="URL externa"
                      className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-2 text-on-surface transition-all focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <div className="mt-2 flex items-center gap-3">
                      <label
                        className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border border-outline-variant/30 bg-surface-container-high/40 px-3 py-2 font-headline text-[10px] font-bold uppercase tracking-widest text-on-surface/70 transition-all hover:bg-surface-container-high/60 ${
                          uploadingCategory === key ? 'pointer-events-none opacity-60' : ''
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">
                          {uploadingCategory === key ? 'hourglass_empty' : 'cloud_upload'}
                        </span>
                        {uploadingCategory === key ? 'Enviando...' : 'Enviar arquivo (S3)'}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploadingCategory === key}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUploadFile(key, type, file);
                            e.target.value = '';
                          }}
                        />
                      </label>
                      <span className="text-xs text-on-surface/40">
                        Envia (preenche a URL automaticamente)
                      </span>
                    </div>
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

      {Object.keys(errors).length > 0 && (
        <div className="mb-4 flex items-center gap-3 rounded-lg border border-red-700/40 bg-red-900/20 px-4 py-3 text-sm text-red-300">
          <span className="material-symbols-outlined text-base">arrow_upward</span>
          {Object.keys(errors).length === 1
            ? 'Há 1 campo obrigatório não preenchido. Role para cima para corrigir.'
            : `Há ${Object.keys(errors).length} campos obrigatórios não preenchidos. Role para cima para corrigir.`}
        </div>
      )}

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
