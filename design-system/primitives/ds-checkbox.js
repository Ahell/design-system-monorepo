/**
 * Design System Checkbox Component
 *
 * Enhanced checkbox primitive with professional styling using design tokens.
 * Supports labels, disabled state, and improved accessibility.
 */

import { LitElement, html, css } from "lit";

export class DSCheckbox extends LitElement {
  static properties = {
    label: { type: String },
    checked: { type: Boolean },
    disabled: { type: Boolean },
    name: { type: String },
    value: { type: String },
    size: { type: String },
  };

  constructor() {
    super();
    this.label = "";
    this.checked = false;
    this.disabled = false;
    this.name = "";
    this.value = "";
    this.size = "md";
  }

  static styles = css`
    :host {
      display: inline-block;
      align-self: flex-start;
      color: var(--color-text-primary);
      font-family: var(--font-sans);
    }

    .checkbox-wrapper {
      display: inline-flex;
      align-items: center;
      gap: var(--space-3);
      cursor: pointer;
      user-select: none;
      white-space: nowrap;
      padding: var(--space-1);
      border-radius: var(--radius-md);
      transition: var(--transition-colors);
    }

    .checkbox-wrapper.disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .checkbox-wrapper:hover:not(.disabled) {
      background: var(--color-surface-secondary);
    }

    /* Hide native checkbox */
    input[type="checkbox"] {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }

    /* Custom checkbox */
    .checkbox-custom {
      position: relative;
      border: 2px solid var(--color-border-primary);
      border-radius: var(--radius-sm);
      background: var(--color-surface-primary);
      transition: var(--transition-all);
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Size variants */
    .checkbox-custom.size-sm {
      width: 16px;
      height: 16px;
    }

    .checkbox-custom.size-md {
      width: 20px;
      height: 20px;
    }

    .checkbox-custom.size-lg {
      width: 24px;
      height: 24px;
    }

    /* Hover state */
    .checkbox-wrapper:hover:not(.disabled) .checkbox-custom {
      border-color: var(--color-border-secondary);
      box-shadow: var(--shadow-sm);
    }

    /* Checked state */
    input[type="checkbox"]:checked + .checkbox-custom {
      background: var(--color-primary-main);
      border-color: var(--color-primary-main);
    }

    input[type="checkbox"]:checked:hover + .checkbox-custom {
      background: var(--color-primary-light);
      border-color: var(--color-primary-light);
    }

    /* Checkmark */
    input[type="checkbox"]:checked + .checkbox-custom::after {
      content: "✓";
      color: white;
      font-size: 12px;
      font-weight: bold;
      line-height: 1;
    }

    /* Focus state */
    input[type="checkbox"]:focus-visible + .checkbox-custom {
      outline: none;
      border-color: var(--color-primary-main);
      box-shadow: 0 0 0 3px var(--color-primary-focus);
    }

    /* Indeterminate state */
    input[type="checkbox"]:indeterminate + .checkbox-custom {
      background: var(--color-primary-main);
      border-color: var(--color-primary-main);
    }

    input[type="checkbox"]:indeterminate + .checkbox-custom::after {
      content: "−";
      color: white;
      font-size: 12px;
      font-weight: bold;
      line-height: 1;
    }

    /* Label */
    .checkbox-label {
      font-size: var(--text-sm);
      font-weight: var(--weight-medium);
      color: var(--color-text-primary);
      line-height: var(--leading-tight);
      margin: 0;
    }

    .checkbox-wrapper.disabled .checkbox-label {
      color: var(--color-text-tertiary);
    }

    /* Error state */
    .checkbox-wrapper.error {
      color: var(--color-error-main);
    }

    .checkbox-wrapper.error .checkbox-custom {
      border-color: var(--color-error-main);
    }

    .checkbox-wrapper.error .checkbox-label {
      color: var(--color-error-main);
    }
  `;

  _handleChange(e) {
    this.checked = e.target.checked;
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { checked: this.checked, value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <label class="checkbox-wrapper ${this.disabled ? "disabled" : ""}">
        <input
          type="checkbox"
          .checked=${this.checked}
          ?disabled=${this.disabled}
          name=${this.name}
          value=${this.value}
          @change=${this._handleChange}
        />
        <span class="checkbox-custom size-${this.size}"></span>
        ${this.label
          ? html`<span class="checkbox-label">${this.label}</span>`
          : ""}
      </label>
    `;
  }
}

customElements.define("ds-checkbox", DSCheckbox);
