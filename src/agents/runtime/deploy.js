// src/agents/runtime/deploy.js
const path = require('path');
const { execSync } = require('child_process');
const logger = require('../../utils/logger');

async function run(cfg, ctx) {
  logger.agent('deploy', 'Verificando condições para deploy...');

  const review = ctx.review || {};

  if (!review.passed) {
    logger.error('Revisão não aprovada. Deploy cancelado.');
    logger.info('Corrija os issues e rode: npx agentflow run --from review');
    return;
  }

  logger.info('Deploy habilitado. Verificando scripts de CI...');

  // Verifica se há scripts de deploy no package.json
  try {
    const packageJson = require(path.resolve(process.cwd(), 'package.json'));
    const scripts = packageJson.scripts || {};

    if (scripts.deploy) {
      logger.agent('deploy', 'Executando npm run deploy...');
      execSync('npm run deploy', { stdio: 'inherit', cwd: process.cwd() });
    } else {
      logger.warn('Nenhum script "deploy" encontrado no package.json.');
      logger.info('Adicione um script "deploy" ou configure CI manualmente.');
    }
  } catch (err) {
    logger.error(`Erro no deploy: ${err.message}`);
  }
}

module.exports = { run };
