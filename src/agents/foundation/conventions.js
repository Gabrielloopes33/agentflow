// src/agents/foundation/conventions.js
const fs = require('fs');
const path = require('path');
const logger = require('../../utils/logger');
const { listDirs, listFiles } = require('../../utils/fs');

function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

function checkNaming(name, convention) {
  if (convention === 'kebab-case') {
    return name === toKebabCase(name);
  }
  if (convention === 'camelCase') {
    return /^[a-z][a-zA-Z0-9]*$/.test(name);
  }
  if (convention === 'PascalCase') {
    return /^[A-Z][a-zA-Z0-9]*$/.test(name);
  }
  return true;
}

async function run(cfg, options = {}) {
  logger.agent('conventions', 'Verificando convenções...');

  const srcPath = path.resolve(process.cwd(), cfg.paths.src);
  if (!fs.existsSync(srcPath)) {
    logger.warn('Diretório src/ não encontrado.');
    return;
  }

  const issues = [];
  const convention = cfg.conventions.namingConvention;

  // Verifica nomes de pastas
  const dirs = listDirs(srcPath);
  for (const dir of dirs) {
    if (!checkNaming(dir, convention)) {
      issues.push(`Pasta "${dir}" não segue ${convention}`);
      if (options.fix) {
        const newName = toKebabCase(dir);
        if (newName !== dir) {
          fs.renameSync(path.join(srcPath, dir), path.join(srcPath, newName));
          logger.agent('conventions', `Renomeado: ${dir} → ${newName}`);
        }
      }
    }
  }

  // Verifica nomes de arquivos
  for (const dir of dirs) {
    const files = listFiles(path.join(srcPath, dir));
    for (const file of files) {
      const baseName = path.basename(file, path.extname(file));
      if (!checkNaming(baseName, convention) && baseName !== 'README') {
        issues.push(`Arquivo "${file}" em "${dir}" não segue ${convention}`);
      }
    }
  }

  // Verifica padrão de módulos
  if (cfg.conventions.modulePattern === 'feature-based') {
    // Cada pasta em src/ deve ser uma feature
    // Não há verificação estrita aqui, apenas log
  }

  if (issues.length > 0) {
    issues.forEach((issue) => logger.warn(issue));
  } else {
    logger.agent('conventions', 'Todas as convenções estão sendo seguidas.');
  }
}

module.exports = { run };
