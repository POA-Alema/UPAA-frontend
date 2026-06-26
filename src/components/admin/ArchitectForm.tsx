'use client';

import Image from 'next/image';
import type { ChangeEvent, FormEvent } from 'react';
import { useEffect, useRef, useState, useTransition } from 'react';
import { uploadArchitectPortrait } from '@/services/architects';
import type { ArchitectFormData, ArchitectStatus } from '@/types/adminArchitect';
import { RichTextEditor } from './RichTextEditor';

type ArchitectFormProps = {
  initialData?: ArchitectFormData;
  onSubmit: (data: ArchitectFormData) => Promise<void>;
};

const STATUS_OPTIONS: Array<{ value: ArchitectStatus; label: string; icon: string }> = [
  { value: 'published', label: 'Publicado', icon: 'public' },
  { value: 'draft', label: 'Rascunho', icon: 'draft' },
  { value: 'archived', label: 'Arquivado', icon: 'inventory_2' },
];

const EMPTY_FORM: ArchitectFormData = {
  status: 'published',
  firstName: '',
  lastName: '',
  fullName: '',
  portraitUrl: '',
  portraitAlt: '',
  birthDay: undefined,
  birthMonth: undefined,
  birthYear: undefined,
  birthCity: '',
  birthCountry: '',
  deathDay: undefined,
  deathMonth: undefined,
  deathYear: undefined,
  deathCity: '',
  deathCountry: '',
  citizenship: '',
  occupation: '',
  about: '',
  style: '',
  influences: '',
  legacy: '',
};

const ERROR_FIELD_IDS: Record<string, string> = {
  firstName: 'field-firstName',
  lastName: 'field-lastName',
  portraitUrl: 'field-portrait',
  portraitAlt: 'field-portrait',
  birth: 'field-birth',
  death: 'field-death',
  citizenship: 'field-citizenship',
  occupation: 'field-occupation',
  about: 'field-about',
  style: 'field-characteristics',
  influences: 'field-characteristics',
  legacy: 'field-characteristics',
};

function createInitialData(initialData?: ArchitectFormData): ArchitectFormData {
  return initialData ? { ...EMPTY_FORM, ...initialData } : { ...EMPTY_FORM };
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, '').trim();
}

function generateSlug(firstName: string, lastName: string): string {
  return [firstName, lastName]
    .filter((part) => part.trim().length > 0)
    .join(' ')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function hasDeathData(data: ArchitectFormData): boolean {
  return Boolean(
    data.deathDay ||
      data.deathMonth ||
      data.deathYear ||
      data.deathCity?.trim() ||
      data.deathCountry?.trim(),
  );
}

export function ArchitectForm({ initialData, onSubmit }: ArchitectFormProps) {
  const [formData, setFormData] = useState<ArchitectFormData>(createInitialData(initialData));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const isEditing = Boolean(initialData);
  const slugPreview = generateSlug(formData.firstName, formData.lastName);

  useEffect(() => {
    if (message) {
      messageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [message]);

  const setField = <K extends keyof ArchitectFormData>(
    field: K,
    value: ArchitectFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field as string]) return prev;
      const next = { ...prev };
      delete next[field as string];
      return next;
    });
  };

  const setTextField =
    (field: keyof ArchitectFormData) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setField(field, event.target.value as never);
    };

  const setNumberField =
    (field: keyof ArchitectFormData) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setField(field, (value === '' ? undefined : Number(value)) as never);
    };

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) nextErrors.firstName = 'Informe o primeiro nome.';
    if (!formData.lastName.trim()) nextErrors.lastName = 'Informe o sobrenome.';
    if (!formData.portraitUrl.trim()) nextErrors.portraitUrl = 'Informe ou envie o retrato.';
    if (!formData.portraitAlt.trim()) nextErrors.portraitAlt = 'Informe o texto alternativo.';
    if (!formData.birthDay || !formData.birthMonth || !formData.birthYear) {
      nextErrors.birth = 'Informe a data de nascimento completa.';
    }
    if (!formData.birthCity.trim() || !formData.birthCountry.trim()) {
      nextErrors.birth = 'Informe cidade e país de nascimento.';
    }
    if (hasDeathData(formData)) {
      if (!formData.deathDay || !formData.deathMonth || !formData.deathYear) {
        nextErrors.death = 'Informe a data de falecimento completa ou deixe tudo em branco.';
      }
      if (!formData.deathCity?.trim() || !formData.deathCountry?.trim()) {
        nextErrors.death = 'Informe cidade e país de falecimento ou deixe tudo em branco.';
      }
    }
    if (!formData.citizenship.trim()) nextErrors.citizenship = 'Informe a nacionalidade.';
    if (!formData.occupation.trim()) nextErrors.occupation = 'Informe a ocupação.';
    if (!stripHtml(formData.about)) nextErrors.about = 'Informe a biografia.';
    if (!formData.style.trim()) nextErrors.style = 'Informe o estilo.';
    if (!formData.influences.trim()) nextErrors.influences = 'Informe as influências.';
    if (!formData.legacy.trim()) nextErrors.legacy = 'Informe o legado.';

    setErrors(nextErrors);

    const firstKey = Object.keys(nextErrors)[0];
    if (firstKey) {
      document
        .getElementById(ERROR_FIELD_IDS[firstKey] ?? firstKey)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return Object.keys(nextErrors).length === 0;
  };

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setMessage(null);

    try {
      const url = await uploadArchitectPortrait(file);
      setField('portraitUrl', url);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Erro ao enviar o retrato.',
      });
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    if (!validate()) return;

    startTransition(async () => {
      try {
        await onSubmit({
          ...formData,
          deathDay: hasDeathData(formData) ? formData.deathDay : null,
          deathMonth: hasDeathData(formData) ? formData.deathMonth : null,
          deathYear: hasDeathData(formData) ? formData.deathYear : null,
          deathCity: hasDeathData(formData) ? formData.deathCity : null,
          deathCountry: hasDeathData(formData) ? formData.deathCountry : null,
        });

        setMessage({
          type: 'success',
          text: isEditing ? 'Arquiteto atualizado com sucesso!' : 'Arquiteto cadastrado com sucesso!',
        });

        if (!isEditing) {
          setFormData(createInitialData());
        }
      } catch (error) {
        setMessage({
          type: 'error',
          text: error instanceof Error ? error.message : 'Erro ao salvar arquiteto.',
        });
      }
    });
  };

  return (
    <form className="mx-auto max-w-4xl font-body" onSubmit={handleSubmit}>
      <p className="mb-8 text-sm text-on-surface/50">
        Campos marcados com <span className="text-primary">*</span> são obrigatórios.
      </p>

      {message && (
        <div
          ref={messageRef}
          className={`mb-8 rounded-lg border p-4 ${
            message.type === 'success'
              ? 'border-green-700/50 bg-green-900/20 text-green-200'
              : 'border-red-700/50 bg-red-900/20 text-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <fieldset className="mb-12 border-b border-outline-variant/20 pb-12">
        <legend className="mb-8 flex items-center gap-4 font-headline text-2xl font-bold text-primary">
          <span className="h-[2px] w-12 bg-primary" />
          Identificação
        </legend>

        <fieldset className="mb-6">
          <legend className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
            Status
          </legend>
          <div className="grid gap-3 md:grid-cols-3" role="radiogroup" aria-label="Status do arquiteto">
            {STATUS_OPTIONS.map((option) => {
              const selected = formData.status === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setField('status', option.value)}
                  className={`group relative flex min-h-14 items-center justify-center gap-3 rounded-lg border px-4 py-3 font-headline text-[10px] font-bold uppercase tracking-widest transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.99] ${
                    selected
                      ? 'border-accent bg-accent/15 text-accent shadow-[0_0_0_1px_rgba(209,166,91,0.42),0_16px_36px_rgba(0,0,0,0.28)]'
                      : 'border-outline-variant/30 bg-surface-container-high/35 text-on-surface hover:border-primary/70 hover:bg-primary/10 hover:text-primary hover:shadow-lg'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-lg transition-colors ${
                      selected ? 'text-accent' : 'text-on-surface/80 group-hover:text-primary'
                    }`}
                  >
                    {option.icon}
                  </span>
                  {option.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          <div id="field-firstName">
            <label htmlFor="firstName" className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
              Primeiro nome *
            </label>
            <input
              id="firstName"
              value={formData.firstName}
              onChange={setTextField('firstName')}
              className={`w-full rounded-lg border px-4 py-2 text-on-surface transition-all focus:outline-none focus:ring-2 ${
                errors.firstName
                  ? 'border-red-500/50 bg-surface-container-high/50 focus:ring-red-500'
                  : 'border-outline-variant/30 bg-surface-container-high/50 focus:ring-primary'
              }`}
            />
            {errors.firstName && <p className="mt-1 text-sm text-red-400">{errors.firstName}</p>}
          </div>

          <div id="field-lastName">
            <label htmlFor="lastName" className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
              Sobrenome *
            </label>
            <input
              id="lastName"
              value={formData.lastName}
              onChange={setTextField('lastName')}
              className={`w-full rounded-lg border px-4 py-2 text-on-surface transition-all focus:outline-none focus:ring-2 ${
                errors.lastName
                  ? 'border-red-500/50 bg-surface-container-high/50 focus:ring-red-500'
                  : 'border-outline-variant/30 bg-surface-container-high/50 focus:ring-primary'
              }`}
            />
            {errors.lastName && <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>}
          </div>

          <div>
            <label htmlFor="fullName" className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
              Nome completo
            </label>
            <input
              id="fullName"
              value={formData.fullName ?? ''}
              onChange={setTextField('fullName')}
              className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-2 text-on-surface transition-all focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="slugPreview" className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
              Slug
            </label>
            <input
              id="slugPreview"
              readOnly
              value={slugPreview}
              className="w-full cursor-default rounded-lg border border-outline-variant/20 bg-surface-container-high/20 px-4 py-2 text-on-surface/60"
            />
          </div>

          <div id="field-citizenship">
            <label htmlFor="citizenship" className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
              Nacionalidade *
            </label>
            <input
              id="citizenship"
              value={formData.citizenship}
              onChange={setTextField('citizenship')}
              className={`w-full rounded-lg border px-4 py-2 text-on-surface transition-all focus:outline-none focus:ring-2 ${
                errors.citizenship
                  ? 'border-red-500/50 bg-surface-container-high/50 focus:ring-red-500'
                  : 'border-outline-variant/30 bg-surface-container-high/50 focus:ring-primary'
              }`}
            />
            {errors.citizenship && <p className="mt-1 text-sm text-red-400">{errors.citizenship}</p>}
          </div>

          <div id="field-occupation">
            <label htmlFor="occupation" className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
              Ocupação *
            </label>
            <input
              id="occupation"
              value={formData.occupation}
              onChange={setTextField('occupation')}
              className={`w-full rounded-lg border px-4 py-2 text-on-surface transition-all focus:outline-none focus:ring-2 ${
                errors.occupation
                  ? 'border-red-500/50 bg-surface-container-high/50 focus:ring-red-500'
                  : 'border-outline-variant/30 bg-surface-container-high/50 focus:ring-primary'
              }`}
            />
            {errors.occupation && <p className="mt-1 text-sm text-red-400">{errors.occupation}</p>}
          </div>
        </div>
      </fieldset>

      <fieldset id="field-portrait" className="mb-12 border-b border-outline-variant/20 pb-12">
        <legend className="mb-8 flex items-center gap-4 font-headline text-2xl font-bold text-primary">
          <span className="h-[2px] w-12 bg-primary" />
          Retrato
        </legend>

        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="space-y-6">
            <div>
              <label htmlFor="portraitUrl" className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
                URL do retrato *
              </label>
              <input
                id="portraitUrl"
                value={formData.portraitUrl}
                onChange={setTextField('portraitUrl')}
                className={`w-full rounded-lg border px-4 py-2 text-on-surface transition-all focus:outline-none focus:ring-2 ${
                  errors.portraitUrl
                    ? 'border-red-500/50 bg-surface-container-high/50 focus:ring-red-500'
                    : 'border-outline-variant/30 bg-surface-container-high/50 focus:ring-primary'
                }`}
              />
              {errors.portraitUrl && <p className="mt-1 text-sm text-red-400">{errors.portraitUrl}</p>}
            </div>

            <div>
              <label htmlFor="portraitAlt" className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
                Texto alternativo *
              </label>
              <input
                id="portraitAlt"
                value={formData.portraitAlt}
                onChange={setTextField('portraitAlt')}
                className={`w-full rounded-lg border px-4 py-2 text-on-surface transition-all focus:outline-none focus:ring-2 ${
                  errors.portraitAlt
                    ? 'border-red-500/50 bg-surface-container-high/50 focus:ring-red-500'
                    : 'border-outline-variant/30 bg-surface-container-high/50 focus:ring-primary'
                }`}
              />
              {errors.portraitAlt && <p className="mt-1 text-sm text-red-400">{errors.portraitAlt}</p>}
            </div>

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUpload}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-headline text-[10px] font-bold uppercase tracking-widest text-on-primary shadow-xl transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-lg">
                  {isUploading ? 'hourglass_empty' : 'cloud_upload'}
                </span>
                {isUploading ? 'Enviando' : 'Enviar retrato'}
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-high/40">
            <div className="relative aspect-[4/5] w-full">
              {formData.portraitUrl ? (
                <Image
                  src={formData.portraitUrl}
                  alt={formData.portraitAlt || 'Retrato do arquiteto'}
                  fill
                  unoptimized
                  sizes="18rem"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-on-surface/40">
                  <span className="material-symbols-outlined text-5xl">portrait</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </fieldset>

      <fieldset className="mb-12 border-b border-outline-variant/20 pb-12">
        <legend className="mb-8 flex items-center gap-4 font-headline text-2xl font-bold text-primary">
          <span className="h-[2px] w-12 bg-primary" />
          Vida
        </legend>

        <div id="field-birth" className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-5">
          <div>
            <label className="mb-2 block font-label text-[0.75rem] uppercase tracking-[0.18em] text-on-surface/70">Dia nasc. *</label>
            <input type="number" min={1} max={31} value={formData.birthDay ?? ''} onChange={setNumberField('birthDay')} className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-2 text-on-surface" />
          </div>
          <div>
            <label className="mb-2 block font-label text-[0.75rem] uppercase tracking-[0.18em] text-on-surface/70">Mês nasc. *</label>
            <input type="number" min={1} max={12} value={formData.birthMonth ?? ''} onChange={setNumberField('birthMonth')} className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-2 text-on-surface" />
          </div>
          <div>
            <label className="mb-2 block font-label text-[0.75rem] uppercase tracking-[0.18em] text-on-surface/70">Ano nasc. *</label>
            <input type="number" value={formData.birthYear ?? ''} onChange={setNumberField('birthYear')} className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-2 text-on-surface" />
          </div>
          <div>
            <label className="mb-2 block font-label text-[0.75rem] uppercase tracking-[0.18em] text-on-surface/70">Cidade *</label>
            <input value={formData.birthCity} onChange={setTextField('birthCity')} className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-2 text-on-surface" />
          </div>
          <div>
            <label className="mb-2 block font-label text-[0.75rem] uppercase tracking-[0.18em] text-on-surface/70">País *</label>
            <input value={formData.birthCountry} onChange={setTextField('birthCountry')} className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-2 text-on-surface" />
          </div>
          {errors.birth && <p className="md:col-span-5 text-sm text-red-400">{errors.birth}</p>}
        </div>

        <div id="field-death" className="grid grid-cols-1 gap-4 md:grid-cols-5">
          <div>
            <label className="mb-2 block font-label text-[0.75rem] uppercase tracking-[0.18em] text-on-surface/70">Dia falec.</label>
            <input type="number" min={1} max={31} value={formData.deathDay ?? ''} onChange={setNumberField('deathDay')} className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-2 text-on-surface" />
          </div>
          <div>
            <label className="mb-2 block font-label text-[0.75rem] uppercase tracking-[0.18em] text-on-surface/70">Mês falec.</label>
            <input type="number" min={1} max={12} value={formData.deathMonth ?? ''} onChange={setNumberField('deathMonth')} className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-2 text-on-surface" />
          </div>
          <div>
            <label className="mb-2 block font-label text-[0.75rem] uppercase tracking-[0.18em] text-on-surface/70">Ano falec.</label>
            <input type="number" value={formData.deathYear ?? ''} onChange={setNumberField('deathYear')} className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-2 text-on-surface" />
          </div>
          <div>
            <label className="mb-2 block font-label text-[0.75rem] uppercase tracking-[0.18em] text-on-surface/70">Cidade</label>
            <input value={formData.deathCity ?? ''} onChange={setTextField('deathCity')} className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-2 text-on-surface" />
          </div>
          <div>
            <label className="mb-2 block font-label text-[0.75rem] uppercase tracking-[0.18em] text-on-surface/70">País</label>
            <input value={formData.deathCountry ?? ''} onChange={setTextField('deathCountry')} className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-2 text-on-surface" />
          </div>
          {errors.death && <p className="md:col-span-5 text-sm text-red-400">{errors.death}</p>}
        </div>
      </fieldset>

      <fieldset id="field-about" className="mb-12 border-b border-outline-variant/20 pb-12">
        <legend className="mb-8 flex items-center gap-4 font-headline text-2xl font-bold text-primary">
          <span className="h-[2px] w-12 bg-primary" />
          Biografia
        </legend>
        <RichTextEditor
          value={formData.about}
          onChange={(content) => setField('about', content)}
        />
        {errors.about && <p className="mt-2 text-sm text-red-400">{errors.about}</p>}
      </fieldset>

      <fieldset id="field-characteristics" className="mb-12 border-b border-outline-variant/20 pb-12">
        <legend className="mb-8 flex items-center gap-4 font-headline text-2xl font-bold text-primary">
          <span className="h-[2px] w-12 bg-primary" />
          Características
        </legend>

        <div className="grid gap-6">
          <label className="grid gap-2 font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
            Estilo *
            <textarea value={formData.style} onChange={setTextField('style')} rows={3} className="rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-3 font-body normal-case tracking-normal text-on-surface focus:outline-none focus:ring-2 focus:ring-primary" />
            {errors.style && <span className="font-body text-sm normal-case tracking-normal text-red-400">{errors.style}</span>}
          </label>

          <label className="grid gap-2 font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
            Influências *
            <textarea value={formData.influences} onChange={setTextField('influences')} rows={3} className="rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-3 font-body normal-case tracking-normal text-on-surface focus:outline-none focus:ring-2 focus:ring-primary" />
            {errors.influences && <span className="font-body text-sm normal-case tracking-normal text-red-400">{errors.influences}</span>}
          </label>

          <label className="grid gap-2 font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
            Legado *
            <textarea value={formData.legacy} onChange={setTextField('legacy')} rows={3} className="rounded-lg border border-outline-variant/30 bg-surface-container-high/50 px-4 py-3 font-body normal-case tracking-normal text-on-surface focus:outline-none focus:ring-2 focus:ring-primary" />
            {errors.legacy && <span className="font-body text-sm normal-case tracking-normal text-red-400">{errors.legacy}</span>}
          </label>
        </div>
      </fieldset>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending || isUploading}
          className="flex items-center gap-2 rounded-lg bg-primary px-8 py-3 font-headline text-[10px] font-bold uppercase tracking-widest text-on-primary shadow-xl transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="material-symbols-outlined text-lg">
            {isPending ? 'hourglass_empty' : 'check'}
          </span>
          {isEditing ? 'Atualizar Arquiteto' : 'Cadastrar Arquiteto'}
        </button>
      </div>
    </form>
  );
}
