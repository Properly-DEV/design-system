# Refactor Playbook

One change at a time, verify after each. Never mix a props API change with a CSS restructure with a token replacement.

After each change, mentally verify: does the component still render all variants? Do interaction states work? Are consumers' usage patterns still valid?

---

## Refactor Order

Fixes ordered by dependency — later changes depend on earlier ones.

```
Phase 1: Foundation (Critical)
  1.1  Native HTML element + accessibility
  1.2  Props API redesign
  1.3  forwardRef
  1.4  onChange + controlled/uncontrolled

Phase 2: Styling (Warning)
  2.1  CSS strategy (inline → classes)
  2.2  Interaction states (JS → CSS pseudo-classes)
  2.3  Tokens (hardcoded → var(--...))
  2.4  Icons (hardcoded color → currentColor)

Phase 3: Polish (Suggestion)
  3.1  Naming consistency
  3.2  Remove fixed width/margin
  3.3  Transition specificity
```

---

## Phase 1: Foundation

These changes affect the public API and are often breaking changes.

### 1.1 Native HTML element + accessibility

1. Identify the interaction archetype (button, checkbox, radio, input, etc.)
2. Replace root with the correct native element
3. For form controls: add hidden native `<input>` using visually-hidden pattern
4. Ensure label association via wrapping `<label>` or `htmlFor`/`id`
5. Add ARIA attributes where needed (`role="switch"`, `aria-pressed`, etc.)
6. `aria-hidden="true"` on decorative icons

**Verify:** Tab → Space/Enter activates. Screen reader announces role and state.

### 1.2 Props API redesign

1. `extends [NativeHTMLAttributes]` on the interface
2. Remove `state` prop — hover/focus/active become CSS
3. `disabled` from native attr, `loading` as boolean prop
4. String enums → booleans (`isChecked: "Yes"` → `checked: boolean`)
5. `label` accepts `ReactNode`
6. `...rest` spread to native element

**Verify:** Does `<Component {...register("field")} />` work with React Hook Form?

### 1.3 forwardRef

1. `forwardRef<HTMLElementType, ComponentProps>`
2. `ref` → native element
3. `useId()` for label association, allow external `id` override

**Verify:** `ref.current` should be the native element.

### 1.4 onChange + controlled/uncontrolled

1. Remove custom `onChange: (value: T) => void`
2. Standard `onChange` from `InputHTMLAttributes`
3. Support `defaultValue`/`defaultChecked` for uncontrolled mode
4. Passing `value`/`checked` makes it controlled (no internal state override)

**Verify:** Controlled with React Hook Form, uncontrolled with `defaultValue`, no React warnings about mode switching.

---

## Phase 2: Styling

Structural changes that don't affect the public API.

### 2.1 Inline styles → CSS

1. Identify project's CSS strategy from discovery
2. Move static `style={{}}` into CSS rules using that strategy
3. Follow project's class naming convention
4. Keep inline styles ONLY for truly dynamic values

**Verify:** Identical appearance. `:hover` now works (may not have with inline styles).

### 2.2 Interaction states → CSS pseudo-classes

1. Remove `onMouseEnter`/`onMouseLeave`, `onFocus`/`onBlur` state tracking
2. Write `:hover`, `:focus-visible`, `:active`, `:disabled` CSS rules
3. For hidden inputs: `.input:focus-visible ~ .visual::after { ... }`
4. Remove `state` prop, remove `getRootStyle(type, state)` helpers

**Verify:** Hover → color changes. Tab → focus ring. Click+hold → active state. Disable → blocked.

### 2.3 Hardcoded values → tokens

1. Search for `#hex`, `rgb`, `hsl`, pixel values with token equivalents
2. Replace with token references
3. Values without matching tokens: decide if a new token is needed or if it's component-specific

**Verify:** Change a token value → component updates automatically.

### 2.4 Icon colors → currentColor

Replace `stroke={color}`, `stroke="#..."` with `stroke="currentColor"`. Remove `getIconColor()` helpers. Set color via CSS on parent.

---

## Phase 3: Polish

Low-risk, any order: naming consistency with project, remove fixed width/margin on wrappers, replace `transition: all` with explicit property lists.

---

## Breaking Changes

Document every public API change:

```
### Props renamed
- `type` → `variant`

### Props removed
- `state` → `disabled` (native) + CSS pseudo-classes + `loading` (boolean)

### Props type changed
- `isChecked: "No"|"Yes"` → `checked: boolean` + `indeterminate: boolean`
- `onChange: (value) => void` → native `ChangeEventHandler`

### Migration
// Before                                    // After
<Button type="Primary" state="Disabled" />   <Button variant="primary" disabled />
<Checkbox isChecked="Yes" />                 <Checkbox checked />
```

---

## Verification Checklist

Run the full checklist from SKILL.md Step 3. Every item must pass. Additionally:

- [ ] Every breaking change documented with before/after
- [ ] Component visually matches original in every variant/state
- [ ] No functionality lost
- [ ] Component is simpler (fewer lines, fewer helpers, fewer props)
- [ ] No bare `document`/`window` outside `useEffect` (SSR safe)
- [ ] Edge cases handled: `undefined` props, empty labels, unexpected values
