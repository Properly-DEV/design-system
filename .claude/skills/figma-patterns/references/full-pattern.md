# Full Pattern — Path B

**When to read:** The pattern is a full screen or complex view with multiple states, new elements, or non-trivial layout. A screenshot alone may not be enough — use `get_design_context` selectively on specific sub-nodes.

---

## Getting design context efficiently

**Never call `get_design_context` on the whole frame.** It consumes ~25k tokens and returns noise.

Strategy:
1. Start with `get_screenshot` of the full frame — identify all sections
2. For components already in `/components/` — skip context, screenshot only
3. Call `get_design_context` only on **unknown or complex sub-nodes**:
   - A new component you haven't seen before
   - A layout section with unclear spacing/nesting
   - An element with non-obvious visual tokens
4. **Always call `get_design_context` on the outermost non-component container** — the card, panel, or wrapper div that is NOT an existing `.tsx` component. This is the single most cost-effective call: it confirms shadow, border, exact padding, and border-radius before any HTML is written. One call, ~2–4k tokens, prevents an entire class of assumption errors.

Decision matrix:
- Known component from `/components/` → skip context, screenshot only
- Unknown sub-node or inline element with unclear properties → `get_design_context` if needed
- **Outermost wrapper div / card / panel** → always `get_design_context`, no exceptions

If the user has multiple state frames in Figma (e.g. `chat-empty`, `chat-loaded`, `chat-error`):
- `get_screenshot` of each state frame
- `get_design_context` only if a state introduces new/unknown elements

---

## Full spec.md template (Path B)

```markdown
# {PatternName} — Pattern Spec

## A — Anatomy

{PatternName}
├── {SectionA}                    [sticky top | scrollable | fixed height: Xpx]
│   ├── {ComponentA}              [existing: /components/{ComponentA}.tsx]
│   ├── {ComponentB}              [existing: /components/{ComponentB}.tsx]
│   └── {ElementC}                [inline: {token-based description}]
├── {SectionB}                    [flex-grow, scrollable]
│   └── {ComponentD}[]            [existing: /components/{ComponentD}.tsx, repeating]
└── {SectionC}                    [sticky bottom]
    ├── {ComponentE}              [existing: /components/{ComponentE}.tsx]
    └── {ComponentF}              [existing: /components/{ComponentF}.tsx]

## B — States

| State    | Description                  | What is visible              | Figma frame      |
|----------|------------------------------|------------------------------|------------------|
| Empty    | No content yet               | CTA / empty state message    | {frame-name}     |
| Loading  | Data fetching in progress    | Skeleton placeholders        | {frame-name}     |
| Loaded   | Content available            | Full component tree          | {frame-name}     |
| Error    | Load failed                  | Error message + retry action | {frame-name}     |

Add / remove rows as needed. If a state is not in Figma, note it as `[not in Figma — describe behavior]`.

## C — Interactions

[AI fill OK if user skips]

→ User performs {main action}:
  1. {Visual change #1 — which component, what changes}
  2. {Visual change #2}
  3. On success: {outcome}
     On error: {outcome}

→ {Secondary interaction}:
  1. ...

## D — Layout

- {SectionA}: {sticky top | sticky bottom | fixed height Xpx | border: var(--...)}
- {SectionB}: {flex: 1 | overflow-y: auto | padding: var(--spacing-n)}
- Gap between items: var(--spacing-{n})
- Breakpoints: [AI fill OK if user skips]
  - < 768px → {behavior}
  - ≥ 768px → {behavior}

## E — Data contract

[AI fill OK if user skips]

{PrimaryEntity}:
  - id: string
  - {field}: {type} — {description}
  - {field}: {type} — {description}

{ViewProps}:
  - {field}: {type}
  - isLoading: boolean
  - error: string | null

## F — Form state [include only if pattern contains a form]

### Library
<!-- AI fill OK: choose based on form complexity -->
- **useState** — simple forms: ≤4 fields, no async validation, no field dependencies
- **react-hook-form + Zod** — complex forms: 5+ fields OR async validation OR field cross-dependencies

### Zod schema [include if react-hook-form chosen]
\`\`\`ts
const {schemaName}Schema = z.object({
  {field}: z.string().min(1, "Required"),
  {field}: z.string().email("Invalid email address"),
  {field}: z.string().min(8, "At least 8 characters"),
  // acceptedTerms: z.literal(true, { errorMap: () => ({ message: "You must accept the terms" }) }),
});
type {SchemaName}Values = z.infer<typeof {schemaName}Schema>;
\`\`\`

### Validation trigger
<!-- AI fill OK: on-submit is the safe default -->
- **On submit only** (safe default — no annoying real-time errors)
- On blur after first submit attempt
- Real-time (only for specific fields like password strength)

### Success state
<!-- required — always specify: what happens after successful submit? -->
- Navigation: {route} OR no navigation (inline success message)
- Visual: {toast | redirect | replace form with success message}

```

After completing sections A–E (and F if applicable), write the **AI Agent Instructions** section.
Read `references/ai-agent-instructions.md` for the format and good/bad examples.

---

## Notes on "AI fill OK" fields

When the user skips a question tagged `[AI fill OK]`:
- Mark the section with a comment: `<!-- AI-generated default — review before shipping -->`
- Generate a reasonable assumption based on common patterns for this type of view
- Keep the assumption minimal and explicit, so both developer and AI agent can easily override it
