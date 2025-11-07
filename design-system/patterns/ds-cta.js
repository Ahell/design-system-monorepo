/**
 * Design System CTA (Call to Action) Component
 *
 * Attention-grabbing CTA section with title, description, and buttons.
 * Typically used for conversion-focused sections.
 */

import { LitElement, html, css } from "lit";

export class DSCTA extends LitElement {
  static properties = {
    title: { type: String },
    description: { type: String },
    primaryButtonText: { type: String, attribute: "primary-button-text" },
    secondaryButtonText: { type: String, attribute: "secondary-button-text" },
    variant: { type: String },
    align: { type: String },
  };

  constructor() {
    super();
    this.title = "";
    this.description = "";
    this.primaryButtonText = "";
    this.secondaryButtonText = "";
    this.variant = "primary";
    this.align = "center";
  }

  static styles = css`
    :host {
      display: block;
      font-family: var(--font-sans);
    }

    .cta {
      padding-top: var(--space-16);
      padding-bottom: var(--space-16);
      box-shadow: var(--shadow-lg);
    }

    .cta.variant-primary {
      background-color: var(--color-primary-main);
      color: var(--color-text-inverse);
    }

    .cta.variant-secondary {
      background-color: var(--color-surface-secondary);
      border-top: var(--border-width-thin) solid var(--color-border-primary);
      border-bottom: var(--border-width-thin) solid var(--color-border-primary);
    }

    .cta.variant-gradient {
      background: var(--gradient-warm);
      color: var(--color-text-inverse);
    }

    .content {
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
    }

    .content.align-center {
      align-items: center;
      text-align: center;
    }

    .content.align-left {
      align-items: flex-start;
      text-align: left;
    }

    .content.align-right {
      align-items: flex-end;
      text-align: right;
    }

    .title {
      font-size: var(--text-3xl);
      font-weight: var(--weight-bold);
      line-height: var(--leading-tight);
      margin: 0;
    }

    .cta.variant-primary .title,
    .cta.variant-gradient .title {
      color: var(--color-text-inverse);
    }

    .cta.variant-secondary .title {
      color: var(--color-text-primary);
    }

    @media (min-width: 768px) {
      .title {
        font-size: var(--text-4xl);
      }
    }

    .description {
      font-size: var(--text-lg);
      line-height: var(--leading-relaxed);
      max-width: var(--content-width);
      margin: 0;
    }

    .cta.variant-primary .description,
    .cta.variant-gradient .description {
      color: var(--color-text-inverse-muted);
    }

    .cta.variant-secondary .description {
      color: var(--color-text-secondary);
    }

    .buttons {
      display: flex;
      gap: var(--space-4);
      flex-wrap: wrap;
    }

    .buttons.align-center {
      justify-content: center;
    }

    .buttons.align-left {
      justify-content: flex-start;
    }

    .buttons.align-right {
      justify-content: flex-end;
    }

    /* Custom button styling for primary/gradient variants */
    .cta.variant-primary .buttons ::slotted(ds-button),
    .cta.variant-gradient .buttons ::slotted(ds-button) {
      --button-bg: var(--color-text-inverse);
      --button-hover-bg: var(--color-text-inverse);
      opacity: var(--opacity-80);
    }

    .cta.variant-primary .buttons ::slotted(ds-button):hover,
    .cta.variant-gradient .buttons ::slotted(ds-button):hover {
      opacity: var(--opacity-100);
    }
  `;

  _handlePrimaryClick() {
    this.dispatchEvent(
      new CustomEvent("ds-cta-primary-click", {
        bubbles: true,
        composed: true,
      })
    );
  }

  _handleSecondaryClick() {
    this.dispatchEvent(
      new CustomEvent("ds-cta-secondary-click", {
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    // Determine button variant based on CTA variant
    const primaryBtnVariant =
      this.variant === "primary" || this.variant === "gradient"
        ? "secondary"
        : "primary";
    const secondaryBtnVariant =
      this.variant === "primary" || this.variant === "gradient"
        ? "outline"
        : "outline";

    return html`
      <div class="cta variant-${this.variant}">
        <ds-container size="lg">
          <div class="content align-${this.align}">
            ${this.title
              ? html`<h2 class="title">${this.title}</h2>`
              : html`<slot name="title"></slot>`}
            ${this.description
              ? html`<p class="description">${this.description}</p>`
              : html`<slot name="description"></slot>`}
            ${this.primaryButtonText || this.secondaryButtonText
              ? html`
                  <div class="buttons align-${this.align}">
                    ${this.primaryButtonText
                      ? html`
                          <ds-button
                            variant="${primaryBtnVariant}"
                            size="lg"
                            @ds-click="${this._handlePrimaryClick}"
                          >
                            ${this.primaryButtonText}
                          </ds-button>
                        `
                      : ""}
                    ${this.secondaryButtonText
                      ? html`
                          <ds-button
                            variant="${secondaryBtnVariant}"
                            size="lg"
                            @ds-click="${this._handleSecondaryClick}"
                          >
                            ${this.secondaryButtonText}
                          </ds-button>
                        `
                      : ""}
                    <slot name="buttons"></slot>
                  </div>
                `
              : html`<slot name="buttons"></slot>`}
          </div>
        </ds-container>
      </div>
    `;
  }
}

customElements.define("ds-cta", DSCTA);
