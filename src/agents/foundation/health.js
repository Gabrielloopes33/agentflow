// src/agents/foundation/health.js
const fs = require('fs');
const path = require('path');
const logger = require('../../utils/logger');
const { readFile, writeJson, listDirs } = require('../../utils/fs');

async function run(cfg, options = {}) {
  logger.agent('health', 'Verificando saúde do projeto...');

  const srcPath = path.resolve(process.cwd(), cfg.paths.src);
  const report = {
    timestamp: new Date().toISOString(),
    modules: [],
    issues: [],
    overall: 'healthy',
  };

  if (!fs.existsSync(srcPath)) {
    report.issues.push('Diretório src/ não encontrado');
    report.overall = 'critical';
  } else {
    const modules = listDirs(srcPath);
    for (const mod of modules) {
      const modulePath = path.join(srcPath, mod);
      const readmePath = path.join(modulePath, 'README.md');
      const hasReadme = fs.existsSync(readmePath);
      const readmeContent = hasReadme ? readFile(readmePath) : '';

      const modReport = {
        name: mod,
        hasReadme,
        readmeHasHash: readmeContent.includes('<!-- hash:'),
        issues: [],
      };

      if (!hasReadme) {
        modReport.issues.push('README.md ausente');
        report.issues.push(`Módulo "${mod}" não tem README.md`);
      }

      if (hasReadme && !readmeContent.includes('<!-- hash:')) {
        modReport.issues.push('README.md não sincronizado (sem hash)');
      }

      report.modules.push(modReport);
    }
  }

  // Verifica se docs/ existe
  const docsPath = path.resolve(process.cwd(), cfg.paths.docs);
  if (!fs.existsSync(docsPath)) {
    report.issues.push('Diretório docs/ não encontrado');
  }

  if (report.issues.length > 0) {
    report.overall = report.issues.length > 3 ? 'critical' : 'warning';
  }

  writeJson(path.resolve(process.cwd(), '.agentflow/health-report.json'), report);

  logger.agent('health', `Saúde: ${report.overall} (${report.issues.length} issues)`);
  report.issues.forEach((issue) => logger.warn(issue));
}

module.exports = { run };
