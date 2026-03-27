---
name: figma-patterns
description: "Use this skill when the user wants to extract a pattern, view, or screen from Figma — a composition of multiple components (e.g. chat view, registration form, dashboard section, onboarding screen). Triggers: 'build this pattern', 'extract this view', 'document this screen', 'create a spec for this layout', 'export this screen', providing a Figma link to a full screen or multi-component frame. Do NOT use for single components with variants — use figma-to-react for those."
---

# Figma → Pattern Spec

Extract Figma patterns into a visual skeleton + behaviour spec. Output serves two consumers: **developers** (any stack) who need a structural starting point, and **AI agents** (Lovable, Cursor, Bolt) who need machine-readable instructions to generate working code.

**Principle:** Get the visual structure perfectly right first. States, interactions, and data details can be refined later — the developer will return to Figma for specifics, and the AI agent will fill gaps or ask follow-up questions.

---

## Decision tree — what are we building?

```
Does the user point to:
├─ A single element with variants?      → Redirect to figma-to-react
├─ 2–3 known components in a layout?   → Path A: Simple Composite
└─ A full screen / view with states?   → Path B: Full Pattern
```

If unsure, ask: *"Does this have multiple view states (loading, empty, error)?"* — Yes → Path B.

---

## Step 1 — Screenshot first

**ALWAYS start with `get_screenshot`.** Never open with `get_design_context`.

From the screenshot:
1. Identify which existing `.tsx` components from `/components/` are visible
2. Assess the layout complexity
3. Decide: Path A or Path B?

> **Screenshot blind spots — do NOT infer these from a screenshot:**
> shadow (`box-shadow`), stroke/border on containers, `backdrop-filter`, `outline`.
> For these properties, the default is **none/0** unless confirmed by `get_design_context`
> on the container node or visible in an existing `.tsx` component file.

**Path A (Simple Composite):** All elements are known components + basic layout → screenshot is enough. Read `references/simple-composite.md`.

**Path B (Full Pattern):** New elements, complex layout, or multiple states needed → may need `get_design_context` on **specific sub-nodes only** (never on the whole frame). Read `references/full-pattern.md`.

---

## Step 2 — Component inventory

List every visible component in the pattern. Check `/components/` for each one.

- Exists as `.tsx` → import it, don't rebuild
- Missing + simple (Divider, Timestamp) → build inline
- Missing + complex → tell user: *"Run figma-to-react on [X] first, then come back."*
  Also append to `TODO.md` (create if absent):
  ```
  - [ ] Build [ComponentName] (needed by [PatternName] pattern, Figma node: [node-id])
  ```

> **Tool rule:** Use the Read tool directly on visible component files — do NOT spawn an Explore agent for this step. Read only the components identified in the inventory, not all files in `/components/`. An Explore agent costs ~40–50k tokens per session; direct Read on 3–5 files costs ~8k tokens — same result at 80% lower cost.

---

## Step 3 — Interview the user

**For every question offer an escape hatch:** *"Answer 'AI fill' — I'll generate a reasonable default."*

**Path A — ask only this:**
> "What states can this composite be in? (loaded only, or also empty/error?)"
If loaded only → skip interview, go to Step 4.

**Path B — read `references/interview-questions.md`** for the full question bank (states, interactions, scroll/sticky, responsive, data). Start with the ★ essential questions only.

---

## Step 4 — Generate output

Generate two files simultaneously and save to `/patterns/`:

### Path A — read `references/simple-composite.md`
Contains the simplified HTML template and spec.md template (Anatomy + Layout + AI Agent Instructions). Self-contained — no other references needed.

### Path B — read these before writing:
- `references/full-pattern.md` → full spec.md template (all 5 sections)
- `references/html-prototype-guide.md` → HTML with state switcher + token rules
- `references/ai-agent-instructions.md` → how to write the AI Agent Instructions section

> **Tool rule:** Read reference files with the Read tool directly — do NOT spawn an Explore agent. Three direct Read calls (~6k tokens) replace one Explore agent session (~40k tokens).

> **Value resolution — resolve BEFORE writing any HTML or TSX:**
>
> **For numeric values** (padding, gap, border-radius, etc. observed in design):
> 1. Match to existing token in `tokens/tokens.css` → use that token.
> 2. No match → propose adding to `tokens.css` (e.g. `--spacing-10: 40px`) and use the new token.
> 3. Never use raw px values in HTML/TSX when a token can represent them.
>
> **For component layout properties** (full-width button, fixed-height input, icon size, etc.):
> 1. Check the component's `.tsx` file for a prop that expresses this — e.g. `fullWidth`, `size="L"`, `icon={…}`.
> 2. If the prop exists → use it. Never use `style={{ width: "100%" }}` or similar.
> 3. If the prop does NOT exist → add a CSS class (`.rly-{component}--full-width`) to the pattern CSS, never inline style.

### Both paths produce two files — do not finish until both exist on disk:
1. **`{PatternName}.html`** — visual prototype, tokens from `tokens.css`, hardcoded data
2. **`{PatternName}.spec.md`** — structured spec always ending with **AI Agent Instructions**

The HTML file is not optional. If you run out of detail, write a minimal HTML skeleton — but always produce the file.

---

## Step 5 — Validate before delivering

- [ ] Every component in Anatomy has a source: existing `.tsx` OR inline style
- [ ] Every view state from the interview has a corresponding HTML tab
- [ ] HTML uses only `tokens.css` variables — zero hardcoded hex/px values
- [ ] `AI Agent Instructions` section exists in spec.md
- [ ] Layout rules cover: what is sticky, what scrolls, key spacing values
- [ ] No `box-shadow`, `border`, or `stroke` added to container elements without Figma confirmation (screenshot alone is not sufficient — verify via `get_design_context` or existing `.tsx` source)
- [ ] Interactive element nesting: no `<button>`, `<a>`, or `<input>` is a descendant of `<label>`, `<button>`, or `<a>`. This class of error silently breaks click handling. Applies to any component that renders a button/link (Button, LinkButton, IconButton) placed inside a label prop, onClick wrapper, or anchor of another component. Fix: make them siblings, not parent-child.

## Step 6 — Deliver audit file and update STATUS.md

### pattern-audit.md

After the two main files are saved, also save `patterns/{PatternName}-audit.md`.
This is a thin reference file — two sections only:

```markdown
# {PatternName} — Pattern Audit

## Figma Translation
| Figma element | Code equivalent |
|---------------|-----------------|
| [layer name]  | [component / inline element] |
| ...           | ... |

## Token Usage
| Token | Used for |
|-------|----------|
| var(--colors-fg-primary) | heading text |
| var(--spacing-4) | section padding |
| ... | ... |
```

No logic, no behavior descriptions. Only what was translated and which tokens were used.

### STATUS.md update

Update `STATUS.md` in the project root — add or update the pattern row in `## Patterns`:
```
| PatternName | ✅ | [PatternName.spec.md](patterns/PatternName.spec.md) | [preview](patterns/PatternName.html) |
```

If STATUS.md does not exist, skip and note it to the user.
