// src/config.js
const path = require('path');
const fs = require('fs');

const DEFAULTS = {
  model: process.env.AGENTFLOW_MODEL || 'claude-sonnet-4-5',
  paths: {
    src: './src',
    docs: './docs',
    stories: './docs/stories',
    adr: './docs/adr',
    architecture: './docs/architecture',
    context: './.agentflow/context.json',
  },
  foundation: {
    scaffold: true, stories: true, standards: true, architecture: true,
    contextSync: true, conventions: true, health: true, onboard: true,
  },
  runtime: {
    analyze: true, plan: true, execute: true, review: true, deploy: false,
  },
  conventions: {
    language: 'typescript',
    framework: '',
    testPattern: '*.spec.ts',
    modulePattern: 'feature-based',
    namingConvention: 'kebab-case',
  },
};

function load() {
  const configPath = path.resolve(process.cwd(), 'agentflow.config.js');
  if (!fs.existsSync(configPath)) return DEFAULTS;
  const userConfig = require(configPath);
  return deepMerge(DEFAULTS, userConfig);
}

function deepMerge(base, override) {
  const result = { ...base };
  for (const key of Object.keys(override)) {
    if (typeof override[key] === 'object' && !Array.isArray(override[key])) {
      result[key] = deepMerge(base[key] || {}, override[key]);
    } else {
      result[key] = override[key];
    }
  }
  return result;
}

module.exports = { load };
