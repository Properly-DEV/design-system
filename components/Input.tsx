/*
 * Component: Input
 * Version: RLY Starter Kit — Light | Variables 2.0
 * Figma node: 8001:18597 (file: uRmtCnYBKrBsVM34hMgQyz)
 * Exported: 2026-03-24
 *
 * Tokens: ../tokens/tokens.css
 * Variants: state × filled
 *   state  — Default | Error | Success
 *   filled — true | false (controls text colour: primary vs secondary)
 *
 * Breaking changes from previous version:
 *   - `state` loses "Hovered", "Focused", "Disabled" — hover/focus are CSS
 *     pseudo-classes, disabled is the native `disabled` attr
 *   - `label` now accepts ReactNode (was string)
 *   - `errorMessage` has no default — omitting it suppresses the error <p>
 *   - `<label>` now linked to `<input>` via useId (htmlFor / id)
 *   - `aria-describedby` wired to the error message when visible
 *   - Styling migrated from inline CSSProperties to CSS string injection
 *     (aligns with project convention; unblocks :hover, :focus-visible, ::placeholder)
 */

import React, { forwardRef, useId } from "react";

// ── Types ───────────────────────────────────────────────────────────────────────

export type InputState = "Default" | "Error" | "Success";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?:            React.ReactNode;
  showLabel?:        boolean;
  state?:            InputState;
  filled?:           boolean;
  errorMessage?:     string;
  wrapperStyle?:     React.CSSProperties;
  wrapperClassName?: string;
}

// ── Styles ──────────────────────────────────────────────────────────────────────

const STYLE_ID = "rly-input-styles";

const styles = `
/* ── Wrapper ──────────────────────────────────────────────────────── */
.rly-input {
  display: flex;
  flex-direction: column;
  gap: 4px; /* TODO: replace with spacing token when available */
}

/* ── Label ────────────────────────────────────────────────────────── */
.rly-input__label {
  font-family: var(--font-family-body);
  font-size: var(--body-3-size);
  line-height: var(--body-3-line-height);
  font-weight: 400;
  color: var(--colors-fg-tertiary);
}

/* ── Field container ──────────────────────────────────────────────── */
.rly-input__field {
  position: relative;
  display: flex;
  align-items: center;
  height: 48px; /* TODO: replace with height token when available */
  border-radius: var(--radius-md);
  border: 1px solid var(--colors-border-tertiary);
  background: var(--colors-bg-primary);
  overflow: hidden;
  flex-shrink: 0;
  transition: border-color 0.15s;
}

/* ── Hover — unfocused, not disabled ──────────────────────────────── */
.rly-input__field:hover:not(:focus-within):not(:has(.rly-input__native:disabled)) {
  border-color: var(--colors-border-secondary);
}

/* ── Focus — ring via ::after + border override ───────────────────── */
.rly-input__field:focus-within {
  overflow: visible;
  border-color: var(--colors-border-secondary);
}
.rly-input__field:focus-within::after {
  content: '';
  position: absolute;
  inset: -2px;
  border: 2px solid var(--colors-border-focus);
  border-radius: calc(var(--radius-md) + 2px);
  pointer-events: none;
}

/* ── Error ────────────────────────────────────────────────────────── */
.rly-input__field--error {
  border-color: var(--colors-border-system-error-primary);
}
.rly-input__field--error:hover:not(:focus-within):not(:has(.rly-input__native:disabled)) {
  border-color: var(--colors-border-system-error-primary);
}

/* ── Success ──────────────────────────────────────────────────────── */
.rly-input__field--success {
  border-color: var(--colors-border-system-success-primary);
}
.rly-input__field--success:hover:not(:focus-within):not(:has(.rly-input__native:disabled)) {
  border-color: var(--colors-border-system-success-primary);
}

/* ── Native input ─────────────────────────────────────────────────── */
.rly-input__native {
  flex: 1;
  padding: 8px 12px; /* TODO: replace with spacing tokens when available */
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-family-body);
  font-size: var(--body-2-size);
  line-height: var(--body-2-line-height);
  font-weight: 400;
  color: var(--colors-fg-secondary);
}

.rly-input__native--filled {
  color: var(--colors-fg-primary);
}

.rly-input__native:disabled {
  cursor: not-allowed;
}

/* ── Disabled wrapper ─────────────────────────────────────────────── */
.rly-input:has(.rly-input__native:disabled) {
  opacity: 0.4;
  cursor: not-allowed;
}

/* ── Error message ────────────────────────────────────────────────── */
.rly-input__error {
  margin: 0;
  font-family: var(--font-family-body);
  font-size: var(--body-4-size);
  line-height: var(--body-4-line-height);
  font-weight: 400;
  color: var(--colors-fg-system-error-primary);
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

// ── Component ───────────────────────────────────────────────────────────────────

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label            = "Label",
    showLabel        = true,
    state            = "Default",
    filled           = false,
    errorMessage,
    wrapperStyle,
    wrapperClassName,
    className,
    id: externalId,
    ...inputProps
  },
  ref
) {
  injectStyles();

  const generatedId = useId();
  const inputId = externalId ?? generatedId;
  const errorId = useId();
  const isError = state === "Error";

  const fieldClass = [
    "rly-input__field",
    state === "Error"   && "rly-input__field--error",
    state === "Success" && "rly-input__field--success",
  ].filter(Boolean).join(" ");

  const nativeClass = [
    "rly-input__native",
    filled    && "rly-input__native--filled",
    className,
  ].filter(Boolean).join(" ");

  return (
    <div
      className={`rly-input${wrapperClassName ? ` ${wrapperClassName}` : ""}`}
      style={wrapperStyle}
    >
      {showLabel && (
        <label htmlFor={inputId} className="rly-input__label">
          {label}
        </label>
      )}

      <div className={fieldClass}>
        <input
          id={inputId}
          ref={ref}
          className={nativeClass}
          aria-invalid={isError || undefined}
          aria-describedby={isError && errorMessage ? errorId : undefined}
          {...inputProps}
        />
      </div>

      {isError && errorMessage && (
        <p id={errorId} role="alert" className="rly-input__error">
          {errorMessage}
        </p>
      )}
    </div>
  );
});

export default Input;
