import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ArchitectBio } from './architect-bio';

// Mock do Next.js Image e Link
vi.mock('next/image', () => ({
  default: ({ src, alt, priority, ...props }: any) => (
    <img src={src} alt={alt} data-priority={priority ? 'true' : 'false'} {...props} />
  ),
}));

vi.mock('next/link', () => ({
  default: ({ children, href, 'aria-label': ariaLabel }: any) => (
    <a href={href} aria-label={ariaLabel}>{children}</a>
  ),
}));

describe('ArchitectBio Component', () => {
  const mockProps = {
    title: 'Theodor Wiederspahn',
    bio: 'Um arquiteto germano-brasileiro.',
    image: {
      src: '/test-image.jpg',
      alt: 'Retrato de Theodor',
    },
    cta: {
      label: 'Explorar',
      href: '/explorar',
    },
  };

  it('deve renderizar título e conteúdo da biografia', () => {
    render(<ArchitectBio {...mockProps} />);
    
    expect(screen.getByText('Theodor Wiederspahn')).toBeDefined();
    expect(screen.getByText(/Um arquiteto germano-brasileiro/)).toBeDefined();
  });

  it('deve não renderizar nada caso os dados obrigatórios estejam vazios', () => {
    const { container } = render(<ArchitectBio title="" bio="" />);
    expect(container.firstChild).toBeNull();
  });

  it('deve renderizar imagem com acessibilidade (role="img" e aria-label)', () => {
    render(<ArchitectBio {...mockProps} />);
    
    const imgContainer = screen.getByRole('img', { name: /Retrato de Theodor/i });
    expect(imgContainer).toBeDefined();
    
    const img = imgContainer.querySelector('img');
    expect(img?.getAttribute('src')).toBe('/test-image.jpg');
  });

  it('deve renderizar o botão de CTA com aria-label para acessibilidade', () => {
    render(<ArchitectBio {...mockProps} />);
    
    const link = screen.getByRole('link', { name: /Explorar sobre Theodor Wiederspahn/i });
    expect(link).toBeDefined();
    expect(link.getAttribute('href')).toBe('/explorar');
  });

  it('deve renderizar o eyebrow através do componente PageSection', () => {
    render(<ArchitectBio {...mockProps} eyebrow="O Arquiteto" />);
    expect(screen.getByText('O Arquiteto')).toBeDefined();
  });

  it('deve renderizar o grid de detalhes quando fornecido', () => {
    const details = [{ label: 'Origem', value: 'Alemanha' }];
    render(<ArchitectBio {...mockProps} details={details} />);
    
    expect(screen.getByText('Origem')).toBeDefined();
    expect(screen.getByText('Alemanha')).toBeDefined();
  });
});
