/**
 * Design System Expandable Details Component
 *
 * Enhanced expandable content component with professional styling.
 * Provides accordion-style expandable sections with smooth animations.
 */

import {
  LitElement,
  html,
  css,
} from "https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js";

export class DSExpandableDetails extends LitElement {
  static properties = {
    open: { type: Boolean },
    summary: { type: String },
    title: { type: String },
    meta: { type: String },
  };

  constructor() {
    super();
    this.open = false;
    this.summary = "";
    this.title = "";
    this.meta = "";
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .expandable-container {
      border: 1px solid var(--color-border-primary);
      border-radius: var(--radius-md);
      background: var(--color-surface-primary);
      overflow: hidden;
      transition: var(--transition-all);
    }

    .expandable-container:hover {
      border-color: var(--color-border-secondary);
      box-shadow: var(--shadow-sm);
    }

    .expandable-summary {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-4);
      background: var(--color-surface-secondary);
      border: none;
      width: 100%;
      cursor: pointer;
      transition: var(--transition-colors);
      text-align: left;
    }

    .expandable-summary:hover {
      background: var(--color-surface-tertiary);
    }

    .expandable-summary:focus {
      outline: none;
      background: var(--color-surface-tertiary);
      box-shadow: inset 0 0 0 2px var(--color-primary-main);
    }

    .summary-content {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      flex: 1;
    }

    .summary-text {
      font-size: var(--text-md);
      font-weight: var(--weight-medium);
      color: var(--color-text-primary);
      margin: 0;
      line-height: var(--leading-tight);
    }

    .summary-meta {
      font-size: var(--text-sm);
      color: var(--color-text-tertiary);
      margin: 0;
      line-height: var(--leading-snug);
    }

    .expandable-icon {
      flex-shrink: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-text-secondary);
      transition: var(--transition-transform);
      font-size: var(--text-lg);
    }

    .expandable-container.open .expandable-icon {
      transform: rotate(90deg);
    }

    .expandable-content {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease-out;
      background: var(--color-surface-primary);
    }

    .expandable-container.open .expandable-content {
      max-height: 1000px;
    }

    .content-inner {
      padding: var(--space-4);
      border-top: 1px solid var(--color-border-primary);
    }

    .stats-row {
      display: flex;
      gap: var(--space-3);
      margin-bottom: var(--space-4);
      flex-wrap: wrap;
    }

    /* Legacy support for title/meta props */
    .details-header {
      background-color: var(--color-surface-secondary);
      padding: var(--space-4);
      border-bottom: 1px solid var(--color-border-primary);
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .details-title {
      font-weight: var(--weight-semibold);
      color: var(--color-text-primary);
      margin: 0;
      font-size: var(--text-md);
    }

    .details-meta {
      color: var(--color-text-tertiary);
      font-size: var(--text-sm);
      margin: 0;
    }

    .details-content {
      padding: var(--space-4);
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .expandable-summary {
        padding: var(--space-3);
      }

      .content-inner {
        padding: var(--space-3);
      }

      .summary-content {
        gap: var(--space-2);
      }

      .stats-row {
        gap: var(--space-2);
      }
    }
  `;

  _toggleOpen() {
    this.open = !this.open;
    this.dispatchEvent(
      new CustomEvent("toggle", {
        detail: { open: this.open },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    // Support both new summary prop and legacy title/meta props
    const displayText = this.summary || this.title;
    const displayMeta = this.summary ? this.meta : this.title ? this.meta : "";

    return html`
      <div class="expandable-container ${this.open ? "open" : ""}">
        <button
          class="expandable-summary"
          @click="${this._toggleOpen}"
          aria-expanded="${this.open}"
        >
          <div class="summary-content">
            <h4 class="summary-text">${displayText}</h4>
            ${displayMeta
              ? html`<p class="summary-meta">${displayMeta}</p>`
              : ""}
          </div>
          <div class="expandable-icon">${this.open ? "▶" : "▶"}</div>
        </button>

        <div class="expandable-content">
          <div class="content-inner">
            <div class="stats-row">
              <slot name="stats"></slot>
            </div>
            <slot></slot>
            <slot name="content"></slot>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("ds-expandable-details", DSExpandableDetails);
