# AI Agent Instructions Guide

**When to read:** During Step 4, when writing the `AI Agent Instructions` section at the end of the spec.md file. This section is always generated — for both Path A and Path B.

**Purpose:** AI agents (Lovable, Cursor, Bolt, ChatGPT with code execution) read this section to understand what to build, what constraints to follow, and what to leave as TODOs. Write it as direct imperatives, not descriptions.

---

## Format for the AI Agent Instructions section

Place this as the **last section** in every spec.md:

```markdown
---

## AI Agent Instructions

You are implementing **{PatternName}**. This is a visual skeleton — implement the structure and styles first. Add application logic (API calls, state management, routing) as TODO comments.

### Components
Import from /components/ — do not recreate:
- `{ComponentA}` — use for {role in pattern}
- `{ComponentB}` — use for {role in pattern}
- `{ComponentC}` — use for {role in pattern}

### Structure
Implement the component tree from the Anatomy section exactly — preserve nesting, order, and layout.

### Styles
- Use only token variables from `tokens.css` — never hardcode colors, spacing, or typography.
- Apply layout rules from Section D: {key rule 1}, {key rule 2}.
- CSS class naming: `.rly-{patternname}__{element}--{modifier}`

### States
Implement all states from Section B. Default render: **{Loaded}** state.
- {Empty} state: {one-line description of what to show}
- {Loading} state: {one-line description — usually skeletons}
- {Error} state: {one-line description}

### Behaviour
{List imperatives from Section C — one line each}
- After {action}: {immediate visual change}
- {ComponentX} renders with opacity: 0.6 in the {sending} state
- Scroll to bottom when a new item is appended to the list
<!-- AI-generated default: adjust to actual behaviour from Section C -->

### TODOs (do not implement — mark as comments)
- Data fetching / API calls
- WebSocket or real-time connections
- Routing and navigation
- Authentication / permissions
{Add any others that came up in the interview}

### Notes
{Any pattern-specific callout — e.g. "Figma source: {file}/{frame}", "Responsive behaviour not specified — default 768px breakpoint applied"}
```

---

## Writing good vs bad instructions

**Good — direct, imperative, specific:**
```markdown
- Import `ChatBubble` from /components/ChatBubble.tsx — do not recreate it.
- Set `opacity: 0.6` on ChatBubble when `status === 'sending'`.
- Scroll MessageList to bottom after appending a new message.
- Leave WebSocket subscription as `// TODO: connect WebSocket here`.
```

**Bad — vague, descriptive, leaves room for interpretation:**
```markdown
- Use the ChatBubble component
- Messages should look different when sending
- There is some scroll behaviour
- WebSocket will be needed later
```

---

## How AI agents read this file

Agents like Lovable read the file top-to-bottom. They prioritise:
1. **Component imports** — they look for explicit "use X from Y" instructions
2. **Visual structure** — the Anatomy tree is the most important part
3. **Explicit constraints** — "never hardcode", "do not recreate"
4. **TODOs** — they leave these as comments, not implement them

Keep the AI Agent Instructions section **dense and imperative**. No full sentences where a bullet point suffices. No explanations of why — just what.

---

## When sections have "AI fill" defaults

If the user skipped questions and defaults were generated, add a note in this section:

```markdown
> **Auto-generated defaults applied** — sections marked with `<!-- AI-generated default -->` were not specified by the designer. Review before shipping:
> - Responsive: 768px breakpoint assumed
> - Animations: none assumed
> - Data contract: inferred from visible elements
```

This ensures the AI agent and developer both know which parts need verification.

---

## Universal rules for all patterns

**Interactive element nesting — universal rule:**
HTML interactive elements cannot be nested. A `<button>` inside a `<label>`, `<a>` inside `<button>`, or `<button>` inside `<a>` creates invalid HTML where click events fight each other or silently fail.
Any time a component renders an interactive element and you're placing it inside another component's `label`, `children`, or wrapper — check what HTML that parent renders. If it renders `<label>`, `<button>`, or `<a>`, restructure to siblings.

---

## Path A — minimal AI Agent Instructions

For simple composites, the section can be very short:

```markdown
## AI Agent Instructions

Implement **{PatternName}** by composing:
- `{ComponentA}` — [existing: /components/{ComponentA}.tsx]
- `{ComponentB}` — [existing: /components/{ComponentB}.tsx]

Layout: {flex row | column}, gap: var(--spacing-{n}), padding: var(--spacing-{n}).
Use only token variables from tokens.css.
No application logic needed for this composite.
```
