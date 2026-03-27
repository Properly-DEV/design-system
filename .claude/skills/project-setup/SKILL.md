---
name: project-setup
description: "Runs the full setup of a new design system project OR updates tokens in an existing project. Use this skill whenever the user says 'start a new project', 'project setup', 'I have exported files from Figma', 'prepare the design system project', 'update tokens', 'Figma changed', or when the folder contains variables.json and/or SVG assets. The skill handles the entire process from raw Figma exports to a ready foundation for building components."
---

# Project Setup — Design System

Walk the user through the full project setup. Each stage is separate — complete it, confirm with the user, then move on.

## Mode detection

At the start, determine which mode to use:

- **New project** — no `tokens.css`, no `CLAUDE.md` → run Stages 1–4
- **Update** — `tokens.css` or `CLAUDE.md` already exists → read `references/update.md` and apply only what changed

If unsure which mode — ask the user.

## File access

Project files are on the user's computer. Use `bash_tool` to read them:

```bash
# Check the project folder contents
ls -la
cat variables.json
ls assets/icons/
```

If `bash_tool` is not available — ask the user to paste the contents of `variables.json` directly in the chat.

## What should be in the folder

- `variables.json` — native Figma variable export (**required**)
- `assets/icons/` — SVG files (optional but recommended before building components)
- `assets/images/` — PNG/WebP (optional)
- `assets/fonts/` — woff2 files (optional — if missing, the skill will use Google Fonts)

If `variables.json` is missing — stop and tell the user how to export it from Figma.

---

## Stage order

### Stage 1 — Tokens
Read `references/tokens.md`.

Input: `variables.json` + data from Figma MCP (text styles, shadows)
Output: `tokens/tokens.css`

### Stage 2 — Icons
Read `references/icons.md`.

Input: `assets/icons/` folder with SVG files
Output: `assets/icons/` with optimised SVGs + React components

### Stage 3 — CLAUDE.md
Read `references/claude-md.md`.

Input: everything generated in Stages 1–2
Output: `CLAUDE.md` in the project root

### Stage 4 — Verification
Read `references/checklist.md`.

Check that the project is ready for building the first component.
This stage also creates `TODO.md` if any gaps were found during setup.

---

## Rules

- Complete one stage at a time. Do not proceed without user confirmation.
- Default stack is **React + TypeScript** — unless the user says otherwise.
- If Figma MCP is unavailable — ask the user to fill in missing values. Details in `references/tokens.md`.
- Do not create files the user did not ask for. Ask before adding anything outside the list.
