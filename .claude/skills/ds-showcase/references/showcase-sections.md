# Showcase Section Templates

## Component section template

```html
<section id="component-[name]" class="component-section">
  <div class="component-header">
    <h2>[ComponentName]</h2>
    <div class="component-meta">
      <span>file:</span> components/[Name].tsx &nbsp;·&nbsp;
      <span>variants:</span> [axis1] × [axis2] &nbsp;·&nbsp;
      <span>node:</span> [figma-node-id]
    </div>
  </div>

  <!-- One variant-group per axis or logical grouping -->
  <div class="variant-group">
    <div class="variant-group-label">[Group Name] — [Axis]</div>
    <div class="variant-row">
      <div class="variant-cell">
        <!-- Rendered component HTML here -->
        <div class="variant-label">[State Name]</div>
      </div>
    </div>
  </div>
</section>
```

## Color swatch template

```html
<div class="color-grid">
  <div class="swatch">
    <div class="swatch-color" style="background:var(--token-name)"></div>
    <div class="swatch-info">
      <div class="swatch-name">Human Name</div>
      <div class="swatch-hex">#hexvalue</div>
      <div class="swatch-var">--token-name</div>
    </div>
  </div>
</div>
```

Note: white swatches need `border-bottom: 1px solid var(--colors-border-tertiary)` on `.swatch-color`.

## Typography specimen template

```html
<div class="type-specimen">
  <div class="type-meta">
    <div class="type-label">Heading 1</div>
    <div class="type-details">56px / 64px · Medium</div>
  </div>
  <div class="type-preview" style="font-size:var(--heading-1-size);line-height:var(--heading-1-line-height);font-weight:500">
    The quick brown fox
  </div>
</div>
```

Use "The quick brown fox jumps over the lazy dog" scaled to fit.
Use "Aa" only for Display sizes (too large for full sentence).
Use "Button Label" for button styles.
Use "Label Text" with `text-transform:uppercase;letter-spacing:0.06em` for label styles.

## Spacing bar template

```html
<div class="spacing-list">
  <div class="spacing-item">
    <div class="spacing-bar" style="width:var(--spacing-4)"></div>
    <div class="spacing-info">--spacing-4 · 16px</div>
  </div>
</div>
```

## Radius demo template

```html
<div class="radius-grid">
  <div class="radius-demo">
    <div class="radius-box" style="border-radius:var(--radius-md)"></div>
    <div class="radius-label">--radius-md<br/>12px</div>
  </div>
</div>
```

## Shadow demo template

```html
<div class="shadow-grid">
  <div class="shadow-demo">
    <div class="shadow-box" style="box-shadow:var(--shadow-md)"></div>
    <table class="token-table" style="width:140px">
      <tr><td class="token-name">--shadow-md</td></tr>
      <tr><td class="token-value" style="font-size:10px">0 2px 8px + 0 4px 14px</td></tr>
    </table>
  </div>
</div>
```

## Component states — how to find the right class names

Do NOT hardcode component-specific class names here. Every project uses different prefixes.

**Always read the component's `.tsx` file first:**
1. Open the component file (e.g. `components/Button.tsx`)
2. Find the `injectStyles()` function — scan the CSS string for class selectors (`.class-name`)
3. Find all `className=` attributes in the JSX
4. Use those exact names — never invent or guess

Example pattern to look for:
```tsx
// In injectStyles():
.my-btn { ... }
.my-btn--primary { ... }
.my-btn--loading { ... }

// In JSX:
<button className={`my-btn my-btn--${variant}`}>
```

Then mirror those exact classes in the showcase HTML.

For state variants (hovered, focused, error, disabled, loading):
- Check if the component uses CSS pseudo-classes (`:hover`, `:disabled`) — if so, static HTML can't show them; add a note in the showcase instead
- Check if the component accepts explicit state props or modifier classes — if so, apply them in static HTML

## Dark background variant row

```html
<div class="variant-row dark-bg">
  <!-- components here -->
</div>
```
`.dark-bg` sets `background: var(--utilities-bg-section-inverse)` and adjusts label color.
