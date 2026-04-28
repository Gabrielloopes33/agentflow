// src/agents/foundation/scaffold.js
const fs = require('fs');
const path = require('path');
const logger = require('../../utils/logger');
const { ensureDir, writeFile } = require('../../utils/fs');

async function run(cfg) {
  logger.agent('scaffold', 'Criando estrutura de pastas...');

  const dirs = [
    cfg.paths.src,
    cfg.paths.docs,
    cfg.paths.stories,
    cfg.paths.adr,
    cfg.paths.architecture,
    path.dirname(cfg.paths.context),
  ];

  for (const dir of dirs) {
    ensureDir(path.resolve(process.cwd(), dir));
  }

  // Adiciona .agentflow/ ao .gitignore se não existir
  const gitignorePath = path.resolve(process.cwd(), '.gitignore');
  let gitignore = '';
  if (fs.existsSync(gitignorePath)) {
    gitignore = fs.readFileSync(gitignorePath, 'utf-8');
  }
  if (!gitignore.includes('.agentflow/')) {
    const append = gitignore.endsWith('\n') ? '' : '\n';
    fs.writeFileSync(gitignorePath, gitignore + append + '.agentflow/\n', 'utf-8');
    logger.agent('scaffold', 'Adicionado .agentflow/ ao .gitignore');
  }

  // Cria README.md vazio em cada módulo de src/ se não existir
  const srcPath = path.resolve(process.cwd(), cfg.paths.src);
  if (fs.existsSync(srcPath)) {
    const modules = fs.readdirSync(srcPath).filter((name) => {
      return fs.statSync(path.join(srcPath, name)).isDirectory();
    });
    for (const mod of modules) {
      const readmePath = path.join(srcPath, mod, 'README.md');
      if (!fs.existsSync(readmePath)) {
        writeFile(readmePath, `# ${mod}\n\n<!-- Descrição do módulo -->\n`);
      }
    }
  }

  logger.agent('scaffold', 'Estrutura criada.');
}

module.exports = { run };
