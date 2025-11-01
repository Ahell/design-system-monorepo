/**
 * Design System Feature Grid Component
 *
 * Grid of feature cards with icons, titles, and descriptions.
 * Fully configurable via props array.
 */

import {
  LitElement,
  html,
  css,
} from "https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js";

export class DSFeatureGrid extends LitElement {
  static properties = {
    title: { type: String },
    subtitle: { type: String },
    features: { type: Array },
    columns: { type: String },
  };

  constructor() {
    super();
    this.title = "";
    this.subtitle = "";
    this.features = [];
    this.columns = "3";
  }

  static styles = css`
    :host {
      display: block;
    }

    .feature-grid {
      padding-top: var(--space-16);
      padding-bottom: var(--space-16);
    }

    .header {
      text-align: center;
      margin-bottom: var(--space-12);
    }

    .subtitle {
      font-size: var(--text-sm);
      font-weight: var(--weight-semibold);
      color: var(--color-primary-main);
      text-transform: uppercase;
      letter-spacing: var(--tracking-wider);
      margin-bottom: var(--space-3);
    }

    .title {
      font-size: var(--text-3xl);
      font-weight: var(--weight-bold);
      color: var(--color-text-primary);
      line-height: var(--leading-tight);
      margin: 0;
    }

    .feature-card {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .feature-icon {
      width: var(--icon-lg);
      height: var(--icon-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--color-primary-main);
      color: var(--color-text-inverse);
      border-radius: var(--radius-xl);
      font-size: var(--text-xl);
      font-weight: var(--weight-bold);
    }

    .feature-title {
      font-size: var(--text-xl);
      font-weight: var(--weight-semibold);
      color: var(--color-text-primary);
      margin: 0;
    }

    .feature-description {
      font-size: var(--text-md);
      color: var(--color-text-secondary);
      line-height: var(--leading-relaxed);
      margin: 0;
    }
  `;

  render() {
    return html`
      <div class="feature-grid">
        <ds-container size="lg">
          ${this.title || this.subtitle
            ? html`
                <div class="header">
                  ${this.subtitle
                    ? html`<div class="subtitle">${this.subtitle}</div>`
                    : ""}
                  ${this.title
                    ? html`<h2 class="title">${this.title}</h2>`
                    : ""}
                </div>
              `
            : ""}

          <ds-grid cols="${this.columns}" gap="lg">
            ${this.features.length > 0
              ? this.features.map(
                  (feature) => html`
                    <ds-card padding="lg">
                      <div class="feature-card">
                        ${feature.icon
                          ? html`<div class="feature-icon">
                              ${feature.icon}
                            </div>`
                          : ""}
                        <h3 class="feature-title">${feature.title}</h3>
                        <p class="feature-description">
                          ${feature.description}
                        </p>
                      </div>
                    </ds-card>
                  `
                )
              : html`<slot></slot>`}
          </ds-grid>
        </ds-container>
      </div>
    `;
  }
}

customElements.define("ds-feature-grid", DSFeatureGrid);
