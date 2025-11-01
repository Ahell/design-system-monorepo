/**
 * Design System Card Content Components
 *
 * Enhanced card components with professional styling using design tokens.
 * Provides DataCard, TableCard, and InfoCard with consistent theming.
 */

import {
  LitElement,
  html,
  css,
} from "https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js";
import "./ds-card-header.js";
import "./ds-card-footer.js";
import "./ds-card.js";

/**
 * DataCard - Basic reusable card component
 * Enhanced with professional styling and design tokens
 * @prop {string} title - Card title text
 * @prop {string} marginTop - CSS margin-top value (default: "6px")
 * @slot - Default slot for card content
 */
class DataCard extends LitElement {
  static properties = {
    title: { type: String },
    marginTop: { type: String, attribute: "margin-top" },
  };

  static styles = css`
    :host {
      display: block;
      margin-top: var(--margin-top, var(--space-3));
    }

    .card-title {
      color: var(--color-text-primary);
      font-size: var(--text-sm);
      margin-bottom: var(--space-3);
      font-weight: var(--weight-semibold);
      line-height: var(--leading-tight);
    }

    ::slotted(*) {
      margin: 0;
    }

    /* Enhanced card styling */
    ds-card {
      transition: var(--transition-all);
    }

    ds-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-xl);
    }
  `;

  constructor() {
    super();
    this.title = "";
    this.marginTop = "6px";
  }

  render() {
    // Use custom property for margin-top
    this.style.setProperty("--margin-top", this.marginTop);

    return html`
      <ds-card padding="md" elevated>
        ${this.title
          ? html`<card-header title="${this.title}">
              <slot name="stats" slot="stats"></slot>
            </card-header>`
          : ""}
        <slot></slot>
      </ds-card>
    `;
  }
}

/**
 * TableCard - Card optimized for data tables
 * Enhanced with professional styling and design tokens
 * @prop {string} title - Main table title
 * @prop {string} meta - Metadata text below title
 * @prop {string} marginTop - CSS margin-top value (default: "6px")
 * @slot stats - Slot for metric pills
 * @slot table - Slot for table content
 * @slot footer - Optional slot for footer content
 */
class TableCard extends LitElement {
  static properties = {
    title: { type: String },
    meta: { type: String },
    marginTop: { type: String, attribute: "margin-top" },
  };

  static styles = css`
    :host {
      display: block;
      margin-top: var(--margin-top, var(--space-3));
    }

    /* Enhanced table card styling */
    ds-card {
      transition: var(--transition-all);
    }

    ds-card:hover {
      transform: translateY(-1px);
      box-shadow: var(--shadow-lg);
    }

    ::slotted([slot="table"]) {
      margin-top: var(--space-2);
    }
  `;

  constructor() {
    super();
    this.title = "";
    this.meta = "";
    this.marginTop = "6px";
  }

  render() {
    // Use custom property for margin-top
    this.style.setProperty("--margin-top", this.marginTop);

    return html`
      <ds-card padding="md" elevated>
        <card-header title="${this.title}" meta="${this.meta}">
          <slot name="stats" slot="stats"></slot>
        </card-header>
        <slot name="table"></slot>
        <slot name="footer"></slot>
      </ds-card>
    `;
  }
}

/**
 * InfoCard - Card for displaying key-value information
 * Enhanced with professional styling and design tokens
 * @prop {string} title - Card title
 * @prop {string} subtitle - Card subtitle/meta text (optional)
 * @prop {string} marginTop - CSS margin-top value (default: "6px")
 * @slot - Default slot for table or info content
 */
class InfoCard extends LitElement {
  static properties = {
    title: { type: String },
    subtitle: { type: String },
    marginTop: { type: String, attribute: "margin-top" },
  };

  static styles = css`
    :host {
      display: block;
      margin-top: var(--margin-top, var(--space-3));
    }

    ::slotted(.budget-table-wrapper) {
      margin-top: var(--space-3);
    }

    ::slotted(.k) {
      color: var(--color-text-secondary);
      font-size: var(--text-sm);
      font-weight: var(--weight-medium);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: var(--space-1);
    }

    ::slotted(.v) {
      font-weight: var(--weight-bold);
      font-size: var(--text-xl);
      color: var(--color-text-primary);
      line-height: var(--leading-tight);
    }

    /* Enhanced info card styling */
    ds-card {
      transition: var(--transition-all);
    }

    ds-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-xl);
    }
  `;

  constructor() {
    super();
    this.title = "";
    this.subtitle = "";
    this.marginTop = "6px";
  }

  render() {
    // Use custom property for margin-top
    this.style.setProperty("--margin-top", this.marginTop);

    return html`
      <ds-card padding="lg" elevated>
        ${this.title
          ? html`<card-header title="${this.title}" meta="${this.subtitle}">
              <slot name="stats" slot="stats"></slot>
            </card-header>`
          : ""}
        <slot></slot>
      </ds-card>
    `;
  }
}

// Register components
customElements.define("data-card", DataCard);
customElements.define("table-card", TableCard);
customElements.define("info-card", InfoCard);

export { DataCard, TableCard, InfoCard };
