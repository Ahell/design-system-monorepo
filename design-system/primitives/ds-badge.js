/**
 * Design System Badge Component
 *
 * Metric badge/pill for displaying statistics with label and value.
 * Uses design tokens from tokens.css and theme.css exclusively.
 *
 * @prop {string} label - The label text (e.g., "Files", "Total Size")
 * @prop {string} value - The value to display (e.g., "1", "191.7 KB")
 * @prop {string} variant - Visual variant: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
 * @prop {string} size - Size variant: 'sm' | 'md' | 'lg'
 */

import {
  LitElement,
  html,
  css,
} from "lit";

class DSBadge extends LitElement {
  static properties = {
    label: { type: String },
    value: { type: String },
    variant: { type: String },
    size: { type: String },
  };

  static styles = css`
    :host {
      display: inline-flex;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-1) var(--space-3);
      border-radius: var(--radius-full);
      border: 1px solid;
      font-family: var(--font-sans);
      font-size: var(--text-xs);
      font-weight: var(--weight-medium);
      color: var(--color-text-secondary);
      white-space: nowrap;
      line-height: var(--leading-tight);
      transition: var(--transition-colors);
    }

    .badge-value {
      color: var(--color-text-primary);
      font-weight: var(--weight-semibold);
    }

    /* Size variants */
    .badge.size-sm {
      padding: 2px var(--space-2);
      font-size: 10px;
    }

    .badge.size-lg {
      padding: var(--space-2) var(--space-4);
      font-size: var(--text-sm);
    }

    /* Default variant */
    .badge.variant-default {
      background: var(--color-badge-default-bg);
      border-color: var(--color-badge-default-border);
      color: var(--color-text-tertiary);
    }

    .badge.variant-default .badge-value {
      color: var(--color-text-secondary);
    }

    /* Primary variant */
    .badge.variant-primary {
      background: var(--color-primary-main);
      border-color: var(--color-primary-main);
      color: var(--color-text-inverse);
    }

    .badge.variant-primary .badge-value {
      color: var(--color-text-inverse);
    }

    /* Success variant */
    .badge.variant-success {
      background: var(--color-success-main);
      border-color: var(--color-success-main);
      color: var(--color-text-inverse);
    }

    .badge.variant-success .badge-value {
      color: var(--color-text-inverse);
    }

    /* Warning variant */
    .badge.variant-warning {
      background: var(--color-warning-main);
      border-color: var(--color-warning-main);
      color: var(--color-text-inverse);
    }

    .badge.variant-warning .badge-value {
      color: var(--color-text-inverse);
    }

    /* Danger variant */
    .badge.variant-danger {
      background: var(--color-error-main);
      border-color: var(--color-error-main);
      color: var(--color-text-inverse);
    }

    .badge.variant-danger .badge-value {
      color: var(--color-text-inverse);
    }

    /* Info variant */
    .badge.variant-info {
      background: var(--color-info-main);
      border-color: var(--color-info-main);
      color: var(--color-text-inverse);
    }

    .badge.variant-info .badge-value {
      color: var(--color-text-inverse);
    }

    /* Hover effects */
    .badge:hover {
      transform: translateY(-1px);
      box-shadow: var(--shadow-sm);
    }
  `;

  constructor() {
    super();
    this.label = "";
    this.value = "";
    this.variant = "default";
    this.size = "md";
  }

  render() {
    const classes = ["badge", `variant-${this.variant}`, `size-${this.size}`]
      .filter(Boolean)
      .join(" ");

    // If label and value are provided, use them
    if (this.label || this.value) {
      return html`
        <div class="${classes}">
          ${this.label} <span class="badge-value">${this.value}</span>
        </div>
      `;
    }

    // Otherwise, use slot content
    return html`
      <div class="${classes}">
        <slot></slot>
      </div>
    `;
  }
}

// Register component
customElements.define("ds-badge", DSBadge);

export { DSBadge };
