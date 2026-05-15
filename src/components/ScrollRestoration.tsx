'use client';

import { useScrollRestoration } from '@/hooks/useScrollRestoration';

/**
 * Componente que previne scroll automático ao navegar entre páginas
 * Deve ser incluído no layout raiz
 */
export function ScrollRestoration() {
  useScrollRestoration();
  return null;
}
