/**
 * Design System Card Content Component
 *
 * Simple semantic wrapper for card content.
 * Styling is handled by the parent ds-card component.
 *
 * This file replaces the old DataCard, TableCard, and InfoCard wrappers
 * which were unnecessary abstractions. Use ds-card with ds-card-header,
 * ds-card-content, and ds-card-footer directly instead.
 */

import { LitElement, html, css } from "lit";

/**
 * DSCardContent - Lightweight semantic wrapper for card content
 * @slot - Default slot for content
 */
class DSCardContent extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
  `;

  render() {
    return html`<slot></slot>`;
  }
}

// Register component
customElements.define("ds-card-content", DSCardContent);

export { DSCardContent };
