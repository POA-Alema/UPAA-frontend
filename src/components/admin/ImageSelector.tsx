'use client';

import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';

interface ImageSelectorProps {
  value?: string; // URL or Base64 data string
  onChange: (value: string) => void;
  label: string;
}

export function ImageSelector({ value = '', onChange, label }: ImageSelectorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewSrc, setPreviewSrc] = useState<string>(value);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setPreviewSrc(value);
  }, [value]);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onChange(result);
        setPreviewSrc(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const triggerSelect = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    onChange('');
    setPreviewSrc('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  return (
    <div className="w-full">
      <label className="mb-2 block font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
        {label}
      </label>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {previewSrc ? (
        <div className="relative group overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-high/40 max-w-xl shadow-lg">
          <div className="relative h-64 w-full">
            <Image
              src={previewSrc}
              alt={label}
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 36rem"
              className="object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-4">
            <button
              type="button"
              onClick={triggerSelect}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-headline text-[10px] font-bold uppercase tracking-widest text-on-primary shadow-md hover:bg-primary/95 transition-all"
            >
              <span className="material-symbols-outlined text-sm">cached</span>
              Substituir
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-headline text-[10px] font-bold uppercase tracking-widest text-white shadow-md hover:bg-red-500 transition-all"
            >
              <span className="material-symbols-outlined text-sm">delete</span>
              Remover
            </button>
          </div>
          <div className="p-4 flex justify-between items-center bg-surface-container-high/60 border-t border-outline-variant/10">
            <span className="text-xs text-on-surface-variant italic truncate max-w-[70%]">
              {previewSrc.startsWith('data:') ? 'Imagem carregada do computador' : previewSrc}
            </span>
            <div className="flex gap-2 md:hidden">
              <button
                type="button"
                onClick={triggerSelect}
                className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                title="Substituir imagem"
              >
                <span className="material-symbols-outlined text-lg">cached</span>
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Remover imagem"
              >
                <span className="material-symbols-outlined text-lg">delete</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={triggerSelect}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all min-h-64 ${
            isDragging
              ? 'border-accent bg-accent/10 scale-98 shadow-inner'
              : 'border-outline-variant/30 bg-surface-container-high/20 hover:border-primary/50 hover:bg-surface-container-high/40'
          }`}
        >
          <span className="material-symbols-outlined text-5xl text-on-surface-variant/40 mb-4 animate-pulse">
            cloud_upload
          </span>
          <p className="text-sm font-semibold text-on-surface text-center mb-1">
            Nenhuma imagem selecionada.
          </p>
          <p className="text-xs text-on-surface-variant text-center max-w-[280px]">
            Clique para selecionar ou arraste uma imagem do computador
          </p>
          <span className="mt-3 text-[10px] text-accent font-headline uppercase tracking-widest bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
            Selecionar arquivo
          </span>
        </div>
      )}
    </div>
  );
}
