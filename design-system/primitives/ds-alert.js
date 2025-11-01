/**
 * Design System Alert Component
 *
 * Contextual feedback messages for user actions and system status.
 * Supports different variants for various message types.
 */

import { LitElement, html, css } from "lit";

export class DSAlert extends LitElement {
  static properties = {
    variant: { type: String },
    title: { type: String },
    dismissible: { type: Boolean },
    icon: { type: String },
  };

  constructor() {
    super();
    this.variant = "info";
    this.title = "";
    this.dismissible = false;
    this.icon = "";
  }

  static styles = css`
    :host {
      display: block;
    }

    .alert {
      padding: var(--space-4);
      border-radius: var(--radius-md);
      border: 1px solid;
      margin-bottom: var(--space-4);
      display: flex;
      align-items: flex-start;
      gap: var(--space-3);
      position: relative;
    }

    .alert-icon {
      flex-shrink: 0;
      font-size: var(--text-lg);
      line-height: 1;
      margin-top: 2px;
    }

    .alert-content {
      flex: 1;
      min-width: 0;
    }

    .alert-title {
      font-size: var(--text-sm);
      font-weight: var(--weight-semibold);
      color: var(--color-text-primary);
      margin: 0 0 var(--space-1) 0;
    }

    .alert-message {
      font-size: var(--text-sm);
      color: var(--color-text-primary);
      margin: 0;
      line-height: var(--leading-relaxed);
    }

    .alert-dismiss {
      flex-shrink: 0;
      background: none;
      border: none;
      cursor: pointer;
      padding: var(--space-1);
      margin: -4px -4px -4px 0;
      color: var(--color-text-secondary);
      border-radius: var(--radius-sm);
      transition: var(--transition-colors);
    }

    .alert-dismiss:hover {
      background: var(--color-surface-secondary);
      color: var(--color-text-primary);
    }

    /* Info variant */
    .alert.variant-info {
      background: var(--color-info-main);
      border-color: var(--color-info-main);
      color: var(--color-text-inverse);
    }

    .alert.variant-info .alert-icon {
      color: var(--color-text-inverse);
    }

    .alert.variant-info .alert-title,
    .alert.variant-info .alert-message {
      color: var(--color-text-inverse);
    }

    /* Success variant */
    .alert.variant-success {
      background: var(--color-success-main);
      border-color: var(--color-success-main);
      color: var(--color-text-inverse);
    }

    .alert.variant-success .alert-icon {
      color: var(--color-text-inverse);
    }

    .alert.variant-success .alert-title,
    .alert.variant-success .alert-message {
      color: var(--color-text-inverse);
    }

    /* Warning variant */
    .alert.variant-warning {
      background: var(--color-warning-main);
      border-color: var(--color-warning-main);
      color: var(--color-text-inverse);
    }

    .alert.variant-warning .alert-icon {
      color: var(--color-text-inverse);
    }

    .alert.variant-warning .alert-title,
    .alert.variant-warning .alert-message {
      color: var(--color-text-inverse);
    }

    /* Error variant */
    .alert.variant-error {
      background: var(--color-error-main);
      border-color: var(--color-error-main);
      color: var(--color-text-inverse);
    }

    .alert.variant-error .alert-icon {
      color: var(--color-text-inverse);
    }

    .alert.variant-error .alert-title,
    .alert.variant-error .alert-message {
      color: var(--color-text-inverse);
    }

    /* Animation for dismiss */
    .alert.dismissing {
      opacity: 0;
      transform: translateY(-10px);
      transition: opacity 0.3s ease, transform 0.3s ease;
    }
  `;

  _handleDismiss() {
    this.classList.add("dismissing");
    setTimeout(() => {
      this.remove();
    }, 300);
  }

  _getDefaultIcon() {
    switch (this.variant) {
      case "success":
        return "✓";
      case "warning":
        return "⚠";
      case "error":
        return "✕";
      case "info":
      default:
        return "ℹ";
    }
  }

  render() {
    const icon = this.icon || this._getDefaultIcon();

    return html`
      <div class="alert variant-${this.variant}">
        <div class="alert-icon">${icon}</div>
        <div class="alert-content">
          ${this.title ? html`<h4 class="alert-title">${this.title}</h4>` : ""}
          <div class="alert-message">
            <slot></slot>
          </div>
        </div>
        ${this.dismissible
          ? html`
              <button
                class="alert-dismiss"
                @click="${this._handleDismiss}"
                aria-label="Dismiss alert"
              >
                ✕
              </button>
            `
          : ""}
      </div>
    `;
  }
}

customElements.define("ds-alert", DSAlert);
