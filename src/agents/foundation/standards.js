// src/agents/foundation/standards.js
const fs = require('fs');
const path = require('path');
const logger = require('../../utils/logger');
const { writeFile, readJson } = require('../../utils/fs');

async function run(cfg) {
  logger.agent('standards', 'Detectando stack e convenções...');

  const packageJson = readJson(path.resolve(process.cwd(), 'package.json'));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

  // Inferir framework
  let framework = '';
  if (deps.next) framework = 'nextjs';
  else if (deps.react) framework = 'react';
  else if (deps.express) framework = 'express';
  else if (deps['@nestjs/core']) framework = 'nestjs';
  else if (deps.vue) framework = 'vue';
  else if (deps.angular) framework = 'angular';

  // Inferir linguagem
  let language = 'javascript';
  let testPattern = '*.spec.js';
  if (deps.typescript || packageJson.devDependencies?.typescript) {
    language = 'typescript';
    testPattern = '*.spec.ts';
  }

  // Atualiza config
  cfg.conventions = {
    ...cfg.conventions,
    language,
    framework,
    testPattern,
  };

  // Salva agentflow.config.js atualizado
  const configPath = path.resolve(process.cwd(), 'agentflow.config.js');
  const configTemplate = require('fs').readFileSync(path.join(__dirname, '../../../templates/agentflow.config.js'), 'utf-8');

  const updatedConfig = configTemplate
    .replace("framework: '',", `framework: '${framework}',`)
    .replace("language: 'typescript'", `language: '${language}'`)
    .replace("*.spec.ts", testPattern);

  writeFile(configPath, updatedConfig);

  // Gera standards.md
  const standardsMd = `# Padrões e Convenções

## Stack

- **Linguagem:** ${language}
- **Framework:** ${framework || 'nenhum detectado'}
- **Runtime:** Node.js

## Convenções

- **Padrão de módulos:** ${cfg.conventions.modulePattern}
- **Naming:** ${cfg.conventions.namingConvention}
- **Testes:** ${testPattern}

## Dependências principais

${Object.keys(deps || {}).slice(0, 15).map((d) => `- ${d}`).join('\n')}

---
*Gerado automaticamente pelo agentflow*
`;

  writeFile(path.resolve(process.cwd(), cfg.paths.architecture, 'standards.md'), standardsMd);

  logger.agent('standards', `Convenções detectadas: ${language} + ${framework || 'vanilla'}`);
}

module.exports = { run };
