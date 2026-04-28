---
name: read-module
description: Analyze a specific module's responsibility, dependencies, patterns, and boundaries. Use when examining a single module, generating module documentation, or determining if code belongs in a module. Trigger on module analysis, README generation, or code organization tasks.
---

# Read Module

Deep-dive analysis of a single module within the project.

## When to Use

- During `agentflow sync` to update module READMEs
- When planning features that affect specific modules
- To verify module boundaries and responsibilities
- Before refactoring or extending a module

## Input

- Module path
- List of files in the module
- Existing README.md (if any)
- Module code content

## Output

Structured analysis:
- **responsibility**: What this module does (1 paragraph, max 3 lines)
- **internalDependencies**: Other project modules it uses
- **externalDependencies**: NPM packages it depends on
- **patterns**: Specific conventions used in this module
- **antiPatterns**: What should NOT go in this module
- **stories**: Related user stories
- **adrs**: Related architecture decisions

## Process

1. List all files in the module
2. Read existing README for context
3. Analyze imports/exports to map dependencies
4. Identify the module's single responsibility
5. Detect patterns specific to this module
6. Explicitly define what does NOT belong here

## Guidelines

- Be explicit about boundaries — what belongs elsewhere
- Note any violations of the module's responsibility
- Identify test coverage gaps
- Flag outdated documentation
