/*
 * Component: Checkbox
 * Version: RLY Starter Kit — Light | Variables 2.0
 * Figma node: 8003:21540 (file: uRmtCnYBKrBsVM34hMgQyz)
 * Exported: 2026-03-24
 *
 * Tokens: ../tokens/tokens.css
 * Variants:
 *   state     — Default | Hovered | Focused | Pressed | Disabled
 *   isChecked — No | Yes | Indeterminate
 *   showText  — boolean
 */

import React, { CSSProperties } from "react";

export type CheckboxState   = "Default" | "Hovered" | "Focused" | "Pressed" | "Disabled";
export type CheckboxChecked = "No" | "Yes" | "Indeterminate";

export interface CheckboxProps {
  label?:     string;
  isChecked?: CheckboxChecked;
  showText?:  boolean;
  state?:     CheckboxState;
  onChange?:  (value: CheckboxChecked) => void;
  className?: string;
  style?:     CSSProperties;
}

// ── Checkmark SVG ────────────────────────────────────────────────────────────
function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <rect width="20" height="20" rx="4" fill="currentColor" />
      <path d="M5 10l3.5 3.5L15 7" stroke="var(--colors-fg-primary)" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Indeterminate (minus) SVG ────────────────────────────────────────────────
function IndeterminateIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <rect width="20" height="20" rx="4" fill="currentColor" />
      <path d="M6 10h8" stroke="var(--colors-fg-primary)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ── Box color helpers ────────────────────────────────────────────────────────
function getBoxStyle(isChecked: CheckboxChecked, state: CheckboxState): CSSProperties {
  const base: CSSProperties = {
    position:     "relative",
    width:        "20px",
    height:       "20px",
    borderRadius: "var(--radius-xs)",
    flexShrink:   0,
    transition:   "border-color 0.15s, background 0.15s",
  };

  if (isChecked === "No") {
    const isActive = state === "Hovered" || state === "Pressed" || state === "Focused";
    return {
      ...base,
      border:     `2px solid ${isActive
        ? "var(--colors-bg-brand-secondary)"   // #00b867 — active states
        : "var(--colors-border-secondary)"}`,  // #c6c6c6 — default + disabled
      background: "transparent",
    };
  }

  // Yes or Indeterminate — filled
  const isActive = ["Hovered", "Pressed", "Focused", "Disabled"].includes(state);
  return {
    ...base,
    background: isActive
      ? "var(--colors-bg-brand-secondary)"  // #00b867
      : "var(--colors-bg-brand-primary)",   // #00ec88
    color: isActive
      ? "var(--colors-bg-brand-secondary)"
      : "var(--colors-bg-brand-primary)",
  };
}

// ── Component ────────────────────────────────────────────────────────────────
export function Checkbox({
  label     = "Checkbox",
  isChecked = "No",
  showText  = true,
  state     = "Default",
  onChange,
  className,
  style,
}: CheckboxProps) {
  const isFocused  = state === "Focused";
  const isDisabled = state === "Disabled";

  const wrapperStyle: CSSProperties = {
    display:    "inline-flex",
    alignItems: "center",
    gap:        "8px",
    opacity:    isDisabled ? 0.4 : 1,
    cursor:     isDisabled ? "not-allowed" : "pointer",
    ...style,
  };

  const controlStyle: CSSProperties = {
    position:        "relative",
    display:         "flex",
    alignItems:      "center",
    justifyContent:  "center",
    width:           "24px",
    height:          "24px",
    flexShrink:      0,
  };

  const focusRingStyle: CSSProperties = {
    position:     "absolute",
    inset:        "1px",
    border:       "2px solid var(--colors-border-focus)",
    borderRadius: "var(--radius-xs)",
    pointerEvents: "none",
  };

  const labelStyle: CSSProperties = {
    fontFamily: "var(--font-family-body)",
    fontSize:   "var(--body-3-size)",
    lineHeight: "var(--body-3-line-height)",
    fontWeight: 400,
    color:      "var(--colors-fg-primary)",
    whiteSpace: "nowrap",
  };

  function handleClick() {
    if (isDisabled || !onChange) return;
    const next: CheckboxChecked = isChecked === "No" ? "Yes" : "No";
    onChange(next);
  }

  return (
    <label className={className} style={wrapperStyle} onClick={handleClick}>
      <div style={controlStyle}>
        <div style={getBoxStyle(isChecked, state)}>
          {isChecked === "Yes"           && <CheckIcon />}
          {isChecked === "Indeterminate" && <IndeterminateIcon />}
        </div>
        {isFocused && <span style={focusRingStyle} aria-hidden="true" />}
      </div>
      {showText && <span style={labelStyle}>{label}</span>}
    </label>
  );
}

export default Checkbox;
