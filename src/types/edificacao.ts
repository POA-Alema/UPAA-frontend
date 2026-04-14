export interface ImagemEdificacao {
  id: string;
  url: string;
  alt: string;
  legenda?: string;
  fallbackUrl?: string;
}

export interface CategoriaImagens {
  plantaBaixa: ImagemEdificacao[];
  fachadas: ImagemEdificacao[];
  fotosExternas: ImagemEdificacao[];
  fotosInternas: ImagemEdificacao[];
}

export interface FonteEdificacao {
  id: string;
  titulo: string;
  autor?: string;
  url?: string;
}

export type Edificacao = {
  id: string;
  titulo: string;
  localizacao: string;
  data?: string;
  projeto?: string;
  construcao?: string;
  ornamentosEsculturas?: string;
  areaConstituida?: string;
  ocupacaoAtual?: string;
  projetoRestauracao?: string;
  tombamento?: string;
  descricao?: string;
  autor?: string;
  fontes?: FonteEdificacao[];
  imagens?: CategoriaImagens;
  criadoEm?: Date;
  atualizadoEm?: Date;
};

export type EdificacaoFormData = Omit<Edificacao, 'id' | 'criadoEm' | 'atualizadoEm'>;
