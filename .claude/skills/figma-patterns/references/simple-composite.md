# Simple Composite — Path A

**When to read:** The pattern consists of 2–3 known components in a straightforward layout. No new elements. No complex state management needed. A screenshot is sufficient — no `get_design_context` call required.

---

## What to extract from the screenshot

For Path A, focus entirely on layout precision:

- Spacing between components (gap, padding, margin)
- Alignment (flex direction, alignment axis, justify)
- Any visible size constraints (min/max width, fixed heights)
- Which token drives each spacing value (check `tokens.css` for closest match)

If you cannot read exact spacing values from the screenshot, note them as `[check Figma]` — the developer will verify in Figma. Do not guess.

---

## Important: what NOT to add to Path A output

- No React/TSX code blocks — spec.md is stack-agnostic
- No props API tables — that belongs in figma-to-react output
- No Do/Don't tables, usage examples, or relationship diagrams
- The AI Agent Instructions section replaces React code — it gives imperatives, not implementation

Keep it lean: Anatomy + Layout + AI Agent Instructions. That's all.

---

## Simplified spec.md template (Path A)

```markdown
# {PatternName} — Composite Spec

## Anatomy

{PatternName}
├── {ComponentA}        [existing: /components/{ComponentA}.tsx]
├── {ComponentB}        [existing: /components/{ComponentB}.tsx]
└── {ComponentC}        [existing: /components/{ComponentC}.tsx]

## Layout

- Direction: row | column
- Gap: var(--spacing-{n})
- Padding: var(--spacing-{n})
- Alignment: {flex-start | center | space-between}
- Width: {full | fixed: Xpx | max-width: Xpx}
- {Any other notable layout rules}

## Notes

{Any edge case or clarification worth passing to the developer.}

## AI Agent Instructions

Use the components from /components/. Compose them as shown in the Anatomy tree above.
Apply layout values exactly as specified — use token variables, never hardcode.
{Add any pattern-specific instruction here, e.g. "render ComponentB only when prop X is truthy"}
```

---

## HTML prototype for Path A

Path A HTML is minimal — a single state (no tab switcher needed unless there are 2+ layout variants).

Structure:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{PatternName}</title>
  <link rel="stylesheet" href="../../tokens/tokens.css">
  <style>
    /* Pattern layout — tokens only */
    .rly-{patternname} {
      display: flex;
      gap: var(--spacing-{n});
      padding: var(--spacing-{n});
    }
  </style>
</head>
<body>
  <div class="rly-{patternname}">
    <!-- Render components here using HTML equivalents -->
  </div>
</body>
</html>
```

Keep CSS minimal. Every value must be a `var(--token)`.
