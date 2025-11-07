import { LitElement, html, css } from "lit";

/**
 * A flexible layout component that provides full control over CSS flexbox properties.
 * Use ds-flex when you need custom flex layouts beyond what ds-stack (vertical) and ds-inline (horizontal) provide.
 *
 * @element ds-flex
 *
 * @prop {string} direction - Flex direction: row | row-reverse | column | column-reverse
 * @prop {string} gap - Gap between items: none | xs | sm | md | lg | xl | 2xl | 3xl | 1 | 2 | 3 | 4 | 6 | 8 | 12
 * @prop {string} align - Align items: start | center | end | stretch | baseline
 * @prop {string} justify - Justify content: start | center | end | space-between | space-around | space-evenly
 * @prop {string} wrap - Flex wrap: nowrap | wrap | wrap-reverse
 * @prop {string} alignContent - Align content for multi-line: start | center | end | stretch | space-between | space-around
 * @prop {string} basis - Flex basis for children (CSS value like "0" or "auto")
 * @prop {string} grow - Flex grow for children (0-12)
 * @prop {string} shrink - Flex shrink for children (0-12)
 *
 * @example
 * <ds-flex direction="row" gap="4" align="center" justify="space-between">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </ds-flex>
 *
 * @example
 * <ds-flex direction="column" gap="2" wrap="wrap">
 *   <div>Vertical layout with wrapping</div>
 * </ds-flex>
 */
export class DSFlex extends LitElement {
  static properties = {
    direction: { type: String },
    gap: { type: String },
    align: { type: String },
    justify: { type: String },
    wrap: { type: String },
    alignContent: { type: String, attribute: "align-content" },
    basis: { type: String },
    grow: { type: String },
    shrink: { type: String },
  };

  static styles = css`
    :host {
      display: flex;
      box-sizing: border-box;
    }

    /* Direction variants */
    :host(.direction-row) {
      flex-direction: row;
    }
    :host(.direction-row-reverse) {
      flex-direction: row-reverse;
    }
    :host(.direction-column) {
      flex-direction: column;
    }
    :host(.direction-column-reverse) {
      flex-direction: column-reverse;
    }

    /* Gap variants */
    :host(.gap-none) {
      gap: 0;
    }
    :host(.gap-xs) {
      gap: var(--space-1);
    }
    :host(.gap-sm) {
      gap: var(--space-2);
    }
    :host(.gap-md) {
      gap: var(--space-3);
    }
    :host(.gap-lg) {
      gap: var(--space-4);
    }
    :host(.gap-xl) {
      gap: var(--space-6);
    }
    :host(.gap-2xl) {
      gap: var(--space-8);
    }
    :host(.gap-3xl) {
      gap: var(--space-12);
    }
    :host(.gap-1) {
      gap: var(--space-1);
    }
    :host(.gap-2) {
      gap: var(--space-2);
    }
    :host(.gap-3) {
      gap: var(--space-3);
    }
    :host(.gap-4) {
      gap: var(--space-4);
    }
    :host(.gap-6) {
      gap: var(--space-6);
    }
    :host(.gap-8) {
      gap: var(--space-8);
    }
    :host(.gap-12) {
      gap: var(--space-12);
    }

    /* Align items variants */
    :host(.align-start) {
      align-items: flex-start;
    }
    :host(.align-center) {
      align-items: center;
    }
    :host(.align-end) {
      align-items: flex-end;
    }
    :host(.align-stretch) {
      align-items: stretch;
    }
    :host(.align-baseline) {
      align-items: baseline;
    }

    /* Justify content variants */
    :host(.justify-start) {
      justify-content: flex-start;
    }
    :host(.justify-center) {
      justify-content: center;
    }
    :host(.justify-end) {
      justify-content: flex-end;
    }
    :host(.justify-space-between) {
      justify-content: space-between;
    }
    :host(.justify-space-around) {
      justify-content: space-around;
    }
    :host(.justify-space-evenly) {
      justify-content: space-evenly;
    }

    /* Wrap variants */
    :host(.wrap-nowrap) {
      flex-wrap: nowrap;
    }
    :host(.wrap-wrap) {
      flex-wrap: wrap;
    }
    :host(.wrap-wrap-reverse) {
      flex-wrap: wrap-reverse;
    }

    /* Align content variants (for multi-line) */
    :host(.align-content-start) {
      align-content: flex-start;
    }
    :host(.align-content-center) {
      align-content: center;
    }
    :host(.align-content-end) {
      align-content: flex-end;
    }
    :host(.align-content-stretch) {
      align-content: stretch;
    }
    :host(.align-content-space-between) {
      align-content: space-between;
    }
    :host(.align-content-space-around) {
      align-content: space-around;
    }

    /* Child flex properties */
    :host(.basis-0) ::slotted(*) {
      flex-basis: 0;
    }
    :host(.basis-auto) ::slotted(*) {
      flex-basis: auto;
    }

    :host(.grow-0) ::slotted(*) {
      flex-grow: 0;
    }
    :host(.grow-1) ::slotted(*) {
      flex-grow: 1;
    }
    :host(.grow-2) ::slotted(*) {
      flex-grow: 2;
    }
    :host(.grow-3) ::slotted(*) {
      flex-grow: 3;
    }
    :host(.grow-4) ::slotted(*) {
      flex-grow: 4;
    }
    :host(.grow-6) ::slotted(*) {
      flex-grow: 6;
    }
    :host(.grow-8) ::slotted(*) {
      flex-grow: 8;
    }
    :host(.grow-12) ::slotted(*) {
      flex-grow: 12;
    }

    :host(.shrink-0) ::slotted(*) {
      flex-shrink: 0;
    }
    :host(.shrink-1) ::slotted(*) {
      flex-shrink: 1;
    }
    :host(.shrink-2) ::slotted(*) {
      flex-shrink: 2;
    }
    :host(.shrink-3) ::slotted(*) {
      flex-shrink: 3;
    }
    :host(.shrink-4) ::slotted(*) {
      flex-shrink: 4;
    }
    :host(.shrink-6) ::slotted(*) {
      flex-shrink: 6;
    }
    :host(.shrink-8) ::slotted(*) {
      flex-shrink: 8;
    }
    :host(.shrink-12) ::slotted(*) {
      flex-shrink: 12;
    }
  `;

  constructor() {
    super();
    this.direction = "row";
    this.gap = "none";
    this.align = "stretch";
    this.justify = "start";
    this.wrap = "nowrap";
    this.alignContent = "";
    this.basis = "";
    this.grow = "";
    this.shrink = "";
  }

  render() {
    const classes = [
      `direction-${this.direction}`,
      `gap-${this.gap}`,
      `align-${this.align}`,
      `justify-${this.justify}`,
      `wrap-${this.wrap}`,
      this.alignContent ? `align-content-${this.alignContent}` : "",
      this.basis ? `basis-${this.basis}` : "",
      this.grow ? `grow-${this.grow}` : "",
      this.shrink ? `shrink-${this.shrink}` : "",
    ]
      .filter(Boolean)
      .join(" ");

    this.className = classes;

    return html`<slot></slot>`;
  }
}

customElements.define("ds-flex", DSFlex);
