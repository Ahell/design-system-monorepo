/**
 * Design System Radio Button Component
 *
 * Enhanced radio button with professional styling using design tokens.
 * Should be used within ds-radio-group for proper group management.
 */

import { LitElement, html, css } from "lit";

export class DSRadio extends LitElement {
  static properties = {
    label: { type: String },
    value: { type: String },
    checked: { type: Boolean },
    disabled: { type: Boolean },
    name: { type: String },
    helper: { type: String },
    size: { type: String },
  };

  constructor() {
    super();
    this.label = "";
    this.value = "";
    this.checked = false;
    this.disabled = false;
    this.name = "";
    this.helper = "";
    this.size = "md";
  }

  static styles = css`
    :host {
      display: block;
      color: var(--color-text-primary);
      font-family: var(--font-sans);
    }

    .radio-wrapper {
      display: inline-flex;
      align-items: flex-start;
      gap: var(--space-3);
      cursor: pointer;
      user-select: none;
      padding: var(--space-1);
      border-radius: var(--radius-md);
      transition: var(--transition-colors);
    }

    .radio-wrapper.disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .radio-wrapper:hover:not(.disabled) {
      background: var(--color-surface-secondary);
    }

    /* Hide native radio */
    input[type="radio"] {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }

    /* Custom radio button */
    .radio-custom {
      position: relative;
      border: 2px solid var(--color-border-primary);
      border-radius: var(--radius-full);
      background: var(--color-surface-primary);
      transition: var(--transition-all);
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Size variants */
    .radio-custom.size-sm {
      width: 16px;
      height: 16px;
    }

    .radio-custom.size-md {
      width: 20px;
      height: 20px;
    }

    .radio-custom.size-lg {
      width: 24px;
      height: 24px;
    }

    /* Hover state */
    .radio-wrapper:hover:not(.disabled) .radio-custom {
      border-color: var(--color-border-secondary);
      box-shadow: var(--shadow-sm);
    }

    /* Checked state */
    input[type="radio"]:checked + .radio-custom {
      border-color: var(--color-primary-main);
      background: var(--color-primary-main);
    }

    input[type="radio"]:checked:hover + .radio-custom {
      background: var(--color-primary-light);
      border-color: var(--color-primary-light);
    }

    input[type="radio"]:checked + .radio-custom::after {
      content: "";
      width: 6px;
      height: 6px;
      border-radius: var(--radius-full);
      background: white;
    }

    /* Focus state */
    input[type="radio"]:focus-visible + .radio-custom {
      outline: none;
      border-color: var(--color-primary-main);
      box-shadow: 0 0 0 3px var(--color-primary-focus);
    }

    /* Label and helper text container */
    .label-container {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
      min-width: 0;
      flex: 1;
    }

    /* Label */
    .radio-label {
      font-size: var(--text-sm);
      font-weight: var(--weight-medium);
      color: var(--color-text-primary);
      line-height: var(--leading-tight);
      margin: 0;
    }

    .radio-wrapper.disabled .radio-label {
      color: var(--color-text-tertiary);
    }

    /* Helper text */
    .radio-helper {
      font-size: var(--text-sm);
      color: var(--color-text-tertiary);
      line-height: var(--leading-snug);
      margin: 0;
    }

    /* Error state */
    .radio-wrapper.error {
      color: var(--color-error-main);
    }

    .radio-wrapper.error .radio-custom {
      border-color: var(--color-error-main);
    }

    .radio-wrapper.error .radio-label {
      color: var(--color-error-main);
    }
  `;

  _handleChange(e) {
    if (this.disabled) return;

    this.checked = e.target.checked;
    this.dispatchEvent(
      new CustomEvent("radio-change", {
        detail: { value: this.value, checked: this.checked },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <label class="radio-wrapper ${this.disabled ? "disabled" : ""}">
        <input
          type="radio"
          .checked=${this.checked}
          ?disabled=${this.disabled}
          name=${this.name}
          value=${this.value}
          @change=${this._handleChange}
        />
        <span class="radio-custom size-${this.size}"></span>
        ${this.label || this.helper
          ? html`
              <div class="label-container">
                ${this.label
                  ? html`<span class="radio-label">${this.label}</span>`
                  : ""}
                ${this.helper
                  ? html`<span class="radio-helper">${this.helper}</span>`
                  : ""}
              </div>
            `
          : ""}
      </label>
    `;
  }
}

customElements.define("ds-radio", DSRadio);
