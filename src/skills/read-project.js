// src/skills/read-project.js
// Constrói prompt de leitura completa do projeto
function buildPrompt(projectTree, packageJson, conventions) {
  return `Você está analisando um projeto com a seguinte estrutura:
\`\`\`
${projectTree}
\`\`\`
package.json resumido:
${JSON.stringify(packageJson, null, 2)}

Convenções configuradas:
${JSON.stringify(conventions, null, 2)}

Faça uma análise da arquitetura atual, identificando módulos principais, responsabilidades e padrões em uso.`;
}
module.exports = { buildPrompt };
