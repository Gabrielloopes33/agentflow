---
name: brainstorm
description: Turn ideas into fully formed designs and specs through collaborative dialogue. Use before any creative work — creating features, building components, adding functionality, or modifying behavior. Trigger on feature requests, new ideas, or when starting any implementation work.
---

# Brainstorming Ideas Into Designs

Help turn ideas into fully formed designs and specs through natural collaborative dialogue.

## HARD-GATE

Do NOT invoke any implementation skill, write any code, scaffold any project, or take any implementation action until you have presented a design and the user has approved it.

## Checklist

Complete in order:

1. **Explore project context** — check files, docs, recent commits
2. **Ask clarifying questions** — one at a time, understand purpose/constraints/success criteria
3. **Propose 2-3 approaches** — with trade-offs and your recommendation
4. **Present design** — in sections scaled to complexity, get approval after each
5. **Write design doc** — save to `docs/stories/YYYY-MM-DD-<topic>-design.md`
6. **Spec self-review** — check for placeholders, contradictions, ambiguity, scope
7. **User reviews written spec** — ask user to review before proceeding
8. **Transition to implementation** — invoke plan-writer skill

## The Process

### Understanding the Idea

- Check current project state first
- If request describes multiple independent subsystems, flag for decomposition
- Ask questions one at a time
- Focus on: purpose, constraints, success criteria

### Exploring Approaches

- Propose 2-3 different approaches with trade-offs
- Present options conversationally with recommendation and reasoning
- Lead with your recommended option

### Presenting the Design

- Scale each section to complexity
- Ask after each section whether it looks right
- Cover: architecture, components, data flow, error handling, testing

### Design for Isolation and Clarity

- Break system into smaller units with one clear purpose
- Well-defined interfaces between units
- Can someone understand a unit without reading its internals?
- Can you change internals without breaking consumers?

### Working in Existing Codebases

- Explore current structure before proposing changes
- Follow existing patterns
- Include targeted improvements for code that affects the work
- Don't propose unrelated refactoring

## Key Principles

- **One question at a time**
- **Multiple choice preferred**
- **YAGNI ruthlessly** — Remove unnecessary features
- **Explore alternatives** — Always propose 2-3 approaches
- **Incremental validation** — Present, get approval, then move on
