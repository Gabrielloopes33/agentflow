---
name: subagent-driven
description: Execute implementation plans by dispatching fresh subagents per task with two-stage review. Use when implementing multi-step plans with independent tasks. Trigger after writing-plans produces a plan, or when executing complex features.
---

# Subagent-Driven Development

Execute plans by dispatching fresh subagents per task, with two-stage review after each.

## Core Principle

Fresh subagent per task + two-stage review (spec then quality) = high quality, fast iteration

## When to Use

- Have a written implementation plan
- Tasks are mostly independent
- Staying in the same session

## The Process

### Per Task Loop:

1. **Dispatch implementer subagent**
   - Provide full task text + context
   - Subagent asks questions if needed
   - Subagent implements, tests, commits, self-reviews

2. **Dispatch spec reviewer subagent**
   - Confirms code matches spec
   - If issues: implementer fixes, re-review

3. **Dispatch code quality reviewer subagent**
   - Reviews code quality, patterns, tests
   - If issues: implementer fixes, re-review

4. **Mark task complete**

### After All Tasks:

5. **Dispatch final code reviewer** for entire implementation
6. **Use finishing-a-development-branch** to complete

## Model Selection

| Task Type | Model |
|-----------|-------|
| Mechanical (1-2 files, clear spec) | Fast/cheap model |
| Integration (multi-file, coordination) | Standard model |
| Architecture/design/review | Most capable model |

## Implementer Status Handling

| Status | Action |
|--------|--------|
| **DONE** | Proceed to spec review |
| **DONE_WITH_CONCERNS** | Read concerns, address if needed, then review |
| **NEEDS_CONTEXT** | Provide missing context, re-dispatch |
| **BLOCKED** | Assess: context? model? task size? plan wrong? Escalate if needed |

## Red Flags — Never

- Skip reviews (spec OR quality)
- Proceed with unfixed issues
- Dispatch multiple implementers in parallel
- Make subagent read plan file (provide full text)
- Start code quality review before spec compliance ✅
- Move to next task while review has open issues

## Integration

**Required skills:**
- `writing-plans` — Creates the plan this executes
- `tdd-enforcer` — Subagents follow TDD
- `code-review` — Template for reviewer subagents
