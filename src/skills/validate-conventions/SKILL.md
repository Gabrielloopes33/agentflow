---
name: validate-conventions
description: Validate code and project structure against configured conventions. Use when checking code quality, reviewing diffs, or verifying consistency between docs and code. Trigger on agentflow check, code review, or before merge.
---

# Validate Conventions

Check that code and project structure follow established conventions.

## When to Use

- `agentflow check` command
- Review agent — validate diffs against conventions
- Before merging features
- During `agentflow sync` to detect drift

## Input

- Diff or code to validate
- Convention configuration (from agentflow.config.js)
- Acceptance criteria (for feature validation)

## Output

Structured validation result:
```json
{
  "passed": boolean,
  "issues": ["violation 1", "violation 2"],
  "suggestions": ["improvement 1", "improvement 2"]
}
```

## Checks Performed

1. **Naming conventions** — kebab-case, camelCase, PascalCase
2. **Module structure** — feature-based vs layer-based
3. **Test location** — co-located or separate
4. **File organization** — imports, exports, barrel files
5. **Documentation** — README exists and is current
6. **Acceptance criteria** — feature meets defined criteria

## Guidelines

- Distinguish between violations (must fix) and suggestions (nice to have)
- With `--fix` flag, auto-correct what is safe to change
- Never rename files without explicit user confirmation
- Report issues with specific file paths and line numbers
