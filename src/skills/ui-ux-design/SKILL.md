---
name: ui-ux-design
description: Apply professional UI/UX design principles to agent-generated interfaces. Use when creating or reviewing UI components, designing user flows, or ensuring visual quality. Trigger on UI creation, component design, layout decisions, or visual review tasks.
---

# UI/UX Design

Apply professional design principles to avoid "AI slop" and create distinctive, high-quality interfaces.

## When to Use

- Generating UI components or pages
- Reviewing visual design of generated code
- Choosing typography, colors, or layouts
- Designing user flows and interactions

## Anti-Patterns to Avoid

### Typography
- ❌ Inter (overused default)
- ❌ System fonts for everything
- ✅ Choose distinctive, appropriate fonts for the brand

### Colors
- ❌ Purple-to-blue gradients (AI cliché)
- ❌ Random bright accent colors
- ✅ Purposeful color systems with meaning

### Layouts
- ❌ Centered hero + 3 feature cards (template fatigue)
- ❌ Generic dashboard grids
- ✅ Asymmetric, editorial, or context-appropriate layouts

### Spacing
- ❌ Excessive padding everywhere
- ❌ No visual hierarchy through spacing
- ✅ Intentional density variation

## Design Principles

### 1. Purposeful Distinction
Every design choice should have a reason. If you can't explain why you chose a color, font, or layout, reconsider it.

### 2. Context Appropriateness
Match the design to the content and audience:
- Developer tools → Clean, functional, dense
- Creative portfolios → Expressive, bold, experimental
- SaaS dashboards → Organized, scannable, professional

### 3. Hierarchy Through Contrast
Use contrast (size, weight, color, space) to guide attention:
- One primary action per view
- Clear information hierarchy
- Visual resting points

### 4. Consistency with Personality
Be consistent within a project, but distinctive from generic AI output:
- Define 2-3 "personality traits" for the UI
- Apply them consistently across components
- Don't mix conflicting styles

## Design System Generation

When generating a design system:

1. **Define personality** — 2-3 adjectives (e.g., "precise, confident, minimal")
2. **Choose typography** — 1-2 font families with clear roles
3. **Build color system** — Primary, secondary, neutrals, semantic colors
4. **Establish spacing scale** — 4px base, consistent ratios
5. **Create component patterns** — Buttons, inputs, cards with consistent treatment

## Integration with Agentflow

Add to `agentflow.config.js`:

```javascript
design: {
  personality: ['precise', 'confident', 'minimal'],
  fonts: {
    heading: 'Geist Sans',
    body: 'Geist Mono'
  },
  colors: {
    primary: '#0a0a0a',
    accent: '#ff3b30'
  }
}
```

The `standards` agent can detect and configure design preferences during `init`.

## Guidelines

- Start with content, not layout
- Design for the specific context, not generic "good design"
- Use whitespace intentionally, not as default
- Test designs at different screen sizes
- Prefer subtle over flashy
