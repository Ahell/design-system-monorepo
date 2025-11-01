/**
 * Design System Radio Group Component
 *
 * Enhanced radio group with professional styling using design tokens.
 * Groups radio buttons together and manages selection state.
 */

import {
  LitElement,
  html,
  css,
} from "lit";

export class DSRadioGroup extends LitElement {
  static properties = {
    label: { type: String },
    value: { type: String },
    name: { type: String },
    required: { type: Boolean },
    disabled: { type: Boolean },
    error: { type: String },
    helper: { type: String },
    orientation: { type: String },
    options: { type: Array },
  };

  constructor() {
    super();
    this.label = "";
    this.value = "";
    this.name = `radio-group-${Math.random().toString(36).substr(2, 9)}`;
    this.required = false;
    this.disabled = false;
    this.error = "";
    this.helper = "";
    this.orientation = "vertical"; // 'vertical' or 'horizontal'
    this.options = [];
  }

  static styles = css`
    :host {
      display: block;
    }

    .radio-group-wrapper {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .label {
      font-size: var(--text-sm);
      font-weight: var(--weight-medium);
      color: var(--color-text-primary);
      line-height: var(--leading-tight);
      margin-bottom: var(--space-1);
    }

    .label .required {
      color: var(--color-error-main);
      margin-left: var(--space-1);
    }

    .radio-container {
      display: flex;
      gap: var(--space-4);
    }

    .radio-container.vertical {
      flex-direction: column;
    }

    .radio-container.horizontal {
      flex-direction: row;
      flex-wrap: wrap;
    }

    /* Error state styling */
    .radio-container.error {
      padding: var(--space-3);
      border: 1px solid var(--color-error-main);
      border-radius: var(--radius-md);
      background: var(--color-error-bg);
    }

    /* Helper and error text */
    .helper-text {
      font-size: var(--text-sm);
      color: var(--color-text-tertiary);
      line-height: var(--leading-snug);
      margin-top: var(--space-1);
    }

    .error-text {
      font-size: var(--text-sm);
      color: var(--color-error-main);
      line-height: var(--leading-snug);
      margin-top: var(--space-1);
      display: flex;
      align-items: center;
      gap: var(--space-1);
    }

    .error-icon {
      font-size: var(--text-sm);
      flex-shrink: 0;
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .radio-container.horizontal {
        flex-direction: column;
        gap: var(--space-2);
      }
    }
  `;

  firstUpdated() {
    this._updateRadioButtons();
  }

  updated(changedProperties) {
    if (changedProperties.has("value") || changedProperties.has("disabled")) {
      this._updateRadioButtons();
    }
  }

  _updateRadioButtons() {
    // Handle options-based radios
    if (this.options.length > 0) {
      const radios = this.shadowRoot.querySelectorAll("ds-radio");
      radios.forEach((radio) => {
        radio.name = this.name;
        radio.checked = radio.value === this.value;
        if (this.disabled) {
          radio.disabled = true;
        }
      });
      return;
    }

    // Handle slotted radios
    const slot = this.shadowRoot.querySelector("slot");
    if (!slot) return;

    const radios = slot
      .assignedElements()
      .filter((el) => el.tagName === "DS-RADIO");

    radios.forEach((radio) => {
      radio.name = this.name;
      radio.checked = radio.value === this.value;
      if (this.disabled) {
        radio.disabled = true;
      }
    });
  }

  _handleRadioChange(e) {
    if (this.disabled) return;

    this.value = e.detail.value;

    // Update all radio buttons
    this._updateRadioButtons();

    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    const hasError = Boolean(this.error);
    const containerClasses = [
      "radio-container",
      this.orientation,
      hasError ? "error" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return html`
      <div class="radio-group-wrapper">
        ${this.label
          ? html`
              <div class="label" role="group" aria-labelledby="group-label">
                <span id="group-label">${this.label}</span>
                ${this.required ? html`<span class="required">*</span>` : ""}
              </div>
            `
          : ""}

        <div
          class="${containerClasses}"
          @radio-change=${this._handleRadioChange}
        >
          ${this.options.length > 0
            ? this.options.map(
                (option) => html`
                  <ds-radio
                    .value=${option.value}
                    ?disabled=${this.disabled}
                    .name=${this.name}
                  >
                    ${option.label}
                  </ds-radio>
                `
              )
            : html`<slot></slot>`}
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

customElements.define("ds-radio-group", DSRadioGroup);
