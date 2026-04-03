/**
 * Tipos para a feature de arquitetos
 * 
 * A estrutura foi pensada para suportar tanto o preview na home
 * quanto a página completa de detalhes do arquiteto.
 */

export interface ArchitectImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface ArchitectDetail {
  label: string;
  value: string;
  subValue?: string;
}

export interface ArchitectAction {
  label: string;
  href: string;
}

/**
 * Dados completos de um arquiteto
 * 
 * Inclui informações para renderizar tanto o preview quanto a página completa.
 */
export interface Architect {
  id: string;
  slug: string;
  eyebrow?: string;
  title: string;
  bioSummary: string; // Resumo curto para o preview na home
  bio: string; // Biografia completa para a página de detalhes
  image?: ArchitectImage;
  actions?: {
    primary: ArchitectAction;   // Para a biografia
    secondary: ArchitectAction; // Para as obras
  };
  details?: ArchitectDetail[];
}

/**
 * Props do componente ArchitectPreview
 * 
 * Renderiza um preview resumido do arquiteto na home.
 * Usa o PageSection para manter consistência visual.
 */
export interface ArchitectPreviewProps {
  architect: Architect;
}

/**
 * Props do componente ArchitectPage
 * 
 * Renderiza a página completa de detalhes do arquiteto.
 */
export interface ArchitectPageProps {
  architect: Architect;
}
