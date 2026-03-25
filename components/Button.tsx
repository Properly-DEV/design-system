/*
 * Component: Button
 * Version: RLY Starter Kit — Light | Variables 2.0
 * Figma node: 8150:765 (file: t0SzZjA8aaFf7v0AqS69wZ)
 * Exported: 2026-03-25
 *
 * Tokens: ../tokens/tokens.css
 * Variants: variant × size
 *   variant — Primary | Secondary | Tertiary | Quaternary
 *   size    — S | M | L
 *
 * Breaking changes from previous version:
 *   - `type` prop renamed to `variant` (type is now the native button type attr)
 *   - `state` prop removed — hover/focus/active/disabled are CSS pseudo-classes
 *   - Secondary is now a filled light-gray button (no border)
 *   - Added sizes M and L; S padding is now uniform 4px (was 0 6px)
 *   - Added Quaternary (ghost) variant
 *   - Component now extends ButtonHTMLAttributes and uses forwardRef
 */

import React, { forwardRef } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────

export type ButtonVariant = "Primary" | "Secondary" | "Tertiary" | "Quaternary";
export type ButtonSize    = "S" | "M" | "L";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?:         string;
  variant?:       ButtonVariant;
  size?:          ButtonSize;
  leftIcon?:      React.ReactNode;
  rightIcon?:     React.ReactNode;
  showLeftIcon?:  boolean;
  showRightIcon?: boolean;
  loading?:       boolean;
}

// ── Styles ─────────────────────────────────────────────────────────────────────

const STYLE_ID = "rly-button-styles";

const styles = `
/* ── Base ─────────────────────────────────────────────────────── */
.rly-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  outline: none;
  -webkit-user-select: none;
  user-select: none;
  font-family: var(--font-family-body);
  font-size: var(--button-2-size);
  line-height: var(--button-2-line-height);
  font-weight: var(--button-2-weight);
  color: var(--colors-fg-primary);
  text-transform: capitalize;
  white-space: nowrap;
  overflow: hidden;
  text-decoration: none;
  transition: background 0.15s ease, border-color 0.15s ease, opacity 0.15s ease;
}

/* Let the focus ring escape the clipping boundary */
.rly-button:focus-visible { overflow: visible; }

/* ── Focus ring ───────────────────────────────────────────────── */
.rly-button:focus-visible::after {
  content: '';
  position: absolute;
  inset: -4px;
  border: 2px solid var(--colors-border-focus);
  border-radius: calc(var(--radius-sm) + 4px);
  pointer-events: none;
}
/* Tertiary has a 1px border — offset by one extra pixel */
.rly-button--tertiary:focus-visible::after { inset: -5px; }

/* ── Disabled ─────────────────────────────────────────────────── */
.rly-button:disabled:not([data-loading]) {
  opacity: 0.4;
  cursor: not-allowed;
}

/* ── Loading ──────────────────────────────────────────────────── */
.rly-button[data-loading] { cursor: wait; }
.rly-button[data-loading] .rly-button__label,
.rly-button[data-loading] .rly-button__icon { opacity: 0; }

@keyframes rly-spin { to { transform: translate(-50%, -50%) rotate(360deg); } }

.rly-button__spinner {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  animation: rly-spin 0.8s linear infinite;
}

/* ── Sizes ────────────────────────────────────────────────────── */
.rly-button--s { padding: 4px; }
.rly-button--m { padding: 8px 6px; }
.rly-button--l { padding: 12px 8px; }

.rly-button__label { padding: 0 4px; }
.rly-button--m .rly-button__label,
.rly-button--l .rly-button__label { padding: 0 6px; }

/* ── Icon slot ────────────────────────────────────────────────── */
.rly-button__icon {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
}

/* ── Primary ──────────────────────────────────────────────────── */
.rly-button--primary { background: var(--colors-bg-brand-primary); }

.rly-button--primary:hover:not(:disabled):not([data-loading]),
.rly-button--primary:focus-visible {
  background: var(--colors-bg-brand-secondary);
}
.rly-button--primary:active:not(:disabled):not([data-loading]) {
  background: var(--colors-bg-brand-tertiary);
}

/* ── Secondary ────────────────────────────────────────────────── */
.rly-button--secondary { background: var(--colors-neutral-25); }

.rly-button--secondary:hover:not(:disabled):not([data-loading]),
.rly-button--secondary:focus-visible {
  background: var(--colors-bg-tertiary);
}
.rly-button--secondary:active:not(:disabled):not([data-loading]) {
  background: var(--colors-bg-quarternary);
}

/* ── Tertiary ─────────────────────────────────────────────────── */
.rly-button--tertiary {
  background: transparent;
  border: 1px solid var(--colors-border-secondary);
}
.rly-button--tertiary:hover:not(:disabled):not([data-loading]),
.rly-button--tertiary:focus-visible {
  border-color: var(--colors-border-primary);
}
.rly-button--tertiary:active:not(:disabled):not([data-loading]) {
  border-color: var(--colors-border-secondary);
}

/* ── Quaternary (ghost) ───────────────────────────────────────── */
.rly-button--quaternary { background: transparent; }

.rly-button--quaternary:hover:not(:disabled):not([data-loading]),
.rly-button--quaternary:focus-visible {
  background: var(--colors-bg-tertiary);
}
.rly-button--quaternary:active:not(:disabled):not([data-loading]) {
  background: var(--colors-bg-quarternary);
}
`;

function injectStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement("style");
  el.id = STYLE_ID;
  el.textContent = styles;
  document.head.appendChild(el);
}

// ── Icons ──────────────────────────────────────────────────────────────────────

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="var(--icon-stroke, 2)" strokeLinecap="round" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="var(--icon-stroke, 2)" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="rly-button__spinner">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />
      <path d="M8 2a6 6 0 0 1 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ── Component ──────────────────────────────────────────────────────────────────

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      label         = "Button",
      variant       = "Primary",
      size          = "M",
      leftIcon,
      rightIcon,
      showLeftIcon  = true,
      showRightIcon = true,
      loading       = false,
      disabled,
      className,
      children,
      ...rest
    },
    ref
  ) {
    injectStyles();

    const cls = [
      "rly-button",
      `rly-button--${variant.toLowerCase()}`,
      `rly-button--${size.toLowerCase()}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        className={cls}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        data-loading={loading || undefined}
        {...rest}
      >
        {showLeftIcon && !loading && (
          <span className="rly-button__icon rly-button__icon--left">
            {leftIcon ?? <PlusIcon />}
          </span>
        )}

        <span className="rly-button__label">{children ?? label}</span>

        {showRightIcon && !loading && (
          <span className="rly-button__icon rly-button__icon--right">
            {rightIcon ?? <ChevronRightIcon />}
          </span>
        )}

        {loading && <SpinnerIcon />}
      </button>
    );
  }
);

export default Button;
