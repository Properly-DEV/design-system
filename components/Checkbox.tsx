/*
 * Component: Checkbox
 * Version: RLY Starter Kit — Light | Variables 2.0
 * Figma node: 8003:21540 (file: uRmtCnYBKrBsVM34hMgQyz)
 * Exported: 2026-03-26
 *
 * Tokens: ../tokens/tokens.css
 * Variants:
 *   checked       — boolean (InputHTMLAttributes)
 *   indeterminate — boolean
 *   disabled      — boolean (InputHTMLAttributes)
 *   showText      — boolean
 *
 * Breaking changes from previous version:
 *   - `state` prop removed — hover/focus/active/disabled are CSS pseudo-classes
 *   - `isChecked` ("No"|"Yes"|"Indeterminate") replaced with `checked` (boolean) + `indeterminate` (boolean)
 *   - `onChange` now receives a ChangeEvent<HTMLInputElement> (standard HTML semantics)
 *   - `label` is now React.ReactNode (was string)
 *   - Component now extends InputHTMLAttributes and uses forwardRef
 *   - ...rest spreads to the native <input> element
 */

import React, { forwardRef, useEffect, useRef } from "react";

// ── Types ───────────────────────────────────────────────────────────────────────

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?:         React.ReactNode;
  indeterminate?: boolean;
  showText?:      boolean;
}

// ── Styles ──────────────────────────────────────────────────────────────────────

const STYLE_ID = "rly-checkbox-styles";

const styles = `
/* ── Wrapper ──────────────────────────────────────────────────── */
.rly-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 8px; /* TODO: replace with spacing token when available */
  cursor: pointer;
  -webkit-user-select: none;
  user-select: none;
}

/* ── Visually-hidden native input ─────────────────────────────── */
.rly-checkbox__input {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  border: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

/* ── Box (visual control) ─────────────────────────────────────── */
.rly-checkbox__box {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  border-radius: var(--radius-xs);
  border: 2px solid var(--colors-border-secondary);
  background: transparent;
  transition: border-color 0.15s, background 0.15s;
  color: var(--colors-fg-primary);
}

/* ── Focus ring ───────────────────────────────────────────────── */
.rly-checkbox__box::after {
  content: '';
  position: absolute;
  inset: -4px;
  border: 2px solid transparent;
  border-radius: calc(var(--radius-xs) + 4px);
  pointer-events: none;
  transition: border-color 0.15s;
}
.rly-checkbox__input:focus-visible ~ .rly-checkbox__box::after {
  border-color: var(--colors-border-focus);
}

/* ── Icons hidden by default ──────────────────────────────────── */
.rly-checkbox__check,
.rly-checkbox__indeterminate {
  display: none;
}

/* ── Checked state ────────────────────────────────────────────── */
.rly-checkbox__input:checked ~ .rly-checkbox__box,
.rly-checkbox__input:indeterminate ~ .rly-checkbox__box {
  background: var(--colors-bg-brand-primary);
  border-color: var(--colors-bg-brand-primary);
}
.rly-checkbox__input:checked ~ .rly-checkbox__box .rly-checkbox__check {
  display: block;
}
.rly-checkbox__input:indeterminate ~ .rly-checkbox__box .rly-checkbox__indeterminate {
  display: block;
}

/* ── Hover — unchecked ────────────────────────────────────────── */
.rly-checkbox:hover .rly-checkbox__input:not(:checked):not(:indeterminate):not(:disabled) ~ .rly-checkbox__box {
  border-color: var(--colors-bg-brand-secondary);
}

/* ── Hover — checked / indeterminate ─────────────────────────── */
.rly-checkbox:hover .rly-checkbox__input:checked:not(:disabled) ~ .rly-checkbox__box,
.rly-checkbox:hover .rly-checkbox__input:indeterminate:not(:disabled) ~ .rly-checkbox__box {
  background: var(--colors-bg-brand-secondary);
  border-color: var(--colors-bg-brand-secondary);
}

/* ── Disabled ─────────────────────────────────────────────────── */
.rly-checkbox:has(.rly-checkbox__input:disabled) {
  opacity: 0.4;
  cursor: not-allowed;
}

/* ── Label text ───────────────────────────────────────────────── */
.rly-checkbox__label {
  font-family: var(--font-family-body);
  font-size: var(--body-3-size);
  line-height: var(--body-3-line-height);
  font-weight: 400;
  color: var(--colors-fg-primary);
  white-space: nowrap;
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

// ── Icons ───────────────────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg className="rly-checkbox__check" width="20" height="20" viewBox="0 0 20 20"
      fill="none" aria-hidden="true">
      <path d="M5 10l3.5 3.5L15 7" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IndeterminateIcon() {
  return (
    <svg className="rly-checkbox__indeterminate" width="20" height="20" viewBox="0 0 20 20"
      fill="none" aria-hidden="true">
      <path d="M6 10h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ── Component ───────────────────────────────────────────────────────────────────

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    {
      label         = "Checkbox",
      indeterminate = false,
      showText      = true,
      className,
      ...rest
    },
    ref
  ) {
    injectStyles();

    const localRef = useRef<HTMLInputElement>(null);

    // Merge external ref with local ref — needed for imperative .indeterminate write
    const setRef = (el: HTMLInputElement | null) => {
      (localRef as React.MutableRefObject<HTMLInputElement | null>).current = el;
      if (typeof ref === "function") ref(el);
      else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
    };

    useEffect(() => {
      if (localRef.current) localRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

    return (
      <label className={`rly-checkbox${className ? ` ${className}` : ""}`}>
        <input
          type="checkbox"
          ref={setRef}
          className="rly-checkbox__input"
          {...rest}
        />
        <span className="rly-checkbox__box" aria-hidden="true">
          <CheckIcon />
          <IndeterminateIcon />
        </span>
        {showText && (
          <span className="rly-checkbox__label">{label}</span>
        )}
      </label>
    );
  }
);

export default Checkbox;
