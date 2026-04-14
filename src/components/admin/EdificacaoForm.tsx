'use client';

import { useState } from 'react';
import type { EdificacaoFormData, FonteEdificacao } from '@/types/edificacao';
import { RichTextEditor } from './RichTextEditor';

interface EdificacaoFormProps {
  onSubmit: (data: EdificacaoFormData) => Promise<void>;
  initialData?: EdificacaoFormData;
  isLoading?: boolean;
}

export function EdificacaoForm({ onSubmit, initialData, isLoading = false }: EdificacaoFormProps) {
  const [formData, setFormData] = useState<EdificacaoFormData>(
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

  const [fonteTemp, setFonteTemp] = useState<Partial<FonteEdificacao>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpar erro do campo quando usuário começa a digitar
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
    if (!formData.localizacao.trim()) {
      newErrors.localizacao = 'Localização é obrigatória';
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
      fontes: (prev.fontes || []).filter((f) => f.id !== id),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage(null);

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
      setSubmitMessage({
        type: 'success',
        text: initialData ? 'Edificação atualizada com sucesso!' : 'Edificação criada com sucesso!',
      });
      
      if (!initialData) {
        // Limpar formulário apenas se for criação
        setFormData({
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
        });
      }
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Erro ao salvar edificação',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto font-body">
      {/* Mensagem de sucesso/erro */}
      {submitMessage && (
        <div
          className={`p-4 rounded-lg mb-8 ${
            submitMessage.type === 'success'
              ? 'bg-green-900/20 text-green-200 border border-green-700/50'
              : 'bg-red-900/20 text-red-200 border border-red-700/50'
          }`}
        >
          {submitMessage.text}
        </div>
      )}

      {/* Seção 1: Informações Básicas */}
      <fieldset className="mb-12 pb-12 border-b border-outline-variant/20">
        <legend className="font-headline font-bold text-2xl mb-8 text-primary flex items-center gap-4">
          <span className="h-[2px] w-12 bg-primary"></span>
          Informações Básicas
        </legend>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Título */}
          <div className="md:col-span-2">
            <label htmlFor="titulo" className="block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70 mb-2">
              Título *
            </label>
            <input
              id="titulo"
              name="titulo"
              type="text"
              value={formData.titulo}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 bg-surface-container-high/50 border rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                errors.titulo ? 'border-red-500/50 focus:ring-red-500' : 'border-outline-variant/30'
              }`}
              required
            />
            {errors.titulo && <p className="text-red-400 text-sm mt-1">{errors.titulo}</p>}
          </div>

          {/* Localização */}
          <div>
            <label htmlFor="localizacao" className="block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70 mb-2">
              Localização *
            </label>
            <input
              id="localizacao"
              name="localizacao"
              type="text"
              value={formData.localizacao}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 bg-surface-container-high/50 border rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                errors.localizacao ? 'border-red-500/50 focus:ring-red-500' : 'border-outline-variant/30'
              }`}
              required
            />
            {errors.localizacao && <p className="text-red-400 text-sm mt-1">{errors.localizacao}</p>}
          </div>

          {/* Data */}
          <div>
            <label htmlFor="data" className="block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70 mb-2">
              Data
            </label>
            <input
              id="data"
              name="data"
              type="text"
              placeholder="Ex: 1900"
              value={formData.data}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-surface-container-high/50 border border-outline-variant/30 rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          {/* Projeto */}
          <div>
            <label htmlFor="projeto" className="block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70 mb-2">
              Projeto
            </label>
            <input
              id="projeto"
              name="projeto"
              type="text"
              value={formData.projeto}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-surface-container-high/50 border border-outline-variant/30 rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          {/* Construção */}
          <div>
            <label htmlFor="construcao" className="block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70 mb-2">
              Construção
            </label>
            <input
              id="construcao"
              name="construcao"
              type="text"
              value={formData.construcao}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-surface-container-high/50 border border-outline-variant/30 rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          {/* Ornamentos e Esculturas */}
          <div>
            <label htmlFor="ornamentosEsculturas" className="block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70 mb-2">
              Ornamentos e Esculturas
            </label>
            <input
              id="ornamentosEsculturas"
              name="ornamentosEsculturas"
              type="text"
              value={formData.ornamentosEsculturas}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-surface-container-high/50 border border-outline-variant/30 rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          {/* Área Construída */}
          <div>
            <label htmlFor="areaConstituida" className="block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70 mb-2">
              Área Construída
            </label>
            <input
              id="areaConstituida"
              name="areaConstituida"
              type="text"
              value={formData.areaConstituida}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-surface-container-high/50 border border-outline-variant/30 rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          {/* Ocupação Atual */}
          <div>
            <label htmlFor="ocupacaoAtual" className="block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70 mb-2">
              Ocupação Atual
            </label>
            <input
              id="ocupacaoAtual"
              name="ocupacaoAtual"
              type="text"
              value={formData.ocupacaoAtual}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-surface-container-high/50 border border-outline-variant/30 rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          {/* Projeto de Restauração */}
          <div>
            <label htmlFor="projetoRestauracao" className="block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70 mb-2">
              Projeto de Restauração
            </label>
            <input
              id="projetoRestauracao"
              name="projetoRestauracao"
              type="text"
              value={formData.projetoRestauracao}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-surface-container-high/50 border border-outline-variant/30 rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          {/* Tombamento */}
          <div>
            <label htmlFor="tombamento" className="block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70 mb-2">
              Tombamento
            </label>
            <input
              id="tombamento"
              name="tombamento"
              type="text"
              value={formData.tombamento}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-surface-container-high/50 border border-outline-variant/30 rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          {/* Autor */}
          <div>
            <label htmlFor="autor" className="block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70 mb-2">
              Autor
            </label>
            <input
              id="autor"
              name="autor"
              type="text"
              value={formData.autor}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-surface-container-high/50 border border-outline-variant/30 rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
        </div>
      </fieldset>

      {/* Seção 2: Descrição */}
      <fieldset className="mb-12 pb-12 border-b border-outline-variant/20">
        <legend className="font-headline font-bold text-2xl mb-8 text-primary flex items-center gap-4">
          <span className="h-[2px] w-12 bg-primary"></span>
          Descrição
        </legend>

        <div>
          <label className="block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70 mb-4">
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

      {/* Seção 3: Fontes */}
      <fieldset className="mb-12 pb-12 border-b border-outline-variant/20">
        <legend className="font-headline font-bold text-2xl mb-8 text-primary flex items-center gap-4">
          <span className="h-[2px] w-12 bg-primary"></span>
          Fontes
        </legend>

        {/* Adicionar Fonte */}
        <div className="bg-surface-container-high/30 p-6 rounded-lg border border-outline-variant/20 mb-6">
          <h3 className="font-headline font-bold text-lg mb-4">Adicionar Fonte</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="fonteTitulo" className="block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70 mb-2">
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
                className={`w-full px-4 py-2 bg-surface-container-high/50 border rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                  errors.fonteTemp ? 'border-red-500/50 focus:ring-red-500' : 'border-outline-variant/30'
                }`}
              />
            </div>

            <div>
              <label htmlFor="fonteAutor" className="block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70 mb-2">
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
                className="w-full px-4 py-2 bg-surface-container-high/50 border border-outline-variant/30 rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="fonteUrl" className="block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70 mb-2">
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
                className="w-full px-4 py-2 bg-surface-container-high/50 border border-outline-variant/30 rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
          </div>

          {errors.fonteTemp && <p className="text-red-400 text-sm mb-4">{errors.fonteTemp}</p>}

          <button
            type="button"
            onClick={handleAddFonte}
            className="bg-primary/20 hover:bg-primary/30 text-primary font-headline font-bold py-2 px-4 rounded-lg transition-all flex items-center gap-2 uppercase tracking-widest text-[10px]"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Adicionar Fonte
          </button>
        </div>

        {/* Lista de Fontes */}
        {formData.fontes && formData.fontes.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-headline font-bold text-lg">Fontes Adicionadas:</h3>
            {formData.fontes.map((fonte) => (
              <div key={fonte.id} className="bg-surface-container-high/40 p-4 rounded-lg border border-outline-variant/30 flex justify-between items-start gap-4">
                <div>
                  <p className="font-headline font-bold text-on-surface">{fonte.titulo}</p>
                  {fonte.autor && <p className="text-on-surface/70 text-sm">Por: {fonte.autor}</p>}
                  {fonte.url && (
                    <a href={fonte.url} target="_blank" rel="noopener noreferrer" className="text-primary text-sm hover:underline">
                      Acessar →
                    </a>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveFonte(fonte.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </fieldset>

      {/* Botão de Envio */}
      <div className="flex justify-end gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-primary text-on-primary font-headline font-bold py-3 px-8 rounded-lg shadow-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 uppercase tracking-widest text-[10px]"
        >
          <span className="material-symbols-outlined text-lg">
            {isLoading ? 'hourglass_empty' : 'check'}
          </span>
          {isLoading ? 'Salvando...' : initialData ? 'Atualizar Edificação' : 'Criar Edificação'}
        </button>
      </div>
    </form>
  );
}
