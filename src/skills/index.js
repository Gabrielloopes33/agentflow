// src/skills/index.js
// Skill registry and loader for agentflow

const fs = require('fs');
const path = require('path');

// Built-in skills
const BUILT_IN_SKILLS = [
  'read-project',
  'read-module',
  'generate-md',
  'validate-conventions',
  'tdd-enforcer',
  'systematic-debug',
  'doc-coauthor',
  'generate-changelog',
  'subagent-driven',
  'code-review',
  'plan-writer',
  'brainstorm',
  'skill-creator',
  'mcp-builder',
  'webapp-testing',
  'ui-ux-design',
];

/**
 * Load a skill by name. Searches in this order:
 * 1. Built-in skills (src/skills/)
 * 2. Project skills (.agentflow/skills/)
 * 3. Global skills (~/.agentflow/skills/)
 */
function load(skillName) {
  const searchPaths = [
    path.join(__dirname, skillName, 'SKILL.md'),
    path.resolve(process.cwd(), '.agentflow', 'skills', skillName, 'SKILL.md'),
    path.resolve(require('os').homedir(), '.agentflow', 'skills', skillName, 'SKILL.md'),
  ];

  for (const skillPath of searchPaths) {
    if (fs.existsSync(skillPath)) {
      return parseSkill(skillPath);
    }
  }

  throw new Error(`Skill "${skillName}" not found. Searched: ${searchPaths.join(', ')}`);
}

/**
 * Parse a SKILL.md file into structured data
 */
function parseSkill(skillPath) {
  const content = fs.readFileSync(skillPath, 'utf-8');

  // Parse YAML frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!frontmatterMatch) {
    throw new Error(`Invalid SKILL.md format: ${skillPath} — missing YAML frontmatter`);
  }

  const yamlContent = frontmatterMatch[1];
  const markdownContent = frontmatterMatch[2].trim();

  // Simple YAML parser (sufficient for skill frontmatter)
  const frontmatter = {};
  for (const line of yamlContent.split('\n')) {
    const match = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (match) {
      const [, key, value] = match;
      frontmatter[key] = value.replace(/^["']|["']$/g, '').trim();
    }
  }

  // Validate required fields
  if (!frontmatter.name) {
    throw new Error(`Skill missing required field "name": ${skillPath}`);
  }
  if (!frontmatter.description) {
    throw new Error(`Skill missing required field "description": ${skillPath}`);
  }

  // Validate name constraints
  if (!/^[a-z0-9-]{1,64}$/.test(frontmatter.name)) {
    throw new Error(
      `Skill name "${frontmatter.name}" invalid. Must be 1-64 chars, lowercase a-z, numbers, hyphens only.`
    );
  }

  // Validate description constraints
  if (frontmatter.description.length > 1024) {
    throw new Error(
      `Skill description too long (${frontmatter.description.length} chars). Max 1024.`
    );
  }

  return {
    name: frontmatter.name,
    description: frontmatter.description,
    license: frontmatter.license || 'MIT',
    metadata: frontmatter.metadata || {},
    instructions: markdownContent,
    path: skillPath,
    dir: path.dirname(skillPath),
  };
}

/**
 * List all available skills
 */
function list() {
  const skills = [];

  // Built-in skills
  for (const name of BUILT_IN_SKILLS) {
    try {
      skills.push(load(name));
    } catch {
      // Skip if skill file doesn't exist yet
    }
  }

  // Project skills
  const projectSkillsDir = path.resolve(process.cwd(), '.agentflow', 'skills');
  if (fs.existsSync(projectSkillsDir)) {
    for (const dir of fs.readdirSync(projectSkillsDir)) {
      const skillPath = path.join(projectSkillsDir, dir, 'SKILL.md');
      if (fs.existsSync(skillPath)) {
        try {
          skills.push(parseSkill(skillPath));
        } catch {
          // Skip invalid skills
        }
      }
    }
  }

  return skills;
}

/**
 * Get skill instructions for use in prompts
 */
function getInstructions(skillName) {
  const skill = load(skillName);
  return skill.instructions;
}

/**
 * Build a prompt that includes relevant skills
 */
function buildPrompt(skillNames, context = {}) {
  const sections = [];

  for (const name of skillNames) {
    try {
      const skill = load(name);
      sections.push(`# ${skill.name}\n\n${skill.instructions}`);
    } catch (err) {
      sections.push(`# ${name}\n\n[Skill not found: ${err.message}]`);
    }
  }

  if (context.task) {
    sections.push(`\n# Task\n\n${context.task}`);
  }

  return sections.join('\n\n---\n\n');
}

module.exports = {
  load,
  parseSkill,
  list,
  getInstructions,
  buildPrompt,
  BUILT_IN_SKILLS,
};
