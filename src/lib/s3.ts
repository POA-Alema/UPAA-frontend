const DEFAULT_S3_BASE_URL = 'https://liderpoaalema.s3.us-east-2.amazonaws.com';

/** Base pública do bucket S3 onde as imagens da aplicação estão armazenadas. */
export const S3_PUBLIC_BASE_URL =
  process.env.NEXT_PUBLIC_S3_BASE_URL ?? DEFAULT_S3_BASE_URL;

/**
 * Monta a URL pública de um objeto do bucket a partir do caminho da imagem
 * (ex.: `images/margs/Margs.jpg`). Encoda cada segmento para suportar nomes
 * de arquivo com espaços (`images/Memorial RS.jpg` → `.../Memorial%20RS.jpg`).
 */
export function s3ImageUrl(path: string): string {
  const key = path
    .replace(/^\/+/, '')
    .split('/')
    .map(encodeURIComponent)
    .join('/');
  return `${S3_PUBLIC_BASE_URL}/${key}`;
}
