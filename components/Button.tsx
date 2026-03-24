/*
 * Component: Button
 * Version: RLY Starter Kit — Light | Variables 2.0
 * Figma node: 8001:18186 (file: uRmtCnYBKrBsVM34hMgQyz)
 * Exported: 2026-03-24
 *
 * Tokens: ../tokens/tokens.css
 * Variants: type × state × size
 *   type  — Primary | Secondary | Tertiary
 *   state — Default | Hovered | Pressed | Focused | Disabled | Loading
 *   size  — S
 */

import React, { CSSProperties } from "react";

export type ButtonType  = "Primary" | "Secondary" | "Tertiary";
export type ButtonState = "Default" | "Hovered" | "Pressed" | "Focused" | "Disabled" | "Loading";
export type ButtonSize  = "S";

export interface ButtonProps {
  label?:       string;
  type?:        ButtonType;
  state?:       ButtonState;
  size?:        ButtonSize;
  leftIcon?:    React.ReactNode;
  rightIcon?:   React.ReactNode;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
  onClick?:     React.MouseEventHandler<HTMLButtonElement>;
  className?:   string;
  style?:       CSSProperties;
}

// ── Spinner (loading indicator) ───────────────────────────────────────────────
function Spinner({ color }: { color: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        animation: "rly-spin 0.8s linear infinite",
      }}
    >
      <circle cx="10" cy="10" r="8" stroke={color} strokeOpacity="0.2" strokeWidth="2" />
      <path d="M10 2a8 8 0 0 1 8 8" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <style>{`@keyframes rly-spin { to { transform: translate(-50%,-50%) rotate(360deg); } }`}</style>
    </svg>
  );
}

// ── Chevron right icon ────────────────────────────────────────────────────────
function ChevronRight({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M6 4l4 4-4 4" stroke={color} strokeWidth="var(--icon-stroke, 2)" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Plus icon ─────────────────────────────────────────────────────────────────
function Plus({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 3v10M3 8h10" stroke={color} strokeWidth="var(--icon-stroke, 2)" strokeLinecap="round" />
    </svg>
  );
}

// ── Style helpers ─────────────────────────────────────────────────────────────
function getRootStyle(type: ButtonType, state: ButtonState): CSSProperties {
  const base: CSSProperties = {
    position:       "relative",
    display:        "inline-flex",
    alignItems:     "center",
    justifyContent: "center",
    height:         "32px",
    padding:        "0 6px",
    borderRadius:   "var(--radius-sm)",   // 8px
    border:         "none",
    cursor:         state === "Disabled" ? "not-allowed" : "pointer",
    outline:        "none",
    userSelect:     "none",
    overflow:       state === "Focused" ? "visible" : "hidden",
    fontFamily:     "var(--font-family-body)",
    transition:     "background 0.15s, border-color 0.15s, opacity 0.15s",
  };

  if (type === "Primary") {
    const bgMap: Record<ButtonState, string> = {
      Default:  "var(--colors-bg-brand-primary)",     // #00ec88
      Hovered:  "var(--colors-bg-brand-secondary)",   // #00b867
      Pressed:  "var(--colors-bg-brand-tertiary)",    // #008a52
      Focused:  "var(--colors-bg-brand-secondary)",
      Disabled: "var(--colors-bg-brand-primary)",
      Loading:  "var(--colors-bg-brand-primary)",
    };
    return {
      ...base,
      background: bgMap[state],
      opacity:    state === "Disabled" ? 0.4 : 1,
    };
  }

  if (type === "Secondary") {
    const borderMap: Record<ButtonState, string> = {
      Default:  "var(--colors-border-secondary)",
      Hovered:  "var(--colors-border-primary)",
      Pressed:  "var(--colors-border-secondary)",
      Focused:  "var(--colors-border-primary)",
      Disabled: "var(--colors-border-secondary)",
      Loading:  "var(--colors-border-secondary)",
    };
    return {
      ...base,
      background:  "transparent",
      border:      `1px solid ${borderMap[state]}`,
      opacity:     state === "Disabled" ? 0.4 : 1,
    };
  }

  // Tertiary
  return {
    ...base,
    background: "transparent",
    border:     "none",
    opacity:    state === "Disabled" ? 0.4 : 1,
  };
}

function getTextColor(type: ButtonType): string {
  if (type === "Tertiary") return "var(--colors-fg-secondary)";
  return "var(--colors-fg-primary)";
}

function getIconColor(type: ButtonType): string {
  return getTextColor(type);
}

// ── Component ─────────────────────────────────────────────────────────────────
export function Button({
  label        = "Button",
  type         = "Primary",
  state        = "Default",
  size         = "S",
  leftIcon,
  rightIcon,
  showLeftIcon  = true,
  showRightIcon = true,
  onClick,
  className,
  style,
}: ButtonProps) {
  const isLoading  = state === "Loading";
  const isDisabled = state === "Disabled";
  const isFocused  = state === "Focused";

  const iconColor = getIconColor(type);
  const textColor = getTextColor(type);

  const focusRingStyle: CSSProperties = {
    position:     "absolute",
    inset:        type === "Secondary" ? "-3px" : "-2px",
    border:       "2px solid var(--colors-border-focus)",
    borderRadius: "10px",
    pointerEvents: "none",
  };

  return (
    <button
      className={className}
      disabled={isDisabled}
      onClick={onClick}
      aria-busy={isLoading}
      style={{ ...getRootStyle(type, state), ...style }}
    >
      {/* Left icon */}
      {showLeftIcon && !isLoading && (
        <span style={{ display: "flex", flexShrink: 0 }}>
          {leftIcon ?? <Plus color={iconColor} />}
        </span>
      )}

      {/* Label */}
      <span
        style={{
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          padding:        "0 6px",
          fontSize:       "var(--button-2-size)",       // 14px
          lineHeight:     "var(--button-2-line-height)", // 16px
          fontWeight:     "var(--button-2-weight)" as CSSProperties["fontWeight"], // 500
          color:          textColor,
          textTransform:  "capitalize",
          whiteSpace:     "nowrap",
          opacity:        isLoading ? 0 : 1,
        }}
      >
        {label}
      </span>

      {/* Right icon */}
      {showRightIcon && !isLoading && (
        <span style={{ display: "flex", flexShrink: 0 }}>
          {rightIcon ?? <ChevronRight color={iconColor} />}
        </span>
      )}

      {/* Loading spinner */}
      {isLoading && <Spinner color={iconColor} />}

      {/* Focus ring */}
      {isFocused && <span style={focusRingStyle} aria-hidden="true" />}
    </button>
  );
}

export default Button;
