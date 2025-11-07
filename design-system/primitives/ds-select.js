/**
 * Design System Select Component
 *
 * Enhanced select dropdown with professional styling using design tokens.
 * Supports options array, placeholder, validation states, and labels.
 */

import { LitElement, html, css } from "lit";

export class DSSelect extends LitElement {
  static properties = {
    label: { type: String },
    options: { type: Array },
    value: { type: String },
    placeholder: { type: String },
    disabled: { type: Boolean },
    required: { type: Boolean },
    error: { type: String },
    helper: { type: String },
    size: { type: String },
    fullWidth: { type: Boolean, attribute: "full-width" },
    name: { type: String },
    icon: { type: String },
  };

  constructor() {
    super();
    this.label = "";
    this.options = [];
    this.value = "";
    this.placeholder = "";
    this.disabled = false;
    this.required = false;
    this.error = "";
    this.helper = "";
    this.size = "md";
    this.fullWidth = false;
    this.name = "";
    this.icon = "";
  }

  static styles = css`
    :host {
      display: block;
      min-width: 0;
    }

    :host([full-width]) {
      width: 100%;
    }

    .select-wrapper {
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

    .select-container {
      position: relative;
      width: 100%;
      min-width: 0;
      display: flex;
      align-items: center;
    }

    .select-icon {
      position: absolute;
      left: var(--space-3);
      color: var(--color-text-tertiary);
      font-size: var(--text-lg);
      pointer-events: none;
      z-index: 1;
    }

    select {
      /* Reset */
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      border: none;
      margin: 0;
      font-family: inherit;
      cursor: pointer;

      /* Layout */
      width: 100%;
      display: block;
      box-sizing: border-box;

      /* Styling using design tokens */
      background: var(--color-surface-primary);
      border: 1px solid var(--color-border-primary);
      border-radius: var(--radius-md);
      color: var(--color-text-primary);
      font-size: var(--text-md);
      font-weight: var(--weight-normal);
      line-height: var(--leading-normal);
      transition: var(--transition-all);
    }

    /* Size variants */
    select.size-sm {
      padding: var(--space-2) var(--space-8) var(--space-2) var(--space-3);
      font-size: var(--text-sm);
    }

    select.size-sm.has-icon {
      padding-left: var(--space-8);
    }

    select.size-md {
      padding: var(--space-3) var(--space-10) var(--space-3) var(--space-4);
    }

    select.size-md.has-icon {
      padding-left: var(--space-10);
    }

    select.size-lg {
      padding: var(--space-4) var(--space-12) var(--space-4) var(--space-5);
      font-size: var(--text-lg);
    }

    select.size-lg.has-icon {
      padding-left: var(--space-12);
    }

    /* States */
    select:hover:not(:disabled):not(.error) {
      border-color: var(--color-border-secondary);
      box-shadow: var(--shadow-sm);
    }

    select:focus {
      outline: none;
      border-color: var(--color-primary-main);
      box-shadow: 0 0 0 3px var(--color-primary-focus);
      background-color: var(--color-surface-primary);
    }

    select:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      background: var(--color-disabled);
      border-color: var(--color-border-primary);
    }

    /* Error state */
    select.error {
      border-color: var(--color-error-main);
      background-color: var(--color-error-bg);
    }

    select.error:focus {
      border-color: var(--color-error-main);
      box-shadow: 0 0 0 3px var(--color-error-focus);
    }

    /* Placeholder style */
    select option[value=""] {
      color: var(--color-text-tertiary);
    }

    /* Custom dropdown arrow */
    .dropdown-arrow {
      position: absolute;
      right: var(--space-3);
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;
      color: var(--color-text-secondary);
      font-size: var(--text-sm);
      line-height: 1;
      transition: var(--transition-colors);
    }

    select.size-sm ~ .dropdown-arrow {
      right: var(--space-2);
    }

    select.size-lg ~ .dropdown-arrow {
      right: var(--space-4);
    }

    select:disabled ~ .dropdown-arrow {
      opacity: 0.6;
    }

    select.error ~ .dropdown-arrow {
      color: var(--color-error-main);
    }

    /* Helper and error text */
    .helper-text {
      font-size: var(--text-sm);
      color: var(--color-text-tertiary);
      line-height: var(--leading-snug);
    }

    .error-text {
      font-size: var(--text-sm);
      color: var(--color-error-main);
      line-height: var(--leading-snug);
      display: flex;
      align-items: center;
      gap: var(--space-1);
    }

    .error-icon {
      font-size: var(--text-sm);
      flex-shrink: 0;
    }
  `;

  _handleChange(e) {
    const selectedValue = e.target.value;
    const allOptions = this._getAllOptionsFlat();
    const selectedOption = allOptions.find(
      (opt) => opt.value === selectedValue
    );

    this.value = selectedValue;

    this.dispatchEvent(
      new CustomEvent("change", {
        detail: {
          value: selectedValue,
          label: selectedOption?.label || selectedValue,
          option: selectedOption,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  _getOptions() {
    // If options array is provided, use it
    if (this.options && this.options.length > 0) {
      return this.options;
    }

    // Otherwise, get options from child <option> elements
    const optionElements = this.querySelectorAll("option");
    return Array.from(optionElements).map((option) => ({
      value: option.value,
      label: option.textContent.trim(),
      disabled: option.disabled,
    }));
  }

  _renderOptions(options) {
    return options.map((item) => {
      // Check if this is an option group
      if (item.group && item.options) {
        return html`
          <optgroup label=${item.group}>
            ${item.options.map(
              (option) => html`
                <option
                  value=${option.value}
                  ?selected=${option.value === this.value}
                  ?disabled=${option.disabled || false}
                >
                  ${option.label}
                </option>
              `
            )}
          </optgroup>
        `;
      }
      // Regular option
      return html`
        <option
          value=${item.value}
          ?selected=${item.value === this.value}
          ?disabled=${item.disabled || false}
        >
          ${item.label}
        </option>
      `;
    });
  }

  _getAllOptionsFlat() {
    // Flatten grouped options for the change handler
    const allOptions = this._getOptions();
    const flatOptions = [];

    allOptions.forEach((item) => {
      if (item.group && item.options) {
        flatOptions.push(...item.options);
      } else {
        flatOptions.push(item);
      }
    });

    return flatOptions;
  }

  render() {
    const hasError = Boolean(this.error);
    const selectClasses = [
      `size-${this.size}`,
      hasError ? "error" : "",
      this.icon ? "has-icon" : "",
    ]
      .filter(Boolean)
      .join(" ");
    const allOptions = this._getOptions();

    return html`
      <div class="select-wrapper">
        ${this.label
          ? html`
              <label class="label">
                ${this.label}
                ${this.required ? html`<span class="required">*</span>` : ""}
              </label>
            `
          : ""}

        <div class="select-container">
          ${this.icon
            ? html`<span class="select-icon">${this.icon}</span>`
            : ""}
          <select
            class=${selectClasses}
            .value=${this.value}
            ?disabled=${this.disabled}
            ?required=${this.required}
            name=${this.name}
            @change=${this._handleChange}
          >
            ${this.placeholder
              ? html`<option value="" disabled ?selected=${!this.value}>
                  ${this.placeholder}
                </option>`
              : ""}
            ${this._renderOptions(allOptions)}
          </select>
          <span class="dropdown-arrow">▼</span>
        </div>

        ${hasError
          ? html`
              <div class="error-text">
                <span class="error-icon">⚠</span>
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

customElements.define("ds-select", DSSelect);
