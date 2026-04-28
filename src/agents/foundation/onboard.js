// src/agents/foundation/onboard.js
const fs = require('fs');
const path = require('path');
const logger = require('../../utils/logger');
const { readJson, writeFile, listDirs } = require('../../utils/fs');

async function run(cfg) {
  logger.agent('onboard', 'Gerando README.md raiz...');

  const packageJson = readJson(path.resolve(process.cwd(), 'package.json'));
  const projectName = packageJson.name || 'Projeto';
  const projectDesc = packageJson.description || '';

  const srcPath = path.resolve(process.cwd(), cfg.paths.src);
  const modules = fs.existsSync(srcPath) ? listDirs(srcPath) : [];

  const moduleList = modules.length > 0
    ? modules.map((m) => `- \`${m}\` — veja [src/${m}/README.md](./src/${m}/README.md)`).join('\n')
    : '- *(nenhum módulo encontrado)*';

  const readme = `# ${projectName}

${projectDesc}

## Stack

- **Linguagem:** ${cfg.conventions.language}
- **Framework:** ${cfg.conventions.framework || 'nenhum'}
- **Runtime:** Node.js

## Estrutura

\`\`\`
${cfg.paths.src}/         ← código-fonte
${cfg.paths.docs}/        ← documentação
${cfg.paths.stories}/     ← user stories
${cfg.paths.adr}/         ← decisões arquiteturais
.agentflow/               ← estado do agentflow (não commitar)
\`\`\`

## Módulos

${moduleList}

## Como rodar localmente

\`\`\`bash
npm install
npm start
\`\`\`

## Usando o agentflow

\`\`\`bash
# Inicializar (roda uma vez)
npx agentflow init

# Rodar fluxo de feature
npx agentflow run

# Sincronizar docs
npx agentflow sync

# Verificar convenções
npx agentflow check
\`\`\`

## Documentação

- [Stories](./${cfg.paths.stories}/README.md)
- [ADRs](./${cfg.paths.adr}/README.md)
- [Padrões](./${cfg.paths.architecture}/standards.md)

---
*Gerado com [agentflow](https://www.npmjs.com/package/agentflow)*
`;

  writeFile(path.resolve(process.cwd(), 'README.md'), readme);
  logger.agent('onboard', 'README.md raiz gerado.');
}

module.exports = { run };
