# Stage 4 — Final Verification

Check that the project is ready for building the first component.

---

## Checklist

### Tokens
- [ ] `tokens/tokens.css` exists
- [ ] File has a `:root` block with at least: colours, spacing, radius, typography
- [ ] Zero hardcoded values outside `:root` (no `#hex` or `16px` outside tokens)
- [ ] If woff2 fonts existed — `@font-face` is defined
- [ ] If 2 modes found — dark mode block exists (data-theme or media query)

### Icons
- [ ] Folder `assets/icons/` exists and is not empty
- [ ] All SVGs use `currentColor`
- [ ] No SVG has a hardcoded colour (`fill="#..."`, `stroke="#..."`)
- [ ] If React components — `index.ts` barrel file exists

### CLAUDE.md
- [ ] File exists in project root
- [ ] Stack is defined
- [ ] CSS prefix is defined
- [ ] Path to tokens.css is correct
- [ ] "Component list is in STATUS.md" note is present

### Folder structure
- [ ] `tokens/` exists
- [ ] `assets/icons/` exists
- [ ] `components/` exists (even if empty)

---

## TODO.md — create if gaps found

If any checklist item failed, or if any values in tokens.css are `[to be filled]`, or if Figma MCP was unavailable during token generation — create `TODO.md` in the project root:

```markdown
# TODO

Items to resolve before the first component can be built.

## Missing token data
- [ ] [Description of missing value, e.g. "Shadow/MD value — Figma MCP was unavailable"]

## Missing assets
- [ ] [Description, e.g. "woff2 font files — currently using Google Fonts fallback"]

## To confirm
- [ ] [Description, e.g. "Dark mode approach: data-theme attribute or media query?"]
```

Only create TODO.md if there are actual items to record. Do not create an empty file.

---

## Final report

After verification, show the user:

```
✅ Setup complete — [Project name]

Generated:
  tokens.css     — [N] tokens (colours: X, spacing: X, radius: X, typography: X, shadows: X)
  icons          — [N] icons ([format])
  CLAUDE.md      — ready

Ready to build components.

⚠️ Open items (see TODO.md):
  [list if any]

Next step: build the first component using the figma-to-react skill.
```

If any checklist item failed — list what needs attention before proceeding.
