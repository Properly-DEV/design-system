# RegisterForm — Pattern Spec

**Figma source:** `https://www.figma.com/design/t0SzZjA8aaFf7v0AqS69wZ/...?node-id=10027-5128`
**Pattern type:** Full Pattern (Path B)
**Preview:** [RegisterForm.html](RegisterForm.html)

---

## A. Anatomy

```
RegisterForm (page — full-viewport, vertically centered)
└── .register-card (white rounded card, max-width 500px)
    ├── .register-card__logo          — "PROPERLY®" brand wordmark
    ├── .register-card__header
    │   ├── h1 .register-card__title  — "Create your account"
    │   └── p  .register-card__subtitle — tagline text
    ├── .register-card__form-panel    — inset panel (neutral-25 bg)
    │   ├── Input  label="First name" placeholder="e.g. Frank"
    │   ├── Input  label="Last name"  placeholder="e.g. Herbert"
    │   ├── Input  label="Email"      type="email"
    │   ├── Input  label="Password"   type="password"
    │   ├── Checkbox label={<>I accept the <a href="/terms">Terms & Privacy Policy</a></>}
    │   │             ⚠ Use plain <a>, NOT LinkButton — LinkButton renders <button>,
    │   │               which is invalid inside the <label> Checkbox renders. Use <a>.
    │   └── Button variant="Primary" size="L" full-width — "Sign Up"
    ├── p .register-card__footer-text — "Have an account?" + LinkButton "Log in"
    ├── .register-card__divider       — <hr>-style line with "or" label
    └── .register-card__social        — row of 3 IconButton (Secondary, size S)
        ├── IconButton aria-label="Sign up with Twitch"
        ├── IconButton aria-label="Sign up with Facebook"
        └── IconButton aria-label="Sign up with LinkedIn"
```

**Component sources:**
| Element | Component file |
|---|---|
| Input fields (×4) | `components/Input.tsx` — `state`, `filled`, `errorMessage` props |
| Checkbox | `components/Checkbox.tsx` — `label`, `checked` props |
| Sign Up button | `components/Button.tsx` — `variant="Primary"` `size="L"` `loading` prop |
| Log in link | `components/LinkButton.tsx` — `size="s"` |
| Social buttons | `components/IconButton.tsx` — `type="Secondary"` + custom `icon` prop |
| Logo, headings, divider | Inline HTML — no component |

---

## B. States

| State | Trigger | Visual diff from Default |
|---|---|---|
| **Default** | Initial page load | Empty inputs, unchecked checkbox, button active |
| **Filled** | User has completed all fields | Input text `color: fg-primary` (filled variant), checkbox checked (brand-green fill) |
| **Loading** | User clicks Sign Up (valid form) | Button shows spinner (opacity-0 label), all inputs and checkbox `disabled` |
| **Error** | Submit with invalid/missing fields | Affected Input fields get `state="Error"` red border + `errorMessage` text below |

---

## C. Interactions

1. **Field focus** — Input border transitions to `--colors-border-secondary`; focus ring (2px `--colors-border-focus`) appears outside field.
2. **Field filled** — Input text changes from `--colors-fg-secondary` (placeholder colour) to `--colors-fg-primary`.
3. **Checkbox toggle** — Box fills with `--colors-bg-brand-primary` (green); check icon becomes visible.
4. **Sign Up click (valid)** → Loading state: Button label opacity → 0, spinner appears and rotates; all form controls disabled.
5. **Sign Up click (invalid)** → Error state: Fields with missing/invalid values display error border + message; focus moves to first invalid field.
6. **"Log in" click** → Navigate to login view (routing — mark as TODO).
7. **Social button click** → Initiate OAuth flow for the corresponding provider (mark as TODO).
8. **"Terms & Privacy Policy" click** → Open terms page/modal (mark as TODO).

---

## D. Layout

| Property | Value |
|---|---|
| Page background | `var(--colors-neutral-50)` |
| Page layout | `display: flex; align-items: center; justify-content: center; min-height: 100vh` |
| Card max-width | `500px` |
| Card border-radius | `var(--radius-xl)` (24px) |
| Card padding | `var(--spacing-10) var(--spacing-8)` (40px top/bottom, 32px left/right) |
| Card gap (between sections) | `var(--spacing-6)` (24px) |
| Form panel background | `var(--colors-neutral-25)` |
| Form panel border-radius | `var(--radius-md)` (12px) |
| Form panel padding | `var(--spacing-6)` (24px) |
| Gap between form fields | `var(--spacing-4)` (16px) |
| Social buttons gap | `var(--spacing-4)` (16px) |
| Scrolling | The page scrolls if viewport is shorter than the card; the card itself does not scroll internally |
| Sticky | Nothing sticky — single viewport page |
| Responsive | Single-column layout; on mobile (< 480px) card fills full width with reduced horizontal padding |

---

## E. Data Contract

### Form fields
| Field | Type | Validation |
|---|---|---|
| `firstName` | `string` | Required, min 1 char |
| `lastName` | `string` | Required, min 1 char |
| `email` | `string` | Required, valid email format |
| `password` | `string` | Required, min 8 chars (exact rules TBD) |
| `acceptedTerms` | `boolean` | Must be `true` to submit |

### Submission payload
```ts
interface RegisterPayload {
  firstName:     string;
  lastName:      string;
  email:         string;
  password:      string;
  acceptedTerms: true;
}
```

### Social auth
Each social button triggers a provider-specific OAuth flow. The provider key (`"twitch" | "facebook" | "linkedin"`) is passed to the auth handler.

---

## F — Form state

### Library
**react-hook-form + Zod** — 5 fields + checkbox validation + async submit.

### Zod schema
```ts
const registerSchema = z.object({
  firstName:     z.string().min(1, "Required"),
  lastName:      z.string().min(1, "Required"),
  email:         z.string().email("Invalid email address"),
  password:      z.string().min(8, "At least 8 characters"),
  acceptedTerms: z.literal(true, { errorMap: () => ({ message: "You must accept the terms" }) }),
});
type RegisterValues = z.infer<typeof registerSchema>;
```

### Validation trigger
**On submit only** — no real-time validation (clean UX, password field especially).

### Success state
- Navigation: redirect to `/dashboard` (or post-login destination)
- Visual: replace form with success message OR immediate redirect — confirm with product

---

## AI Agent Instructions

### Components — import, do not recreate

```tsx
import { Input }       from "@/components/Input";
import { Checkbox }    from "@/components/Checkbox";
import { Button }      from "@/components/Button";
import { LinkButton }  from "@/components/LinkButton";
import { IconButton }  from "@/components/IconButton";
```

Do **not** rebuild any of these components. Use them as-is with the props listed below.

### Structure

Implement the component tree from Section A exactly:

```tsx
<div className="register-card">
  <span className="register-card__logo">PROPERLY®</span>

  <header className="register-card__header">
    <h1 className="register-card__title">Create your account</h1>
    <p className="register-card__subtitle">…</p>
  </header>

  <div className="register-card__form-panel">
    <Input label="First name" placeholder="e.g. Frank" … />
    <Input label="Last name"  placeholder="e.g. Herbert" … />
    <Input label="Email"      type="email" … />
    <Input label="Password"   type="password" … />
    <Checkbox label={<>I accept the <a href="/terms" className="register-card__terms-link">Terms & Privacy Policy</a></>} … />
    {/* Button has no fullWidth prop — use pattern CSS class instead of inline style */}
    <Button variant="Primary" size="L" loading={isLoading} className="register-card__btn-signup">
      Sign Up
    </Button>
    {/* Pattern CSS: .register-card__btn-signup { width: 100%; } */}
  </div>

  <p className="register-card__footer-text">
    Have an account? <LinkButton size="s" label="Log in" onClick={…} />
  </p>

  <div className="register-card__divider">…or…</div>

  <div className="register-card__social">
    <IconButton type="Secondary" icon={<TwitchIcon />}   aria-label="Sign up with Twitch"    onClick={…} />
    <IconButton type="Secondary" icon={<FacebookIcon />} aria-label="Sign up with Facebook"  onClick={…} />
    <IconButton type="Secondary" icon={<LinkedInIcon />} aria-label="Sign up with LinkedIn"  onClick={…} />
  </div>
</div>
```

### Styles

- Use only CSS custom properties from `tokens/tokens.css` — no hardcoded hex values or raw px sizes.
- Name CSS classes using the `.register-card__` prefix (BEM-style, project convention).
- Card: `border-radius: var(--radius-xl)`, `background: var(--colors-bg-primary)`.
- Form panel: `background: var(--colors-neutral-25)`, `border-radius: var(--radius-md)`.
- Page background: `var(--colors-neutral-50)`.

### States

Handle all four states via React state:

- **Default** — initial render, all fields empty, `loading={false}`.
- **Filled** — no explicit state needed; emerges naturally from controlled inputs and `filled` prop on `<Input>` when value is non-empty.
- **Loading** — `isLoading = true`: pass `loading={true}` to Button; pass `disabled` to all inputs and the Checkbox.
- **Error** — per-field error map: pass `state="Error"` and `errorMessage="…"` to each `<Input>` with a validation failure.

### Behaviour

1. On every keystroke, update the form state object.
2. Pass `filled={value.length > 0}` to each `<Input>` to trigger filled text colour.
3. On Sign Up click: validate all fields client-side → if invalid, populate error map and skip submission → if valid, set `isLoading = true` and call the submit handler.
4. On submit success: navigate to the post-registration destination. // TODO: wire routing
5. On submit failure (API error): set `isLoading = false`, show a top-level error message or field-level errors as returned by the API.
6. Social buttons: call `onSocialAuth(provider)` where provider is `"twitch" | "facebook" | "linkedin"`. // TODO: wire OAuth

### TODOs (mark as comments, do not implement)

```tsx
// TODO: wire Sign Up API call — POST /api/auth/register with RegisterPayload
// TODO: wire "Log in" navigation — route to /login
// TODO: wire Terms & Privacy Policy link — route to /terms or open modal
// TODO: wire social OAuth — provider-specific flow (Twitch / Facebook / LinkedIn)
// TODO: password strength indicator (not shown in Figma, check with design)
```

### Notes

- This spec was extracted from Figma node `10027:5128` (file `t0SzZjA8aaFf7v0AqS69wZ`).
- Responsive behaviour (card goes full-width on mobile) is assumed standard; verify exact breakpoint with design.
- Social icon SVGs are placeholders — replace with official brand icons per provider guidelines.
- The "PROPERLY®" logo is text-only in this spec; the real project may use an SVG logo asset.
