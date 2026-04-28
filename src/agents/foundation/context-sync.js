// src/agents/foundation/context-sync.js
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const logger = require('../../utils/logger');
const { readFile, writeFile, listDirs, listFiles } = require('../../utils/fs');
const readModuleSkill = require('../../skills/read-module');
const generateMdSkill = require('../../skills/generate-md');
const llm = require('../../utils/llm');

async function run(cfg, options = {}) {
  logger.agent('context-sync', 'Sincronizando README.md dos módulos...');

  const srcPath = path.resolve(process.cwd(), cfg.paths.src);
  if (!fs.existsSync(srcPath)) {
    logger.warn('Diretório src/ não encontrado. Pulando sync.');
    return;
  }

  const modules = options.module
    ? [options.module]
    : listDirs(srcPath);

  const moduleTemplate = readFile(path.join(__dirname, '../../../templates/module-readme.md'));

  for (const mod of modules) {
    const modulePath = path.join(srcPath, mod);
    if (!fs.existsSync(modulePath)) {
      logger.warn(`Módulo não encontrado: ${mod}`);
      continue;
    }

    const files = listFiles(modulePath);
    const readmePath = path.join(modulePath, 'README.md');
    const existingReadme = readFile(readmePath);

    // Calcula hash do conteúdo dos arquivos para detectar mudanças
    const codeContent = files
      .filter((f) => f !== 'README.md')
      .map((f) => readFile(path.join(modulePath, f)))
      .join('\n');
    const currentHash = crypto.createHash('md5').update(codeContent).digest('hex');

    // Verifica hash salvo no README
    const hashMatch = existingReadme.match(/<!-- hash: ([a-f0-9]+) -->/);
    const savedHash = hashMatch ? hashMatch[1] : null;

    if (savedHash === currentHash) {
      logger.agent('context-sync', `Módulo ${mod} está atualizado.`);
      continue;
    }

    logger.agent('context-sync', `Atualizando README.md de ${mod}...`);

    // Usa LLM para gerar README atualizado
    const prompt = readModuleSkill.buildPrompt(modulePath, files, existingReadme);
    const analysis = await llm.call({
      model: cfg.model,
      prompt,
      systemPrompt: 'Você é um assistente técnico que analisa código e descreve módulos de forma clara e objetiva.',
    });

    const generatePrompt = generateMdSkill.buildPrompt(analysis, moduleTemplate);
    const newReadme = await llm.call({
      model: cfg.model,
      prompt: generatePrompt,
      systemPrompt: 'Gere um README.md técnico conciso e útil para desenvolvedores e IAs.',
    });

    // Adiciona hash e data
    const finalReadme = newReadme.replace(
      '*Última sincronização: [data]*',
      `*Última sincronização: ${new Date().toISOString().split('T')[0]}*\n<!-- hash: ${currentHash} -->`
    );

    writeFile(readmePath, finalReadme);
    logger.agent('context-sync', `README.md de ${mod} atualizado.`);
  }
}

module.exports = { run };
