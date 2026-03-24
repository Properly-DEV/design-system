/*
 * Component: Input
 * Version: RLY Starter Kit — Light | Variables 2.0
 * Figma node: 8001:18597 (file: uRmtCnYBKrBsVM34hMgQyz)
 * Exported: 2026-03-24
 *
 * Tokens: ../tokens/tokens.css
 * Variants: state × filled
 *   state  — Default | Hovered | Focused | Error | Success | Disabled
 *   filled — true | false (controls text colour: primary vs secondary)
 */

import React, { CSSProperties, forwardRef } from "react";

export type InputState = "Default" | "Hovered" | "Focused" | "Error" | "Success" | "Disabled";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?:        string;
  showLabel?:    boolean;
  state?:        InputState;
  filled?:       boolean;
  errorMessage?: string;
  style?:        CSSProperties;
  wrapperStyle?: CSSProperties;
  wrapperClassName?: string;
}

// ── Border color per state ─────────────────────────────────────────────────
const borderColorMap: Record<InputState, string> = {
  Default:  "var(--colors-border-tertiary)",   // #e9e9e9
  Hovered:  "var(--colors-border-secondary)",  // #c6c6c6
  Focused:  "var(--colors-border-secondary)",  // #c6c6c6
  Error:    "var(--colors-border-system-error-primary)",    // #fd4710
  Success:  "var(--colors-border-system-success-primary)",  // #3efea2
  Disabled: "var(--colors-border-primary)",    // #a7a7a7
};

// ── Component ─────────────────────────────────────────────────────────────────
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label        = "Label",
    showLabel    = true,
    state        = "Default",
    filled       = false,
    errorMessage = "Error Message",
    style,
    wrapperStyle,
    wrapperClassName,
    disabled,
    ...inputProps
  },
  ref
) {
  const isDisabled = state === "Disabled" || disabled;
  const isFocused  = state === "Focused";
  const isError    = state === "Error";

  const wrapperStyles: CSSProperties = {
    display:       "flex",
    flexDirection: "column",
    gap:           "4px",
    width:         "290px",
    opacity:       isDisabled ? 0.4 : 1,
    ...wrapperStyle,
  };

  const fieldStyles: CSSProperties = {
    position:        "relative",
    display:         "flex",
    alignItems:      "center",
    height:          "48px",
    borderRadius:    "var(--radius-md)",   // 12px
    border:          `1px solid ${borderColorMap[state]}`,
    background:      "var(--colors-bg-primary)",
    overflow:        isFocused ? "visible" : "hidden",
    flexShrink:      0,
  };

  const inputStyles: CSSProperties = {
    flex:        1,
    padding:     "8px 12px",
    border:      "none",
    outline:     "none",
    background:  "transparent",
    fontFamily:  "var(--font-family-body)",
    fontSize:    "var(--body-2-size)",        // 16px
    lineHeight:  "var(--body-2-line-height)", // 24px
    fontWeight:  400,
    color:       filled
      ? "var(--colors-fg-primary)"            // #080808
      : "var(--colors-fg-secondary)",         // #595959
    cursor:      isDisabled ? "not-allowed" : "text",
    ...style,
  };

  const focusRingStyles: CSSProperties = {
    position:     "absolute",
    inset:        "-2px",
    border:       "2px solid var(--colors-border-focus)",  // #6388f7
    borderRadius: "13px",
    pointerEvents: "none",
  };

  return (
    <div className={wrapperClassName} style={wrapperStyles}>
      {/* Label */}
      {showLabel && (
        <label
          style={{
            fontFamily:  "var(--font-family-body)",
            fontSize:    "var(--body-3-size)",        // 14px
            lineHeight:  "var(--body-3-line-height)", // 20px
            fontWeight:  400,
            color:       "var(--colors-fg-tertiary)", // #898989
          }}
        >
          {label}
        </label>
      )}

      {/* Input field */}
      <div style={fieldStyles}>
        <input
          ref={ref}
          disabled={isDisabled}
          aria-invalid={isError}
          style={inputStyles}
          {...inputProps}
        />

        {/* Focus ring */}
        {isFocused && <span style={focusRingStyles} aria-hidden="true" />}
      </div>

      {/* Error message */}
      {isError && showLabel && (
        <p
          role="alert"
          style={{
            fontFamily: "var(--font-family-body)",
            fontSize:   "var(--body-4-size)",        // 12px
            lineHeight: "var(--body-4-line-height)", // 18px
            fontWeight: 400,
            color:      "var(--colors-fg-system-error-primary)", // #fd4710
          }}
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
});

export default Input;
