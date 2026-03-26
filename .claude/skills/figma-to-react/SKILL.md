---
name: figma-to-react
description: "Use this skill whenever the user wants to convert a Figma component into production-quality React code. Triggers include: pasting a Figma link or node URL, saying 'build this component', 'convert from Figma', 'component from design', 'create a checkbox/button/input/etc.', or asking to refactor or audit an existing component that was originally exported from Figma. Also trigger when the user shares a Figma component screenshot or describes a component's variants and wants React code. If the user asks to build a component without providing a Figma link, prompt them for the Figma node URL before proceeding. Do NOT use for full pages, layouts, or multi-component app screens — only individual components and small composites."
---

# Figma → Production React Components

Convert Figma components into accessible, token-driven, production-grade React + TypeScript code. One file per component. Zero shortcuts.

## Quick Reference

| Step | Action | Details |
|------|--------|---------|
| 1 | Fetch from Figma | Use MCP `get_design_context` on the provided link |
| 2 | Read tokens | Load project's `tokens.css` into context |
| 3 | Classify | Identify interaction archetype (Toggle, Selection, Text Entry, Action, Disclosure, Overlay, Display) |
| 4 | Design API | Create TypeScript interface extending native HTML attrs |
| 5 | Choose HTML + ARIA | Read `references/component-patterns.md` for the archetype |
| 6 | Build CSS | Injected `<style>`, pseudoclasses, tokens only |
| 7 | Assemble TSX | One file, forwardRef, composable |
| 8 | Validate | Run mental checklist before delivering |

---

## Step 1: Fetch Component Data from Figma

Use Figma MCP tool `get_design_context` on the user's link. Extract:
- Component name
- Properties list (variants, booleans, content)
- Property values (e.g., Type: Primary, Secondary, Tertiary)
- Layer structure (which elements are inside the component)
- Applied variables/tokens (colors, spacing, radius, typography)
- Component description (may contain usage notes from the designer)

**If Figma MCP is not connected:** tell the user to connect Figma MCP before proceeding. This skill requires live Figma data.

**If MCP returns incomplete token data:** check whether a `tokens.css` file exists in the project. If yes, read it. If not, ask the user to provide their tokens file.

## Step 2: Read Project Tokens

Load `tokens.css` from the project. Every visual value in the component must reference these tokens. Never hardcode a color, font size, radius, or spacing value — always use `var(--token-name)`.

If the project has component-level structural tokens (like `--button-height-s` or `--input-border-radius`), use them. If not, use the semantic tokens directly (like `var(--radius-md)`).

## Step 3: Classify the Component

Determine which **interaction archetype** this component belongs to. The archetype drives the HTML element, ARIA, keyboard behavior, and CSS strategy. Every component — no matter how unique its visual design — fits one or more of these:

```
What does the component DO?

├─ Switches between on/off?              → Toggle
│   (checkbox, switch, toggle button, favorite icon, theme toggle)
│
├─ Picks ONE option from a set?          → Single Selection
│   (radio group, dropdown, select, tabs, segmented control)
│
├─ Picks MANY options from a set?        → Multi Selection
│   (checkbox group, multi-select dropdown, tag picker, filter bar)
│
├─ User types or edits text?             → Text Entry
│   (input, textarea, search, combobox, OTP input, inline edit)
│
├─ Fires an action when clicked?         → Action Trigger
│   (button, icon button, link button, menu item, FAB, CTA)
│
├─ Shows/hides related content?          → Disclosure
│   (accordion, collapsible, dropdown menu, tooltip, popover)
│
├─ Floats above the page?               → Overlay
│   (modal, dialog, drawer, toast, bottom sheet, command palette)
│
└─ Displays information, not interactive? → Display
    (badge, avatar, tag, progress bar, skeleton, divider, stat)
```

**Components can combine archetypes.** A dropdown is Action Trigger + Disclosure + Single Selection. A removable tag is Display + Action Trigger. When this happens, read all relevant archetype sections in `references/component-patterns.md` and merge their patterns — see the "Composite Components" section there.

If the component doesn't fit any archetype, read `references/component-patterns.md` fully and design from first principles using the rules in this skill.

## Step 4: Design the Props API

Create the TypeScript interface. This is where Figma properties get translated into idiomatic React props.

**Rule: extend native HTML attributes for the component's root element.**

```tsx
// Form controls
interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> { ... }

// Buttons
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { ... }

// Display elements
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> { ... }
```

**Translating Figma properties to props:**

| Figma property | React translation | Example |
|----------------|-------------------|---------|
| Type (variant, multi-value) | Union type prop | `type?: "Primary" \| "Secondary"` |
| Size (variant, multi-value) | Union type prop | `size?: "S" \| "M" \| "L"` |
| State: Disabled | Native `disabled` attr (inherited) | Already in HTML attrs |
| State: Loading | Boolean prop | `loading?: boolean` |
| State: Hovered, Focused, Pressed | **SKIP — CSS pseudoclasses** | Never a prop |
| State: Error, Success | Union or boolean prop | `status?: "error" \| "success"` |
| Show ___ (boolean) | Boolean prop with default `true` | `showLabel?: boolean` |
| Is Checked | Native `checked` (inherited) | Already in HTML attrs |
| Is Indeterminate | Boolean prop (JS-only, no HTML attr) | `indeterminate?: boolean` |
| Is Selected | Native `checked` + `role="switch"` | Already in HTML attrs |
| Label, Placeholder | `ReactNode` or `string` prop | `label?: React.ReactNode` |

**What this means in practice:**

```tsx
// ❌ Figma-mirroring API — this mirrors Figma variants, not React conventions
interface CheckboxProps {
  state: "Default" | "Hovered" | "Focused" | "Pressed" | "Disabled";
  isChecked: "No" | "Yes" | "Indeterminate";
  label: string;
}

// ✅ Idiomatic React API — extends native, boolean states, ReactNode label
interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  hideLabel?: boolean;
  indeterminate?: boolean;
}
// checked, disabled, onChange, name, value, id, className, style — all inherited
```

## Step 5: Choose HTML Element and ARIA

Read `references/component-patterns.md` and find the **archetype** matching your classification from Step 3. Each archetype section contains: which HTML element to use, required ARIA attributes, keyboard interactions, and structural code examples.

If the component combines multiple archetypes (e.g., a dropdown = Action Trigger + Disclosure + Single Selection), read all relevant sections and see the "Composite Components" section for guidance on merging patterns.

This is non-negotiable: if a native HTML element exists for the job (`<input>`, `<button>`, `<select>`, `<dialog>`), use it. Never build a custom control from `<div>` + `onClick` when a native element provides keyboard handling, form submission, and screen reader support for free.

## Step 6: Build CSS

CSS is embedded in the component file as a string, injected once via `<style>` with deduplication.

### Injection pattern (same for every component)

```tsx
const STYLE_ID = "rly-checkbox-styles";

function injectStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement("style");
  el.id = STYLE_ID;
  el.textContent = styles;
  document.head.appendChild(el);
}
```

### Naming convention (BEM-like, prefixed)

```
.rly-{component}                → wrapper/root
.rly-{component}__{element}     → child element
.rly-{component}--{modifier}    → modifier on root
```

Examples: `.rly-checkbox`, `.rly-checkbox__box`, `.rly-checkbox__input`, `.rly-checkbox--disabled`.

### Interaction states — always CSS, never JS

This is the most important rule in the skill. Figma has variants like "Hovered", "Focused", "Pressed" because designers need to show how each state looks. In the browser, these are native CSS pseudoclasses — the browser handles them automatically.

```css
/* Hover — :hover on wrapper, target visual element via sibling selector */
.rly-checkbox:hover .rly-checkbox__input:not(:disabled) ~ .rly-checkbox__box {
  border-color: var(--colors-bg-brand-secondary);
}

/* Focus — :focus-visible (keyboard only, avoids mouse focus ring) */
.rly-checkbox__input:focus-visible ~ .rly-checkbox__box::after {
  content: '';
  position: absolute;
  inset: -4px;
  border: 2px solid var(--colors-border-focus);
  border-radius: var(--radius-xs);
  pointer-events: none;
}

/* Checked — :checked on native input */
.rly-checkbox__input:checked ~ .rly-checkbox__box {
  background: var(--colors-bg-brand-primary);
}

/* Active (pressed) — :active on wrapper */
.rly-checkbox:active .rly-checkbox__input:not(:disabled) ~ .rly-checkbox__box { ... }

/* Disabled — :disabled on native input */
.rly-checkbox__input:disabled ~ .rly-checkbox__box { ... }
```

Sibling selectors (`~`) let the visual indicator react to the native input's state. The browser manages state, CSS displays it. This is more reliable than tracking state in React and toggling classes manually.

### Focus ring — consistent across all components

```css
/* Form controls (hidden input + visual element) */
.rly-{component}__input:focus-visible ~ .rly-{component}__{visual}::after {
  content: '';
  position: absolute;
  inset: -4px;
  border: 2px solid var(--colors-border-focus);
  border-radius: /* component-specific, usually token radius + 4px */;
  pointer-events: none;
  z-index: 1;
}

/* Buttons (no hidden input, focus directly on <button>) */
.rly-button:focus-visible::after {
  content: '';
  position: absolute;
  inset: -4px;
  border: 2px solid var(--colors-border-focus);
  border-radius: /* token radius + 4px */;
  pointer-events: none;
}
```

### Disabled — consistent pattern

```css
.rly-{component}--disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
```

### Transitions — explicit property list, never `all`

```css
.rly-checkbox__box {
  transition: background 0.15s ease, border-color 0.15s ease;
}
```

### Hidden native input (checkbox, radio, switch)

```css
.rly-{component}__input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### Token usage — zero magic numbers

Every visual value must come from a CSS custom property:

```css
/* ❌ Hardcoded values */
border: 2px solid #c6c6c6;
border-radius: 4px;
font-size: 14px;

/* ✅ Token references */
border: 2px solid var(--colors-border-secondary);
border-radius: var(--radius-xs);
font-size: var(--body-3-size);
```

## Step 7: Assemble the TSX File

One file per component. Order inside the file:

```tsx
// 1. Header comment — component name, Figma source, date
// 2. Imports
import React, { forwardRef, useRef, useEffect, useId, CSSProperties } from "react";

// 3. Public types (exported)
export interface CheckboxProps extends ... { }

// 4. CSS string constant + injection function
const STYLE_ID = "rly-checkbox-styles";
const styles = `...`;
function injectStyles() { ... }

// 5. Internal sub-components (icons, visual indicators)
function CheckIcon() {
  return <svg ... stroke="currentColor" ... />;
}

// 6. Main component with forwardRef
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    { label, hideLabel, indeterminate, disabled, className, style, id: externalId, ...inputProps },
    externalRef
  ) {
    injectStyles();
    const generatedId = useId();
    const id = externalId ?? generatedId;
    // ... component logic, ref merging, render
  }
);

// 7. Default export
export default Checkbox;
```

### forwardRef targets

- Form controls → ref on `<input>` / `<select>` / `<textarea>`
- Buttons → ref on `<button>`
- Display elements → ref on root `<span>` / `<div>`

Use `useId()` to generate stable IDs for label-input association. Allow external `id` prop to override.

### Icon handling

Render icons as inline SVG. Use `currentColor` for stroke/fill so icons inherit color from CSS. Mark decorative icons with `aria-hidden="true"`.

```tsx
<svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" />
</svg>
```

### Asset lookup

When a Figma component is an icon, logo, or illustration (not a UI control), it is a pre-exported SVG asset — do not rebuild it in code. Look for it in `src/assets/` matching the Figma layer path (e.g. Figma `Icons/network/Solana` → `src/assets/icons/network/solana.svg`).

## Step 8: Validate Before Delivering

Run this checklist mentally. Do not print it to the user — if something fails, fix it silently. Show the checklist only if the user explicitly asks for an audit.

1. **Keyboard**: Tab focuses the component. Space/Enter activates or toggles.
2. **Hover**: `:hover` in CSS changes appearance.
3. **Focus**: `:focus-visible` shows a ring. `:focus` alone is NOT used.
4. **Disabled**: native `disabled` blocks interaction, opacity is 0.4.
5. **Screen reader**: role, state, and label are announced correctly.
6. **Form** (controls only): `name`, `value`, `<form>` submit work.
7. **forwardRef**: ref reaches the native element.
8. **Tokens**: every color, spacing, radius, font references `var(--...)`.
9. **No inline styles** on static values — CSS classes only.
10. **Naming**: classes follow `rly-{component}__...` convention.
11. **Icons**: `currentColor` + `aria-hidden="true"`.

---

## References

Read these when indicated:

- **`references/component-patterns.md`** — Read in Step 5. Organized by **interaction archetypes** (Toggle, Single Selection, Multi Selection, Text Entry, Action Trigger, Disclosure, Overlay, Display), not by component name. Find the archetype matching your component's behavior. Includes a "Composite Components" section for components combining multiple archetypes. Has a table of contents at the top.

- **`references/anti-patterns.md`** — Optionally read before delivering (Step 8). Common Figma-export mistakes with ❌/✅ corrections. Useful when refactoring existing components.
