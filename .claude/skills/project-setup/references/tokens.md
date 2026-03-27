# Stage 1 — Tokens

Build `tokens/tokens.css` from two sources: `variables.json` and Figma MCP.

---

## Source A — variables.json

This is the **native Figma variable export** (Figma → Resources → Variables → Export). The format is always:

```json
{
  "collections": [
    {
      "name": "Colors",
      "modes": [
        { "name": "Light", "variables": [
          { "name": "Brand/500", "value": "#00ec88", "type": "COLOR" },
          { "name": "FG/Primary", "value": "#080808", "type": "COLOR" }
        ]},
        { "name": "Dark", "variables": [
          { "name": "Brand/500", "value": "#00c070", "type": "COLOR" },
          { "name": "FG/Primary", "value": "#ffffff", "type": "COLOR" }
        ]}
      ]
    },
    {
      "name": "Spacing",
      "modes": [{ "name": "Default", "variables": [
        { "name": "4", "value": 16, "type": "FLOAT" }
      ]}]
    }
  ]
}
```

### Multi-mode detection (required step)

Before generating tokens, count the modes in each collection:

- **1 mode per collection** → generate a single `:root {}` block only
- **2 modes per collection** → generate `:root {}` for the first mode (Light) + a second block for the second mode (Dark)

For the dark mode block, ask the user which approach they prefer:
> "I found a Dark mode in variables.json. How should I apply it — via `[data-theme="dark"]` attribute, or `@media (prefers-color-scheme: dark)`?"

Use their answer for all dark-mode collections.

**How to process:** iterate over `collections` → `modes[].variables`. Each variable becomes a CSS custom property:

```
collection.name / variable.name  →  --token-name
Colors / Brand/500               →  --colors-brand-500
Colors / FG/Primary              →  --colors-fg-primary
Spacing / 4                      →  --spacing-4
Radius / MD                      →  --radius-md
```

Naming rules:
- Slash `/` in name → hyphen `-`
- Uppercase → lowercase
- Keep exact names from Figma — do not translate, do not abbreviate
- Type `FLOAT` → add `px` for spacing/radius/size; leave as a number for font-weight and similar

---

## Source B — Figma MCP

Use `get_design_context` or query the Figma file via MCP. Fetch:

**Text styles** — each style is a set of:
- `fontSize`, `lineHeight`, `fontWeight`, `fontFamily`
- The Figma style name becomes the token prefix: `Heading/1` → `--heading-1-size`, `--heading-1-line-height`

**Effects (shadows)** — each Drop Shadow effect:
- `x`, `y`, `blur`, `spread`, `color` (with opacity)
- Name: `Shadow/SM` → `--shadow-sm`

**If MCP is unavailable:** do not leave empty sections. Ask the user:

> "Figma MCP is not available. I need values for text styles and shadows to complete tokens.css. You can describe them (e.g. 'Heading 1 is 56px, line-height 64px, weight 500') or paste a Figma screenshot — I'll fill in the rest."

If the user cannot provide data — generate tokens.css without those sections and add a comment `/* MISSING DATA — fill in manually */` in the relevant place. Do not continue with an incomplete file without informing the user.

---

## Output format — tokens.css

**Single mode (light only):**

```css
/* ============================================================
   [Project name] — Design Tokens
   Source: Figma Variables + MCP Styles
   Generated: [date]
   ============================================================ */

:root {

  /* ── Colors: Brand ───────────────────────────────────────── */
  --colors-brand-500: #00ec88;

  /* ── Colors: Foreground ──────────────────────────────────── */
  --colors-fg-primary: #080808;

  /* ── Spacing ────────────────────────────────────────────── */
  --spacing-4: 16px;

  /* ── Radius ─────────────────────────────────────────────── */
  --radius-md: 12px;

  /* ── Typography ──────────────────────────────────────────── */
  --font-family-body: "Inter", sans-serif;
  --heading-1-size: 56px;
  --heading-1-line-height: 64px;

  /* ── Shadows ─────────────────────────────────────────────── */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.06), 0 1px 10px rgba(0,0,0,0.1);

}
```

**Two modes (light + dark) — example with data-theme:**

```css
:root {
  /* Light mode tokens */
  --colors-brand-500: #00ec88;
  --colors-fg-primary: #080808;
}

[data-theme="dark"] {
  --colors-brand-500: #00c070;
  --colors-fg-primary: #ffffff;
}
```

Non-colour collections (Spacing, Radius, Typography, Shadows) that have only one mode are always in `:root` only.

**Rules:**
- One file, each mode in its own block
- Section comments for each category
- Order: Colors → Spacing → Radius → Typography → Shadows → rest
- Zero values not defined in Figma — do not add your own

---

## Verification after generation

Before moving to Stage 2, check:

- [ ] Every colour from variables.json has its token
- [ ] Text styles are complete (size + line-height for each)
- [ ] Fonts are handled (see below)
- [ ] Dark mode block generated if 2 modes found
- [ ] File loads without errors (no typos in names)

### Font handling

**Have woff2 files** (`assets/fonts/`) → add `@font-face` before `:root`:
```css
@font-face {
  font-family: "FontName";
  src: url("../assets/fonts/name.woff2") format("woff2");
  font-weight: 400;
  font-display: swap;
}
```

**No woff2 files** → check font name from variables.json or MCP, switch to Google Fonts and inform the user:

```css
/* Fonts — Google Fonts fallback (no local woff2 files) */
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap");
```

> "No local font files found. Using Google Fonts for [font name]. If you have woff2 files, add them to `assets/fonts/` and let me know — I'll update tokens.css."

Show the user a summary: how many tokens were generated per category.
