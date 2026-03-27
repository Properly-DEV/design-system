# HTML Prototype Guide

**When to read:** During Step 4 (Path B), when building the `.html` output file for a full pattern with multiple states.
**Path A:** Use the template inside `simple-composite.md` instead — it's shorter and sufficient.

**Contents:** [Path B template](#full-template) · [CSS naming](#css-naming) · [Token rules](#token-rules) · [Skeleton pattern](#skeleton) · [What to hardcode](#hardcode)

**Save output to:** `/patterns/{PatternName}.html`

---

## Full template (Path B) {#full-template}

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{PatternName} — Pattern Prototype</title>
  <link rel="stylesheet" href="../tokens/tokens.css">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--typography-body-font-family, sans-serif);
      background: var(--colors-bg-primary);
      color: var(--colors-fg-primary);
    }
    .prototype-toolbar {
      display: flex;
      gap: var(--spacing-2);
      padding: var(--spacing-3) var(--spacing-4);
      background: var(--colors-bg-secondary);
      border-bottom: 1px solid var(--colors-border-secondary);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .prototype-toolbar button {
      padding: var(--spacing-1) var(--spacing-3);
      border: 1px solid var(--colors-border-primary);
      border-radius: var(--radius-md);
      background: var(--colors-bg-primary);
      color: var(--colors-fg-secondary);
      cursor: pointer;
      font-size: var(--typography-label-sm-size);
    }
    .prototype-toolbar button.active {
      background: var(--colors-bg-brand);
      color: var(--colors-fg-on-brand);
      border-color: transparent;
    }
    .state-panel { display: none; }
    .state-panel.active { display: block; }

    /* Pattern styles — tokens only */
    .rly-{patternname} { }
    .rly-{patternname}__{element} { }
  </style>
</head>
<body>
  <nav class="prototype-toolbar">
    <button class="active" onclick="showState('loaded')">Loaded</button>
    <button onclick="showState('empty')">Empty</button>
    <button onclick="showState('loading')">Loading</button>
    <button onclick="showState('error')">Error</button>
  </nav>

  <div id="state-loaded" class="state-panel active">
    <div class="rly-{patternname}">
      <!-- Loaded state — hardcoded sample data -->
    </div>
  </div>
  <div id="state-empty" class="state-panel">
    <div class="rly-{patternname}"><!-- Empty state --></div>
  </div>
  <div id="state-loading" class="state-panel">
    <div class="rly-{patternname}"><!-- Skeleton loading state --></div>
  </div>
  <div id="state-error" class="state-panel">
    <div class="rly-{patternname}"><!-- Error state --></div>
  </div>

  <script>
    function showState(name) {
      document.querySelectorAll('.state-panel').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.prototype-toolbar button').forEach(el => el.classList.remove('active'));
      document.getElementById('state-' + name).classList.add('active');
      event.target.classList.add('active');
    }
  </script>
</body>
</html>
```

Add/remove state tabs to match the states from the spec. Only include states the pattern actually has.

---

## CSS naming {#css-naming}

BEM-like with `rly-` prefix:
```
.rly-{patternname}                    → root
.rly-{patternname}__{element}         → child
.rly-{patternname}__{element}--{mod}  → modifier
```

---

## Token rules {#token-rules}

Every visual value must be a CSS variable — never hardcoded:

| Property | Token example |
|----------|--------------|
| color | `var(--colors-fg-primary)` |
| background | `var(--colors-bg-secondary)` |
| border | `1px solid var(--colors-border-primary)` |
| spacing | `var(--spacing-4)` |
| border-radius | `var(--radius-md)` |
| font-size | `var(--typography-body-size)` |
| shadow | `var(--shadow-md)` |

If a token doesn't exist for a value → use closest + comment: `/* closest available — check tokens.css */`

**Zero defaults for container decoration**
`box-shadow`, `border`, and `outline` on container `<div>` elements default to **none** — do not add them based on visual judgment from a screenshot. Screenshots cannot reliably show 1px borders or subtle shadows. Add these only when confirmed by `get_design_context` on that specific node.

**No inline styles for component-expressible properties**
Before writing `style={{ X }}` on a component, check if X can be expressed as a prop (e.g. `fullWidth`, `size`, `variant`). Inline styles on components bypass the design system intent and create maintenance debt. For wrapper divs: always CSS class + token, never `style={{}}`.

---

## Skeleton / loading state {#skeleton}

```html
<div style="width:100%; height:var(--spacing-5); background:var(--colors-bg-secondary);
  border-radius:var(--radius-sm); animation:skeleton-pulse 1.5s ease-in-out infinite;"></div>
```
```css
@keyframes skeleton-pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
```

---

## What to hardcode (intentionally) {#hardcode}

Sample data is always hardcoded in the prototype — this is correct:
- Names, messages, timestamps, counts

Never hardcode: colors, spacing, typography, radius, shadows.
