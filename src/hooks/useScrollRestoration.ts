import { useEffect } from 'react';

/**
 * Hook que previne o scroll automático para o topo ao navegar
 * Mantém a posição do scroll ou scroll suave controlado
 */
export function useScrollRestoration() {
  useEffect(() => {
    // Disable automatic scroll to top on navigation
    // Next.js 15 with app router will respect window.history.scrollRestoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    return () => {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }
    };
  }, []);
}
