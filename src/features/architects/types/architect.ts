/**
 * Types for the architects feature.
 * The structure is designed to support both the preview on the home page
 * and the full architect detail page, ensuring consistent data flow.
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

// --- New Interfaces Based on Figma Design ---
export interface ArchitectCharacteristic {
  icon: string;        // Icon name from Material Symbols (e.g., 'auto_awesome')
  title: string;       // Title of the architectural characteristic (e.g., 'Monumental Eclecticism')
  description: string; // Explanatory text describing the characteristic
}

export interface ArchitectWork {
  title: string;
  image?: ArchitectImage; 
}
// ------------------------------------------

/**
 * Complete data structure for an architect.
 * Includes all information needed to render both preview and full detail page.
 */
export interface Architect {
  id: string;
  slug: string;
  eyebrow?: string;
  title: string;
  bioSummary: string; // Short summary for the home page preview
  bio: string; // Full biography for the detail page
  image?: ArchitectImage;
  actions?: {
    primary: ArchitectAction;   // Action button for biography section
    secondary: ArchitectAction; // Action button for works section
  };
  details?: ArchitectDetail[];
  
  // New properties for the detailed page
  characteristics?: ArchitectCharacteristic[];
  works?: ArchitectWork[];
  ctaDescription?: string; // Descriptive text above the buttons at the end of the page
}

/**
 * Props for the ArchitectPreview component.
 * Renders a summarized preview of the architect on the home page.
 * Uses PageSection for visual consistency.
 */
export interface ArchitectPreviewProps {
  architect: Architect;
}

/**
 * Props for the ArchitectPage component.
 * Renders the full detail page for an architect.
 */
export interface ArchitectPageProps {
  architect: Architect;
}