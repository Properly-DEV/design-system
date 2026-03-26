// Status
// Figma: node 10010:996 — file t0SzZjA8aaFf7v0AqS69wZ
// Tokens: ../tokens/tokens.css
// Variants: blue | green | orange | red
// 2026-03-26

import React, { forwardRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type StatusState = "blue" | "green" | "orange" | "red";

export interface StatusProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Connection state — drives dot color and default label. Default: "blue" */
  state?: StatusState;
  /** Override the default label text for the current state. */
  label?: React.ReactNode;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const STYLE_ID = "rly-status-styles";

const styles = `
.rly-status {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 46px;
  padding: 0 28px;
}

.rly-status__label {
  font-family: var(--font-family-body);
  font-size: var(--body-4-size);
  line-height: var(--body-4-line-height);
  font-weight: 400;
  white-space: nowrap;
  flex-shrink: 0;
}

.rly-status--blue .rly-status__label   { color: var(--colors-fg-system-info-primary); }
.rly-status--green .rly-status__label  { color: var(--colors-fg-system-success-primary); }
.rly-status--orange .rly-status__label { color: var(--colors-fg-system-warning-primary); }
.rly-status--red .rly-status__label    { color: var(--colors-fg-system-error-primary); }
`;

function injectStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement("style");
  el.id = STYLE_ID;
  el.textContent = styles;
  document.head.appendChild(el);
}

// ─── Dot icons (inlined from src/assets/icons/dot, Size=S 16×16) ─────────────

function DotBlue() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path d="M4 8C4 5.79086 5.79086 4 8 4V4C10.2091 4 12 5.79086 12 8V8C12 10.2091 10.2091 12 8 12V12C5.79086 12 4 10.2091 4 8V8Z" fill="#4369DE" />
      <path d="M8 2C11.3137 2 14 4.68629 14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2Z" stroke="#0032C7" strokeOpacity="0.25" strokeWidth="4" />
    </svg>
  );
}

function DotGreen() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path d="M4 8C4 5.79086 5.79086 4 8 4V4C10.2091 4 12 5.79086 12 8V8C12 10.2091 10.2091 12 8 12V12C5.79086 12 4 10.2091 4 8V8Z" fill="#01D770" />
      <path d="M8 2C11.3137 2 14 4.68629 14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2Z" stroke="#0BFE8A" strokeOpacity="0.25" strokeWidth="4" />
    </svg>
  );
}

function DotOrange() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path d="M4 8C4 5.79086 5.79086 4 8 4V4C10.2091 4 12 5.79086 12 8V8C12 10.2091 10.2091 12 8 12V12C5.79086 12 4 10.2091 4 8V8Z" fill="#EECB32" />
      <path d="M8 2C11.3137 2 14 4.68629 14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2Z" stroke="#EECB32" strokeOpacity="0.25" strokeWidth="4" />
    </svg>
  );
}

function DotRed() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path d="M4 8C4 5.79086 5.79086 4 8 4V4C10.2091 4 12 5.79086 12 8V8C12 10.2091 10.2091 12 8 12V12C5.79086 12 4 10.2091 4 8V8Z" fill="#FD4710" />
      <path d="M8 2C11.3137 2 14 4.68629 14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2Z" stroke="#FD4710" strokeOpacity="0.25" strokeWidth="4" />
    </svg>
  );
}

const dotMap: Record<StatusState, React.ReactElement> = {
  blue: <DotBlue />,
  green: <DotGreen />,
  orange: <DotOrange />,
  red: <DotRed />,
};

const defaultLabels: Record<StatusState, string> = {
  blue: "Checking connection",
  green: "Stable connection",
  orange: "Unstable connection",
  red: "Disconnected",
};

// ─── Component ────────────────────────────────────────────────────────────────

export const Status = forwardRef<HTMLDivElement, StatusProps>(
  function Status({ state = "blue", label, className, ...rest }, ref) {
    injectStyles();

    const classes = ["rly-status", `rly-status--${state}`, className]
      .filter(Boolean)
      .join(" ");

    return (
      <div ref={ref} className={classes} {...rest}>
        {dotMap[state]}
        <span className="rly-status__label">{label ?? defaultLabels[state]}</span>
      </div>
    );
  }
);

export default Status;
