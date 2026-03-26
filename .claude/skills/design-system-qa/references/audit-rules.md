# Audit Rules — Five Dimensions

Every component is evaluated across five dimensions. Each dimension has **universal rules** (true regardless of project) and **contextual rules** (depend on the project's convention profile from discovery).

## Table of Contents

1. [Props API](#1-props-api)
2. [Styles & Tokens](#2-styles--tokens)
3. [Interaction States](#3-interaction-states)
4. [Accessibility](#4-accessibility)
5. [Architecture & Scalability](#5-architecture--scalability)

---

## 1. Props API

### Rule 1.1 — Extend native HTML attributes [Universal] [Critical]

The props interface must extend the native HTML attributes of its root interactive element.

```tsx
// ❌ Custom interface with no native attrs
interface ButtonProps { label: string; onClick?: () => void; disabled?: boolean; }

// ✅ Extends native — gets onClick, disabled, type, form, aria-*, data-*, etc.
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: React.ReactNode;
  variant?: "primary" | "secondary";
}
```

**Which element to extend:**

| Component type | Extend | Root element |
|---------------|--------|--------------|
| Button, IconButton | `ButtonHTMLAttributes<HTMLButtonElement>` | `<button>` |
| Text input | `InputHTMLAttributes<HTMLInputElement>` | `<input>` |
| Textarea | `TextareaHTMLAttributes<HTMLTextAreaElement>` | `<textarea>` |
| Checkbox, Radio, Switch | `Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>` | `<input>` |
| Link | `AnchorHTMLAttributes<HTMLAnchorElement>` | `<a>` |
| Select | `SelectHTMLAttributes<HTMLSelectElement>` | `<select>` |
| Display (badge, tag) | `HTMLAttributes<HTMLSpanElement>` | `<span>` |
| Container (card, panel) | `HTMLAttributes<HTMLDivElement>` | `<div>` |

### Rule 1.2 — No state prop for interaction states [Universal] [Critical]

Hover, focus, active/pressed are browser events. They must never be React props.

```tsx
// ❌ Figma variants leaked into code
interface ButtonProps { state: "Default" | "Hovered" | "Focused" | "Pressed" | "Disabled"; }

// ✅ Disabled comes from native attr, rest from CSS pseudo-classes
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { }
```

**Exception:** `loading` is a valid prop. Error/success statuses on form fields are also valid — they depend on validation logic, not browser events.

### Rule 1.3 — Boolean states over string enums [Universal] [Warning]

```tsx
// ❌ Figma naming
isChecked: "No" | "Yes" | "Indeterminate"

// ✅ Standard React types
checked?: boolean       // native attr (inherited)
indeterminate?: boolean // JS-only, set via ref
```

### Rule 1.4 — Standard onChange + controlled/uncontrolled [Universal] [Critical]

Form controls must use standard React event handlers and support both controlled (`value` + `onChange`) and uncontrolled (`defaultValue` + ref) modes.

```tsx
// ❌ Custom callback — breaks React Hook Form, Formik, etc.
onChange?: (value: string) => void

// ✅ Standard React event
onChange?: React.ChangeEventHandler<HTMLInputElement>
```

If the component uses a native `<input>`, controlled/uncontrolled is automatic. If it manages internal state, verify: passing `value`/`checked` makes it controlled, omitting them uses internal state + `defaultValue`/`defaultChecked`. Mixing modes must not trigger React warnings.

### Rule 1.5 — Labels accept ReactNode [Universal] [Warning]

`label?: string` → `label?: React.ReactNode`. Allows rich content (bold, icon, tooltip) without hacking around the limitation.

### Rule 1.6 — forwardRef on the correct element [Universal] [Critical]

Every component must use `forwardRef` targeting the primary native element: form controls → `<input>`, buttons → `<button>`, display → root element.

```tsx
// ❌
function Checkbox(props: CheckboxProps) { ... }
// ✅
const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(props, ref) {
    return <label><input ref={ref} type="checkbox" ... /></label>;
  }
);
```

### Rule 1.7 — Rest props spread + className/style reach root [Universal] [Warning]

Unrecognized props must pass through to the native element. This ensures `className`, `style`, `data-testid`, `aria-describedby`, etc. all work.

```tsx
// ❌ Extra props lost
function Button({ label, variant, disabled }: ButtonProps) {
  return <button disabled={disabled}>{label}</button>;
}
// ✅ ...rest reaches native element, className merged
function Button({ label, variant, className, ...rest }: ButtonProps) {
  return <button className={`btn ${className ?? ""}`} {...rest}>{label}</button>;
}
```

### Rule 1.8 — API ergonomics and naming [Contextual] [Warning]

- **Sensible defaults:** `<Button />` with zero props should render a working button.
- **Intuitive names:** Prefer community conventions (`variant`, `size`, `disabled`) over inventions (`visualStyle`, `magnitude`).
- **Minimal required props:** 5+ required props = API too demanding.
- **No prop drilling:** If most props just pass through to a child, the component may be too thin.
- **Consistent with project:** Match the project's naming pattern for variants, sizes, etc.

---

## 2. Styles & Tokens

### Rule 2.1 — No hardcoded colors [Universal] [Warning]

Any color value (#hex, rgb, hsl) should be a token reference. If no token match exists, flag the token file as incomplete. `transparent`, `currentColor`, `inherit` are valid CSS keywords.

```css
/* ❌ */ color: "#595959"; border: "1px solid #c6c6c6";
/* ✅ */ color: var(--colors-fg-secondary); border: 1px solid var(--colors-border-secondary);
```

### Rule 2.2 — No magic numbers [Universal] [Warning]

Pixel values for spacing, sizing, radius, font should reference tokens if available. Structural values specific to one component (focus ring `inset: -4px`, icon `stroke-width: 2`) are acceptable if no system-level token exists.

```css
/* ❌ */ padding: 0 6px; border-radius: 8px; font-size: 14px;
/* ✅ */ padding: 0 var(--spacing-1); border-radius: var(--radius-sm); font-size: var(--body-3-size);
```

### Rule 2.3 — No inline styles for static values [Universal] [Warning]

Static CSS belongs in CSS rules, not `style={{}}`. Inline styles block pseudo-classes, pseudo-elements, media queries, and are nearly impossible to override. Finite variant sets (3 backgrounds for 3 variants) are better as CSS modifier classes. True dynamic values (calculated positions, progress percentages) are OK inline.

### Rule 2.4 — No transition: all [Universal] [Suggestion]

`transition: all` animates layout properties causing thrashing. Use explicit property lists.

### Rule 2.5 — SVG icons use currentColor [Universal] [Warning]

`stroke="currentColor"` / `fill="currentColor"` instead of hardcoded colors or color props. Enables theming without JS.

### Rule 2.6 — Styling approach matches project [Contextual] [Warning]

Whatever CSS strategy the project uses (CSS Modules, styled-components, Tailwind, injected `<style>`, plain CSS), the component must match. The skill does not prescribe a strategy — only consistency.

---

## 3. Interaction States

### Rule 3.1 — All interaction states via CSS pseudo-classes [Universal] [Critical]

Never recreate hover, focus, or active in JavaScript:

| State | CSS | Common mistakes |
|-------|-----|----------------|
| Hover | `:hover:not(:disabled)` | `onMouseEnter`/`onMouseLeave` + state |
| Focus | `:focus-visible` (not `:focus`) | `onFocus`/`onBlur` + state, or `:focus` showing ring on mouse click |
| Active | `:active:not(:disabled)` | `state="Pressed"` prop |

For form controls with hidden inputs, use sibling selectors: `.input:focus-visible ~ .visual::after { ... }`

### Rule 3.2 — Disabled via native attribute [Universal] [Critical]

Use native HTML `disabled`, not a custom prop or CSS class. Native disabled blocks clicks, tab, and form submission automatically.

```tsx
// ❌
<div style={{ opacity: isDisabled ? 0.4 : 1, pointerEvents: isDisabled ? "none" : "auto" }}>
// ✅
<button disabled={disabled}>
```

### Rule 3.3 — Interaction patterns consistent with project [Contextual] [Warning]

Check the convention profile: focus ring implementation (`::after`, `outline`, `box-shadow`), focus color token, disabled opacity (commonly `0.4` or `0.38`). The component must match.

---

## 4. Accessibility

### Rule 4.1 — Use native HTML elements [Universal] [Critical]

If a native element exists for the behavior, use it. A `<div onClick>` has no keyboard support, no form submission, no screen reader semantics, and is invisible to `getByRole()` in testing-library.

| Behavior | Required element |
|----------|-----------------|
| Triggers an action | `<button>` |
| Toggles on/off | `<input type="checkbox">` |
| Picks one from set | `<input type="radio">` |
| Text input | `<input>` or `<textarea>` |
| Navigation link | `<a href="...">` |
| Selection from list | `<select>` |
| Modal/dialog | `<dialog>` |

### Rule 4.2 — Label association [Universal] [Critical]

Every form control needs an accessible label — wrapping `<label>` (preferred) or `htmlFor` + `id`. Use `useId()` for stable IDs. If a component supports hiding its visible label, the text must still be available via `aria-label` or a visually-hidden class.

### Rule 4.3 — Decorative icons hidden [Universal] [Warning]

Icons that don't convey meaning: `<svg aria-hidden="true">`.

### Rule 4.4 — Keyboard interaction [Universal] [Critical]

| Component | Tab | Space | Enter | Arrow keys |
|-----------|-----|-------|-------|------------|
| Button | Focus | Activate | Activate | — |
| Checkbox | Focus | Toggle | — | — |
| Radio group | Focus group | Select | — | Move selection |
| Switch | Focus | Toggle | — | — |
| Text input | Focus | Type | Submit form | Move cursor |
| Tabs | Focus tab list | — | — | Switch tab |
| Modal | Focus first | — | — | Trap focus |

Native HTML elements provide this for free. Custom ARIA roles require manual keyboard handling.

### Rule 4.5 — ARIA attributes when needed [Universal] [Warning]

- Switch: `role="switch"` on `<input type="checkbox">`
- Indeterminate: `aria-checked="mixed"` + `.indeterminate = true` via ref
- Toggle button: `aria-pressed="true"` / `"false"`
- Loading button: `aria-busy="true"`
- Error input: `aria-invalid="true"` + `aria-describedby` → error message

---

## 5. Architecture & Scalability

### Rule 5.1 — No external layout opinions [Universal] [Warning]

No fixed `width`, no `margin` on root. Height on buttons/inputs is acceptable (tap target). Width is almost never OK to hardcode.

### Rule 5.2 — SSR and hydration safety [Universal] [Critical]

- No bare `document`/`window` in render path — must be in `useEffect` or behind `typeof document !== "undefined"`.
- No `Math.random()`/`Date.now()` for IDs — use `useId()`.
- Side effects (style injection, DOM measurement) in `useEffect`, not render body.

```tsx
// ❌ Crashes in SSR
function Component() { const width = window.innerWidth; return <div style={{ width }} />; }
// ✅ Browser APIs in useEffect only
function Component() {
  const [width, setWidth] = useState(0);
  useEffect(() => { setWidth(window.innerWidth); }, []);
  return <div style={width ? { width } : undefined} />;
}
```

### Rule 5.3 — Composition and defensive coding [Universal] [Warning]

**Composition:** Flat props OK for atoms. For complex components, watch for: 10+ props, multi-branch render, consumers can't control internals. These signal need for compound components (`Select` + `Select.Option`).

**Defensive:** `undefined` props, empty labels, unexpected variant values, missing callbacks — must not crash or render "undefined".

### Rule 5.4 — Consistent with project architecture [Contextual] [Warning]

Whatever patterns the project uses — CSS strategy, class naming, file structure, exports — the component must match. If no convention exists, skip this rule.

### Rule 5.5 — No unnecessary re-renders [Universal] [Suggestion]

Only flag for complex components rendering many times. Watch: callbacks without `useCallback`, expensive computations without `useMemo`, context consumers reading entire context.
