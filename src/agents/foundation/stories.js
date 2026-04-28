// src/agents/foundation/stories.js
const path = require('path');
const logger = require('../../utils/logger');
const { writeFile, readFile } = require('../../utils/fs');

async function run(cfg) {
  logger.agent('stories', 'Criando documentação de stories...');

  const storiesDir = path.resolve(process.cwd(), cfg.paths.stories);
  const storyTemplate = readFile(path.join(__dirname, '../../../templates/story.md'));

  const readmeContent = `# Stories

Este diretório contém as user stories do projeto.

## Padrão

Cada story segue o template definido em [story-template.md](./story-template.md).

## Exemplo

Veja [example-story.md](./example-story.md) para um exemplo preenchido.
`;

  writeFile(path.join(storiesDir, 'README.md'), readmeContent);
  writeFile(path.join(storiesDir, 'story-template.md'), storyTemplate);

  // Cria example-story.md preenchido
  const example = storyTemplate
    .replace('[Título]', 'Exemplo: Autenticação de usuário')
    .replace('STORY-XXX', 'STORY-001')
    .replace('draft | in-progress | done', 'done')
    .replace('[data]', new Date().toISOString().split('T')[0])
    .replace('Como [persona], quero [ação], para que [benefício].', 'Como usuário, quero fazer login com email e senha, para que eu acesse minha conta de forma segura.');

  writeFile(path.join(storiesDir, 'example-story.md'), example);

  logger.agent('stories', 'Documentação de stories criada.');
}

module.exports = { run };
