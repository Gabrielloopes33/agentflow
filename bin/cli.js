#!/usr/bin/env node
// bin/cli.js

const { Command } = require('commander');
const { version } = require('../package.json');
const orchestrator = require('../src/orchestrator');

const program = new Command();

program
  .name('agentflow')
  .description('Orquestrador de agentes de IA para desenvolvimento')
  .version(version);

program
  .command('init')
  .description('Inicializa o agentflow no projeto (roda uma vez)')
  .option('--skip-scaffold', 'Não criar estrutura de pastas')
  .option('--skip-onboard', 'Não gerar README raiz')
  .action((options) => orchestrator.init(options));

program
  .command('run')
  .description('Executa o fluxo completo de uma feature')
  .option('--from <step>', 'Retomar de uma etapa: analyze|plan|execute|review|deploy')
  .option('--only <step>', 'Rodar somente uma etapa específica')
  .action((options) => orchestrator.run(options));

program
  .command('sync')
  .description('Atualiza os README.md dos módulos com base no código atual')
  .option('--module <path>', 'Sincronizar apenas um módulo específico')
  .action((options) => orchestrator.sync(options));

program
  .command('check')
  .description('Verifica convenções e consistência entre docs e código')
  .option('--fix', 'Tentar corrigir automaticamente o que for possível')
  .action((options) => orchestrator.check(options));

// Skill management commands
const skillCmd = program
  .command('skill')
  .description('Gerencia skills do agentflow');

skillCmd
  .command('create <name>')
  .description('Cria um novo skill')
  .action((name) => orchestrator.skillCreate(name));

skillCmd
  .command('list')
  .description('Lista todos os skills disponíveis')
  .action(() => orchestrator.skillList());

skillCmd
  .command('validate <path>')
  .description('Valida um skill')
  .action((skillPath) => orchestrator.skillValidate(skillPath));

skillCmd
  .command('show <name>')
  .description('Mostra detalhes de um skill')
  .action((name) => orchestrator.skillShow(name));

program
  .command('release')
  .description('Gera changelog e release notes')
  .option('--since <tag>', 'Gerar desde uma tag específica')
  .option('--to <tag>', 'Gerar até uma tag específica')
  .action((options) => orchestrator.release(options));

program.parse();
