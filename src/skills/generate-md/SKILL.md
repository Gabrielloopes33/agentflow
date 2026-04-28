---
name: generate-md
description: Generate markdown documentation from analysis data. Use when creating READMEs, specs, ADRs, stories, or any project documentation. Trigger on documentation generation, sync operations, or when converting analysis into written docs.
---

# Generate Markdown Documentation

Convert structured analysis into well-formatted markdown documents.

## When to Use

- `agentflow sync` — regenerate module READMEs
- `agentflow init` — create initial documentation
- Plan agent — generate SDD and specs
- Stories agent — create user story documents

## Input

- Analysis data (from read-project or read-module)
- Template to follow
- Target document type

## Output

Well-formatted markdown document following the provided template.

## Process

1. Receive analysis data
2. Select appropriate template
3. Fill template sections with analysis
4. Add cross-references (ADRs, stories, other modules)
5. Include last-sync timestamp and content hash

## Templates Available

- `module-readme.md` — Module documentation
- `story.md` — User story format
- `adr.md` — Architecture Decision Record
- `sdd.md` — Software Design Document

## Guidelines

- Be concise and objective
- Write for an AI that will work on this without additional context
- Include explicit boundaries (what does NOT belong)
- Add cross-references to related docs
- Always include sync timestamp and content hash for tracking
