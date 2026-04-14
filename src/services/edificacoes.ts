import type { Edificacao, EdificacaoFormData } from '@/types/edificacao';

// Simular uma base de dados em memória (será substituída pela API)
const edificacoes: Edificacao[] = [
  {
    id: '1',
    titulo: 'Casarão Histórico do Menino Deus',
    localizacao: 'Porto Alegre, RS',
    data: '1900',
    ocupacaoAtual: 'Residencial',
    descricao: 'Um importante exemplar da arquitetura germânica em Porto Alegre.',
    criadoEm: new Date('2024-01-01'),
    atualizadoEm: new Date('2024-01-01'),
  },
  {
    id: '2',
    titulo: 'Sociedade Germânia',
    localizacao: 'Porto Alegre, RS',
    data: '1920',
    ocupacaoAtual: 'Cultural',
    descricao: 'Sede da associação que preserva a cultura germânica.',
    criadoEm: new Date('2024-01-01'),
    atualizadoEm: new Date('2024-01-01'),
  },
];

let nextId = 3;

/**
 * Obtém todas as edificações
 */
export async function getEdificacoes(): Promise<Edificacao[]> {
  // TODO: Substituir por chamada à API real
  return new Promise((resolve) => {
    setTimeout(() => resolve(edificacoes), 500);
  });
}

/**
 * Obtém uma edificação pelo ID
 */
export async function getEdificacaoById(id: string): Promise<Edificacao | null> {
  // TODO: Substituir por chamada à API real
  return new Promise((resolve) => {
    setTimeout(() => {
      const edificacao = edificacoes.find((e) => e.id === id);
      resolve(edificacao || null);
    }, 300);
  });
}

/**
 * Cria uma nova edificação
 */
export async function createEdificacao(data: EdificacaoFormData): Promise<Edificacao> {
  // TODO: Substituir por chamada à API real
  return new Promise((resolve) => {
    setTimeout(() => {
      const novaEdificacao: Edificacao = {
        ...data,
        id: String(nextId++),
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      };
      edificacoes.push(novaEdificacao);
      resolve(novaEdificacao);
    }, 500);
  });
}

/**
 * Atualiza uma edificação existente
 */
export async function updateEdificacao(
  id: string,
  data: EdificacaoFormData
): Promise<Edificacao> {
  // TODO: Substituir por chamada à API real
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = edificacoes.findIndex((e) => e.id === id);
      if (index === -1) {
        reject(new Error(`Edificação com ID ${id} não encontrada`));
        return;
      }

      const edificacaoAtualizada: Edificacao = {
        ...edificacoes[index],
        ...data,
        id,
        criadoEm: edificacoes[index].criadoEm,
        atualizadoEm: new Date(),
      };
      edificacoes[index] = edificacaoAtualizada;
      resolve(edificacaoAtualizada);
    }, 500);
  });
}

/**
 * Deleta uma edificação
 */
export async function deleteEdificacao(id: string): Promise<void> {
  // TODO: Substituir por chamada à API real
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = edificacoes.findIndex((e) => e.id === id);
      if (index === -1) {
        reject(new Error(`Edificação com ID ${id} não encontrada`));
        return;
      }
      edificacoes.splice(index, 1);
      resolve();
    }, 300);
  });
}
