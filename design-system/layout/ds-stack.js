/**
 * Design System Stack Component
 *
 * Vertical layout with consistent spacing between children.
 * Uses design tokens for gap values.
 */

import {
  LitElement,
  html,
  css,
} from "https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js";

export class DSStack extends LitElement {
  static properties = {
    gap: { type: String },
    align: { type: String },
    justify: { type: String },
  };

  constructor() {
    super();
    this.gap = "md";
    this.align = "stretch";
    this.justify = "start";
  }

  static styles = css`
    :host {
      display: block;
    }

    .stack {
      display: flex;
      flex-direction: column;
    }

    /* Gap variants */
    .stack.gap-none {
      gap: var(--space-0);
    }
    .stack.gap-xs {
      gap: var(--space-xs);
    }
    .stack.gap-sm {
      gap: var(--space-sm);
    }
    .stack.gap-md {
      gap: var(--space-md);
    }
    .stack.gap-lg {
      gap: var(--space-lg);
    }
    .stack.gap-xl {
      gap: var(--space-xl);
    }
    .stack.gap-2xl {
      gap: var(--space-2xl);
    }
    .stack.gap-3xl {
      gap: var(--space-3xl);
    }

    /* Numeric gaps */
    .stack.gap-1 {
      gap: var(--space-1);
    }
    .stack.gap-2 {
      gap: var(--space-2);
    }
    .stack.gap-3 {
      gap: var(--space-3);
    }
    .stack.gap-4 {
      gap: var(--space-4);
    }
    .stack.gap-6 {
      gap: var(--space-6);
    }
    .stack.gap-8 {
      gap: var(--space-8);
    }
    .stack.gap-12 {
      gap: var(--space-12);
    }
    .stack.gap-16 {
      gap: var(--space-16);
    }

    /* Align items */
    .stack.align-start {
      align-items: flex-start;
    }
    .stack.align-center {
      align-items: center;
    }
    .stack.align-end {
      align-items: flex-end;
    }
    .stack.align-stretch {
      align-items: stretch;
    }

    /* Justify content */
    .stack.justify-start {
      justify-content: flex-start;
    }
    .stack.justify-center {
      justify-content: center;
    }
    .stack.justify-end {
      justify-content: flex-end;
    }
    .stack.justify-between {
      justify-content: space-between;
    }
  `;

  render() {
    const classes = [
      "stack",
      `gap-${this.gap}`,
      `align-${this.align}`,
      `justify-${this.justify}`,
    ].join(" ");

    return html`
      <div class="${classes}">
        <slot></slot>
      </div>
    `;
  }
}

customElements.define("ds-stack", DSStack);
