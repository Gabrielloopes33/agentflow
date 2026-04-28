// src/agents/runtime/plan.js
const fs = require('fs');
const path = require('path');
const logger = require('../../utils/logger');
const context = require('../../context');
const skills = require('../../skills');
const { writeFile } = require('../../utils/fs');
const llm = require('../../utils/llm');

async function run(cfg, ctx) {
  logger.agent('plan', 'Gerando plano com doc-coauthoring workflow...');

  const analyze = ctx.analyze || {};
  const feature = ctx.currentFeature || {};

  // Load doc-coauthor skill for structured document creation
  let docCoauthorInstructions = '';
  try {
    docCoauthorInstructions = skills.getInstructions('doc-coauthor');
  } catch {
    logger.warn('Skill doc-coauthor não encontrado. Usando modo básico.');
  }

  // Load plan-writer skill for implementation plan format
  let planWriterInstructions = '';
  try {
    planWriterInstructions = skills.getInstructions('plan-writer');
  } catch {
    logger.warn('Skill plan-writer não encontrado. Usando formato básico.');
  }

  // Load brainstorm skill for design exploration
  let brainstormInstructions = '';
  try {
    brainstormInstructions = skills.getInstructions('brainstorm');
  } catch {
    logger.warn('Skill brainstorm não encontrado.');
  }

  logger.info('=== DOC CO-AUTHORING: Stage 1 - Context Gathering ===');
  logger.info(`Feature: ${feature.title || 'Não especificada'}`);
  logger.info(`Descrição: ${feature.description || 'Não especificada'}`);
  logger.info(`Módulos afetados: ${(analyze.modulesAffected || []).join(', ') || 'N/A'}`);
  logger.info('');

  const prompt = `Com base na análise do projeto, gere um SDD (Software Design Document) e um plano de execução completo.

${docCoauthorInstructions ? '\n=== DOC CO-AUTHORING GUIDELINES ===\n' + docCoauthorInstructions : ''}

${planWriterInstructions ? '\n=== PLAN WRITER FORMAT ===\n' + planWriterInstructions : ''}

${brainstormInstructions ? '\n=== BRAINSTORM GUIDELINES ===\n' + brainstormInstructions : ''}

**Feature:** ${feature.title || 'Não especificada'}
**Descrição:** ${feature.description || 'Não especificada'}

**Análise prévia:**
- Resumo: ${analyze.summary || 'N/A'}
- Módulos afetados: ${(analyze.modulesAffected || []).join(', ') || 'N/A'}
- Dependências: ${(analyze.dependencies || []).join(', ') || 'N/A'}
- Riscos: ${(analyze.risks || []).join(', ') || 'N/A'}
- Issues detectados: ${(analyze.issues || []).map((i) => `[${i.severity}] ${i.description}`).join('; ') || 'N/A'}
- Recomendações: ${(analyze.recommendations || []).join(', ') || 'N/A'}

**Convenções do projeto:**
${JSON.stringify(cfg.conventions, null, 2)}

Retorne JSON no formato:
{
  "sdd": "texto completo do SDD com seções: Contexto, Objetivos, Arquitetura, Componentes, Data Flow, Error Handling, Testing",
  "tasks": [
    {
      "name": "Nome da Task",
      "files": {
        "create": ["path/to/file.js"],
        "modify": ["path/to/existing.js"],
        "test": ["path/to/test.js"]
      },
      "steps": [
        "Step 1: Descrição",
        "Step 2: Descrição"
      ]
    }
  ],
  "acceptanceCriteria": ["critério 1", "critério 2"],
  "designDecisions": [
    { "decision": "...", "rationale": "..." }
  ]
}`;

  const response = await llm.call({
    model: cfg.model,
    prompt,
    systemPrompt: 'Você é um tech lead experiente. Gere SDDs claros e planos de execução concretos com tasks de 2-5 minutos cada. Siga o formato de plan writer com header obrigatório.',
  });

  let parsed;
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
  } catch {
    parsed = { sdd: response, tasks: [], acceptanceCriteria: [], designDecisions: [] };
  }

  // Save SDD as file
  const storyId = feature.title
    ? feature.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    : 'feature';
  const sddPath = path.resolve(process.cwd(), cfg.paths.stories, `${storyId}-sdd.md`);

  const sddContent = generateSddDocument(feature, parsed, cfg);
  writeFile(sddPath, sddContent);

  // Save implementation plan
  const planPath = path.resolve(process.cwd(), cfg.paths.stories, `${storyId}-plan.md`);
  const planContent = generatePlanDocument(feature, parsed, cfg);
  writeFile(planPath, planContent);

  await context.update(cfg, 'plan', {
    sdd: parsed.sdd || '',
    tasks: parsed.tasks || [],
    acceptanceCriteria: parsed.acceptanceCriteria || [],
    designDecisions: parsed.designDecisions || [],
    sddPath,
    planPath,
  });

  logger.agent('plan', `Plano gerado. ${(parsed.tasks || []).length} tasks, ${(parsed.acceptanceCriteria || []).length} critérios de aceite.`);
  logger.info(`SDD salvo em: ${sddPath}`);
  logger.info(`Plano salvo em: ${planPath}`);

  if (parsed.designDecisions && parsed.designDecisions.length > 0) {
    logger.info('Decisões de design:');
    for (const dd of parsed.designDecisions) {
      logger.info(`  • ${dd.decision} — ${dd.rationale}`);
    }
  }
}

function generateSddDocument(feature, parsed, cfg) {
  return `# SDD: ${feature.title || 'Feature'}

**Status:** Draft  
**Criado em:** ${new Date().toISOString().split('T')[0]}  
**Feature:** ${feature.title || 'N/A'}

## Contexto

${feature.description || 'N/A'}

## Objetivos

${(parsed.acceptanceCriteria || []).map((c) => `- ${c}`).join('\n') || 'N/A'}

## Arquitetura

${parsed.sdd || 'N/A'}

## Decisões de Design

${(parsed.designDecisions || []).map((d) => `- **${d.decision}**: ${d.rationale}`).join('\n') || 'N/A'}

## Critérios de Aceite

${(parsed.acceptanceCriteria || []).map((c) => `- [ ] ${c}`).join('\n') || 'N/A'}

## Módulos Afetados

${(parsed.modulesAffected || []).map((m) => `- \`${m}\``).join('\n') || 'N/A'}

---
*Gerado pelo agentflow plan agent*
`;
}

function generatePlanDocument(feature, parsed, cfg) {
  const tasks = parsed.tasks || [];

  let tasksSection = '';
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    tasksSection += `### Task ${i + 1}: ${task.name}\n\n`;
    tasksSection += `**Files:**\n`;
    if (task.files?.create) {
      tasksSection += `- Create: ${task.files.create.join(', ')}\n`;
    }
    if (task.files?.modify) {
      tasksSection += `- Modify: ${task.files.modify.join(', ')}\n`;
    }
    if (task.files?.test) {
      tasksSection += `- Test: ${task.files.test.join(', ')}\n`;
    }
    tasksSection += `\n`;
    if (task.steps) {
      for (const step of task.steps) {
        tasksSection += `- [ ] ${step}\n`;
      }
    }
    tasksSection += `\n`;
  }

  return `# ${feature.title || 'Feature'} Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven (recommended) or executing-plans to implement this plan task-by-task. Steps use checkbox (\`- [ ]\`) syntax for tracking.

**Goal:** ${feature.description || 'Implement feature'}

**Architecture:** ${parsed.sdd ? parsed.sdd.substring(0, 200) + '...' : 'See SDD'}

**Tech Stack:** ${cfg.conventions.language || 'javascript'} ${cfg.conventions.framework || ''}

---

${tasksSection}

---
*Gerado pelo agentflow plan agent*
`;
}

module.exports = { run };
