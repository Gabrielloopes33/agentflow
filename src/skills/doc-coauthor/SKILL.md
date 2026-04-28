---
name: doc-coauthor
description: Guide users through structured collaborative document creation. Use when writing documentation, specs, ADRs, proposals, or any structured content. Trigger on writing docs, creating specs, drafting proposals, or RFC tasks.
---

# Doc Co-Authoring Workflow

Structured workflow for collaborative document creation.

## When to Offer This Workflow

**Trigger conditions:**
- User mentions writing documentation: "write a doc", "draft a proposal", "create a spec"
- User mentions specific doc types: "PRD", "design doc", "decision doc", "RFC"
- Starting a substantial writing task

## The Three Stages

### Stage 1: Context Gathering

**Goal:** Close the gap between what the user knows and what the agent knows.

**Initial Questions:**
1. What type of document is this?
2. Who's the primary audience?
3. What's the desired impact when someone reads this?
4. Is there a template or specific format to follow?
5. Any other constraints or context to know?

**Info Dumping:**
- Background on the project/problem
- Related discussions or documents
- Why alternative solutions aren't being used
- Timeline pressures or constraints
- Technical architecture or dependencies

### Stage 2: Refinement & Structure

**Goal:** Iteratively build each section through brainstorming and editing.

- Build outline based on context
- Draft each section collaboratively
- Iterate based on feedback
- Ensure consistency across sections

### Stage 3: Reader Testing

**Goal:** Test the doc with a fresh agent (no context) to catch blind spots.

- Give the document to a fresh subagent
- Ask it to explain what the document says
- Identify gaps, ambiguities, or unclear sections
- Fix issues before finalizing

## Output

- Well-structured document following the chosen template
- Cross-references to related docs
- Clear, concise language suitable for the target audience
- Validated through Reader Testing

## Guidelines

- Write for the target audience's level of expertise
- Be explicit about decisions and trade-offs
- Include examples where helpful
- Cross-reference related documents
- Test with a fresh reader before considering done
