// src/skills/generate-md.js
// Constrói prompt de geração de README.md de módulo
function buildPrompt(analysis, template) {
  return `Com base nessa análise de módulo:
${analysis}

Gere um README.md seguindo este template:
${template}

O README deve ser conciso, objetivo e útil para uma IA que vai trabalhar nesse módulo sem contexto adicional.`;
}
module.exports = { buildPrompt };
