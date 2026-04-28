// agentflow.config.js — gerado pelo agentflow init, editável pelo usuário
module.exports = {
  // Modelo a usar (o pacote chama via env var ou SDK configurado pelo usuário)
  model: process.env.AGENTFLOW_MODEL || 'claude-sonnet-4-5',

  // Diretórios do projeto
  paths: {
    src: './src',
    docs: './docs',
    stories: './docs/stories',
    adr: './docs/adr',
    architecture: './docs/architecture',
    context: './.agentflow/context.json',
  },

  // Quais agentes de foundation estão ativos
  foundation: {
    scaffold: true,
    stories: true,
    standards: true,
    architecture: true,
    contextSync: true,
    conventions: true,
    health: true,
    onboard: true,
  },

  // Quais etapas do runtime estão ativas
  runtime: {
    analyze: true,
    plan: true,
    execute: true,
    review: true,
    deploy: false, // desabilitado por padrão — requer configuração de CI
  },

  // Padrões e convenções do projeto (preenchidos pelo agente standards no init)
  conventions: {
    language: 'javascript',
    framework: '',           // ex: 'nextjs', 'express', 'nestjs'
    testPattern: '*.spec.js',
    modulePattern: 'feature-based', // 'feature-based' | 'layer-based'
    namingConvention: 'kebab-case', // para arquivos e pastas
  },
};
