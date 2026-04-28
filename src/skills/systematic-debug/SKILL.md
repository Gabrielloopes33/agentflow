---
name: systematic-debug
description: Debug any bug, test failure, or unexpected behavior using a systematic 4-phase approach. Use when encountering errors, before proposing fixes, or when previous fixes failed. Trigger on test failures, runtime errors, or integration issues.
---

# Systematic Debugging

## Overview

Random fixes waste time and create new bugs. Quick patches mask underlying issues.

**Core principle:** ALWAYS find root cause before attempting fixes. Symptom fixes are failure.

## The Iron Law

```
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
```

## The Four Phases

You MUST complete each phase before proceeding to the next.

### Phase 1: Root Cause Investigation

**BEFORE attempting ANY fix:**

1. **Read Error Messages Carefully**
   - Don't skip past errors or warnings
   - Read stack traces completely
   - Note line numbers, file paths, error codes

2. **Reproduce Consistently**
   - Can you trigger it reliably?
   - What are the exact steps?
   - Does it happen every time?

3. **Check Recent Changes**
   - What changed that could cause this?
   - Git diff, recent commits
   - New dependencies, config changes

4. **Trace Data Flow**
   - Where does bad value originate?
   - What called this with bad value?
   - Keep tracing up until you find the source
   - Fix at source, not at symptom

### Phase 2: Pattern Analysis

**Find the pattern before fixing:**

1. **Find Working Examples** — Locate similar working code
2. **Compare Against References** — Read reference implementations completely
3. **Identify Differences** — List every difference, however small
4. **Understand Dependencies** — What does this need to work?

### Phase 3: Hypothesis and Testing

**Scientific method:**

1. **Form Single Hypothesis** — "I think X is the root cause because Y"
2. **Test Minimally** — SMALLEST possible change, one variable at a time
3. **Verify Before Continuing** — Did it work? Yes → Phase 4. No → NEW hypothesis

### Phase 4: Implementation

**Fix the root cause, not the symptom:**

1. **Create Failing Test Case** — Simplest reproduction, automated if possible
2. **Implement Single Fix** — ONE change at a time, no "while I'm here"
3. **Verify Fix** — Test passes? No other tests broken? Issue resolved?
4. **If 3+ Fixes Failed** — STOP. Question the architecture. Discuss with human.

## Red Flags — STOP and Follow Process

- "Quick fix for now, investigate later"
- "Just try changing X and see if it works"
- "Skip the test, I'll manually verify"
- "One more fix attempt" (after 2+ failures)
- Each fix reveals new problem in different place

## Quick Reference

| Phase | Key Activities | Success Criteria |
|-------|---------------|------------------|
| **1. Root Cause** | Read errors, reproduce, check changes | Understand WHAT and WHY |
| **2. Pattern** | Find working examples, compare | Identify differences |
| **3. Hypothesis** | Form theory, test minimally | Confirmed or new hypothesis |
| **4. Implementation** | Create test, fix, verify | Bug resolved, tests pass |
