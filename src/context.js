// src/context.js
const fs = require('fs');
const path = require('path');

function getContextPath(cfg) {
  return path.resolve(process.cwd(), cfg.paths.context);
}

async function init(cfg) {
  const contextPath = getContextPath(cfg);
  const dir = path.dirname(contextPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const initial = {
    version: '1.0.0',
    project: { name: '', description: '', stack: [], entryPoints: [] },
    currentFeature: { title: '', description: '', startedAt: '' },
    pipeline: { lastStep: '', completedSteps: [], status: 'idle' },
    analyze: {}, plan: {}, execute: {}, review: {},
  };

  fs.writeFileSync(contextPath, JSON.stringify(initial, null, 2));
}

async function load(cfg) {
  const contextPath = getContextPath(cfg);
  if (!fs.existsSync(contextPath)) {
    throw new Error('context.json não encontrado. Rode: npx agentflow init');
  }
  return JSON.parse(fs.readFileSync(contextPath, 'utf-8'));
}

async function save(cfg, ctx) {
  fs.writeFileSync(getContextPath(cfg), JSON.stringify(ctx, null, 2));
}

async function setStep(cfg, step) {
  const ctx = await load(cfg);
  ctx.pipeline.lastStep = step;
  ctx.pipeline.status = 'running';
  await save(cfg, ctx);
  return ctx;
}

async function completeStep(cfg, step) {
  const ctx = await load(cfg);
  if (!ctx.pipeline.completedSteps.includes(step)) {
    ctx.pipeline.completedSteps.push(step);
  }
  ctx.pipeline.status = 'idle';
  await save(cfg, ctx);
}

async function update(cfg, stepKey, data) {
  const ctx = await load(cfg);
  ctx[stepKey] = { ...ctx[stepKey], ...data, completedAt: new Date().toISOString() };
  await save(cfg, ctx);
}

module.exports = { init, load, save, setStep, completeStep, update };
