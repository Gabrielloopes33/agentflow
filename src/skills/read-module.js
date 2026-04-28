// src/skills/read-module.js
// Constrói prompt de análise de um módulo específico
function buildPrompt(modulePath, moduleFiles, existingReadme) {
  return `Analise o módulo em ${modulePath}.
Arquivos presentes:
${moduleFiles.join('\n')}

README.md atual (pode estar desatualizado):
${existingReadme || '(não existe)'}

Descreva: responsabilidade do módulo, dependências internas/externas, padrões específicos, o que NÃO deve ir nesse módulo.`;
}
module.exports = { buildPrompt };
