/**
 * Design System Textarea Component
 *
 * Reusable textarea primitive using design tokens.
 * Supports auto-grow, character counter, and validation states.
 */

import {
  LitElement,
  html,
  css,
} from "https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js";

export class DSTextarea extends LitElement {
  static properties = {
    label: { type: String },
    value: { type: String },
    placeholder: { type: String },
    disabled: { type: Boolean },
    required: { type: Boolean },
    error: { type: String },
    helper: { type: String },
    rows: { type: Number },
    maxLength: { type: Number, attribute: "max-length" },
    showCounter: { type: Boolean, attribute: "show-counter" },
    autoGrow: { type: Boolean, attribute: "auto-grow" },
    resize: { type: String },
    fullWidth: { type: Boolean, attribute: "full-width" },
    name: { type: String },
  };

  constructor() {
    super();
    this.label = "";
    this.value = "";
    this.placeholder = "";
    this.disabled = false;
    this.required = false;
    this.error = "";
    this.helper = "";
    this.rows = 4;
    this.maxLength = null;
    this.showCounter = false;
    this.autoGrow = false;
    this.resize = "vertical";
    this.fullWidth = false;
    this.name = "";
  }

  static styles = css`
    :host {
      display: block;
    }

    :host([full-width]) {
      width: 100%;
    }

    .textarea-wrapper {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      width: 100%;
    }

    .label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .label {
      font-size: var(--text-sm);
      font-weight: var(--weight-medium);
      color: var(--color-text-primary);
      line-height: var(--leading-tight);
    }

    .label .required {
      color: var(--color-danger-main);
      margin-left: var(--space-1);
    }

    .counter {
      font-size: var(--text-xs);
      color: var(--color-text-tertiary);
      font-family: var(--font-mono);
    }

    .counter.warning {
      color: var(--color-warning-main);
    }

    .counter.error {
      color: var(--color-danger-main);
    }

    .textarea-container {
      position: relative;
      width: 100%;
    }

    textarea {
      /* Reset */
      border: none;
      margin: 0;
      font-family: inherit;
      outline: none;

      /* Layout */
      width: 100%;
      display: block;

      /* Styling using design tokens - matching ds-input */
      background: var(--color-surface-secondary);
      border: var(--border-width-thin) solid var(--color-border-primary);
      border-radius: var(--radius-lg);
      color: var(--color-text-secondary);
      font-size: var(--text-sm);
      font-weight: var(--weight-normal);
      line-height: var(--leading-relaxed);
      padding: var(--space-3);
      transition: var(--transition-colors),
        border-color var(--duration-fast) var(--ease-out);

      /* Resize control */
      resize: vertical;
      min-height: var(--min-height-xl);
    }

    textarea.resize-none {
      resize: none;
    }

    textarea.resize-horizontal {
      resize: horizontal;
    }

    textarea.resize-both {
      resize: both;
    }

    /* States */
    textarea::placeholder {
      color: var(--color-text-tertiary);
    }

    textarea:hover:not(:disabled) {
      border-color: var(--color-border-secondary);
    }

    textarea:focus {
      outline: none;
      border-color: var(--color-primary-main);
      box-shadow: var(--shadow-focus);
      background-color: var(--color-surface-tertiary);
    }

    textarea:disabled {
      opacity: var(--opacity-50);
      cursor: not-allowed;
      background: var(--color-surface-secondary);
      resize: none;
    }

    /* Error state */
    textarea.error {
      border-color: var(--color-danger-main);
    }

    textarea.error:focus {
      outline: none;
      border-color: var(--color-danger-main);
      box-shadow: var(--shadow-focus);
    }

    /* Helper and error text */
    .helper-text {
      font-size: var(--text-xs);
      color: var(--color-text-tertiary);
      line-height: var(--leading-tight);
    }

    .error-text {
      font-size: var(--text-xs);
      color: var(--color-danger-main);
      line-height: var(--leading-tight);
      display: flex;
      align-items: center;
      gap: var(--space-1);
    }

    .error-icon {
      font-size: var(--text-sm);
    }
  `;

  _handleInput(e) {
    this.value = e.target.value;

    // Auto-grow functionality
    if (this.autoGrow) {
      e.target.style.height = "auto";
      e.target.style.height = e.target.scrollHeight + "px";
    }

    this.dispatchEvent(
      new CustomEvent("input", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  _handleChange(e) {
    this.value = e.target.value;
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  updated(changedProperties) {
    if (changedProperties.has("value") && this.autoGrow) {
      const textarea = this.shadowRoot.querySelector("textarea");
      if (textarea) {
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
      }
    }
  }

  _getCharacterCount() {
    const currentLength = this.value?.length || 0;
    if (!this.maxLength) {
      return { current: currentLength, max: null, percentage: 0 };
    }

    const percentage = (currentLength / this.maxLength) * 100;
    return {
      current: currentLength,
      max: this.maxLength,
      percentage,
    };
  }

  render() {
    const hasError = Boolean(this.error);
    const { current, max, percentage } = this._getCharacterCount();

    const textareaClasses = [hasError ? "error" : "", `resize-${this.resize}`]
      .filter(Boolean)
      .join(" ");

    const counterClasses = [
      percentage >= 100 ? "error" : percentage >= 90 ? "warning" : "",
    ]
      .filter(Boolean)
      .join(" ");

    const showCounterDisplay = this.showCounter || this.maxLength;

    return html`
      <div class="textarea-wrapper">
        ${this.label || showCounterDisplay
          ? html`
              <div class="label-row">
                ${this.label
                  ? html`
                      <label class="label">
                        ${this.label}
                        ${this.required
                          ? html`<span class="required">*</span>`
                          : ""}
                      </label>
                    `
                  : html`<span></span>`}
                ${showCounterDisplay
                  ? html`
                      <span class="counter ${counterClasses}">
                        ${current}${max ? `/${max}` : ""}
                      </span>
                    `
                  : ""}
              </div>
            `
          : ""}

        <div class="textarea-container">
          <textarea
            class=${textareaClasses}
            .value=${this.value}
            placeholder=${this.placeholder}
            ?disabled=${this.disabled}
            ?required=${this.required}
            rows=${this.rows}
            maxlength=${this.maxLength || ""}
            name=${this.name}
            @input=${this._handleInput}
            @change=${this._handleChange}
          ></textarea>
        </div>

        ${hasError
          ? html`
              <div class="error-text">
                <span class="error-icon">⚠️</span>
                <span>${this.error}</span>
              </div>
            `
          : this.helper
          ? html`<div class="helper-text">${this.helper}</div>`
          : ""}
      </div>
    `;
  }
}

customElements.define("ds-textarea", DSTextarea);
