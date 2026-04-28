# agentflow

Orquestrador de agentes de IA para fluxos de desenvolvimento

## Stack

- **Linguagem:** javascript
- **Framework:** nenhum
- **Runtime:** Node.js

## Estrutura

```
./src/         ← código-fonte
./docs/        ← documentação
./docs/stories/     ← user stories
./docs/adr/         ← decisões arquiteturais
.agentflow/               ← estado do agentflow (não commitar)
```

## Módulos

- `agents` — veja [src/agents/README.md](./src/agents/README.md)
- `skills` — veja [src/skills/README.md](./src/skills/README.md)
- `utils` — veja [src/utils/README.md](./src/utils/README.md)

## Como rodar localmente

```bash
npm install
npm start
```

## Usando o agentflow

```bash
# Inicializar (roda uma vez)
npx agentflow init

# Rodar fluxo de feature
npx agentflow run

# Sincronizar docs
npx agentflow sync

# Verificar convenções
npx agentflow check
```

## Documentação

- [Stories](././docs/stories/README.md)
- [ADRs](././docs/adr/README.md)
- [Padrões](././docs/architecture/standards.md)

---
*Gerado com [agentflow](https://www.npmjs.com/package/agentflow)*
