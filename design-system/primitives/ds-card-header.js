/**
 * Design System Card Header Component
 *
 * Enhanced card header with professional styling using design tokens.
 * Provides consistent header layout with title, meta text, and stats slot.
 * Uses design system layout components (ds-inline, ds-stack) internally.
 */

import { LitElement, html, css } from "lit";
import "../layout/ds-inline.js";
import "../layout/ds-stack.js";

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
      font-family: var(--font-sans);
      margin: calc(-1 * var(--card-padding, var(--space-6)));
      margin-bottom: var(--space-6);
      padding: var(--card-padding, var(--space-6));
      padding-bottom: 0;
    }

    .card-title {
      font-size: var(--text-lg);
      font-weight: var(--weight-semibold);
      color: var(--color-text-primary);
      margin: 0;
      line-height: var(--leading-tight);
    }

    .card-meta {
      font-size: var(--text-sm);
      color: var(--color-text-tertiary);
      line-height: var(--leading-snug);
      margin: 0;
    }

    /* Responsive design */
    @media (max-width: 768px) {
      :host {
        margin-bottom: var(--space-4);
      }

      .card-title {
        font-size: var(--text-md);
      }
    }
  `;

  constructor() {
    super();
    this.title = "";
    this.meta = "";
  }

  render() {
    return html`
      <ds-flex
        direction="row"
        justify="space-between"
        align="start"
        gap="4"
        wrap="wrap"
      >
        <ds-stack gap="1" style="flex: 1; min-width: 0; text-align: left;">
          ${this.title ? html`<h3 class="card-title">${this.title}</h3>` : ""}
          ${this.meta ? html`<p class="card-meta">${this.meta}</p>` : ""}
        </ds-stack>
        <ds-inline gap="2" style="flex-shrink: 0;">
          <slot name="stats"></slot>
        </ds-inline>
      </ds-flex>
    `;
  }
}

// Register component
customElements.define("ds-card-header", CardHeader);

export { CardHeader };
