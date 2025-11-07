/**
 * Design System Inline Component
 *
 * Horizontal layout with consistent spacing between children.
 * Uses design tokens for gap values.
 */

import { LitElement, html, css } from "lit";

export class DSInline extends LitElement {
  static properties = {
    gap: { type: String },
    align: { type: String },
    justify: { type: String },
    wrap: { type: Boolean },
  };

  constructor() {
    super();
    this.gap = "md";
    this.align = "center";
    this.justify = "start";
    this.wrap = false;
  }

  static styles = css`
    :host {
      display: block;
      font-family: var(--font-sans);
    }

    .inline {
      display: flex;
      flex-direction: row;
    }

    /* Gap variants */
    .inline.gap-none {
      gap: var(--space-0);
    }
    .inline.gap-xs {
      gap: var(--space-xs);
    }
    .inline.gap-sm {
      gap: var(--space-sm);
    }
    .inline.gap-md {
      gap: var(--space-md);
    }
    .inline.gap-lg {
      gap: var(--space-lg);
    }
    .inline.gap-xl {
      gap: var(--space-xl);
    }
    .inline.gap-2xl {
      gap: var(--space-2xl);
    }
    .inline.gap-3xl {
      gap: var(--space-3xl);
    }

    /* Numeric gaps */
    .inline.gap-1 {
      gap: var(--space-1);
    }
    .inline.gap-2 {
      gap: var(--space-2);
    }
    .inline.gap-3 {
      gap: var(--space-3);
    }
    .inline.gap-4 {
      gap: var(--space-4);
    }
    .inline.gap-6 {
      gap: var(--space-6);
    }
    .inline.gap-8 {
      gap: var(--space-8);
    }
    .inline.gap-12 {
      gap: var(--space-12);
    }

    /* Alignment variants */
    .inline.align-start {
      align-items: flex-start;
    }
    .inline.align-center {
      align-items: center;
    }
    .inline.align-end {
      align-items: flex-end;
    }
    .inline.align-stretch {
      align-items: stretch;
    }
    .inline.align-baseline {
      align-items: baseline;
    }

    /* Justify variants */
    .inline.justify-start {
      justify-content: flex-start;
    }
    .inline.justify-center {
      justify-content: center;
    }
    .inline.justify-end {
      justify-content: flex-end;
    }
    .inline.justify-space-between {
      justify-content: space-between;
    }
    .inline.justify-space-around {
      justify-content: space-around;
    }
    .inline.justify-space-evenly {
      justify-content: space-evenly;
    }

    /* Wrap */
    .inline.wrap {
      flex-wrap: wrap;
    }
  `;

  render() {
    const classes = [
      "inline",
      `gap-${this.gap}`,
      `align-${this.align}`,
      `justify-${this.justify}`,
      this.wrap ? "wrap" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return html`
      <div class="${classes}">
        <slot></slot>
      </div>
    `;
  }
}

customElements.define("ds-inline", DSInline);
