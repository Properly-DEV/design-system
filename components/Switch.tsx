/*
 * Component: Switch
 * Version: RLY Starter Kit — Light | Variables 2.0
 * Figma node: 8003:21474 (file: uRmtCnYBKrBsVM34hMgQyz)
 * Exported: 2026-03-24
 *
 * Tokens: ../tokens/tokens.css
 * Variants:
 *   state      — Default | Hovered | Focused | Pressed
 *   isSelected — boolean
 *   isDisabled — boolean
 *   showText   — boolean
 */

import React, { CSSProperties } from "react";

export type SwitchState = "Default" | "Hovered" | "Focused" | "Pressed";

export interface SwitchProps {
  label?:      string;
  isSelected?: boolean;
  isDisabled?: boolean;
  showText?:   boolean;
  state?:      SwitchState;
  onChange?:   (checked: boolean) => void;
  className?:  string;
  style?:      CSSProperties;
}

function getTrackColor(isSelected: boolean, state: SwitchState, isDisabled: boolean): string {
  if (isSelected) {
    if (state === "Default" && !isDisabled) return "var(--colors-bg-brand-primary)";  // #00ec88
    return "var(--colors-bg-brand-secondary)"; // #00b867 — Hovered, Pressed, Focused, Disabled
  }
  // Not selected
  if (state === "Hovered" || state === "Pressed" || state === "Focused") {
    return "var(--colors-bg-quarternary)"; // #d9d9d9
  }
  return "var(--colors-bg-tertiary)"; // #e9e9e9
}

export function Switch({
  label      = "Switch",
  isSelected = false,
  isDisabled = false,
  showText   = true,
  state      = "Default",
  onChange,
  className,
  style,
}: SwitchProps) {
  const isFocused  = state === "Focused";
  const trackColor = getTrackColor(isSelected, state, isDisabled);

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
    flexDirection:  "column",
    alignItems:     "flex-start",
    justifyContent: "center",
    height:         "24px",
    padding:        "2px",
    flexShrink:     0,
  };

  const trackStyle: CSSProperties = {
    display:        "flex",
    alignItems:     "center",
    justifyContent: isSelected ? "flex-end" : "flex-start",
    width:          "32px",
    height:         "20px",
    padding:        "2px",
    borderRadius:   "var(--radius-full)",
    background:     trackColor,
    overflow:       "hidden",
    transition:     "background 0.2s",
    flexShrink:     0,
  };

  const thumbStyle: CSSProperties = {
    width:        "16px",
    height:       "16px",
    borderRadius: "var(--radius-full)",
    background:   "var(--colors-base-white)",
    boxShadow:    "var(--shadow-sm)",
    flexShrink:   0,
    transition:   "transform 0.2s",
  };

  const focusRingStyle: CSSProperties = {
    position:     "absolute",
    inset:        "1px 0.667px",
    border:       "2px solid var(--colors-border-focus)",
    borderRadius: "14px",
    pointerEvents: "none",
  };

  const labelStyle: CSSProperties = {
    fontFamily:  "var(--font-family-body)",
    fontSize:    "var(--body-3-size)",
    lineHeight:  "var(--body-3-line-height)",
    fontWeight:  400,
    color:       "var(--colors-fg-primary)",
    whiteSpace:  "nowrap",
  };

  return (
    <label className={className} style={wrapperStyle}>
      <input
        type="checkbox"
        checked={isSelected}
        disabled={isDisabled}
        onChange={(e) => onChange?.(e.target.checked)}
        style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
      />
      <div style={controlStyle}>
        <div style={trackStyle}>
          <div style={thumbStyle} />
        </div>
        {isFocused && !isDisabled && <span style={focusRingStyle} aria-hidden="true" />}
      </div>
      {showText && <span style={labelStyle}>{label}</span>}
    </label>
  );
}

export default Switch;
