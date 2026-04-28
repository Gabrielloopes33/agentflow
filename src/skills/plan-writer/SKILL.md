---
name: plan-writer
description: Write comprehensive implementation plans before touching code. Use when you have a spec or requirements for a multi-step task. Trigger after brainstorming produces a design, or when user requests implementation of a feature.
---

# Writing Plans

Write comprehensive implementation plans assuming the engineer has zero context for our codebase and questionable taste.

## Overview

Document everything needed: which files to touch, code, testing, docs, how to test it. Bite-sized tasks. DRY. YAGNI. TDD. Frequent commits.

## Plan Document Header

Every plan MUST start with:

```markdown
# [Feature Name] Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven (recommended) or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** [One sentence describing what this builds]

**Architecture:** [2-3 sentences about approach]

**Tech Stack:** [Key technologies/libraries]

---
```

## Bite-Sized Task Granularity

**Each step is one action (2-5 minutes):**
- "Write the failing test" — step
- "Run it to make sure it fails" — step
- "Implement the minimal code to make the test pass" — step
- "Run the tests and make sure they pass" — step
- "Commit" — step

## Task Structure

```markdown
### Task N: [Component Name]

**Files:**
- Create: `exact/path/to/file.js`
- Modify: `exact/path/to/existing.js:123-145`
- Test: `tests/exact/path/to/test.js`

- [ ] **Step 1: Write the failing test**

```javascript
def test_specific_behavior():
    result = function(input)
    assert result == expected
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test path/to/test.js`
Expected: FAIL with "function not defined"

- [ ] **Step 3: Write minimal implementation**

```javascript
function function(input) {
    return expected;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test path/to/test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/path/test.js src/path/file.js
git commit -m "feat: add specific feature"
```
```

## No Placeholders

Every step must contain actual content. These are plan failures:
- "TBD", "TODO", "implement later", "fill in details"
- "Add appropriate error handling" / "add validation"
- "Write tests for the above" (without actual test code)
- "Similar to Task N" (repeat the code)
- Steps describing what to do without showing how

## Self-Review

After writing the plan:
1. **Spec coverage** — Can you point to a task for each spec requirement?
2. **Placeholder scan** — Search for red flags from "No Placeholders"
3. **Type consistency** — Do signatures match across tasks?

## Execution Handoff

After saving the plan, offer:
1. **Subagent-Driven (recommended)** — Fresh subagent per task, review between tasks
2. **Inline Execution** — Execute in this session with checkpoints
