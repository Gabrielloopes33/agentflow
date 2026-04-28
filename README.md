# @gabrielloopes33/agentflow

> Orquestrador de agentes de IA para fluxos de desenvolvimento

[![npm version](https://img.shields.io/npm/v/@gabrielloopes33/agentflow.svg)](https://www.npmjs.com/package/@gabrielloopes33/agentflow)
[![license](https://img.shields.io/npm/l/@gabrielloopes33/agentflow.svg)](https://github.com/Gabrielloopes33/agentflow/blob/main/LICENSE)

`agentflow` é um pacote npm que encapsula um fluxo completo de desenvolvimento assistido por IA. Instale em qualquer projeto e use a CLI para orquestrar agentes de IA em duas fases:

- **Foundation (`init`)** — roda uma vez por projeto, cria estrutura, documentação base e padrões
- **Runtime (`run`, `sync`, `check`)** — roda continuamente durante o desenvolvimento de features

---

## 🚀 Instalação

### Instalar no projeto (recomendado)

```bash
npm install --save-dev @gabrielloopes33/agentflow
```

### Instalar globalmente

```bash
npm install -g @gabrielloopes33/agentflow
```

### Usar sem instalar (npx)

```bash
npx @gabrielloopes33/agentflow <comando>
```

---

## 📋 Uso Rápido

```bash
# 1. Inicializar no projeto (roda uma vez)
npx @gabrielloopes33/agentflow init

# 2. Rodar fluxo completo de feature
npx @gabrielloopes33/agentflow run

# 3. Sincronizar docs com código
npx @gabrielloopes33/agentflow sync

# 4. Verificar convenções
npx @gabrielloopes33/agentflow check
```

---

## 🏗️ Foundation: `init`

Roda uma vez por projeto. Cria:

- Estrutura de pastas (`src/`, `docs/`, `.agentflow/`)
- Documentação base (stories, ADRs, standards)
- `agentflow.config.js` — configuração do projeto
- `.agentflow/context.json` — estado compartilhado
- README.md raiz do projeto

```bash
npx @gabrielloopes33/agentflow init

# Opções
npx @gabrielloopes33/agentflow init --skip-scaffold   # Não criar estrutura de pastas
npx @gabrielloopes33/agentflow init --skip-onboard    # Não gerar README raiz
```

---

## ⚡ Runtime: `run`

Executa o fluxo completo de uma feature em 5 etapas:

| Etapa | O que faz |
|---|---|
| `analyze` | Analisa projeto, identifica módulos afetados, riscos e issues |
| `plan` | Gera SDD, quebra em tasks, define critérios de aceite |
| `execute` | Prepara contexto para execução (handoff para agente de código) |
| `review` | Revisa código em 6 áreas: plan, quality, architecture, docs, issues, communication |
| `deploy` | Dispara scripts de CI/deploy (desabilitado por padrão) |

```bash
# Fluxo completo
npx @gabrielloopes33/agentflow run

# Retomar de uma etapa específica
npx @gabrielloopes33/agentflow run --from plan
npx @gabrielloopes33/agentflow run --from execute

# Rodar somente uma etapa
npx @gabrielloopes33/agentflow run --only analyze
npx @gabrielloopes33/agentflow run --only review
```

---

## 🔄 Manutenção

### `sync` — Sincronizar documentação

Atualiza os README.md dos módulos com base no código atual.

```bash
# Sincronizar todos os módulos
npx @gabrielloopes33/agentflow sync

# Sincronizar apenas um módulo
npx @gabrielloopes33/agentflow sync --module auth
```

### `check` — Verificar saúde do projeto

Verifica convenções e consistência entre docs e código.

```bash
# Verificar
npx @gabrielloopes33/agentflow check

# Tentar corrigir automaticamente
npx @gabrielloopes33/agentflow check --fix
```

### `release` — Gerar changelog

Gera changelog a partir dos commits git.

```bash
# Desde a última tag
npx @gabrielloopes33/agentflow release

# Range específico
npx @gabrielloopes33/agentflow release --since v1.0.0 --to v1.1.0
```

---

## 🧩 Skills

O agentflow inclui 16 skills no formato SKILL.md que guiam os agentes:

| Skill | Descrição |
|---|---|
| `brainstorm` | Explora ideias em designs/specs antes de implementar |
| `plan-writer` | Cria planos de implementação com tasks de 2-5 min |
| `subagent-driven` | Executa planos com fresh subagent por task + review em 2 estágios |
| `tdd-enforcer` | Enforce TDD: "NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST" |
| `code-review` | Review em 6 áreas: plan, quality, architecture, docs, issues, communication |
| `systematic-debug` | Debug em 4 fases: root cause → pattern → hypothesis → fix |
| `doc-coauthor` | Co-criação de documentos com workflow de 3 estágios |
| `generate-changelog` | Gera changelogs amigáveis a partir de commits |
| `skill-creator` | Cria novos skills para o ecossistema agentflow |
| `mcp-builder` | Constrói servidores MCP para integração com LLMs |
| `webapp-testing` | Testes com Playwright usando padrão recognition-action |
| `ui-ux-design` | Aplica princípios de design profissional |
| `read-project` | Analisa estrutura do projeto |
| `read-module` | Analisa módulo específico |
| `generate-md` | Gera documentação markdown |
| `validate-conventions` | Valida código contra convenções configuradas |

### Gerenciar skills

```bash
# Listar skills disponíveis
npx @gabrielloopes33/agentflow skill list

# Criar novo skill
npx @gabrielloopes33/agentflow skill create meu-skill

# Validar skill
npx @gabrielloopes33/agentflow skill validate ./meu-skill/SKILL.md

# Ver detalhes de um skill
npx @gabrielloopes33/agentflow skill show tdd-enforcer
```

---

## ⚙️ Configuração

O `init` cria `agentflow.config.js` na raiz do projeto:

```javascript
module.exports = {
  // Modelo a usar
  model: process.env.AGENTFLOW_MODEL || 'claude-sonnet-4-5',

  // Diretórios do projeto
  paths: {
    src: './src',
    docs: './docs',
    stories: './docs/stories',
    adr: './docs/adr',
    architecture: './docs/architecture',
    context: './.agentflow/context.json',
  },

  // Agentes de foundation ativos
  foundation: {
    scaffold: true,
    stories: true,
    standards: true,
    architecture: true,
    contextSync: true,
    conventions: true,
    health: true,
    onboard: true,
  },

  // Etapas do runtime ativas
  runtime: {
    analyze: true,
    plan: true,
    execute: true,
    review: true,
    deploy: false, // desabilitado por padrão
  },

  // Convenções do projeto
  conventions: {
    language: 'typescript',
    framework: '',
    testPattern: '*.spec.ts',
    modulePattern: 'feature-based',
    namingConvention: 'kebab-case',
  },
};
```

---

## 🔑 Configurar API Key

Configure a chave de API via variável de ambiente:

```bash
# Linux/Mac
export ANTHROPIC_API_KEY=sk-...

# Windows PowerShell
$env:ANTHROPIC_API_KEY="sk-..."

# Windows CMD
set ANTHROPIC_API_KEY=sk-...
```

Ou adicione ao `.env` do projeto:

```
ANTHROPIC_API_KEY=sk-...
```

---

## 📦 Estrutura do Projeto

```
my-project/
├── src/                    ← código-fonte
├── docs/
│   ├── stories/           ← user stories
│   ├── adr/               ← architecture decision records
│   └── architecture/      ← padrões e standards
├── .agentflow/
│   ├── context.json       ← estado compartilhado (não commitar)
│   └── skills/            ← skills customizados
├── agentflow.config.js    ← configuração do agentflow
└── README.md              ← gerado pelo onboard
```

---

## 🛠️ Desenvolvimento

```bash
# Clonar
gh repo clone Gabrielloopes33/agentflow
cd agentflow

# Instalar dependências
npm install

# Testar
npm test

# Lint
npm run lint
```

---

## 📄 Licença

MIT © [Gabriel Lopes](https://github.com/Gabrielloopes33)

---

*Gerado com ❤️ usando agentflow*
