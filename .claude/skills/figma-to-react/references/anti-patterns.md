# Anti-Patterns Checklist

Use this as a final check before delivering a component. Each item shows what to avoid and what to do instead. If you catch any of these in the component you're building, fix them before delivering.

---

## 1. State prop for interaction states

```tsx
// ❌ Figma variant exported as prop
<Checkbox state="Hovered" />
<Button state="Focused" />

// ✅ Interaction states handled by CSS pseudo-classes
.rly-checkbox:hover .rly-checkbox__box { ... }
.rly-button:focus-visible::after { ... }
```

**Why it's wrong:** Hover, focus, and active are browser events. Exposing them as props means the component doesn't respond to real user interaction — it just renders a static snapshot of a Figma variant.

---

## 2. Inline styles for static values

```tsx
// ❌ Style objects for values that never change at runtime
const boxStyle: CSSProperties = {
  width: "20px",
  height: "20px",
  borderRadius: "var(--radius-xs)",
  border: `2px solid ${isActive ? "var(--colors-bg-brand-secondary)" : "var(--colors-border-secondary)"}`,
};

// ✅ CSS handles static styling, JS handles only dynamic values
.rly-checkbox__box {
  width: 20px;
  height: 20px;
  border-radius: var(--radius-xs);
  border: 2px solid var(--colors-border-secondary);
}
```

**Why it's wrong:** Inline styles block CSS pseudo-classes (`:hover`, `:focus-visible`, `:active`), pseudo-elements (`::after`), media queries, and transitions. They also have specificity 1000, making them nearly impossible to override from outside.

---

## 3. String enum instead of boolean

```tsx
// ❌ Figma naming leaked into code
isChecked: "No" | "Yes" | "Indeterminate"
onChange: (value: "No" | "Yes" | "Indeterminate") => void

// ✅ Standard React/HTML types
checked?: boolean
indeterminate?: boolean
onChange?: React.ChangeEventHandler<HTMLInputElement>
```

**Why it's wrong:** No React developer expects `isChecked === "No"`. Native HTML uses `checked` (boolean). React Hook Form, Formik, and every form library expect boolean checked and standard `ChangeEvent`. String enums break all of these integrations.

---

## 4. Missing native HTML element

```tsx
// ❌ Custom div pretending to be a checkbox
<label onClick={handleClick}>
  <div style={boxStyle}>
    {isChecked === "Yes" && <CheckIcon />}
  </div>
  <span>{label}</span>
</label>

// ✅ Real native input — keyboard, forms, a11y for free
<label>
  <input type="checkbox" checked={checked} onChange={onChange} />
  <span aria-hidden="true"><CheckIcon /></span>
  <span>{label}</span>
</label>
```

**Why it's wrong:** Without a native `<input>`, the component has no keyboard support (Tab, Space), no form submission (name, value), no screen reader semantics (role, checked state), and no integration with browser autofill or validation.

---

## 5. Missing forwardRef

```tsx
// ❌ No way to access the underlying element
function Checkbox(props: CheckboxProps) {
  return <label>...</label>;
}

// ✅ Ref forwarded to the native input
const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(props, ref) {
    return <label><input ref={ref} type="checkbox" />...</label>;
  }
);
```

**Why it's wrong:** Without forwardRef, you can't use `React Hook Form` (needs ref for registration), can't call `.focus()` imperatively, can't set `.indeterminate` on checkboxes (JS-only property), and can't measure or position the element.

---

## 6. Hardcoded SVG icons

```tsx
// ❌ SVG with fixed dimensions and colors baked in
<svg width="20" height="20" viewBox="0 0 20 20">
  <rect width="20" height="20" rx="4" fill="#00ec88" />
  <path stroke="#080808" strokeWidth="2" d="M5 10l3.5 3.5L15 7" />
</svg>

// ✅ SVG uses currentColor, size controlled by CSS
<svg className="rly-checkbox__icon" viewBox="0 0 12 12" fill="none" aria-hidden="true">
  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" />
</svg>
```

**Why it's wrong:** Hardcoded colors ignore theming and dark mode. Hardcoded dimensions are brittle — if the component size changes, the icon doesn't adapt. Mixing background (rect) with icon (path) in the same SVG conflates structure and decoration.

---

## 7. transition: all

```css
/* ❌ Animates everything, including layout properties */
transition: all 0.15s ease;

/* ✅ Explicit property list — only what needs to animate */
transition: background 0.15s ease, border-color 0.15s ease;
```

**Why it's wrong:** `transition: all` animates width, height, padding, margin — causing layout thrashing and unexpected visual glitches. It also degrades performance because the browser must check every property for changes on every frame.

---

## 8. Magic numbers instead of tokens

```tsx
// ❌ Pixel values from Figma copied directly
borderRadius: "8px",
padding: "0 6px",
fontSize: "14px",
color: "#595959",

// ✅ Token references
border-radius: var(--radius-sm);
padding: 0 var(--spacing-1);
font-size: var(--body-3-size);
color: var(--colors-fg-secondary);
```

**Why it's wrong:** Magic numbers break when the design system tokens change. If the brand updates `--radius-sm` from 8px to 6px, hardcoded `8px` values stay wrong. Tokens are the single source of truth — use them.

---

## 9. Custom onChange signature

```tsx
// ❌ Non-standard callback
onChange: (value: CheckboxChecked) => void
onChange: (checked: boolean) => void

// ✅ Standard React event
onChange?: React.ChangeEventHandler<HTMLInputElement>
// Which gives the consumer: (event) => { event.target.checked, event.target.value, ... }
```

**Why it's wrong:** React Hook Form, Formik, and every form library pass their own `onChange` handler that expects a standard `React.ChangeEvent`. Custom signatures break this contract and force consumers to write adapters.

---

## 10. Label as string-only

```tsx
// ❌ Only accepts plain text
label?: string

// ✅ Accepts any React content
label?: React.ReactNode
```

**Why it's wrong:** Sometimes labels need formatting (bold, link, icon, tooltip trigger). `string` forces consumers to hack around the limitation. `ReactNode` accepts strings (most common case) AND rich content when needed.

---

## 11. onClick on non-button element

```tsx
// ❌ Div pretending to be interactive
<div onClick={handleClick} style={{ cursor: "pointer" }}>
  Click me
</div>

// ✅ Use the correct semantic element
<button onClick={handleClick}>
  Click me
</button>
```

**Why it's wrong:** A `div` with `onClick` has no keyboard support (Enter/Space), no focus management (Tab), no implicit ARIA role, and no disabled state. A `<button>` provides all of these natively.

---

## 12. Mixing concerns in component wrapper

```tsx
// ❌ Component manages its own margin/position
const wrapperStyle = {
  margin: "16px 0",
  width: "290px",
};

// ✅ Component has no opinion about external layout
// Parent controls spacing via className, style, or layout
<div style={{ marginBottom: 16 }}>
  <Checkbox label="Terms" />
</div>
```

**Why it's wrong:** A design system component should not dictate how it sits in a layout. Fixed width and margin make it impossible to use in different contexts (sidebar, modal, full-width form). Let the consumer control external spacing.
