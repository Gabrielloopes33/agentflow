// src/agents/runtime/execute.js
const logger = require('../../utils/logger');
const context = require('../../context');
const skills = require('../../skills');

async function run(cfg, ctx) {
  logger.agent('execute', 'Preparando execução com subagent-driven development...');

  const plan = ctx.plan || {};
  const tasks = plan.tasks || [];

  if (tasks.length === 0) {
    logger.warn('Nenhuma task encontrada no plano. Execute o plan agent primeiro.');
    logger.info('Para gerar um plano: npx agentflow run --from plan');
    return;
  }

  // Load TDD enforcer skill instructions
  let tddInstructions = '';
  try {
    tddInstructions = skills.getInstructions('tdd-enforcer');
  } catch {
    logger.warn('Skill tdd-enforcer não encontrado. Executando sem enforce de TDD.');
  }

  // Load subagent-driven skill instructions
  let subagentInstructions = '';
  try {
    subagentInstructions = skills.getInstructions('subagent-driven');
  } catch {
    logger.warn('Skill subagent-driven não encontrado. Executando em modo básico.');
  }

  logger.info('=== MODO DE EXECUÇÃO: Subagent-Driven Development ===');
  logger.info(`Feature: ${ctx.currentFeature?.title || 'N/A'}`);
  logger.info(`Total de tasks: ${tasks.length}`);
  logger.info(`SDD: ${plan.sdd ? 'Disponível' : 'N/A'}`);
  logger.info('');

  // Prepare execution context
  const executionContext = {
    feature: ctx.currentFeature,
    plan: plan,
    tasks: tasks,
    conventions: cfg.conventions,
    model: cfg.model,
    tddInstructions,
    subagentInstructions,
  };

  // Log execution context for the subagent
  logger.info('Contexto preparado para execução:');
  logger.info(`- Tasks: ${tasks.map((t, i) => `${i + 1}. ${t}`).join(', ')}`);
  logger.info(`- Convenções: ${JSON.stringify(cfg.conventions)}`);
  logger.info('');

  // For now, we prepare the handoff context
  // In a full implementation, this would dispatch actual subagents
  logger.info('Instruções para o agente de execução:');
  logger.info('1. Ler o SDD em docs/stories/');
  logger.info('2. Executar tasks uma a uma com TDD');
  logger.info('3. Aplicar review em 2 estágios após cada task');
  logger.info('4. Commitar com mensagens descritivas');
  logger.info('');

  if (tddInstructions) {
    logger.info('=== TDD ENFORCER ATIVO ===');
    logger.info('NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST');
    logger.info('==========================');
  }

  if (subagentInstructions) {
    logger.info('=== SUBAGENT-DRIVEN ATIVO ===');
    logger.info('Fresh subagent per task + two-stage review');
    logger.info('=============================');
  }

  logger.info('');
  logger.info('Para continuar após execução manual:');
  logger.info('  npx agentflow run --from review');

  // Track execution state
  await context.update(cfg, 'execute', {
    filesChanged: [],
    diff: '',
    tasksTotal: tasks.length,
    tasksCompleted: 0,
    mode: 'subagent-driven',
    tddEnforced: !!tddInstructions,
    note: 'Execução preparada para subagent-driven com TDD. Execute manualmente e retome com --from review.',
  });

  logger.agent('execute', 'Handoff preparado. Modo subagent-driven + TDD ativado.');
}

module.exports = { run };
