// src/agents/runtime/analyze.js
const fs = require('fs');
const path = require('path');
const logger = require('../../utils/logger');
const context = require('../../context');
const skills = require('../../skills');
const { readJson, listDirs } = require('../../utils/fs');
const readProjectSkill = require('../../skills/read-project');
const llm = require('../../utils/llm');

async function run(cfg, ctx) {
  logger.agent('analyze', 'Analisando projeto e feature...');

  const packageJson = readJson(path.resolve(process.cwd(), 'package.json'));
  const srcPath = path.resolve(process.cwd(), cfg.paths.src);

  // Load systematic-debug skill for issue detection
  let debugInstructions = '';
  try {
    debugInstructions = skills.getInstructions('systematic-debug');
  } catch {
    logger.warn('Skill systematic-debug não encontrado.');
  }

  // Monta árvore do projeto
  let projectTree = '';
  if (fs.existsSync(srcPath)) {
    const dirs = listDirs(srcPath);
    projectTree = dirs.map((d) => `src/${d}/`).join('\n');
  }

  const prompt = readProjectSkill.buildPrompt(projectTree, packageJson, cfg.conventions);

  // Build analysis prompt with systematic debugging context
  const analysisPrompt = `${prompt}

${debugInstructions ? '\n=== SISTEMA DE DETECÇÃO DE ISSUES ===\nUse as 4 fases do systematic debugging para identificar potenciais problemas:\n1. Root Cause Investigation\n2. Pattern Analysis\n3. Hypothesis and Testing\n4. Implementation Risks\n' : ''}

Analise o projeto e retorne JSON no formato:
{
  "summary": "resumo da arquitetura",
  "modulesAffected": ["modulo1", "modulo2"],
  "dependencies": ["dep1", "dep2"],
  "risks": ["risco1", "risco2"],
  "issues": [
    { "severity": "high|medium|low", "description": "...", "module": "..." }
  ],
  "recommendations": ["recomendação1", "recomendação2"]
}`;

  const analysis = await llm.call({
    model: cfg.model,
    prompt: analysisPrompt,
    systemPrompt: 'Você é um arquiteto de software. Analise o projeto identificando módulos, dependências, riscos e potenciais issues. Seja proativo na identificação de problemas.',
  });

  // Tenta parsear JSON da resposta
  let parsed;
  try {
    const jsonMatch = analysis.match(/\{[\s\S]*\}/);
    parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
  } catch {
    parsed = { 
      summary: analysis, 
      modulesAffected: [], 
      dependencies: [], 
      risks: [],
      issues: [],
      recommendations: [],
    };
  }

  // Log issues found with systematic debugging approach
  if (parsed.issues && parsed.issues.length > 0) {
    logger.info('=== ISSUES DETECTADOS ===');
    for (const issue of parsed.issues) {
      const icon = issue.severity === 'high' ? '🔴' : issue.severity === 'medium' ? '🟡' : '🟢';
      logger.warn(`${icon} [${issue.severity.toUpperCase()}] ${issue.description}`);
      if (issue.module) {
        logger.warn(`   Módulo: ${issue.module}`);
      }
    }
    logger.info('');
  }

  // Log recommendations
  if (parsed.recommendations && parsed.recommendations.length > 0) {
    logger.info('=== RECOMENDAÇÕES ===');
    for (const rec of parsed.recommendations) {
      logger.info(`💡 ${rec}`);
    }
    logger.info('');
  }

  await context.update(cfg, 'analyze', {
    summary: parsed.summary || '',
    modulesAffected: parsed.modulesAffected || [],
    dependencies: parsed.dependencies || [],
    risks: parsed.risks || [],
    issues: parsed.issues || [],
    recommendations: parsed.recommendations || [],
  });

  logger.agent('analyze', `Análise concluída. Módulos afetados: ${(parsed.modulesAffected || []).join(', ') || 'nenhum'}`);
  
  if (parsed.issues && parsed.issues.length > 0) {
    const highIssues = parsed.issues.filter((i) => i.severity === 'high').length;
    const medIssues = parsed.issues.filter((i) => i.severity === 'medium').length;
    logger.warn(`Issues encontrados: ${highIssues} high, ${medIssues} medium, ${parsed.issues.length - highIssues - medIssues} low`);
  }
}

module.exports = { run };
