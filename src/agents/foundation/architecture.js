// src/agents/foundation/architecture.js
const path = require('path');
const logger = require('../../utils/logger');
const { writeFile, readFile } = require('../../utils/fs');

async function run(cfg) {
  logger.agent('architecture', 'Criando documentação de ADRs...');

  const adrDir = path.resolve(process.cwd(), cfg.paths.adr);
  const adrTemplate = readFile(path.join(__dirname, '../../../templates/adr.md'));

  const readmeContent = `# Architecture Decision Records (ADRs)

Este diretório contém os registros de decisões arquiteturais do projeto.

## Formato

Cada ADR segue o template em [adr-template.md](./adr-template.md).
`;

  writeFile(path.join(adrDir, 'README.md'), readmeContent);
  writeFile(path.join(adrDir, 'adr-template.md'), adrTemplate);

  // Cria ADR-001 inicial
  const adr001 = adrTemplate
    .replace('ADR-XXX', 'ADR-001')
    .replace('[Título da Decisão]', 'Decisões Iniciais do Projeto')
    .replace('[data]', new Date().toISOString().split('T')[0])
    .replace('proposed | accepted | deprecated | superseded', 'accepted')
    .replace('## Contexto\n<!-- Qual problema ou situação motivou essa decisão? -->',
      `## Contexto\nInicialização do projeto. Definição de stack, estrutura de módulos e padrões.`)
    .replace('## Decisão\n<!-- O que foi decidido? -->',
      `## Decisão\n- Stack: ${cfg.conventions.language} + ${cfg.conventions.framework || 'vanilla'}\n- Estrutura de módulos: ${cfg.conventions.modulePattern}\n- Uso do agentflow para orquestração de agentes de IA`);

  writeFile(path.join(adrDir, 'adr-001-initial-decisions.md'), adr001);

  logger.agent('architecture', 'ADRs criados.');
}

module.exports = { run };
