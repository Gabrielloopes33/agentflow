// src/orchestrator.js

const fs = require('fs');
const path = require('path');
const config = require('./config');
const context = require('./context');
const logger = require('./utils/logger');
const skills = require('./skills');

// Agentes runtime
const analyze = require('./agents/runtime/analyze');
const plan = require('./agents/runtime/plan');
const execute = require('./agents/runtime/execute');
const review = require('./agents/runtime/review');
const deploy = require('./agents/runtime/deploy');

// Agentes foundation
const scaffold = require('./agents/foundation/scaffold');
const stories = require('./agents/foundation/stories');
const standards = require('./agents/foundation/standards');
const architecture = require('./agents/foundation/architecture');
const contextSync = require('./agents/foundation/context-sync');
const conventions = require('./agents/foundation/conventions');
const health = require('./agents/foundation/health');
const onboard = require('./agents/foundation/onboard');

const RUNTIME_STEPS = ['analyze', 'plan', 'execute', 'review', 'deploy'];

const RUNTIME_AGENTS = { analyze, plan, execute, review, deploy };

async function init(options = {}) {
  logger.info('Iniciando agentflow no projeto...');
  const cfg = config.load();
  await context.init(cfg);

  const agents = [
    cfg.foundation.scaffold && !options.skipScaffold && scaffold,
    cfg.foundation.stories && stories,
    cfg.foundation.standards && standards,
    cfg.foundation.architecture && architecture,
    !options.skipOnboard && cfg.foundation.onboard && onboard,
  ].filter(Boolean);

  for (const agent of agents) {
    await agent.run(cfg);
  }

  logger.success('Projeto inicializado. Edite agentflow.config.js para ajustar configurações.');
}

async function run(options = {}) {
  const cfg = config.load();
  const ctx = await context.load(cfg);

  const startIndex = options.from
    ? RUNTIME_STEPS.indexOf(options.from)
    : 0;

  if (startIndex === -1) {
    logger.error(`Etapa inválida: ${options.from}. Use: ${RUNTIME_STEPS.join(', ')}`);
    process.exit(1);
  }

  const stepsToRun = options.only
    ? [options.only]
    : RUNTIME_STEPS.slice(startIndex);

  for (const step of stepsToRun) {
    if (!cfg.runtime[step]) {
      logger.warn(`Etapa '${step}' desabilitada na config. Pulando.`);
      continue;
    }

    logger.info(`Executando: ${step}`);
    await context.setStep(cfg, step);

    try {
      await RUNTIME_AGENTS[step].run(cfg, ctx);
      await context.completeStep(cfg, step);
    } catch (err) {
      logger.error(`Falha na etapa '${step}': ${err.message}`);
      logger.info(`Para retomar: npx agentflow run --from ${step}`);
      process.exit(1);
    }
  }

  logger.success('Fluxo concluído.');
}

async function sync(options = {}) {
  const cfg = config.load();
  logger.info('Sincronizando README.md dos módulos...');
  await contextSync.run(cfg, { module: options.module });
  logger.success('Sync concluído.');
}

async function check(options = {}) {
  const cfg = config.load();
  logger.info('Verificando convenções e saúde do projeto...');
  await conventions.run(cfg, { fix: options.fix });
  await health.run(cfg, { fix: options.fix });
  logger.success('Check concluído.');
}

// Skill management
async function skillCreate(name) {
  logger.info(`Criando skill: ${name}...`);

  // Validate name
  if (!/^[a-z0-9-]{1,64}$/.test(name)) {
    logger.error(`Nome inválido: "${name}". Use apenas a-z, 0-9, hífens. Máx 64 chars.`);
    process.exit(1);
  }

  const skillDir = path.resolve(process.cwd(), '.agentflow', 'skills', name);

  if (fs.existsSync(skillDir)) {
    logger.error(`Skill "${name}" já existe em ${skillDir}`);
    process.exit(1);
  }

  fs.mkdirSync(skillDir, { recursive: true });

  const skillTemplate = `---
name: ${name}
description: |
  Descreva o que este skill faz e quando usá-lo.
  Inclua frases de trigger específicas.
  Seja "pushy" para combater undertriggering.
---

# ${name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ')}

## When to Use

Quando usar este skill...

## Input

O que o skill precisa...

## Output

O que o skill produz...

## Process

Passo a passo...

## Guidelines

Regras e melhores práticas...
`;

  fs.writeFileSync(path.join(skillDir, 'SKILL.md'), skillTemplate);

  logger.success(`Skill "${name}" criado em ${skillDir}`);
  logger.info('Edite o SKILL.md e adicione scripts/references/assets se necessário.');
}

async function skillList() {
  logger.info('Skills disponíveis:');
  logger.info('');

  const allSkills = skills.list();

  // Built-in skills
  logger.info('=== Built-in ===');
  for (const skill of allSkills) {
    const isBuiltin = skill.path.includes('node_modules') || skill.path.includes('src/skills');
    if (isBuiltin) {
      logger.info(`  ${skill.name} — ${skill.description.substring(0, 60)}...`);
    }
  }

  // Project skills
  const projectSkills = allSkills.filter((s) => s.path.includes('.agentflow/skills'));
  if (projectSkills.length > 0) {
    logger.info('');
    logger.info('=== Projeto ===');
    for (const skill of projectSkills) {
      logger.info(`  ${skill.name} — ${skill.description.substring(0, 60)}...`);
    }
  }

  logger.info('');
  logger.info(`Total: ${allSkills.length} skills`);
}

async function skillValidate(skillPath) {
  logger.info(`Validando skill: ${skillPath}...`);

  try {
    const fullPath = path.resolve(skillPath);
    const skill = skills.parseSkill(fullPath);

    logger.success(`Skill válido: ${skill.name}`);
    logger.info(`  Descrição: ${skill.description.substring(0, 80)}...`);
    logger.info(`  Licença: ${skill.license}`);
    logger.info(`  Instruções: ${skill.instructions.length} chars`);
  } catch (err) {
    logger.error(`Validação falhou: ${err.message}`);
    process.exit(1);
  }
}

async function skillShow(name) {
  try {
    const skill = skills.load(name);

    logger.info(`=== ${skill.name} ===`);
    logger.info(`Descrição: ${skill.description}`);
    logger.info(`Licença: ${skill.license}`);
    logger.info(`Caminho: ${skill.path}`);
    logger.info('');
    logger.info('=== Instruções ===');
    logger.info(skill.instructions.substring(0, 500) + (skill.instructions.length > 500 ? '...' : ''));
  } catch (err) {
    logger.error(`Skill não encontrado: ${err.message}`);
    process.exit(1);
  }
}

// Release management
async function release(options = {}) {
  logger.info('Gerando changelog...');

  const { execSync } = require('child_process');

  try {
    // Get commit range
    const since = options.since || execSync('git describe --tags --abbrev=0', { encoding: 'utf-8' }).trim();
    const to = options.to || 'HEAD';

    logger.info(`Range: ${since}..${to}`);

    // Get commits
    const commits = execSync(
      `git log ${since}..${to} --pretty=format:"%h %s" --no-merges`,
      { encoding: 'utf-8' }
    );

    if (!commits.trim()) {
      logger.warn('Nenhum commit encontrado no range especificado.');
      return;
    }

    // Load changelog skill
    let changelogInstructions = '';
    try {
      changelogInstructions = skills.getInstructions('generate-changelog');
    } catch {
      logger.warn('Skill generate-changelog não encontrado. Usando formato básico.');
    }

    // Use LLM to categorize and format
    const llm = require('./utils/llm');
    const cfg = config.load();

    const prompt = `${changelogInstructions ? changelogInstructions + '\n\n' : ''}
Analise estes commits e gere um changelog:

${commits}

Gere um changelog em formato markdown com as categorias:
- ✨ New Features
- 🔧 Improvements  
- 🐛 Fixes
- ⚠️ Breaking Changes
- 🔒 Security`;

    const changelog = await llm.call({
      model: cfg.model,
      prompt,
      systemPrompt: 'Você é um technical writer. Transforme commits técnicos em changelogs amigáveis para usuários.',
    });

    // Save changelog
    const changelogPath = path.resolve(process.cwd(), 'CHANGELOG.md');
    const existing = fs.existsSync(changelogPath) ? fs.readFileSync(changelogPath, 'utf-8') : '';
    const newEntry = `## [${new Date().toISOString().split('T')[0]}]\n\n${changelog}\n\n`;

    fs.writeFileSync(changelogPath, newEntry + existing);

    logger.success(`Changelog gerado e salvo em ${changelogPath}`);
  } catch (err) {
    logger.error(`Erro ao gerar changelog: ${err.message}`);
    logger.info('Certifique-se de estar em um repositório git com commits.');
  }
}

module.exports = { init, run, sync, check, skillCreate, skillList, skillValidate, skillShow, release };
