/**
 * Design System Hero Component
 *
 * Hero section pattern composing Container, Stack, Button.
 * Fully configurable via props, no hardcoded content.
 */

import { LitElement, html, css } from "lit";

export class DSHero extends LitElement {
  static properties = {
    title: { type: String },
    subtitle: { type: String },
    description: { type: String },
    align: { type: String },
    size: { type: String },
    primaryButtonText: { type: String, attribute: "primary-button-text" },
    secondaryButtonText: { type: String, attribute: "secondary-button-text" },
    showButtons: { type: Boolean, attribute: "show-buttons" },
  };

  constructor() {
    super();
    this.title = "";
    this.subtitle = "";
    this.description = "";
    this.align = "center";
    this.size = "lg";
    this.primaryButtonText = "";
    this.secondaryButtonText = "";
    this.showButtons = false;
  }

  static styles = css`
    :host {
      display: block;
      font-family: var(--font-sans);
    }

    .hero {
      padding-top: var(--space-16);
      padding-bottom: var(--space-16);
      background-color: var(--color-surface-primary);
    }

    .hero.size-sm {
      padding-top: var(--space-12);
      padding-bottom: var(--space-12);
    }

    .hero.size-md {
      padding-top: var(--space-16);
      padding-bottom: var(--space-16);
    }

    .hero.size-lg {
      padding-top: var(--space-24);
      padding-bottom: var(--space-24);
    }

    .hero.size-xl {
      padding-top: var(--space-32);
      padding-bottom: var(--space-32);
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

    .subtitle {
      font-size: var(--text-sm);
      font-weight: var(--weight-semibold);
      color: var(--color-primary-main);
      text-transform: uppercase;
      letter-spacing: var(--tracking-wider);
    }

    .title {
      font-size: var(--text-4xl);
      font-weight: var(--weight-bold);
      color: var(--color-text-primary);
      line-height: var(--leading-tight);
      margin: 0;
    }

    .title.size-sm {
      font-size: var(--text-2xl);
    }

    .title.size-md {
      font-size: var(--text-3xl);
    }

    .title.size-lg {
      font-size: var(--text-4xl);
    }

    .title.size-xl {
      font-size: var(--text-5xl);
    }

    @media (min-width: 768px) {
      .title {
        font-size: var(--text-5xl);
      }

      .title.size-lg {
        font-size: var(--text-5xl);
      }
    }

    .description {
      font-size: var(--text-lg);
      color: var(--color-text-secondary);
      line-height: var(--leading-relaxed);
      max-width: var(--content-width);
    }

    .description.size-sm {
      font-size: var(--text-md);
    }

    .description.size-md {
      font-size: var(--text-lg);
    }

    .description.size-lg {
      font-size: var(--text-xl);
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

    /* Image slot */
    ::slotted([slot="image"]) {
      margin-top: var(--space-8);
      max-width: 100%;
      height: auto;
      border-radius: var(--radius-2xl);
      box-shadow: var(--shadow-lg);
    }
  `;

  _handlePrimaryClick() {
    this.dispatchEvent(
      new CustomEvent("ds-hero-primary-click", {
        bubbles: true,
        composed: true,
      })
    );
  }

  _handleSecondaryClick() {
    this.dispatchEvent(
      new CustomEvent("ds-hero-secondary-click", {
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <div class="hero size-${this.size}">
        <ds-container size="lg">
          <div class="content align-${this.align}">
            ${this.subtitle
              ? html`<div class="subtitle">${this.subtitle}</div>`
              : ""}
            ${this.title
              ? html`<h1 class="title size-${this.size}">${this.title}</h1>`
              : html`<slot name="title"></slot>`}
            ${this.description
              ? html`<p class="description size-${this.size}">
                  ${this.description}
                </p>`
              : html`<slot name="description"></slot>`}
            ${this.showButtons ||
            this.primaryButtonText ||
            this.secondaryButtonText
              ? html`
                  <div class="buttons align-${this.align}">
                    ${this.primaryButtonText
                      ? html`
                          <ds-button
                            variant="primary"
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
                            variant="warning"
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
              : ""}

            <slot name="image"></slot>
            <slot></slot>
          </div>
        </ds-container>
      </div>
    `;
  }
}

customElements.define("ds-hero", DSHero);
