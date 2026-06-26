/**
 * Metadados de uma imagem exibidos no modal de visualização ampliada.
 *
 * CONTRATO com o backend: ambos os campos são OPCIONAIS no tipo, mas a
 * intenção do produto é que TODA imagem traga `title` e `description`.
 * O `description` é um texto livre que será editado como rich text no CMS
 * (aceita HTML simples; o componente `RichText` higieniza e quebra em parágrafos).
 *
 * Enquanto o backend não envia estes campos, eles vêm dos mocks. Quando o
 * backend passar a enviá-los, as funções de normalização devem mapeá-los para cá.
 */
export interface ImageMetadata {
  /** Título da imagem (nome exibido como cabeçalho do painel). */
  title?: string;
  /** Texto livre (rich text do CMS) descrevendo a imagem. */
  description?: string;
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
