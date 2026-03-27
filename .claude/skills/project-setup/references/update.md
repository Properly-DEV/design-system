# Update mode — existing project

Use this mode when the project already exists and Figma has changed.

---

## Step 1 — Establish what changed

Ask the user:

> "What changed in Figma? (e.g. new colours, updated spacing, new text styles, everything)"

If they don't know — fetch the new `variables.json` and compare with the current `tokens.css`.

## Step 2 — Token diff

Read the existing `tokens/tokens.css` and the new `variables.json`. Compare:

```bash
cat tokens/tokens.css
cat variables.json
```

Find three categories of changes:

**New tokens** — in variables.json, missing from tokens.css
```
+ --colors-brand-950: #00291b   ← NEW
```

**Changed values** — token exists in both but value differs
```
~ --colors-brand-500: #00ec88 → #00f090   ← CHANGED
```

**Removed tokens** — in tokens.css, missing from variables.json
```
- --colors-neutral-150: #d0d0d0   ← REMOVED
```

## Step 3 — Report before making changes

Before changing anything, show the user the diff:

```
Changes found in tokens:

New (3):
  --colors-brand-950: #00291b
  --spacing-10: 40px
  --radius-2xl: 32px

Changed (1):
  --colors-brand-500: #00ec88 → #00f090

Removed (2):
  --colors-neutral-150  ⚠️ may be used in components
  --shadow-xs           ⚠️ may be used in components

Continue?
```

**Warning for removed tokens:** if a token was used in components, removing it will cause visual breakage. Always warn the user — let them decide whether to remove or keep as deprecated.

## Step 4 — Update tokens.css

After user confirmation:

1. Add new tokens to the appropriate sections
2. Update changed values
3. Do **not** automatically remove deprecated tokens — comment them out with a note:

```css
/* DEPRECATED — removed from Figma [date]. Check usage before deleting. */
/* --colors-neutral-150: #d0d0d0; */
```

## Step 5 — MCP styles (if available)

If Figma MCP is available — check whether text styles or shadows also changed. Apply the same diff process for the Typography and Shadows sections of tokens.css.

## Step 6 — Update CLAUDE.md

In the "Figma → Last export" section, enter today's date.

If there were deprecated tokens — add them to TODO.md (create if it doesn't exist):
```
- [ ] Check usage of --colors-neutral-150 in components (deprecated)
```
