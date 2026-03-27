# Discovery Guide — Profiling a Design System

Before auditing a component, understand the project's conventions. This makes every audit contextual and accurate, regardless of which design system you're working with.

## Step 0 — Check for CLAUDE.md (always first)

Look for `CLAUDE.md` in the project root. If it exists:
- Read it
- Extract: token file path, CSS prefix, CSS strategy, component file structure
- Use this as your convention profile — **skip Steps 1–3 below**

CLAUDE.md is the authoritative source of conventions for projects that use `project-setup`. Profiling from scratch when it's available wastes tool calls and context.

Only continue to Steps 1–3 when CLAUDE.md is absent or incomplete.

## Table of Contents

1. [Find the Token File](#1-find-the-token-file)
2. [Map Token Categories](#2-map-token-categories)
3. [Profile Existing Components](#3-profile-existing-components)
4. [Build the Convention Profile](#4-build-the-convention-profile)

---

## 1. Find the Token File

Look for CSS custom properties, theme objects, or design tokens in the project. Common locations and formats:

| Format | Where to look | Example |
|--------|---------------|---------|
| CSS custom properties | `tokens.css`, `variables.css`, `theme.css`, `:root` in any CSS | `--color-primary: #00ec88;` |
| JS/TS theme object | `theme.ts`, `tokens.ts`, `stitches.config.ts` | `colors: { primary: '#00ec88' }` |
| JSON tokens | `tokens.json`, `design-tokens.json` | Style Dictionary format |
| Tailwind config | `tailwind.config.js` | `theme.extend.colors` |
| SCSS variables | `_variables.scss`, `_tokens.scss` | `$color-primary: #00ec88;` |

If no token file exists, note this as a Critical finding — the project has no single source of truth for design values.

## 2. Map Token Categories

Read the token file and identify which categories exist. Don't assume any naming convention — discover it.

**Common categories to look for:**

- **Colors:** foreground/text, background, border, brand, semantic (error, success, warning, info)
- **Typography:** font families, font sizes, line heights, font weights
- **Spacing:** padding/margin scale
- **Radius:** border-radius values
- **Shadows:** box-shadow presets
- **Icons:** size, stroke width
- **Z-index:** layering scale
- **Motion/transitions:** duration, easing

**What to note:**

- The **naming pattern**: `--colors-fg-primary` vs `--color-text-default` vs `--fg-1` vs `--ds-text-primary`
- The **category prefixes**: do colors start with `--colors-`, `--color-`, `--c-`?
- The **scale pattern**: numbered (`-100`, `-200`, `-300`)? named (`-primary`, `-secondary`)? both?
- **Semantic vs raw**: does the system have both raw values (`--blue-500`) and semantic aliases (`--color-error`)?

Build a mental lookup table: "when I see a hardcoded `#595959` in a component, the correct token is `--colors-fg-secondary`" (or whatever the project equivalent is).

## 3. Profile Existing Components

Read 2–3 components that the team considers production-ready. If the project has only the component being audited, skip this step.

**Extract these patterns:**

### CSS Strategy

| Pattern | Signs |
|---------|-------|
| Injected `<style>` with dedup | `STYLE_ID` constant, `injectStyles()` function, template literal CSS |
| CSS Modules | `.module.css` imports, `styles.className` usage |
| Styled-components / Emotion | `styled.div`, `css` template tags |
| Tailwind | `className="flex items-center gap-2"` |
| Inline styles only | `style={{ }}` everywhere, no CSS classes |

### Class Naming

| Convention | Example |
|------------|---------|
| BEM with prefix | `.rly-button__icon--left` |
| BEM without prefix | `.button__icon--left` |
| Flat with prefix | `.ds-button-icon` |
| camelCase (CSS Modules) | `styles.buttonIcon` |
| Utility-first (Tailwind) | No custom class names |

### Props API Patterns

- How are **variants** named? `variant`, `type`, `kind`?
- What are **size values**? `"S" | "M" | "L"`, `"sm" | "md" | "lg"`, `"small" | "medium" | "large"`?
- Are **native HTML attributes** extended? (`extends ButtonHTMLAttributes`)
- Is `forwardRef` used?
- How is **disabled** handled? Native attr or custom prop?
- How is **loading** handled? Boolean prop? Part of a state enum?

### Interaction Patterns

- **Focus ring:** `::after` pseudo-element? `outline`? `box-shadow`? What color token?
- **Focus trigger:** `:focus-visible` or `:focus`?
- **Disabled opacity:** `0.4`? `0.5`? `0.38`?
- **Transitions:** What properties? What duration? What easing?
- **Hover/active:** CSS pseudo-classes or JS state?

## 4. Build the Convention Profile

After steps 1–3, you should have a clear picture. Summarize it mentally (don't print to user) as:

```
Convention Profile:
- Tokens: [file path], [naming pattern], [categories found]
- CSS: [strategy], [class naming], [prefix]
- Props: [variant naming], [size scale], [extends native attrs: yes/no]
- States: [focus ring approach], [disabled pattern], [hover approach]
- Ref: [forwardRef used: yes/no], [target element pattern]
```

Use this profile throughout the audit. When a contextual rule says "check if the component follows project conventions," compare against this profile.

---

## Edge Cases

**Mixed conventions in the project:** If existing components use inconsistent patterns (some use inline styles, some use CSS classes), note this in the audit but evaluate against the *better* pattern. Don't perpetuate bad conventions.

**No existing components:** If the component being audited is the first one, evaluate against universal rules only. Skip contextual rules or flag them as "establish convention — no precedent found."

**Multiple token files:** Some projects split tokens (colors.css, typography.css, spacing.css). Read all of them.

**Token file is a JS/TS object, not CSS:** Map it mentally the same way. Instead of `var(--color-primary)`, the correct reference might be `theme.colors.primary` or `tokens.color.primary`. The principle is the same — no hardcoded values.
