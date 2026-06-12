/**
 * Metadados de referência de uma imagem.
 *
 * CONTRATO com o backend (ainda não implementado no servidor):
 * todos os campos são OPCIONAIS — o front renderiza condicionalmente e
 * nunca quebra o layout quando algum deles estiver ausente.
 *
 * Enquanto o backend não envia estes campos, eles vêm do mock
 * (ver src/features/buildings/mocks/building-mock.ts). Quando o backend
 * passar a enviá-los, as funções de normalização devem mapeá-los para cá.
 */
export interface ImageMetadata {
  /** Título curto da imagem (ex.: "Fachada principal"). */
  title?: string;
  /** Legenda ou descrição longa do que a imagem mostra. */
  description?: string;
  /** Fonte formal: instituição, acervo ou autor da imagem. */
  source?: string;
  /** Referência literária ou bibliográfica associada. */
  reference?: string;
  /** Créditos da imagem (fotógrafo, ilustrador, licença). */
  credits?: string;
}

/**
 * Shape mínimo consumido pelo componente de imagem expansível e seu modal.
 * `BuildingImage` e `ArchitectImage` são estruturalmente compatíveis com este tipo.
 */
export interface ExpandableImageData extends ImageMetadata {
  src: string;
  alt: string;
  /** Rótulo curto exibido sob a imagem na galeria (ex.: "Planta baixa"). */
  caption?: string;
}
