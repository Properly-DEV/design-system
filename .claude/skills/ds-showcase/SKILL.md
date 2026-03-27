---
name: ds-showcase
description: 'Builds or updates a standalone design system showcase - a self-contained HTML page (or Vercel-deployable app) that displays tokens and component variants, serving as an alternative to Storybook. Use whenever the user wants to present, preview, or document components visually - phrases like build the showcase, update index.html, add component to showcase, deploy to Vercel, make something like Storybook, show all variants, present the design system, or when a new component needs to be added to the presentation layer.'
---

# ds-showcase

Builds a zero-dependency, self-contained showcase that lives in `index.html`.
No build step. Opens in browser directly or deploys to Vercel as-is.

**When to run:** This skill is intended to run once — at the end of the project, before handoff. Do not run it after each component. If the user asks to update the showcase mid-project, confirm that all components planned for this release are complete before proceeding.

## Architecture decision

**Always use the existing `index.html` pattern** from the project unless the user
explicitly asks for something different. This means:
- Pure HTML + CSS + vanilla JS (no React, no bundler)
- All styles inline in `<style>` tag
- Components rendered as static HTML that mirrors the React output
- Tokens loaded from `tokens.css` via `<link>`

If user asks for Vercel deployment → read `references/vercel-deploy.md`
If user asks for a React-based showcase → read `references/react-showcase.md`

## Step 0 — Scan all components and patterns first

Before writing any HTML, scan:
- `/components/` directory: list every `.tsx` file — each gets its own `<section>`
- `/patterns/` directory (if exists): list every `.html` file — each gets a link in the Patterns section
- Auto-generate `<nav>` anchor links from the full component list + patterns list

## Page structure

Every showcase page has this structure — do not deviate:
```
<header>          — Project name, last export date, token file ref
<nav>             — Anchor links to each section (one per component + one per token category + patterns if present)
<section>         — Per token category (Colors, Typography, Spacing, Radius, Shadows)
<section>         — Per component (with all variant groups) — ALL components, none skipped
<section>         — Patterns (only if /patterns/ has .html files)
```

### Patterns section

If `/patterns/` contains `.html` files, add a `<section id="patterns">` after all component sections:
```html
<section id="patterns" class="component-section">
  <div class="component-header">
    <h2>Patterns</h2>
    <p class="component-meta">Screen-level compositions built from components</p>
  </div>
  <div class="variant-group">
    <div class="variant-group-label">Available patterns</div>
    <ul>
      <li><a href="patterns/RegistrationForm.html" target="_blank">Registration Form</a> — <a href="patterns/RegistrationForm.spec.md">spec</a></li>
      <!-- one line per pattern -->
    </ul>
  </div>
</section>
```
Link to the `.html` preview and `.spec.md` file for each pattern. Do not embed the HTML inline — use links only.

→ For detailed section templates: read `references/showcase-sections.md`

## Adding a component to the showcase

1. Read the component's `.tsx` file to understand all prop variants
2. Create one `<section id="component-[name]">` with `class="component-section"`
3. For each variant axis, create a `<div class="variant-group">`
4. Show every combination that has a distinct visual output
5. Static HTML only — mirror what the React component renders, no JS needed

## Adding a token section

Token sections follow the same pattern regardless of category.
→ See `references/showcase-sections.md` for color grid, type specimen, spacing bar patterns.

## CSS class conventions (from existing index.html)

Never invent new class names. Use only:
- `.component-section`, `.component-header`, `.component-meta`
- `.variant-group`, `.variant-group-label`, `.variant-row`, `.variant-cell`, `.variant-label`
- `.color-grid`, `.swatch`, `.swatch-color`, `.swatch-info`
- `.type-specimen`, `.type-meta`, `.type-preview`
- `.token-table`, `.token-name`, `.token-value`
- `.radius-grid`, `.radius-demo`, `.spacing-list`, `.shadow-grid`

## Quality checklist before delivering

- [ ] All component states shown (Default, Hovered, Focused, Error, etc.)
- [ ] Dark background variants shown where component supports it
- [ ] Token CSS vars used everywhere — no hardcoded hex or px
- [ ] Nav links match section IDs
- [ ] Page opens without a server (no fetch(), no module imports)
