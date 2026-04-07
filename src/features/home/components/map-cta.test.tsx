// @vitest-environment jsdom
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MapCTA } from './map-cta'; 
import '@testing-library/jest-dom';

describe('Componente MapCTA', () => {
  // Teste 1: Testar renderização
  it('deve renderizar o botão na tela', () => {
    render(<MapCTA />);
    
    // Procura na tela um elemento que seja um link e tenha o texto "EXPLORAR MAPA"
    const button = screen.getByRole('link', { name: /explorar mapa/i });
    
    // Afirma que esse botão existe no documento HTML gerado
    expect(button).toBeInTheDocument();
  });

  // Teste 2: Testar clique e navegação
  it('deve possuir o link de navegação correto para a rota /mapa', () => {
    render(<MapCTA />);
    
    const button = screen.getByRole('link', { name: /explorar mapa/i });
    
    // Afirma que a propriedade "href" do link aponta exatamente para a rota exigida
    expect(button).toHaveAttribute('href', '/mapa');
  });
});