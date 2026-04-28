// src/skills/validate-conventions.js
// Constrói prompt de validação de convenções
function buildPrompt(diff, conventions, acceptanceCriteria) {
  return `Analise este diff:
\`\`\`diff
${diff}
\`\`\`

Convenções do projeto:
${JSON.stringify(conventions, null, 2)}

Critérios de aceite da feature:
${acceptanceCriteria.join('\n')}

Identifique: violações de convenção, critérios não atendidos, sugestões de melhoria.
Retorne JSON: { "passed": boolean, "issues": string[], "suggestions": string[] }`;
}
module.exports = { buildPrompt };
