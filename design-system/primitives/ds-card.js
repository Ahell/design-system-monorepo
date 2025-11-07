/**
 * Design System Card Component
 *
 * Reusable card primitive using design tokens.
 * Supports multiple variants and flexible content via slots.
 */

import { LitElement, html, css } from "lit";

export class DSCard extends LitElement {
  static properties = {
    variant: { type: String },
    padding: { type: String },
    elevated: { type: Boolean },
    interactive: { type: Boolean },
    borderless: { type: Boolean },
  };

  constructor() {
    super();
    this.variant = "default";
    this.padding = "md";
    this.elevated = false;
    this.interactive = false;
    this.borderless = false;
  }

  static styles = css`
    :host {
      display: block;
      font-family: var(--font-sans);
    }

    .card {
      background-color: var(--color-surface-secondary);
      border-radius: var(--radius-xl);
      border: var(--border-width-thin) solid var(--color-border-primary);
      transition: var(--transition-all);
      position: relative;
    }

    /* Padding variants */
    .card.padding-none {
      padding: 0;
    }

    .card.padding-sm {
      padding: var(--space-4);
    }

    .card.padding-md {
      padding: var(--space-6);
    }

    .card.padding-lg {
      padding: var(--space-8);
    }

    .card.padding-xl {
      padding: var(--space-12);
    }

    /* Elevated variant */
    .card.elevated {
      background-color: var(--color-surface-primary);
      box-shadow: var(--shadow-lg);
    }

    .card.elevated:hover {
      box-shadow: var(--shadow-xl);
      transform: var(--transform-lift-sm);
    }

    /* Interactive variant */
    .card.interactive {
      cursor: pointer;
    }

    .card.interactive:hover {
      border-color: var(--color-border-secondary);
      box-shadow: var(--shadow-sm);
      transform: var(--transform-lift-xs);
    }

    .card.interactive:active {
      transform: translateY(0);
      box-shadow: none;
    }

    /* Borderless variant */
    .card.borderless {
      border: none;
    }

    /* Variant styles */
    .card.variant-primary {
      border-color: var(--color-primary-main);
      background-color: var(--color-card-primary-bg);
    }

    .card.variant-success {
      border-color: var(--color-success-main);
      background-color: var(--color-card-success-bg);
    }

    .card.variant-warning {
      border-color: var(--color-warning-main);
      background-color: var(--color-card-warning-bg);
    }

    .card.variant-danger {
      border-color: var(--color-danger-main);
      background-color: var(--color-card-danger-bg);
    }

    /* Slots */
    ::slotted([slot="header"]) {
      margin-bottom: var(--space-4);
    }

    ::slotted([slot="footer"]) {
      margin-bottom: var(--space-4);
      padding-top: var(--space-4);
      border-top: var(--border-width-thin) solid var(--color-border-primary);
    }

    /* Header slot wrapper */
    .card-header {
      font-size: var(--text-lg);
      font-weight: var(--weight-semibold);
      color: var(--color-text-primary);
      margin-bottom: var(--space-4);
    }

    .card-body {
      color: var(--color-text-secondary);
    }

    .card-footer {
      margin-top: var(--space-4);
      padding-top: var(--space-4);
      border-top: var(--border-width-thin) solid var(--color-border-primary);
    }

    /* Focus visible for interactive cards */
    .card.interactive:focus-visible {
      outline: none;
      box-shadow: var(--shadow-focus);
    }
  `;

  _handleClick(e) {
    if (this.interactive) {
      this.dispatchEvent(
        new CustomEvent("ds-card-click", {
          detail: {},
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  render() {
    const classes = [
      "card",
      `variant-${this.variant}`,
      `padding-${this.padding}`,
      this.elevated ? "elevated" : "",
      this.interactive ? "interactive" : "",
      this.borderless ? "borderless" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return html`
      <div
        class="${classes}"
        @click="${this._handleClick}"
        tabindex="${this.interactive ? "0" : ""}"
        role="${this.interactive ? "button" : ""}"
      >
        <slot name="header"></slot>
        <div class="card-body">
          <slot></slot>
        </div>
        <slot name="footer"></slot>
      </div>
    `;
  }
}

// Register component
if (!customElements.get("ds-card")) {
  customElements.define("ds-card", DSCard);
}
