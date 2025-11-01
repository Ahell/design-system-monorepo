/**
 * Design System Two Column Component
 *
 * Two-column layout pattern (text + image or content + sidebar).
 * Responsive: stacks on mobile, side-by-side on desktop.
 */

import {
  LitElement,
  html,
  css,
} from "lit";

export class DSTwoColumn extends LitElement {
  static properties = {
    reverse: { type: Boolean },
    ratio: { type: String },
    gap: { type: String },
    align: { type: String },
  };

  constructor() {
    super();
    this.reverse = false;
    this.ratio = "1:1";
    this.gap = "lg";
    this.align = "center";
  }

  static styles = css`
    :host {
      display: block;
    }

    .two-column {
      padding-top: var(--space-16);
      padding-bottom: var(--space-16);
    }

    .columns {
      display: grid;
      gap: var(--space-lg);
      align-items: center;
    }

    .columns.gap-sm {
      gap: var(--space-sm);
    }
    .columns.gap-md {
      gap: var(--space-md);
    }
    .columns.gap-lg {
      gap: var(--space-lg);
    }
    .columns.gap-xl {
      gap: var(--space-xl);
    }

    .columns.align-start {
      align-items: flex-start;
    }
    .columns.align-center {
      align-items: center;
    }
    .columns.align-end {
      align-items: flex-end;
    }

    /* Mobile: stack */
    .columns {
      grid-template-columns: var(--grid-cols-1);
    }

    /* Desktop: side by side */
    @media (min-width: 768px) {
      .columns.ratio-1-1 {
        grid-template-columns: var(--grid-cols-1-1);
      }

      .columns.ratio-2-1 {
        grid-template-columns: var(--grid-cols-2-1);
      }

      .columns.ratio-1-2 {
        grid-template-columns: var(--grid-cols-1-2);
      }

      .columns.ratio-3-2 {
        grid-template-columns: var(--grid-cols-3-2);
      }

      .columns.ratio-2-3 {
        grid-template-columns: var(--grid-cols-2-3);
      }

      .columns.reverse {
        direction: rtl;
      }

      .columns.reverse > * {
        direction: ltr;
      }
    }

    .column {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    /* Typography defaults for content column */
    ::slotted(h2) {
      font-size: var(--text-3xl);
      font-weight: var(--weight-bold);
      color: var(--color-text-primary);
      line-height: var(--leading-tight);
      margin: 0;
    }

    ::slotted(h3) {
      font-size: var(--text-xl);
      font-weight: var(--weight-semibold);
      color: var(--color-text-primary);
      line-height: var(--leading-tight);
      margin: 0;
    }

    ::slotted(p) {
      font-size: var(--text-md);
      color: var(--color-text-secondary);
      line-height: var(--leading-relaxed);
      margin: 0;
    }

    ::slotted(img) {
      width: 100%;
      height: auto;
      border-radius: var(--radius-2xl);
      box-shadow: var(--shadow-lg);
    }

    ::slotted([slot="image"]) {
      width: 100%;
      height: auto;
      border-radius: var(--radius-2xl);
      box-shadow: var(--shadow-lg);
    }
  `;

  render() {
    const normalizedRatio = this.ratio.replace(":", "-");
    const classes = [
      "columns",
      `ratio-${normalizedRatio}`,
      `gap-${this.gap}`,
      `align-${this.align}`,
      this.reverse ? "reverse" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return html`
      <div class="two-column">
        <ds-container size="lg">
          <div class="${classes}">
            <div class="column">
              <slot name="left"></slot>
              <slot name="content"></slot>
            </div>
            <div class="column">
              <slot name="right"></slot>
              <slot name="image"></slot>
            </div>
          </div>
        </ds-container>
      </div>
    `;
  }
}

customElements.define("ds-two-column", DSTwoColumn);
