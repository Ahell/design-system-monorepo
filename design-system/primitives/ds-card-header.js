/**
 * Design System Card Header Component
 *
 * Enhanced card header with professional styling using design tokens.
 * Provides consistent header layout with title, meta text, and stats slot.
 */

import {
  LitElement,
  html,
  css,
} from "lit";

/**
 * CardHeader - Enhanced card header with professional styling
 * @prop {string} title - Main heading text
 * @prop {string} meta - Optional subtitle/description text
 * @slot stats - Slot for metric pills or other header content
 */
class CardHeader extends LitElement {
  static properties = {
    title: { type: String },
    meta: { type: String },
  };

  static styles = css`
    :host {
      display: block;
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-4);
      padding-bottom: var(--space-4);
      margin-bottom: var(--space-4);
      border-bottom: 1px solid var(--color-border-primary);
      position: relative;
    }

    .header-content {
      flex: 1;
      min-width: 0;
    }

    .card-title {
      font-size: var(--text-lg);
      font-weight: var(--weight-semibold);
      color: var(--color-text-primary);
      margin: 0 0 var(--space-1) 0;
      line-height: var(--leading-tight);
    }

    .card-meta {
      font-size: var(--text-sm);
      color: var(--color-text-tertiary);
      line-height: var(--leading-snug);
      margin: 0;
    }

    .header-actions {
      display: flex;
      gap: var(--space-2);
      flex-shrink: 0;
      align-items: center;
    }

    /* Enhanced styling for slotted content */
    ::slotted(.badge) {
      margin: 0;
    }

    ::slotted(ds-badge) {
      margin: 0;
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .card-header {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-3);
        padding-bottom: var(--space-3);
        margin-bottom: var(--space-3);
      }

      .header-actions {
        width: 100%;
        justify-content: flex-start;
        flex-wrap: wrap;
      }

      .card-title {
        font-size: var(--text-md);
      }
    }

    /* Hover effect for interactive headers */
    .card-header:hover {
      border-bottom-color: var(--color-border-secondary);
    }
  `;

  constructor() {
    super();
    this.title = "";
    this.meta = "";
  }

  render() {
    return html`
      <div class="card-header">
        <div class="header-content">
          ${this.title ? html`<h3 class="card-title">${this.title}</h3>` : ""}
          ${this.meta ? html`<p class="card-meta">${this.meta}</p>` : ""}
        </div>
        <div class="header-actions">
          <slot name="stats"></slot>
        </div>
      </div>
    `;
  }
}

// Register component
customElements.define("card-header", CardHeader);

export { CardHeader };
