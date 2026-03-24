/*
 * Component: IconButton
 * Version: RLY Starter Kit — Light | Variables 2.0
 * Figma node: 8001:18338 (file: uRmtCnYBKrBsVM34hMgQyz)
 * Exported: 2026-03-24
 *
 * Tokens: ../tokens/tokens.css
 * Variants:
 *   type  — Primary | Secondary | Tertiary
 *   state — Default | Hovered | Pressed | Focused | Disabled
 *   size  — S
 */

import React, { CSSProperties } from "react";

export type IconButtonType  = "Primary" | "Secondary" | "Tertiary";
export type IconButtonState = "Default" | "Hovered" | "Pressed" | "Focused" | "Disabled";

export interface IconButtonProps {
  type?:     IconButtonType;
  state?:    IconButtonState;
  icon?:     React.ReactNode;
  onClick?:  React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  style?:    CSSProperties;
}

function getIconColor(type: IconButtonType, state: IconButtonState): string {
  if (type === "Tertiary") {
    // Hovered and Focused use primary (darker), rest use secondary
    return (state === "Hovered" || state === "Focused")
      ? "var(--colors-fg-primary)"
      : "var(--colors-fg-secondary)";
  }
  return "var(--colors-fg-primary)";
}

function getRootStyle(type: IconButtonType, state: IconButtonState): CSSProperties {
  const base: CSSProperties = {
    position:       "relative",
    display:        "inline-flex",
    alignItems:     "center",
    justifyContent: "center",
    width:          "32px",
    height:         "32px",
    borderRadius:   "var(--radius-sm)",
    border:         "none",
    padding:        0,
    cursor:         state === "Disabled" ? "not-allowed" : "pointer",
    outline:        "none",
    userSelect:     "none",
    overflow:       state === "Focused" ? "visible" : "hidden",
    transition:     "background 0.15s, border-color 0.15s, opacity 0.15s",
  };

  if (type === "Primary") {
    const bgMap: Record<IconButtonState, string> = {
      Default:  "var(--colors-bg-brand-primary)",
      Hovered:  "var(--colors-bg-brand-secondary)",
      Pressed:  "var(--colors-bg-brand-tertiary)",
      Focused:  "var(--colors-bg-brand-secondary)",
      Disabled: "var(--colors-bg-brand-primary)",
    };
    return { ...base, background: bgMap[state], opacity: state === "Disabled" ? 0.4 : 1 };
  }

  if (type === "Secondary") {
    const borderMap: Record<IconButtonState, string> = {
      Default:  "var(--colors-border-secondary)",
      Hovered:  "var(--colors-border-primary)",
      Pressed:  "var(--colors-border-secondary)",
      Focused:  "var(--colors-border-primary)",
      Disabled: "var(--colors-border-secondary)",
    };
    return {
      ...base,
      background: "transparent",
      border:     `1px solid ${borderMap[state]}`,
      opacity:    state === "Disabled" ? 0.4 : 1,
    };
  }

  // Tertiary
  return { ...base, background: "transparent", opacity: state === "Disabled" ? 0.4 : 1 };
}

// Default icon: plus (+)
function PlusIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 3v10M3 8h10" stroke={color} strokeWidth="var(--icon-stroke, 2)" strokeLinecap="round" />
    </svg>
  );
}

export function IconButton({
  type  = "Primary",
  state = "Default",
  icon,
  onClick,
  className,
  style,
}: IconButtonProps) {
  const iconColor = getIconColor(type, state);
  const isFocused  = state === "Focused";
  const isDisabled = state === "Disabled";

  const focusRingStyle: CSSProperties = {
    position:     "absolute",
    inset:        type === "Secondary" ? "-3px" : "-2px",
    height:       "36px",
    border:       "2px solid var(--colors-border-focus)",
    borderRadius: "10px",
    pointerEvents: "none",
  };

  return (
    <button
      className={className}
      disabled={isDisabled}
      onClick={onClick}
      style={{ ...getRootStyle(type, state), ...style }}
    >
      {icon ?? <PlusIcon color={iconColor} />}
      {isFocused && <span style={focusRingStyle} aria-hidden="true" />}
    </button>
  );
}

export default IconButton;
