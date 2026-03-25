# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A source design system (RLY Starter Kit) containing production-ready React/TypeScript components derived from Figma. Components are meant to be **copied into target projects**, not consumed as an npm package. There is no build pipeline, package.json, or test runner.

Figma source file: `uRmtCnYBKrBsVM34hMgQyz`

## Architecture

```
components/     # 8 React/TypeScript components (self-contained, no external deps)
tokens/         # tokens.css — single source of truth for all visual values
docs/           # Static HTML documentation/showcase pages
.claude/skills/ # Figma-to-React skill guide and reference patterns
```

## Component Conventions

**File structure** (every component follows this order):
1. Header comment with Figma node ID
2. Imports
3. Exported types/interfaces
4. CSS string constant + style injection function (`injectStyles`)
5. Sub-components / icon helpers
6. Main component with `forwardRef`

**CSS class naming**: `.rly-{component}__{element}--{modifier}` (BEM-like, RLY prefix)

**Token usage**: Every visual value must come from `tokens/tokens.css` via CSS custom properties — no hardcoded hex values or magic numbers. e.g., `color: var(--colors-fg-primary)` not `color: #080808`.

**State handling**: Interactive states (hover, focus, disabled, checked) are driven by CSS pseudo-classes (`:hover`, `:focus-visible`, `:active`, `:disabled`, `:checked`), never toggled via React state.

**Props**: Components extend native HTML attributes (`ButtonHTMLAttributes`, `InputHTMLAttributes`, etc.). Forward refs to native elements. Use `useId()` for stable label associations.

**Accessibility**: Semantic HTML elements, ARIA roles/attributes where needed, `:focus-visible` for keyboard focus rings, `aria-hidden="true"` on decorative SVGs.

## Adding New Components

Follow the methodology in `.claude/skills/figma-to-react/SKILL.md`:
1. Fetch design context from Figma
2. Map visual tokens to `tokens.css` variables
3. Classify the interaction archetype (see `references/component-patterns.md`)
4. Design the props API extending native HTML attributes
5. Choose the correct semantic HTML element
6. Build CSS using token variables and pseudo-class state
7. Assemble the TSX with `forwardRef`
8. Validate against the checklist in the skill guide

Avoid the pitfalls documented in `.claude/skills/figma-to-react/references/anti-patterns.md`.
