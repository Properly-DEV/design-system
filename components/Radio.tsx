/*
 * Component: Radio
 * Version: RLY Starter Kit — Light | Variables 2.0
 * Figma node: 8003:21626 (file: uRmtCnYBKrBsVM34hMgQyz)
 * Exported: 2026-03-24
 *
 * Tokens: ../tokens/tokens.css
 * Variants:
 *   state     — Default | Hovered | Focused | Pressed | Disabled
 *   isChecked — boolean
 *   showText  — boolean
 */

import React, { CSSProperties } from "react";

export type RadioState = "Default" | "Hovered" | "Focused" | "Pressed" | "Disabled";

export interface RadioProps {
  label?:     string;
  isChecked?: boolean;
  showText?:  boolean;
  state?:     RadioState;
  onChange?:  (checked: boolean) => void;
  name?:      string;
  value?:     string;
  className?: string;
  style?:     CSSProperties;
}

function getOuterStyle(isChecked: boolean, state: RadioState): CSSProperties {
  const base: CSSProperties = {
    position:     "relative",
    display:      "flex",
    alignItems:   "center",
    justifyContent: "center",
    width:        "20px",
    height:       "20px",
    borderRadius: "var(--radius-full)",
    flexShrink:   0,
    transition:   "background 0.15s, border-color 0.15s",
  };

  if (!isChecked) {
    const isActive = state === "Hovered" || state === "Pressed" || state === "Focused" || state === "Disabled";
    return {
      ...base,
      border:     `2px solid ${isActive
        ? "var(--colors-bg-brand-secondary)"   // #00b867
        : "var(--colors-border-secondary)"}`,  // #c6c6c6
      background: "transparent",
    };
  }

  // Checked
  const isActive = state === "Hovered" || state === "Pressed" || state === "Focused" || state === "Disabled";
  return {
    ...base,
    background: isActive
      ? "var(--colors-bg-brand-secondary)"  // #00b867
      : "var(--colors-bg-brand-primary)",   // #00ec88
  };
}

function getSelectionDotStyle(state: RadioState): CSSProperties {
  const isActive = state === "Hovered" || state === "Pressed" || state === "Focused" || state === "Disabled";
  return {
    width:        "16px",
    height:       "16px",
    borderRadius: "var(--radius-full)",
    border:       "2px solid var(--colors-base-white)",
    background:   isActive
      ? "var(--colors-bg-brand-secondary)"  // #00b867
      : "var(--colors-bg-brand-primary)",   // #00ec88
    flexShrink:   0,
  };
}

export function Radio({
  label     = "Checkbox",
  isChecked = false,
  showText  = true,
  state     = "Default",
  onChange,
  name,
  value,
  className,
  style,
}: RadioProps) {
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
    position:       "relative",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    width:          "24px",
    height:         "24px",
    flexShrink:     0,
  };

  const focusRingStyle: CSSProperties = {
    position:     "absolute",
    inset:        "1px",
    border:       "2px solid var(--colors-border-focus)",
    borderRadius: "var(--radius-full)",
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

  return (
    <label className={className} style={wrapperStyle}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={isChecked}
        disabled={isDisabled}
        onChange={(e) => onChange?.(e.target.checked)}
        style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
      />
      <div style={controlStyle}>
        <div style={getOuterStyle(isChecked, state)}>
          {isChecked && <div style={getSelectionDotStyle(state)} />}
        </div>
        {isFocused && <span style={focusRingStyle} aria-hidden="true" />}
      </div>
      {showText && <span style={labelStyle}>{label}</span>}
    </label>
  );
}

export default Radio;
