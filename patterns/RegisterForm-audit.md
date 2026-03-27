# RegisterForm — Pattern Audit

## Figma Translation

| Figma element | Code equivalent |
|---|---|
| Card frame (white, rounded) | `.register-card` div — `border-radius: var(--radius-xl)`, `background: var(--colors-bg-primary)` |
| "PROPERLY®" logo text | `.register-card__logo` span — inline, font-weight 700 |
| "Create your account" heading | `h1.register-card__title` — `var(--heading-3-size)` |
| Subtitle paragraph | `p.register-card__subtitle` — `var(--body-3-size)`, `var(--colors-fg-secondary)` |
| Input fields ×4 (First name, Last name, Email, Password) | `<Input>` from `components/Input.tsx` — `label`, `placeholder`, `type` props |
| Terms checkbox | `<Checkbox>` from `components/Checkbox.tsx` — `label` as ReactNode with `<a>` (not LinkButton — invalid nesting inside `<label>`) |
| "Sign Up" button | `<Button variant="Primary" size="L">` from `components/Button.tsx` — full-width |
| "Have an account? Log in" | `<LinkButton size="s">` from `components/LinkButton.tsx` |
| "or" horizontal divider | `.register-card__divider` — flex row with two `<div>` lines and label text |
| Social icon buttons ×3 | `<IconButton type="Secondary">` from `components/IconButton.tsx` — custom `icon` prop |
| Form inset panel (grey bg) | `.register-card__form-panel` div — `background: var(--colors-neutral-25)`, `border-radius: var(--radius-md)` |

## Token Usage

| Token | Used for |
|---|---|
| `var(--colors-neutral-50)` | Page background |
| `var(--colors-neutral-25)` | Form panel background |
| `var(--colors-bg-primary)` | Card background, input field background |
| `var(--colors-fg-primary)` | Logo text, heading, filled input text |
| `var(--colors-fg-secondary)` | Subtitle, footer text, empty input text |
| `var(--colors-fg-tertiary)` | Input labels |
| `var(--colors-fg-brand-primary)` | LinkButton text, Terms link |
| `var(--colors-bg-brand-primary)` | Sign Up button fill, checkbox checked fill |
| `var(--colors-bg-brand-secondary)` | Sign Up button hover fill |
| `var(--colors-border-tertiary)` | Input default border, divider line |
| `var(--colors-border-secondary)` | Input hover/focus border, checkbox box border |
| `var(--colors-border-system-error-primary)` | Input error state border |
| `var(--colors-fg-system-error-primary)` | Input error message text |
| `var(--colors-border-focus)` | Keyboard focus ring on inputs, button, checkbox |
| `var(--radius-xl)` | Card border-radius (24px) |
| `var(--radius-md)` | Input field border-radius, form panel border-radius (12px) |
| `var(--radius-sm)` | Button border-radius, icon button border-radius (8px) |
| `var(--radius-xs)` | Checkbox box border-radius (4px) |
| `var(--spacing-4)` | Gap between form fields, social buttons gap (16px) |
| `var(--spacing-6)` | Form panel padding, card section gap (24px) |
| `var(--spacing-8)` | Card horizontal padding (32px) |
| `var(--spacing-10)` | Card vertical padding (40px) — token added to tokens.css |
| `var(--heading-3-size)` / `var(--heading-3-line-height)` | "Create your account" title |
| `var(--heading-5-size)` / `var(--heading-5-line-height)` | Logo text |
| `var(--body-2-size)` / `var(--body-2-line-height)` | Input field text |
| `var(--body-3-size)` / `var(--body-3-line-height)` | Input labels, subtitle, checkbox label, footer text |
| `var(--body-4-size)` / `var(--body-4-line-height)` | Input error messages |
| `var(--button-2-size)` / `var(--button-2-line-height)` / `var(--button-2-weight)` | Sign Up button label |
| `var(--font-family-headings)` | Logo, title |
| `var(--font-family-body)` | All body copy, labels, inputs |
