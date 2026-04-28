---
name: skill-creator
description: Create new skills, modify existing skills, and measure skill performance. Use when users want to create a skill from scratch, edit or optimize an existing skill, run evals, or benchmark skill performance. Trigger on skill creation, skill editing, or skill optimization requests.
---

# Skill Creator

Create and iteratively improve skills for the agentflow ecosystem.

## The Process

1. **Decide** what the skill should do and roughly how
2. **Write** a draft of the skill (SKILL.md)
3. **Test** with a few prompts and run evals
4. **Evaluate** results qualitatively and quantitatively
5. **Rewrite** based on feedback
6. **Repeat** until satisfied
7. **Expand** test set and try at larger scale

## Anatomy of a Skill

```
skill-name/
├── SKILL.md (required)
│   ├── YAML frontmatter (name, description required)
│   └── Markdown instructions
└── Bundled Resources (optional)
    ├── scripts/       — Helper scripts
    ├── references/    — Reference documents
    └── assets/        — Images, templates, etc.
```

## SKILL.md Structure

```yaml
---
name: skill-name
description: |
  What this skill does and when to use it.
  Include trigger phrases and contexts.
  Be slightly "pushy" to combat undertriggering.
---

# Skill Title

## When to Use

Specific trigger conditions...

## Input

What the skill needs...

## Output

What the skill produces...

## Process

Step-by-step instructions...

## Guidelines

Rules and best practices...
```

## Frontmatter Constraints

| Field | Required | Constraints |
|-------|----------|-------------|
| `name` | Yes | 1-64 chars, lowercase a-z, numbers, hyphens |
| `description` | Yes | 1-1024 chars, include trigger phrases |
| `license` | No | License name (default: MIT) |

## Description Best Practices

- Include what the skill does AND when to use it
- Add specific trigger phrases
- Be "pushy" to combat undertriggering:
  - ❌ "How to build dashboards..."
  - ✅ "How to build dashboards. Use this whenever the user mentions dashboards, data visualization, internal metrics, or wants to display any kind of company data, even if they don't explicitly ask for a 'dashboard.'"

## Testing

For objectively verifiable skills (file transforms, data extraction, code generation):
- Create test cases with expected outputs
- Run with-skill vs baseline comparison
- Measure accuracy and completeness

For subjective skills (writing style, art):
- Qualitative evaluation by human
- A/B testing with different versions

## Installation

Skills install to `.agentflow/skills/` following the Agent Skills specification.

```bash
# Create new skill
agentflow skill create <name>

# Validate skill
agentflow skill validate <path>

# Test skill
agentflow skill test <path>
```
