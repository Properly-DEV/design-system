---
name: design-system-qa
description: "Audit and refactor React design system components to production quality. Use this skill whenever the user wants to review, audit, QA, lint, improve, or refactor a component from any design system. Triggers include: 'audit this component', 'is this production ready', 'review my Button/Input/etc', 'refactor this to best practices', 'QA this component', 'check component quality', or any request to evaluate whether a React component follows design system conventions. Also triggers when the user shares a component file and asks what's wrong with it, or wants to prepare a component for handoff to developers. Works with ANY design system — not limited to a specific token format or naming convention."
---

# Design System QA

Audit and refactor React design system components to production quality. Works universally across design systems by profiling the project's tokens and conventions before evaluating.

## Two Modes

| Mode | Trigger | What happens |
|------|---------|--------------|
| **Audit** | "audit", "review", "QA", "check", "is this ready" | Read → Profile → Evaluate → Report. No code changes. |
| **Refactor** | "refactor", "fix", "improve", "make production ready" | Audit first, then fix issues one by one, verifying after each change. |

If the user's intent is ambiguous, default to Audit — it's non-destructive and the user can request refactoring after seeing the report.

---

## Step 0: Profile the Design System

Before evaluating any component, build a mental model of the project's conventions. This makes the audit universal — it adapts to whatever DS it encounters.

**Start with `CLAUDE.md`** — look for it in the project root first:
- If it exists: read it. Extract token file path, CSS prefix, CSS strategy, component file structure. Use this as your convention profile — skip the discovery steps below.
- If it does not exist: follow `references/discovery-guide.md` to profile from scratch.

When CLAUDE.md is present, the only discovery step still needed is reading the component under audit. You already know the conventions.

Read `references/discovery-guide.md` only when CLAUDE.md is absent. In short:

1. **Find and read the token file** (CSS custom properties, theme object, or equivalent). Note the naming pattern, categories, and available values.
2. **Read 2–3 existing components** that the team considers "done" or that were recently built. Note: CSS strategy (injected `<style>`, CSS modules, Tailwind, styled-components), class naming convention, props naming patterns, focus ring approach, disabled pattern.
3. **Check for project docs** (README, style guide) that declare conventions explicitly.

If the project has only one component (the one being audited), skip convention profiling — evaluate against universal rules only.

---

## Step 1: Audit

Read `references/audit-rules.md`. It organizes rules into five dimensions:

1. **Props API** — Is the interface idiomatic React? Does it extend native HTML attrs?
2. **Styles & Tokens** — Are all visual values token references? Any hardcoded magic numbers?
3. **Interaction States** — Are hover/focus/active handled by CSS pseudo-classes, not JS props?
4. **Accessibility** — Native HTML elements? Keyboard support? Screen reader semantics?
5. **Architecture** — File structure? No layout opinions? Consistent with project patterns?

For each rule, classify the finding by severity. Read `references/severity-guide.md` for classification criteria. In short:

| Severity | Meaning | Examples |
|----------|---------|---------|
| **Critical** | Broken for end users or developers | Missing native element, no keyboard support, props incompatible with form libraries |
| **Warning** | Works but not production-grade | Inline styles for static values, hardcoded colors, inconsistent naming |
| **Suggestion** | Polish and optimization | File ordering, missing memoization, minor naming tweaks |

### Audit Report Format

Present findings grouped by severity, highest first. For each finding:

```
### [Severity] Short description
**Rule:** Which rule from which dimension
**Location:** File + line/area
**Problem:** What's wrong and why it matters
**Fix:** Concrete code showing before → after
```

End with a summary: X critical, Y warnings, Z suggestions. If zero criticals, say the component is safe to ship with optional improvements.

---

## Step 2: Refactor (only in Refactor mode)

Read `references/refactor-playbook.md` for the full process. The key principle: **one change at a time, verify after each.**

High-level flow:

1. Fix all **Critical** issues first, in this order:
   - Native HTML element + accessibility (foundational — everything else depends on this)
   - Props API (changes the component's public interface)
   - forwardRef (depends on correct element choice)
2. Fix **Warnings** next:
   - Move inline styles → CSS (biggest structural change)
   - Replace hardcoded values → tokens
   - Interaction states → CSS pseudo-classes
3. Apply **Suggestions** last

After refactoring, re-run the audit mentally. The report should come back clean.

### Breaking Changes

If the refactor changes the props API (renaming props, changing types, removing the `state` prop), explicitly list every breaking change and show migration examples:

```tsx
// Before
<Button type="Primary" state="Disabled" />

// After
<Button variant="primary" disabled />
```

---

## Step 3: Validate

After audit or refactor, run this final checklist. Do not print it — if something fails, fix it (refactor mode) or add it to the report (audit mode).

1. **Keyboard:** Tab focuses. Space/Enter activates or toggles.
2. **Interaction states:** `:hover`, `:focus-visible`, `:active` handled by CSS, not JS props.
3. **Disabled:** Native `disabled` attr blocks interaction. Styled via CSS `:disabled`.
4. **Screen reader:** Role, state, and label announced correctly. Native elements used.
5. **Testable:** Queryable via `getByRole`, `getByLabelText` — no reliance on `data-testid` for basic usage.
6. **Form integration:** Works with `<form>` submit, React Hook Form, Formik. Controlled and uncontrolled modes both work.
7. **forwardRef:** Ref reaches the primary native element.
8. **Tokens:** Every color, spacing, radius, font references a design token.
9. **CSS strategy:** No inline styles on static values. Styling approach matches project convention.
10. **Icons:** SVGs use `currentColor` + `aria-hidden="true"`.
11. **SSR safe:** No bare `document`/`window` outside `useEffect`. IDs via `useId()`, not random.
12. **Defensive:** Handles `undefined` props, empty labels, missing callbacks, unexpected variant values.

---

## References

Read these when indicated above:

- **`references/discovery-guide.md`** — How to profile any design system. Read in Step 0.
- **`references/audit-rules.md`** — All five audit dimensions with universal and contextual rules, ❌/✅ examples. Read in Step 1. Has a table of contents.
- **`references/severity-guide.md`** — How to classify findings. Read in Step 1.
- **`references/refactor-playbook.md`** — Safe refactoring process with verification steps. Read in Step 2.
