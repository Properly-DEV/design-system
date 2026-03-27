# Stage 3 — CLAUDE.md

Generate `CLAUDE.md` in the project root. This is the "project memory" — every Claude session starts by reading this file. Keep it as lean as possible: only what a new session needs to orient itself and stay consistent.

**Component list is NOT here.** It lives in `STATUS.md`. Do not add a component status table to CLAUDE.md.

---

## Before generating — gather information

Ask the user for things you cannot infer from files:

1. **Project / client name** — e.g. "RLY Starter Kit", "Acme Design System"
2. **Stack** — React + Vite? Next.js? Vue? TypeScript?
3. **CSS class prefix** — e.g. `rly-`, `acme-`, `ds-` (default: first 3 letters of project name)
4. **Figma MCP available** — yes/no (affects how Claude should fetch data)
5. **Figma file link** — if available

Infer the rest from the generated files (tokens.css, icon structure).

---

## CLAUDE.md template

```markdown
# [Project name] — Design System

> Project conventions file. Read before every session.

## Stack
- [Framework + version]
- TypeScript: [yes/no]
- [Build tool]
- Tokens: `tokens/tokens.css`

## Figma
- File: [link or "unavailable"]
- MCP: [available / unavailable]
- Last export: [date]

## CSS Prefix
All CSS classes and component names use the prefix `[prefix]-`.
Example: `.rly-button`, `.rly-button__label`, `.rly-button--primary`

## CSS Strategy
- Style: injected `<style>` tag in each component, deduplicated via `STYLE_ID`
- Naming: BEM-like — `.prefix-component__element--modifier`
- Tokens: ALWAYS `var(--token-name)` — zero hardcoded values
- Interaction states: CSS pseudo-classes (`:hover`, `:focus-visible`, `:active`, `:disabled`) — NEVER JS props

## Component file structure
Each component is a single `.tsx` file. Order inside the file:
1. Header comment (name, Figma node, date)
2. Imports
3. Exported types
4. CSS string + `injectStyles()` function
5. Internal sub-components (icons, visual elements)
6. Main component with `forwardRef`
7. `export default`

## Component list
See `STATUS.md` for the full list of components and their status.
```

---

## Rules

- Do not copy this template literally — fill it with actual project data
- If you don't know something — write `[to be filled]` and note it in TODO.md
- CLAUDE.md is intentionally lean — resist the urge to add more sections
- The component list, token categories, and "to do" lists all belong in STATUS.md or TODO.md, not here
