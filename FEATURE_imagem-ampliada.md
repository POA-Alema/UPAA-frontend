# Feature: Imagem com Visualização Ampliada

Modal full-screen + painel lateral de metadados para imagens de edificações e arquitetos no projeto **Uma Porto Alegre Alemã** (Next.js 15, React 19, Tailwind 4).

## Critérios de Aceitação (resumo)

- Ícone de expandir visível no hover/focus sobre a imagem
- Cursor `zoom-in` indicando que a imagem é clicável
- Modal full-screen abre ao clicar, exibindo a imagem em alta resolução (`object-contain`)
- Painel lateral com título, legenda, descrição, fonte, referência e créditos
- Renderização condicional: campos ausentes não quebram o layout
- Fechar por botão (ícone `close`), tecla Esc ou clique no backdrop
- Responsivo: desktop lado a lado (imagem + sidebar), mobile empilhado e rolável
- Scroll do body bloqueado enquanto o modal está aberto
- Gestão de foco: foca o botão fechar ao abrir, restaura o foco original ao fechar

---

## ✅ O que foi feito

### 1. `src/types/image.ts` — Contrato de metadados (novo arquivo)

Define as interfaces que estabelecem o contrato entre front e backend para metadados de imagem:

- **`ImageMetadata`**: todos os campos opcionais — `title`, `description`, `source`, `reference`, `credits`. O front renderiza condicionalmente; campos ausentes não quebram nada.
- **`ExpandableImageData extends ImageMetadata`**: adiciona `src` (obrigatório), `alt` (obrigatório) e `caption?` — shape mínimo consumido pelo modal e pelo componente de imagem expansível.

### 2. `src/features/buildings/types/building.ts` — `BuildingImage extends ImageMetadata`

`BuildingImage` passou a estender `ImageMetadata` (importado de `@/types/image`), unificando o contrato de metadados sem breaking change para os consumidores existentes.

### 3. `src/features/architects/types/architect.ts` — `ArchitectImage extends ImageMetadata`

Mesma extensão aplicada a `ArchitectImage`, garantindo consistência entre os dois domínios.

### 4. `src/components/media/ImageModal.tsx` — Modal full-screen (novo componente)

Componente `"use client"` que implementa:

- Renderização via `createPortal(document.body)` — mesmo padrão de `src/features/map/components/map-markers.tsx`
- Backdrop com `bg-black/85 backdrop-blur-sm`; clique no backdrop fecha o modal
- Tecla Esc fecha via `document.addEventListener("keydown", …)` (cleanup no unmount)
- Scroll-lock: salva e restaura `document.body.style.overflow`
- Gestão de foco: `useRef` no botão fechar, `focus()` ao montar, restaura foco ao desmontar
- Imagem em `<Image fill … object-contain>` com `priority`
- Sidebar com renderização condicional de título, legenda, descrição, fonte, referência e créditos
- i18n via `useTranslation("common")` com fallback inline em português (`image.close`, `image.source`, `image.reference`, `image.credits`)
- Paleta: fundo `#1A1A1A`, labels em `#E9C46A`, texto `white/80`

**Type-check passou** (`npx tsc --noEmit` sem erros).

---

## 🚧 O que falta fazer

### Responsabilidade: Front-end

#### `src/components/media/ExpandableImage.tsx` (componente ainda não existe)

Wrapper `"use client"` que:

- Renderiza o `next/image` normalmente
- Sobrepõe um botão `absolute inset-0` com `cursor-zoom-in` e ícone Material Symbols `open_in_full` no canto superior direito, visível no hover/focus
- Controla o estado `isOpen` e renderiza `<ImageModal>` quando aberto

#### Chaves i18n (`src/features/i18n.ts`)

Adicionar bloco `image` nos 3 idiomas (pt / en / de):

```json
"image": {
  "expand": "Ampliar imagem",
  "close": "Fechar imagem ampliada",
  "source": "Fonte",
  "reference": "Referência",
  "credits": "Créditos"
}
```

#### Wiring do `ExpandableImage` nas 4 superfícies

1. **`BuildingGallery.tsx`** — substituir `<figure>/<img>` por `<ExpandableImage>` em todos os itens
2. **Hero de `BuildingPage.tsx`** — mesma substituição na imagem principal
3. **`ArchitectGallery.tsx`** — somente nos cards `<figure>` **sem** `href`; cards com link continuam navegando normalmente (não abrir modal sobre link)
4. **Hero de `ArchitectPage.tsx`** — idem ao hero de edificação

#### Seed do mock MARGS (`src/features/buildings/mocks/building-mock.ts`)

Popular `ImageMetadata` no hero e em pelo menos 3 itens da galeria do MARGS com dados de exemplo reais (título, descrição, fonte, referência, créditos) para demonstrar e testar o painel lateral completo.

#### Testes (por último, a pedido do usuário)

Padrão: Vitest + Testing Library, mockando `next/image`, `react-i18next` e `next/link`.

- **`ExpandableImage`**: mostra ícone `open_in_full` no hover; abre `ImageModal` ao clicar; não abre quando envolto em link
- **`ImageModal`**: fecha por botão; fecha por Esc; fecha por clique no backdrop; renderização condicional de cada campo de metadados (campo ausente → não renderiza o label)

---

### Responsabilidade: Backend (usuário)

Implementar o contrato `ImageMetadata` (definido em `src/types/image.ts`) nos endpoints de imagem e mapear os campos nas funções de normalização do front:

- `src/services/buildings.ts` → `normalizeImage` — mapear `title`, `description`, `source`, `reference`, `credits` do payload para `BuildingImage`
- `src/features/map/utils/map-buildings.ts` → `extractAttachments` — idem para as imagens usadas no mapa

Padrão já existente no projeto: **tenta backend → fallback mock**. Os campos do mock continuam sendo exibidos enquanto o backend não os enviar; ao implementar, basta que o endpoint passe a incluí-los na resposta.

---

## 📐 Contrato de metadados (para o backend)

Definido em `src/types/image.ts`. **Todos os campos são opcionais.**

| Campo         | Tipo     | Descrição                                                     |
|---------------|----------|---------------------------------------------------------------|
| `src`         | `string` | URL da imagem (obrigatório em `ExpandableImageData`)          |
| `alt`         | `string` | Texto alternativo acessível (obrigatório em `ExpandableImageData`) |
| `caption`     | `string?`| Rótulo curto exibido na galeria (ex.: "Planta baixa")         |
| `title`       | `string?`| Título curto da imagem (ex.: "Fachada principal")             |
| `description` | `string?`| Legenda ou descrição longa do conteúdo da imagem              |
| `source`      | `string?`| Fonte formal: instituição, acervo ou autor                    |
| `reference`   | `string?`| Referência literária ou bibliográfica associada               |
| `credits`     | `string?`| Créditos: fotógrafo, ilustrador, licença                      |

O front renderiza cada campo condicionalmente — se o campo vier `undefined` ou `null`, o label correspondente simplesmente não é exibido no painel lateral, sem quebrar o layout.

Enquanto o backend não enviar esses campos, os valores virão do mock em `src/features/buildings/mocks/building-mock.ts` e `src/features/architects/mocks/architect-mock.ts`.

---

## 🎨 Decisões técnicas

### Ícones: Material Symbols

O projeto já usa Material Symbols. Os ícones escolhidos são:
- `open_in_full` — botão de expandir sobreposto à imagem (ainda no `ExpandableImage`, a implementar)
- `close` — botão de fechar dentro do `ImageModal` (já implementado, com rotação de 90° no hover)

### Modal via `createPortal`

Segue o padrão já estabelecido em `src/features/map/components/map-markers.tsx`. Renderizar no `document.body` evita problemas de `z-index` e `overflow: hidden` de ancestrais.

### Paleta de cores

Consistente com o design system do projeto:
- Fundo do modal: `#1A1A1A`
- Labels de metadados: `#E9C46A` (dourado)
- Texto do corpo: `white/80`
- Backdrop: `black/85` com `backdrop-blur-sm`

### i18n com fallback inline

As chaves `image.*` ainda não existem nos arquivos de tradução (TODO acima). Por enquanto, `useTranslation` retorna o segundo argumento de `t()` como fallback, garantindo que o componente funcione em português mesmo sem as chaves configuradas.

### Escopo de aplicação: galerias e heros (mapa fora)

O modal é aplicado nas galerias e imagens hero de edificações e arquitetos. O componente de mapa (`src/features/map`) fica **fora do escopo** para evitar modal aninhado sobre o mapa interativo (Leaflet/Mapbox já gerencia seu próprio overlay).
