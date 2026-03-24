/*
 * Component: LinkButton
 * Version: RLY Starter Kit — Light | Variables 2.0
 * Figma node: 8003:21371 (file: uRmtCnYBKrBsVM34hMgQyz)
 * Exported: 2026-03-24
 *
 * Tokens: ../tokens/tokens.css
 * Variants:
 *   size  — l | m | s | xs
 *   state — default | hovered | focused | pressed | disabled
 */

import React, { CSSProperties } from "react";

export type LinkButtonSize  = "l" | "m" | "s" | "xs";
export type LinkButtonState = "default" | "hovered" | "focused" | "pressed" | "disabled";

export interface LinkButtonProps {
  label?:    string;
  size?:     LinkButtonSize;
  state?:    LinkButtonState;
  onClick?:  React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  style?:    CSSProperties;
}

const fontSizeMap: Record<LinkButtonSize, string> = {
  l:  "var(--body-1-size)",   // 18px
  m:  "var(--body-2-size)",   // 16px
  s:  "var(--body-3-size)",   // 14px
  xs: "var(--body-4-size)",   // 12px
};

const lineHeightMap: Record<LinkButtonSize, string> = {
  l:  "var(--body-1-line-height)",  // 28px
  m:  "var(--body-2-line-height)",  // 24px
  s:  "var(--body-3-line-height)",  // 20px
  xs: "var(--body-4-line-height)",  // 18px
};

const focusRingHeightMap: Record<LinkButtonSize, string> = {
  l: "32px", m: "28px", s: "24px", xs: "22px",
};

function getColor(state: LinkButtonState): string {
  if (state === "pressed")  return "var(--colors-fg-brand-tertiary)";  // #006640
  if (state === "hovered" || state === "focused") return "var(--colors-fg-brand-secondary)"; // #008a52
  return "var(--colors-fg-brand-primary)"; // #00b867 — default + disabled
}

export function LinkButton({
  label   = "Button",
  size    = "l",
  state   = "default",
  onClick,
  className,
  style,
}: LinkButtonProps) {
  const color     = getColor(state);
  const isFocused = state === "focused";

  const rootStyle: CSSProperties = {
    position:       "relative",
    display:        "inline-flex",
    alignItems:     "center",
    justifyContent: "center",
    padding:        "0 4px",
    background:     "none",
    border:         "none",
    borderBottom:   `1px dashed ${color}`,
    cursor:         state === "disabled" ? "not-allowed" : "pointer",
    opacity:        state === "disabled" ? 0.4 : 1,
    overflow:       "visible",
    ...style,
  };

  const textStyle: CSSProperties = {
    fontFamily:  "var(--font-family-body)",
    fontSize:    fontSizeMap[size],
    lineHeight:  lineHeightMap[size],
    fontWeight:  400,
    color,
    whiteSpace:  "nowrap",
  };

  const focusRingStyle: CSSProperties = {
    position:     "absolute",
    left:         "-2px",
    right:        "-2px",
    top:          "50%",
    transform:    "translateY(-50%)",
    height:       focusRingHeightMap[size],
    border:       "2px solid var(--colors-border-focus)",
    borderRadius: "var(--radius-xs)",
    pointerEvents: "none",
  };

  return (
    <button
      className={className}
      disabled={state === "disabled"}
      onClick={onClick}
      style={rootStyle}
    >
      <span style={textStyle}>{label}</span>
      {isFocused && <span style={focusRingStyle} aria-hidden="true" />}
    </button>
  );
}

export default LinkButton;
