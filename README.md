# UPAA Frontend

Base inicial do frontend do projeto Uma Porto Alegre Alemã da AGES, preparada para evolução incremental com foco em previsibilidade de ambiente, qualidade estática e CI desde o início.

## Stack inicial

- Next.js com App Router
- React
- TypeScript em modo `strict`
- Tailwind CSS
- ESLint com regras do Next.js
- Vitest
- GitHub Actions para lint, type-check, testes e build

## Requisitos

- Node.js 24 LTS
- npm 11 ou superior

O npm já vem junto com a instalação oficial do Node.js.

Download oficial do Node.js e npm:

- https://nodejs.org/en/download

Referência oficial de releases do Node.js:

- https://nodejs.org/en/about/previous-releases

O repositório inclui `.nvmrc` apontando para Node 24.

## Clonando o repositório

```bash
git clone https://github.com/POA-Alema/UPAA-frontend.git
cd UPAA-frontend
```

## Primeiro acesso à branch `develop`

Depois de clonar, busque as referências remotas e garanta que você está trabalhando em `develop`:

```bash
git fetch origin
git checkout develop
git pull origin develop
```

Se o `checkout develop` não funcionar no primeiro acesso, use:

```bash
git fetch origin
git checkout -b develop origin/develop
```

## Atualizando sua branch local `develop`

Sempre que voltar ao projeto e quiser atualizar sua base local:

```bash
git fetch origin
git checkout develop
git pull origin develop
```

## Primeira configuração do ambiente

Use o script de setup do projeto:

```bash
npm run setup
```

O script:

- cria `.env.local` a partir de `.env.example`, se o arquivo ainda não existir
- instala as dependências do projeto
- mostra os próximos passos no terminal

Depois disso:

1. Abra `.env.local`.
2. Revise `NEXT_PUBLIC_API_URL`.
   O que revisar aqui:
   essa variável deve apontar para a URL do backend que você vai usar no ambiente local.
   Valor padrão atual:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Se o backend estiver rodando em outra porta, host ou ambiente remoto, ajuste esse valor.

3. Rode a validação local:

```bash
npm run validate
```

4. Inicie o ambiente:

```bash
npm run dev
```

5. Abra `http://localhost:3000` e verifique se a tela inicial carrega com o título do projeto.

## Scripts disponíveis

- `npm run dev`: sobe o ambiente local
- `npm run build`: gera o build de produção
- `npm run start`: serve o build de produção
- `npm run setup`: cria `.env.local` se necessário e instala dependências
- `npm run validate`: executa lint, type-check, testes e build em sequência
- `npm run check:deps`: acusa alterações em `package.json` e `package-lock.json` em relação à baseline aprovada do projeto
- `npm run lint`: executa o lint do projeto
- `npm run lint:fix`: corrige problemas autocorrigíveis
- `npm run type-check`: executa validação de tipos
- `npm run test`: executa os testes uma vez
- `npm run test:watch`: executa os testes em modo watch

## Estrutura inicial

```text
.
|- .github/workflows/frontend-ci.yml
|- src/
|  |- app/
|  |  |- conteudo-acessivel/
|  |  |- edificacoes/
|  |- components/
|  |  |- layout/
|  |- data/
|  |- features/
|  |  |- accessible-content/
|  |  |- buildings/
|  |  |- home/
|  |  |- map/
|  |- lib/
|- .env.example
|- .gitignore
|- .nvmrc
|- eslint.config.mjs
|- next.config.ts
|- package.json
|- postcss.config.mjs
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

- o setup cria `.env.local`, se necessário, e conclui a instalação das dependências
- `lint`, `type-check`, `test` e `build` terminam com sucesso
- `http://localhost:3000` abre a página inicial
- a página mostra o título `Uma Porto Alegre Alemã`

## Diferenças por sistema operacional

O fluxo principal do projeto é o mesmo em Windows, Linux e macOS:

```bash
npm run setup
npm run validate
npm run dev
```

O que costuma mudar é a forma de instalar e gerenciar a versão do Node:

- Windows:
  use o instalador oficial do Node.js ou, se preferir gerenciar versões, instale `nvm-windows`
- Linux/macOS:
  use o instalador oficial do Node.js ou, se preferir gerenciar versões, instale `nvm`

Se você optar por gerenciador de versões:

- `nvm` (Linux/macOS): https://github.com/nvm-sh/nvm
- `nvm-windows`: https://github.com/coreybutler/nvm-windows

Exemplos:

- Linux/macOS com `nvm`:

```bash
nvm install 24
nvm use 24
```

- Windows com `nvm-windows`:

```bash
nvm install 24
nvm use 24
```

Se o seu terminal do Windows tiver problema com o alias do `npm`, use `npm.cmd` no lugar de `npm`.

## Observações de ambiente

- O projeto usa alias `@/*` apontando para `src/*`.
- O `NEXT_PUBLIC_API_URL` é a primeira variável pública formalizada para integração com backend.
- O arquivo `next-env.d.ts` foi mantido versionado para evitar falhas no `tsc --noEmit` antes do primeiro `next build`. Se a pipeline mudar para gerar tipos antes da checagem, esse ponto pode ser revisado.
- A CI agora está alinhada com Node 24 LTS.
- `leaflet` e `react-leaflet` permanecem instalados porque fazem parte da arquitetura definida, mas nenhuma implementação de mapa foi antecipada neste mockup inicial.

## Estrutura de produto adotada

- A página inicial foi preparada com três blocos principais: introdução, mapa e acesso ao conteúdo acessível.
- O mapa apontará para páginas de edificações em `src/app/edificacoes/[slug]`.
- A rota `src/app/conteudo-acessivel` foi reservada para a versão textual e acessível do projeto.
- Dados mockados iniciais ficam em `src/data` apenas para sustentar a navegação e os placeholders.
