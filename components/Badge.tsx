/*
 * Component: Badge
 * Version: RLY Starter Kit — Light | Variables 2.0
 * Figma node: 8001:18719 (file: uRmtCnYBKrBsVM34hMgQyz)
 * Exported: 2026-03-24
 *
 * Tokens: ../tokens/tokens.css
 * Variants:
 *   type    — Neutral | Green | Yellow | Red | Blue
 *   variant — Solid | Subtle
 *   hasIcon — boolean
 */

import React, { CSSProperties } from "react";

export type BadgeType    = "Neutral" | "Green" | "Yellow" | "Red" | "Blue";
export type BadgeVariant = "Solid" | "Subtle";

export interface BadgeProps {
  label?:    string;
  type?:     BadgeType;
  variant?:  BadgeVariant;
  hasIcon?:  boolean;
  icon?:     React.ReactNode;
  className?: string;
  style?:    CSSProperties;
}

// ── Token maps per type ───────────────────────────────────────────────────────
const bgTokenMap: Record<BadgeType, string> = {
  Neutral: "var(--colors-component-bg-badge-neutral)",       // rgba(0,0,0,0.05)
  Green:   "var(--colors-bg-system-success-primary)",        // rgba(11,254,138,0.05)
  Yellow:  "var(--colors-bg-system-warning-primary)",        // rgba(238,203,50,0.05)
  Red:     "var(--colors-bg-system-error-primary)",          // rgba(253,71,16,0.05)
  Blue:    "var(--colors-bg-system-info-primary)",           // rgba(0,50,199,0.05)
};

const borderTokenMap: Record<BadgeType, string> = {
  Neutral: "var(--colors-border-secondary)",                 // #c6c6c6
  Green:   "var(--colors-border-system-success-primary)",    // #3efea2
  Yellow:  "var(--colors-border-system-warning-primary)",    // #f3d659
  Red:     "var(--colors-border-system-error-primary)",      // #fd4710
  Blue:    "var(--colors-border-system-info-primary)",       // #4369de
};

const textTokenMap: Record<BadgeType, string> = {
  Neutral: "var(--colors-fg-secondary)",                     // #595959
  Green:   "var(--colors-fg-system-success-primary)",        // #01a355
  Yellow:  "var(--colors-fg-system-warning-primary)",        // #eecb32
  Red:     "var(--colors-fg-system-error-primary)",          // #fd4710
  Blue:    "var(--colors-fg-system-info-primary)",           // #4369de
};

// ── Default star icon ─────────────────────────────────────────────────────────
function StarIcon({ color }: { color: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path
        d="M6 1l1.236 2.506 2.764.402-2 1.949.472 2.751L6 7.25 3.528 8.608 4 5.857 2 3.908l2.764-.402L6 1z"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
export function Badge({
  label   = "Status",
  type    = "Neutral",
  variant = "Solid",
  hasIcon = true,
  icon,
  className,
  style,
}: BadgeProps) {
  const textColor = textTokenMap[type];

  const rootStyle: CSSProperties = {
    display:      "inline-flex",
    alignItems:   "center",
    gap:          "4px",
    height:       "22px",
    padding:      "0 4px",
    borderRadius: "var(--radius-xs)",
    background:   bgTokenMap[type],
    border:       variant === "Solid" ? `1px solid ${borderTokenMap[type]}` : "none",
    ...style,
  };

  const labelStyle: CSSProperties = {
    fontFamily:  "var(--font-family-body)",
    fontSize:    "var(--body-4-size)",        // 12px
    lineHeight:  "var(--body-4-line-height)", // 18px
    fontWeight:  400,
    color:       textColor,
    whiteSpace:  "nowrap",
  };

  return (
    <span className={className} style={rootStyle}>
      {hasIcon && (icon ?? <StarIcon color={textColor} />)}
      <span style={labelStyle}>{label}</span>
    </span>
  );
}

export default Badge;
