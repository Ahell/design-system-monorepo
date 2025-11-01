/**
 * Design System Button Component
 *
 * Reusable button primitive using design tokens.
 * Supports multiple variants, sizes, and states.
 * No hardcoded values - everything from tokens.
 */

import {
  LitElement,
  html,
  css,
} from "https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js";

export class DSButton extends LitElement {
  static properties = {
    variant: { type: String },
    size: { type: String },
    disabled: { type: Boolean },
    fullWidth: { type: Boolean, attribute: "full-width" },
    type: { type: String },
    loading: { type: Boolean },
  };

  constructor() {
    super();
    this.variant = "primary";
    this.size = "md";
    this.disabled = false;
    this.fullWidth = false;
    this.type = "button";
    this.loading = false;
  }

  static styles = css`
    :host {
      display: inline-block;
    }

    :host([full-width]) {
      display: block;
    }

    button {
      /* Reset */
      margin: 0;
      border: 0;
      cursor: pointer;
      user-select: none;
      text-decoration: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;

      /* Typography from tokens */
      font-family: var(--font-sans);
      font-weight: var(--weight-medium);
      line-height: var(--leading-normal);
      text-align: center;

      /* Layout */
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      vertical-align: middle;
      white-space: nowrap;

      /* Transitions */
      transition: var(--transition-colors), var(--transition-transform);

      /* Border radius from tokens */
      border-radius: var(--radius-lg);

      /* Base styles - will be overridden by variants */
      background-color: var(--color-btn-primary);
      color: var(--color-text-inverse);
      border: var(--border-width-thin) solid transparent;
      box-shadow: var(--shadow-sm);
    }

    /* Size variants */
    button.size-xs {
      font-size: var(--text-xs);
      padding: var(--space-1) var(--space-3);
      border-radius: var(--radius-md);
    }

    button.size-sm {
      font-size: var(--text-xs);
      font-weight: var(--weight-semibold);
      padding: var(--space-1) var(--space-3);
      border-radius: var(--radius-md);
    }

    button.size-md {
      font-size: var(--text-md);
      padding: var(--space-3) var(--space-6);
    }

    button.size-lg {
      font-size: var(--text-lg);
      padding: var(--space-4) var(--space-8);
      border-radius: var(--radius-xl);
    }

    button.size-xl {
      font-size: var(--text-xl);
      padding: var(--space-5) var(--space-10);
      border-radius: var(--radius-xl);
      font-weight: var(--weight-semibold);
    }

    /* Primary variant (default) */
    button.variant-primary {
      background-color: var(--color-btn-primary);
      color: var(--color-text-inverse);
      font-weight: var(--weight-semibold);
      box-shadow: var(--shadow-sm);
    }

    button.variant-primary:hover:not(:disabled) {
      background-color: var(--color-hover);
      box-shadow: var(--shadow-lg);
      transform: var(--transform-lift-xs);
    }

    button.variant-primary:active:not(:disabled) {
      background-color: var(--color-active);
      transform: translateY(0);
      box-shadow: var(--shadow-sm);
    }

    button.variant-primary:focus-visible {
      outline: none;
      box-shadow: var(--shadow-focus);
    }

    /* Secondary variant */
    button.variant-secondary {
      background-color: var(--color-surface-secondary);
      color: var(--color-text-primary);
      border: var(--border-width-thin) solid var(--color-border-primary);
      box-shadow: var(--shadow-sm);
    }

    button.variant-secondary:hover:not(:disabled) {
      background-color: var(--color-surface-tertiary);
      border-color: var(--color-border-secondary);
      transform: var(--transform-lift-xs);
    }

    button.variant-secondary:active:not(:disabled) {
      background-color: var(--color-surface-primary);
      transform: translateY(0);
    }

    /* Ghost variant */
    button.variant-ghost {
      background-color: transparent;
      color: var(--color-text-secondary);
      border: var(--border-width-thin) solid transparent;
      box-shadow: none;
    }

    button.variant-ghost:hover:not(:disabled) {
      background-color: var(--color-surface-secondary);
      color: var(--color-text-primary);
    }

    button.variant-ghost:active:not(:disabled) {
      background-color: var(--color-surface-primary);
    }

    /* Ghost Subtle variant - for table actions (primary color) */
    button.variant-ghost-subtle {
      background-color: transparent;
      color: var(--color-primary);
      border: var(--border-width-thin) solid var(--color-primary-300);
      box-shadow: none;
    }

    button.variant-ghost-subtle:hover:not(:disabled) {
      background-color: var(--color-surface-secondary);
      color: var(--color-hover);
      border-color: var(--color-primary-400);
    }

    button.variant-ghost-subtle:active:not(:disabled) {
      background-color: var(--color-surface-tertiary);
      color: var(--color-active);
    }

    /* Danger Ghost variant - for table actions (danger color) */
    button.variant-danger-ghost {
      background-color: transparent;
      color: var(--color-error-main);
      border: var(--border-width-thin) solid var(--color-error-main);
      box-shadow: none;
      opacity: var(--opacity-70);
    }

    button.variant-danger-ghost:hover:not(:disabled) {
      background-color: var(--color-error-main);
      color: var(--color-text-inverse);
      border-color: var(--color-error-main);
      opacity: var(--opacity-100);
    }

    button.variant-danger-ghost:active:not(:disabled) {
      background-color: var(--color-error-main);
      color: var(--color-text-inverse);
      opacity: var(--opacity-90);
    }

    /* Outline variant */
    button.variant-outline {
      background-color: transparent;
      color: var(--color-text-primary);
      border: var(--border-width-thin) solid var(--color-border-primary);
      box-shadow: none;
    }

    button.variant-outline:hover:not(:disabled) {
      background-color: var(--color-surface-secondary);
      border-color: var(--color-border-secondary);
    }

    button.variant-outline:active:not(:disabled) {
      background-color: var(--color-surface-primary);
    }

    /* Danger variant */
    button.variant-danger {
      background-color: var(--color-error-main);
      color: var(--color-text-inverse);
      font-weight: var(--weight-semibold);
      box-shadow: var(--shadow-sm);
    }

    button.variant-danger:hover:not(:disabled) {
      background-color: var(--color-error-main);
      box-shadow: var(--shadow-lg);
      transform: var(--transform-lift-xs);
    }

    button.variant-danger:active:not(:disabled) {
      background-color: var(--color-error-main);
      transform: translateY(0);
    }

    /* Accent variant */
    button.variant-accent {
      background-color: var(--color-btn-accent);
      color: var(--color-text-inverse);
      font-weight: var(--weight-semibold);
      box-shadow: var(--shadow-sm);
    }

    button.variant-accent:hover:not(:disabled) {
      background-color: var(--color-btn-accent);
      box-shadow: var(--shadow-lg);
      transform: var(--transform-lift-xs);
    }

    button.variant-accent:active:not(:disabled) {
      background-color: var(--color-btn-accent);
      transform: translateY(0);
    }

    /* Success variant */
    button.variant-success {
      background-color: var(--color-btn-success);
      color: var(--color-text-inverse);
      font-weight: var(--weight-semibold);
      box-shadow: var(--shadow-sm);
    }

    button.variant-success:hover:not(:disabled) {
      background-color: var(--color-btn-success);
      box-shadow: var(--shadow-lg);
      transform: var(--transform-lift-xs);
    }

    button.variant-success:active:not(:disabled) {
      background-color: var(--color-btn-success);
      transform: translateY(0);
    }

    /* Warning variant */
    button.variant-warning {
      background-color: var(--color-btn-warning);
      color: var(--color-text-inverse);
      font-weight: var(--weight-semibold);
      box-shadow: var(--shadow-sm);
    }

    button.variant-warning:hover:not(:disabled) {
      background-color: var(--color-btn-warning);
      box-shadow: var(--shadow-lg);
      transform: var(--transform-lift-xs);
    }

    button.variant-warning:active:not(:disabled) {
      background-color: var(--color-btn-warning);
      transform: translateY(0);
    }

    /* Error/Danger variant */
    button.variant-danger,
    button.variant-error {
      background-color: var(--color-btn-danger);
      color: var(--color-text-inverse);
      font-weight: var(--weight-semibold);
      box-shadow: var(--shadow-sm);
    }

    button.variant-danger:hover:not(:disabled),
    button.variant-error:hover:not(:disabled) {
      background-color: var(--color-btn-danger);
      box-shadow: var(--shadow-lg);
      transform: var(--transform-lift-xs);
    }

    button.variant-danger:active:not(:disabled),
    button.variant-error:active:not(:disabled) {
      background-color: var(--color-btn-danger);
      transform: translateY(0);
    }

    /* Info variant */
    button.variant-info {
      background-color: var(--color-btn-info);
      color: var(--color-text-inverse);
      font-weight: var(--weight-semibold);
      box-shadow: var(--shadow-sm);
    }

    button.variant-info:hover:not(:disabled) {
      background-color: var(--color-btn-info);
      box-shadow: var(--shadow-lg);
      transform: var(--transform-lift-xs);
    }

    button.variant-info:active:not(:disabled) {
      background-color: var(--color-btn-info);
      transform: translateY(0);
    }

    /* Disabled state */
    button:disabled {
      opacity: var(--opacity-50);
      cursor: not-allowed;
      transform: none !important;
      background-color: var(--color-disabled) !important;
      color: var(--color-text-tertiary) !important;
      border-color: var(--color-border-tertiary) !important;
    }

    /* Full width */
    button.full-width {
      width: 100%;
    }

    /* Loading state */
    button.loading {
      cursor: wait;
      opacity: var(--opacity-70);
    }

    .loading-spinner {
      display: inline-block;
      width: 1em;
      height: 1em;
      border: var(--border-width-medium) solid currentColor;
      border-right-color: transparent;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    /* Focus visible styles */
    button:focus-visible {
      outline: none;
      box-shadow: var(--shadow-focus);
    }
  `;

  _handleClick(e) {
    if (this.disabled || this.loading) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    this.dispatchEvent(
      new CustomEvent("ds-click", {
        detail: {},
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    const classes = [
      `variant-${this.variant}`,
      `size-${this.size}`,
      this.fullWidth ? "full-width" : "",
      this.loading ? "loading" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return html`
      <button
        type="${this.type}"
        class="${classes}"
        ?disabled="${this.disabled || this.loading}"
        @click="${this._handleClick}"
      >
        ${this.loading ? html`<span class="loading-spinner"></span>` : ""}
        <slot></slot>
      </button>
    `;
  }
}

// Register component
customElements.define("ds-button", DSButton);
