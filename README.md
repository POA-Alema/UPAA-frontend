# UPAA Frontend

Base inicial do frontend do projeto Uma Porto Alegre Alem da AGES, preparada para evolucao incremental com foco em previsibilidade de ambiente, qualidade estatica e CI desde o inicio.

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

Para manter aderencia com a CI, use Node 20 LTS. O repositório inclui `.nvmrc` com a versao base recomendada.

## Primeira configuracao

Use o script de setup do projeto:

```bash
npm run setup
```

O script:

- cria `.env.local` a partir de `.env.example` se o arquivo ainda nao existir
- instala as dependencias do projeto
- mostra os proximos passos no terminal

Depois disso:

1. Revise o valor de `NEXT_PUBLIC_API_URL` em `.env.local`.
2. Rode a validacao local:

```bash
npm run validate
```

3. Inicie o ambiente:

```bash
npm run dev
```

4. Abra `http://localhost:3000` e verifique se a tela inicial carrega com o titulo do projeto.

## Scripts disponiveis

- `npm run dev`: sobe o ambiente local
- `npm run build`: gera o build de producao
- `npm run start`: serve o build de producao
- `npm run setup`: cria `.env.local` se necessario e instala dependencias
- `npm run validate`: executa lint, type-check, testes e build em sequencia
- `npm run lint`: executa o lint do projeto
- `npm run lint:fix`: corrige problemas autocorrigiveis
- `npm run type-check`: executa validacao de tipos
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

## Padrao de qualidade adotado

O pipeline inicial do frontend executa, nesta ordem:

1. `npm ci`
2. `npm run lint`
3. `npx tsc --noEmit`
4. `npm run test --if-present`
5. `npm run build`

Qualquer alteracao no projeto deve manter esse fluxo verde localmente antes de abrir PR.

## Teste rapido do ambiente

Use esta sequencia para validar que o mockup inicial e a pipeline estao prontos:

```bash
npm run setup
npm run validate
npm run dev
```

Resultado esperado:

- o setup cria `.env.local` se necessario e conclui a instalacao das dependencias
- `lint`, `type-check`, `test` e `build` terminam com sucesso
- `http://localhost:3000` abre a pagina inicial
- a pagina mostra apenas o titulo `Uma Porto Alegre Alema`

## Diferencas por sistema operacional

O fluxo principal e o mesmo em Windows, Linux e macOS:

```bash
npm run setup
npm run validate
npm run dev
```

O que muda na pratica e a forma de selecionar a versao do Node:

- Linux/macOS com `nvm`: `nvm use`
- Windows com `nvm-windows`: `nvm use 20.19.0`

Se o seu terminal do Windows tiver problema com o alias do `npm`, use `npm.cmd` no lugar de `npm`.

## Observacoes de ambiente

- O projeto usa alias `@/*` apontando para `src/*`.
- O `NEXT_PUBLIC_API_URL` e a primeira variavel publica formalizada para integracao com backend.
- O arquivo `next-env.d.ts` foi mantido versionado para evitar falhas no `tsc --noEmit` antes do primeiro `next build`. Se a pipeline mudar para gerar tipos antes da checagem, esse ponto pode ser revisado.
- A CI usa Node 20. Desenvolver com Node 23 ou superior pode gerar warnings de engine e resultados diferentes do pipeline.
- `leaflet` e `react-leaflet` permanecem instalados porque fazem parte da arquitetura definida, mas nenhuma implementacao de mapa foi antecipada neste mockup inicial.

## Estrutura de produto adotada

- A pagina inicial foi preparada com tres blocos principais: introducao, mapa e acesso ao conteudo acessivel.
- O mapa apontara para paginas de edificacoes em `src/app/edificacoes/[slug]`.
- A rota `src/app/conteudo-acessivel` foi reservada para a versao textual e acessivel do projeto.
- Dados mockados iniciais ficam em `src/data` apenas para sustentar a navegacao e os placeholders.
