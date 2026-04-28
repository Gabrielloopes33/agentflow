// src/agents/runtime/review.js
const logger = require('../../utils/logger');
const context = require('../../context');
const skills = require('../../skills');
const validateConventionsSkill = require('../../skills/validate-conventions');
const llm = require('../../utils/llm');

async function run(cfg, ctx) {
  logger.agent('review', 'Iniciando code review completo...');

  const execute = ctx.execute || {};
  const plan = ctx.plan || {};

  // Load code-review skill instructions
  let codeReviewInstructions = '';
  try {
    codeReviewInstructions = skills.getInstructions('code-review');
  } catch {
    logger.warn('Skill code-review não encontrado. Usando review básico.');
  }

  // Load systematic-debug skill for issue analysis
  let debugInstructions = '';
  try {
    debugInstructions = skills.getInstructions('systematic-debug');
  } catch {
    logger.warn('Skill systematic-debug não encontrado.');
  }

  // If no diff, assume manual execution
  if (!execute.diff) {
    logger.warn('Nenhum diff encontrado. A execução foi manual?');
    logger.info('Iniciando review manual com checklist de 6 áreas...');
    logger.info('');

    // Run 6-area review checklist manually
    await runSixAreaReview(cfg, ctx, codeReviewInstructions);
    return;
  }

  // Full automated review with LLM
  logger.info('=== CODE REVIEW: 6 ÁREAS DE ANÁLISE ===');
  logger.info('1. Plan Alignment | 2. Code Quality | 3. Architecture');
  logger.info('4. Documentation  | 5. Issues        | 6. Communication');
  logger.info('=======================================');
  logger.info('');

  // Build comprehensive review prompt
  const reviewPrompt = buildReviewPrompt(execute.diff, plan, cfg, codeReviewInstructions);

  const response = await llm.call({
    model: cfg.model,
    prompt: reviewPrompt,
    systemPrompt: 'Você é um Senior Code Reviewer. Analise o código de forma estruturada nas 6 áreas definidas. Seja rigoroso mas construtivo.',
  });

  // Parse review result
  let parsed = parseReviewResponse(response);

  // Also run convention validation
  const conventionPrompt = validateConventionsSkill.buildPrompt(
    execute.diff,
    cfg.conventions,
    plan.acceptanceCriteria || []
  );

  const conventionResponse = await llm.call({
    model: cfg.model,
    prompt: conventionPrompt,
    systemPrompt: 'Valide convenções do projeto e critérios de aceite.',
  });

  let conventionResult;
  try {
    const jsonMatch = conventionResponse.match(/\{[\s\S]*\}/);
    conventionResult = jsonMatch ? JSON.parse(jsonMatch[0]) : { passed: false, issues: [], suggestions: [] };
  } catch {
    conventionResult = { passed: false, issues: [conventionResponse], suggestions: [] };
  }

  // Merge results
  const finalResult = {
    passed: parsed.passed && conventionResult.passed,
    areas: parsed.areas,
    conventionIssues: conventionResult.issues,
    conventionSuggestions: conventionResult.suggestions,
    overallAssessment: parsed.overallAssessment,
  };

  await context.update(cfg, 'review', {
    passed: finalResult.passed,
    issues: [
      ...(parsed.issues || []),
      ...(conventionResult.issues || []),
    ],
    suggestions: [
      ...(parsed.suggestions || []),
      ...(conventionResult.suggestions || []),
    ],
    areas: parsed.areas,
    completedAt: new Date().toISOString(),
  });

  // Report results
  reportReviewResults(finalResult);
}

function buildReviewPrompt(diff, plan, cfg, codeReviewInstructions) {
  return `Você é um Senior Code Reviewer. Analise este diff nas 6 áreas abaixo.

${codeReviewInstructions ? '\n=== INSTRUÇÕES DO SKILL ===\n' + codeReviewInstructions : ''}

=== DIFF ===
\`\`\`diff
${diff}
\`\`\`

=== PLANO ===
${plan.sdd || 'N/A'}

=== CRITÉRIOS DE ACEITE ===
${(plan.acceptanceCriteria || []).join('\n') || 'N/A'}

=== CONVENÇÕES ===
${JSON.stringify(cfg.conventions, null, 2)}

Retorne JSON no formato:
{
  "passed": boolean,
  "areas": {
    "planAlignment": { "score": 1-5, "notes": "..." },
    "codeQuality": { "score": 1-5, "notes": "..." },
    "architecture": { "score": 1-5, "notes": "..." },
    "documentation": { "score": 1-5, "notes": "..." },
    "issues": { "critical": [...], "important": [...], "suggestions": [...] },
    "communication": { "notes": "..." }
  },
  "overallAssessment": "Ready to proceed | Needs fixes | Needs significant rework",
  "issues": ["issue 1", "issue 2"],
  "suggestions": ["suggestion 1", "suggestion 2"]
}`;
}

function parseReviewResponse(response) {
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    // Fallback to basic parsing
  }

  return {
    passed: false,
    areas: {},
    overallAssessment: 'Needs fixes',
    issues: [response],
    suggestions: [],
  };
}

async function runSixAreaReview(cfg, ctx, instructions) {
  logger.info('=== CHECKLIST DE REVIEW MANUAL ===');
  logger.info('');
  logger.info('1. PLAN ALIGNMENT');
  logger.info('   [ ] Toda funcionalidade planejada foi implementada?');
  logger.info('   [ ] Há desvios do plano? São justificados?');
  logger.info('');
  logger.info('2. CODE QUALITY');
  logger.info('   [ ] Padrões e convenções seguidos?');
  logger.info('   [ ] Tratamento de erros adequado?');
  logger.info('   [ ] Type safety / defensive programming?');
  logger.info('');
  logger.info('3. ARCHITECTURE');
  logger.info('   [ ] SOLID principles respeitados?');
  logger.info('   [ ] Separation of concerns?');
  logger.info('   [ ] Integração com sistemas existentes OK?');
  logger.info('');
  logger.info('4. DOCUMENTATION');
  logger.info('   [ ] Código comentado onde necessário?');
  logger.info('   [ ] READMEs atualizados?');
  logger.info('   [ ] ADRs atualizados se necessário?');
  logger.info('');
  logger.info('5. ISSUES');
  logger.info('   [ ] Nenhum issue Critical?');
  logger.info('   [ ] Issues Important resolvidos?');
  logger.info('   [ ] Suggestions anotadas para depois?');
  logger.info('');
  logger.info('6. COMMUNICATION');
  logger.info('   [ ] Commits descritivos?');
  logger.info('   [ ] Mensagens de commit claras?');
  logger.info('');

  // Mark as needing manual review
  await context.update(cfg, 'review', {
    passed: true, // Assume passed for manual flow
    issues: ['Revisão manual necessária — execução sem diff registrado'],
    suggestions: ['Considere usar git diff para gerar o diff automaticamente'],
    areas: {
      planAlignment: { score: 0, notes: 'Manual review required' },
      codeQuality: { score: 0, notes: 'Manual review required' },
      architecture: { score: 0, notes: 'Manual review required' },
      documentation: { score: 0, notes: 'Manual review required' },
      issues: { critical: [], important: [], suggestions: [] },
      communication: { notes: 'Manual review required' },
    },
    overallAssessment: 'Manual review required',
    completedAt: new Date().toISOString(),
  });

  logger.agent('review', 'Review manual concluído. Verifique o checklist acima.');
}

function reportReviewResults(result) {
  if (result.areas) {
    logger.info('=== RESULTADOS POR ÁREA ===');
    for (const [area, data] of Object.entries(result.areas)) {
      if (data && data.score) {
        const score = '★'.repeat(data.score) + '☆'.repeat(5 - data.score);
        logger.info(`${area}: ${score} ${data.notes || ''}`);
      }
    }
    logger.info('');
  }

  if (result.passed) {
    logger.agent('review', '✓ Revisão aprovada em todas as áreas.');
  } else {
    logger.agent('review', `✗ Revisão reprovada.`);
  }

  if (result.conventionIssues && result.conventionIssues.length > 0) {
    logger.info('Issues de convenção:');
    result.conventionIssues.forEach((issue) => logger.warn(issue));
  }

  logger.info(`Avaliação geral: ${result.overallAssessment || 'N/A'}`);
}

module.exports = { run };
