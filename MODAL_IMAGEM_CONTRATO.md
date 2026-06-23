# Modal de Imagem Ampliada — Contrato e Locais de Uso

Documentação do componente único de visualização ampliada de imagens do projeto
**Uma Porto Alegre Alemã**. Todo o site usa o **mesmo** modal; este documento define
o contrato de dados (front ↔ backend) e lista **todos** os pontos que o consomem.

---

## 1. Componentes

| Componente | Arquivo | Papel |
|---|---|---|
| **`ExpandableImage`** | `src/components/media/ExpandableImage.tsx` | Wrapper da imagem. Renderiza o `next/image`, sobrepõe o botão "ampliar" (ícone `open_in_full`, visível no hover/focus, `cursor-zoom-in`) e abre o `ImageModal`. **É este que as telas usam.** |
| **`ImageModal`** | `src/components/media/ImageModal.tsx` | O modal full-screen em si (portal no `document.body`). Imagem + painel lateral de metadados. Fecha por botão, `Esc` ou clique no backdrop. |

> Regra de ouro: **nunca** criar um modal/visualizador de imagem paralelo. Toda imagem
> de conteúdo deve passar pelo `ExpandableImage`.

---

## 2. Contrato de dados (`src/types/image.ts`)

```ts
export interface ImageMetadata {
  title?: string;        // título exibido como cabeçalho do painel
  description?: string;  // TEXTO LIVRE (rich text do CMS) — corpo do painel
}

export interface ExpandableImageData extends ImageMetadata {
  src: string;           // obrigatório — URL da imagem
  alt: string;           // obrigatório — texto alternativo (acessibilidade)
  caption?: string;      // legenda curta (rótulo da galeria)
}
```

### Como o modal usa cada campo

| Campo | Uso no modal |
|---|---|
| `src` / `alt` | A imagem (`object-contain`, centralizada). `alt` é o texto alternativo. |
| `title` | Cabeçalho do painel lateral. Fallback de exibição: `title` → `caption` → `alt`. |
| `description` | Corpo do painel, renderizado pelo componente **`RichText`** (aceita HTML simples vindo do CMS; quebra em parágrafos por `</p><p>` ou linha em branco). |
| `caption` | Subtítulo do painel. Se **não houver `description`**, vira uma legenda discreta sobreposta na base da imagem (sem painel). |

### Regra do painel

O **painel lateral só aparece quando vem `description`**. Sem `description`, o modal
mostra apenas a imagem (com uma legenda sobreposta, se houver `title`/`caption`).

➡️ **Diretriz do produto: toda imagem deve trazer `title` + `description`.**

---

## 3. Tamanho e aparência (fixo para todas)

- Tamanho **fixo e uniforme** para qualquer imagem: `94vw × 85vh` (até `1200px` de largura).
  A imagem usa `object-contain` e centraliza — o modal **não** muda de tamanho conforme a proporção.
- Backdrop **translúcido**: `bg-black/50` + `backdrop-blur-sm` (dá pra ver o fundo borrado).
- Layout responsivo: desktop = imagem + painel lado a lado; mobile = empilhado e rolável.
- Paleta: fundo `#1A1A1A`, título em branco, labels/acentos em `#E9C46A`, texto via `rich-text--muted`.

---

## 4. Todos os locais que usam o modal

### ✅ Abrem o `ImageModal` (via `ExpandableImage`)

| # | Local | Arquivo | Imagem |
|---|---|---|---|
| 1 | Galeria de edificações | `src/features/buildings/components/BuildingGallery.tsx` | cada item da galeria (`BuildingImage[]`) |
| 2 | Hero da edificação | `src/features/buildings/components/BuildingPage.tsx` | `building.hero` |
| 3 | Galeria de obras do arquiteto | `src/features/architects/components/ArchitectGallery.tsx` | obras **sem** `href` |
| 4 | Hero do arquiteto | `src/features/architects/components/ArchitectPage.tsx` | `architect.image` |
| 5 | Preview do arquiteto (home) | `src/features/architects/components/ArchitectPreview.tsx` | `architect.image` |
| 6 | Seção de imigração (home) | `src/features/home/components/immigration-section.tsx` | `data.image` |
| 7 | Popup do mapa | `src/features/map/components/map-markers.tsx` | `attachments[0]` do marcador |

### ⛔ Não abrem o modal (por decisão de UX)

| Local | Motivo |
|---|---|
| Cards da galeria de obras **com** `href` (`ArchitectGallery`) | Clicar **navega** para a página da edificação (não abrir modal sobre link). |
| Preview do mapa na home (`MapPreviewSection`) | É mapa + botão "Explorar Mapa"; sem imagem clicável. |
| Ícones de característica (`BuildingPage`) | São ícones, não fotos de conteúdo. |
| Telas de administração / CMS (`src/components/admin/*`) | Fora do escopo do modal público. |

---

## 5. Tipos por domínio (todos estendem `ImageMetadata`)

| Tipo | Arquivo | Observação |
|---|---|---|
| `BuildingImage` | `src/features/buildings/types/building.ts` | Usado em `hero` e em `gallery: BuildingImage[]` — **a galeria é um array; aceita quantas imagens vierem**, cada uma com `title` + `description`. |
| `ArchitectImage` | `src/features/architects/types/architect.ts` | Usado no hero (`Architect.image`) e em cada obra (`ArchitectWork.image`). |
| `BuildingAttachment` | `src/features/map/utils/map-buildings.ts` | Imagens do popup do mapa. |
| `ImmigrationSection["image"]` | `src/features/home/types/immigration.ts` | `ImageMetadata & { src; alt }`. |

> ✔️ Verificado: todos esses tipos estendem `ImageMetadata`, então acrescentar imagens
> (ex.: mais fotos numa edificação) já vem tipado com `title`/`description` — sem mudança de tipo.

---

## 6. Como o backend deve enviar

Hoje o backend **não** envia `title`/`description`; eles vêm de placeholder (lorem) nos mocks.
Padrão do projeto: **tenta backend → fallback mock**. Nada quebra enquanto os campos não chegam —
o modal apenas omite o painel se faltar `description`.

Para o backend passar a alimentar, inclua os campos no payload e mapeie-os nestes pontos
(procure pelo comentário `// Placeholder até o CMS enviar...`):

| Ponto de normalização | Arquivo | Domínio |
|---|---|---|
| `normalizeImage` | `src/services/buildings.ts` | hero/galeria de edificações |
| `mapArchitectFromApi` / `mapFeaturedArchitect` | `src/features/architects/data/architects.ts` | arquiteto (página e preview) |
| `mapImmigrationSection` | `src/features/home/data/immigration.ts` | imigração (home) |
| `mapBackendMediaToAttachment` | `src/features/map/utils/map-buildings.ts` | popup do mapa |

### Shape sugerido do payload (por imagem)

```json
{
  "src": "https://.../imagem.jpg",
  "alt": "Texto alternativo acessível",
  "caption": "Legenda curta (opcional)",
  "title": "Título da imagem",
  "description": "<p>Texto livre em rich text do CMS…</p>"
}
```

Para **edificações com várias imagens**, o backend envia uma **lista** dessas estruturas
(uma por foto). Cada item deve trazer `title` + `description` — não há limite de quantidade,
e todas aparecem na galeria com o mesmo modal e o mesmo painel.

---

## 7. Acessibilidade e comportamento

- Abre focando o botão fechar; ao fechar, restaura o foco anterior.
- Fecha por: botão (ícone `close`), tecla `Esc`, clique no backdrop.
- Bloqueia o scroll do `body` enquanto aberto.
- Renderização condicional: campos ausentes não quebram o layout.
- `z-index` `z-[20000]` para abrir corretamente sobre o popup do mapa (`z-10000`).
