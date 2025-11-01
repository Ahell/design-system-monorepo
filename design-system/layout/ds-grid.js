/**
 * Design System Grid Component
 *
 * Responsive grid layout with flexible columns.
 * Uses design tokens for gap values.
 */

import {
  LitElement,
  html,
  css,
} from "https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js";

export class DSGrid extends LitElement {
  static properties = {
    cols: { type: String },
    gap: { type: String },
    autoFit: { type: Boolean, attribute: "auto-fit" },
    minWidth: { type: String, attribute: "min-width" },
  };

  constructor() {
    super();
    this.cols = "1";
    this.gap = "md";
    this.autoFit = false;
    this.minWidth = "250px";
  }

  static styles = css`
    :host {
      display: block;
    }

    .grid {
      display: grid;
    }

    /* Column variants */
    .grid.cols-1 {
      grid-template-columns: var(--grid-repeat-1);
    }
    .grid.cols-2 {
      grid-template-columns: var(--grid-repeat-2);
    }
    .grid.cols-3 {
      grid-template-columns: var(--grid-repeat-3);
    }
    .grid.cols-4 {
      grid-template-columns: var(--grid-repeat-4);
    }
    .grid.cols-5 {
      grid-template-columns: var(--grid-repeat-5);
    }
    .grid.cols-6 {
      grid-template-columns: var(--grid-repeat-6);
    }
    .grid.cols-12 {
      grid-template-columns: var(--grid-repeat-12);
    }

    /* Gap variants */
    .grid.gap-none {
      gap: var(--space-0);
    }
    .grid.gap-xs {
      gap: var(--space-xs);
    }
    .grid.gap-sm {
      gap: var(--space-sm);
    }
    .grid.gap-md {
      gap: var(--space-md);
    }
    .grid.gap-lg {
      gap: var(--space-lg);
    }
    .grid.gap-xl {
      gap: var(--space-xl);
    }
    .grid.gap-2xl {
      gap: var(--space-2xl);
    }
    .grid.gap-3xl {
      gap: var(--space-3xl);
    }

    /* Numeric gaps */
    .grid.gap-1 {
      gap: var(--space-1);
    }
    .grid.gap-2 {
      gap: var(--space-2);
    }
    .grid.gap-3 {
      gap: var(--space-3);
    }
    .grid.gap-4 {
      gap: var(--space-4);
    }
    .grid.gap-6 {
      gap: var(--space-6);
    }
    .grid.gap-8 {
      gap: var(--space-8);
    }
    .grid.gap-12 {
      gap: var(--space-12);
    }

    /* Responsive grid patterns - only apply when responsive attribute is set */
    @media (max-width: 767px) {
      .grid.responsive.cols-2,
      .grid.responsive.cols-3,
      .grid.responsive.cols-4,
      .grid.responsive.cols-5,
      .grid.responsive.cols-6 {
        grid-template-columns: var(--grid-repeat-1);
      }
    }

    @media (min-width: 768px) and (max-width: 1023px) {
      .grid.responsive.cols-3,
      .grid.responsive.cols-4,
      .grid.responsive.cols-5,
      .grid.responsive.cols-6 {
        grid-template-columns: var(--grid-repeat-2);
      }
    }
  `;

  render() {
    const classes = [
      "grid",
      !this.autoFit ? `cols-${this.cols}` : "",
      `gap-${this.gap}`,
    ]
      .filter(Boolean)
      .join(" ");

    // If auto-fit is enabled, use dynamic grid-template-columns
    const style = this.autoFit
      ? `grid-template-columns: repeat(auto-fit, minmax(${this.minWidth}, 1fr));`
      : "";

    return html`
      <div class="${classes}" style="${style}">
        <slot></slot>
      </div>
    `;
  }
}

customElements.define("ds-grid", DSGrid);
