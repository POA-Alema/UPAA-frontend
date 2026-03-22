# UPAA Frontend

Base inicial do frontend do projeto Uma Porto Alegre Além da AGES, preparada para evolução incremental com foco em previsibilidade de ambiente, qualidade estática e CI desde o início.

## Stack inicial

- Next.js com App Router
- React
- TypeScript em modo `strict`
- Tailwind CSS
- ESLint com regras do Next.js
- Vitest
- GitHub Actions para lint, type-check, testes e build

## Requisitos

- Node.js 20.19 ou superior dentro da linha 20.x
- npm 10 ou superior

Para manter aderência com a CI, use Node 20 LTS. O repositório inclui `.nvmrc` com a versão base recomendada.

## Primeira configuração

Use o script de setup do projeto:

```bash
npm run setup
```

O script:

- cria `.env.local` a partir de `.env.example` se o arquivo ainda não existir
- instala as dependências do projeto
- mostra os próximos passos no terminal

Depois disso:

1. Revise o valor de `NEXT_PUBLIC_API_URL` em `.env.local`.
2. Rode a validação local:

```bash
npm run validate
```

3. Inicie o ambiente:

```bash
npm run dev
```

4. Abra `http://localhost:3000` e verifique se a tela inicial carrega com o título do projeto.

## Scripts disponíveis

- `npm run dev`: sobe o ambiente local
- `npm run build`: gera o build de produção
- `npm run start`: serve o build de produção
- `npm run setup`: cria `.env.local` se necessário e instala dependências
- `npm run validate`: executa lint, type-check, testes e build em sequência
- `npm run lint`: executa o lint do projeto
- `npm run lint:fix`: corrige problemas autocorrigíveis
- `npm run type-check`: executa validação de tipos
- `npm run test`: executa os testes uma vez
- `npm run test:watch`: executa os testes em modo watch

## Estrutura (inicial)

```text
.
|- .github/workflows/frontend-ci.yml
|- src/
|  |- app/
|  |  |- conteudo-acessivel/
|  |  |- edificacoes/
|  |- lib/
|  |- components/
|  |  |- layout/
|  |- data/
|  |- features/
|     |- accessible-content/
|     |- buildings/
|     |- home/
|     |- map/
|- .env.example
|- .gitignore
|- eslint.config.mjs
|- next.config.ts
|- postcss.config.mjs
|- package.json
|- tsconfig.json
|- vitest.config.ts
```

## Padrão de qualidade adotado

O pipeline inicial do frontend executa, nesta ordem:

1. `npm ci`
2. `npm run lint`
3. `npx tsc --noEmit`
4. `npm run test --if-present`
5. `npm run build`

Qualquer alteração no projeto deve manter esse fluxo verde localmente antes de abrir PR.

## Teste rápido do ambiente

Use esta sequência para validar que o mockup inicial e a pipeline estão prontos:

```bash
npm run setup
npm run validate
npm run dev
```

Resultado esperado:

- o setup cria `.env.local` se necessário e conclui a instalação das dependências
- `lint`, `type-check`, `test` e `build` terminam com sucesso
- `http://localhost:3000` abre a página inicial
- a página mostra apenas o título `Uma Porto Alegre Além`

## Diferenças por sistema operacional

O fluxo principal é o mesmo em Windows, Linux e macOS:

```bash
npm run setup
npm run validate
npm run dev
```

O que muda na prática é a forma de selecionar a versão do Node:

- Linux/macOS com `nvm`: `nvm use`
- Windows com `nvm-windows`: `nvm use 20.19.0`

Se o seu terminal do Windows tiver problema com o alias do `npm`, use `npm.cmd` no lugar de `npm`.

## Observações de ambiente

- O projeto usa alias `@/*` apontando para `src/*`.
- O `NEXT_PUBLIC_API_URL` é a primeira variável pública formalizada para integração com backend.
- O arquivo `next-env.d.ts` foi mantido versionado para evitar falhas no `tsc --noEmit` antes do primeiro `next build`. Se a pipeline mudar para gerar tipos antes da checagem, esse ponto pode ser revisado.
- A CI usa Node 20. Desenvolver com Node 23 ou superior pode gerar warnings de engine e resultados diferentes do pipeline.
- `leaflet` e `react-leaflet` permanecem instalados porque fazem parte da arquitetura definida, mas nenhuma implementação de mapa foi antecipada neste mockup inicial.

## Estrutura de produto adotada

- A página inicial foi preparada com três blocos principais: introdução, mapa e acesso ao conteúdo acessível.
- O mapa apontará para páginas de edificações em `src/app/edificacoes/[slug]`.
- A rota `src/app/conteudo-acessivel` foi reservada para a versão textual e acessível do projeto.
- Dados mockados iniciais ficam em `src/data` apenas para sustentar a navegação e os placeholders.
