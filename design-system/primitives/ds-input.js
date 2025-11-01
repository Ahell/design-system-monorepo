/**
 * Design System Input Component
 *
 * Reusable input primitive using design tokens.
 * Supports various input types, validation states, and labels.
 */

import {
  LitElement,
  html,
  css,
} from "lit";

export class DSInput extends LitElement {
  static properties = {
    label: { type: String },
    type: { type: String },
    value: { type: String },
    placeholder: { type: String },
    disabled: { type: Boolean },
    required: { type: Boolean },
    error: { type: String },
    hint: { type: String },
    size: { type: String },
    fullWidth: { type: Boolean, attribute: "full-width" },
    name: { type: String },
    icon: { type: String },
    iconPosition: { type: String },
  };

  constructor() {
    super();
    this.label = "";
    this.type = "text";
    this.value = "";
    this.placeholder = "";
    this.disabled = false;
    this.required = false;
    this.error = "";
    this.hint = "";
    this.size = "md";
    this.fullWidth = false;
    this.name = "";
    this.icon = "";
    this.iconPosition = "left";
  }

  static styles = css`
    :host {
      display: block;
      min-width: 0;
    }

    :host([full-width]) {
      width: 100%;
    }

    .input-wrapper {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      width: 100%;
      min-width: 0;
    }

    .label {
      font-size: var(--text-sm);
      font-weight: var(--weight-medium);
      color: var(--color-text-primary);
      line-height: var(--leading-tight);
    }

    .label .required {
      color: var(--color-error-main);
      margin-left: var(--space-1);
    }

    .input-container {
      position: relative;
      width: 100%;
      display: flex;
      align-items: center;
    }

    .input-icon {
      position: absolute;
      left: var(--space-3);
      color: var(--color-text-tertiary);
      font-size: var(--text-lg);
      pointer-events: none;
      z-index: 1;
    }

    .input-icon.icon-right {
      left: auto;
      right: var(--space-3);
    }

    input,
    textarea,
    select {
      /* Reset */
      margin: 0;
      font-family: inherit;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;

      /* Typography */
      font-family: inherit;
      font-size: var(--text-md);
      line-height: var(--leading-normal);
      color: var(--color-text-primary);

      /* Layout */
      width: 100%;
      display: block;
      box-sizing: border-box;

      /* Appearance */
      background-color: var(--color-surface-primary);
      border: 1px solid var(--color-input-border);
      border-radius: var(--radius-md);

      /* Transitions */
      transition: var(--transition-all);
    }

    /* Size variants */
    input.size-sm,
    textarea.size-sm,
    select.size-sm {
      font-size: var(--text-sm);
      padding: var(--space-2) var(--space-3);
    }

    input.size-sm.has-icon:not(.icon-right),
    select.size-sm.has-icon:not(.icon-right) {
      padding-left: var(--space-8);
    }

    input.size-sm.has-icon.icon-right,
    select.size-sm.has-icon.icon-right {
      padding-right: var(--space-8);
    }

    input.size-md,
    textarea.size-md,
    select.size-md {
      padding: var(--space-3) var(--space-4);
    }

    input.size-md.has-icon:not(.icon-right),
    select.size-md.has-icon:not(.icon-right) {
      padding-left: var(--space-10);
    }

    input.size-md.has-icon.icon-right,
    select.size-md.has-icon.icon-right {
      padding-right: var(--space-10);
    }

    input.size-lg,
    textarea.size-lg,
    select.size-lg {
      font-size: var(--text-lg);
      padding: var(--space-4) var(--space-5);
    }

    input.size-lg.has-icon:not(.icon-right),
    select.size-lg.has-icon:not(.icon-right) {
      padding-left: var(--space-12);
    }

    input.size-lg.has-icon.icon-right,
    select.size-lg.has-icon.icon-right {
      padding-right: var(--space-12);
    }

    /* Hover state */
    input:hover:not(:disabled):not(.error),
    textarea:hover:not(:disabled):not(.error),
    select:hover:not(:disabled):not(.error) {
      border-color: var(--color-border-secondary);
      box-shadow: var(--shadow-sm);
    }

    /* Focus state */
    input:focus,
    textarea:focus,
    select:focus {
      outline: none;
      border-color: var(--color-primary-main);
      box-shadow: var(--shadow-focus);
      background-color: var(--color-surface-primary);
    }

    /* Error state */
    input.error,
    textarea.error,
    select.error {
      border-color: var(--color-error-main);
      background-color: var(--color-error-bg);
    }

    input.error:focus,
    textarea.error:focus,
    select.error:focus {
      border-color: var(--color-error-main);
      box-shadow: 0 0 0 3px var(--color-error-focus);
    }

    /* Disabled state */
    input:disabled,
    textarea:disabled,
    select:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      background-color: var(--color-disabled);
      border-color: var(--color-border-primary);
    }

    /* Placeholder */
    input::placeholder,
    textarea::placeholder {
      color: var(--color-text-tertiary);
    }

    /* Textarea specific */
    textarea {
      resize: vertical;
      min-height: 80px;
    }

    /* Select specific */
    select {
      cursor: pointer;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right var(--space-3) center;
      background-size: 12px;
    }

    select.has-icon.icon-right {
      background-position: right var(--space-8) center;
    }

    /* Hint text */
    .hint {
      font-size: var(--text-sm);
      color: var(--color-text-secondary);
      line-height: var(--leading-snug);
    }

    /* Error message */
    .error-message {
      font-size: var(--text-sm);
      color: var(--color-error-main);
      line-height: var(--leading-snug);
      font-weight: var(--weight-medium);
      display: flex;
      align-items: center;
      gap: var(--space-1);
    }

    .error-message::before {
      content: "⚠";
      font-size: var(--text-sm);
    }
  `;

  _handleInput(e) {
    this.value = e.target.value;
    this.dispatchEvent(
      new CustomEvent("ds-input", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  _handleChange(e) {
    this.value = e.target.value;
    this.dispatchEvent(
      new CustomEvent("ds-change", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    const inputClasses = [
      `size-${this.size}`,
      this.error ? "error" : "",
      this.icon ? "has-icon" : "",
      this.iconPosition === "right" ? "icon-right" : "",
    ]
      .filter(Boolean)
      .join(" ");

    const renderInput = () => {
      if (this.type === "textarea") {
        return html`
          <textarea
            class="${inputClasses}"
            .value="${this.value}"
            placeholder="${this.placeholder}"
            ?disabled="${this.disabled}"
            ?required="${this.required}"
            name="${this.name}"
            @input="${this._handleInput}"
            @change="${this._handleChange}"
          ></textarea>
        `;
      }

      if (this.type === "select") {
        return html`
          <select
            class="${inputClasses}"
            .value="${this.value}"
            ?disabled="${this.disabled}"
            ?required="${this.required}"
            name="${this.name}"
            @change="${this._handleChange}"
          >
            <slot></slot>
          </select>
        `;
      }

      return html`
        <input
          type="${this.type}"
          class="${inputClasses}"
          .value="${this.value}"
          placeholder="${this.placeholder}"
          ?disabled="${this.disabled}"
          ?required="${this.required}"
          name="${this.name}"
          @input="${this._handleInput}"
          @change="${this._handleChange}"
        />
      `;
    };

    return html`
      <div class="input-wrapper">
        ${this.label
          ? html`
              <label class="label">
                ${this.label}
                ${this.required ? html`<span class="required">*</span>` : ""}
              </label>
            `
          : ""}

        <div class="input-container">
          ${this.icon && this.iconPosition === "left"
            ? html`<span class="input-icon">${this.icon}</span>`
            : ""}
          ${renderInput()}
          ${this.icon && this.iconPosition === "right"
            ? html`<span class="input-icon icon-right">${this.icon}</span>`
            : ""}
        </div>

        ${this.error
          ? html`<div class="error-message">${this.error}</div>`
          : this.hint
          ? html`<div class="hint">${this.hint}</div>`
          : ""}
      </div>
    `;
  }
}

// Register component
customElements.define("ds-input", DSInput);
