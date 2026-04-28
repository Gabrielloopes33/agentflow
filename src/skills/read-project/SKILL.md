---
name: read-project
description: Analyze project structure, identify modules, dependencies, and architectural patterns. Use when exploring a codebase, understanding project layout, or preparing for feature implementation. Trigger on project analysis, codebase exploration, or architecture review tasks.
---

# Read Project

Analyze the complete project structure to build context for agent operations.

## When to Use

- Before implementing any feature (to understand the codebase)
- During `agentflow init` to map the project
- When the `analyze` agent runs to identify affected modules
- Before writing plans or specs

## Input

- Project directory tree
- package.json (or equivalent)
- Existing conventions configuration

## Output

Returns a structured analysis containing:
- **modules**: List of modules with responsibilities
- **dependencies**: Internal and external dependencies
- **patterns**: Architectural patterns in use
- **entryPoints**: Main entry points of the application
- **risks**: Potential risks for new features

## Process

1. Scan directory structure
2. Read package.json for dependencies and scripts
3. Identify module boundaries (folders in src/)
4. Map internal dependencies between modules
5. Detect patterns (feature-based, layer-based, etc.)
6. Identify potential risks for new features

## Guidelines

- Focus on module-level analysis, not file-level
- Identify coupling between modules
- Note any architectural anti-patterns
- Flag modules that lack documentation
