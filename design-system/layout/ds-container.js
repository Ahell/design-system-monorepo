/**
 * Design System Container Component
 *
 * Responsive container with max-width constraints.
 * Uses design tokens for sizing and spacing.
 */

import { LitElement, html, css } from "lit";

export class DSContainer extends LitElement {
  static properties = {
    size: { type: String },
    padding: { 
      type: Boolean, 
      reflect: true,
      converter: {
        fromAttribute: (value) => value !== 'false' && value !== null && value !== undefined,
        toAttribute: (value) => value ? '' : null,
      }
    },
    center: { 
      type: Boolean, 
      reflect: true,
      converter: {
        fromAttribute: (value) => value !== 'false' && value !== null && value !== undefined,
        toAttribute: (value) => value ? '' : null,
      }
    },
  };

  constructor() {
    super();
    this.size = "lg";
    this.padding = true;
    this.center = true;
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
      font-family: var(--font-sans);
    }

    .container {
      width: 100%;
    }

    .container.center {
      margin-left: auto;
      margin-right: auto;
    }

    .container.padding {
      padding-left: var(--space-4);
      padding-right: var(--space-4);
    }

    /* Size variants */
    .container.size-sm {
      max-width: var(--container-sm);
    }

    .container.size-md {
      max-width: var(--container-md);
    }

    .container.size-lg {
      max-width: var(--container-lg);
    }

    .container.size-xl {
      max-width: var(--container-xl);
    }

    .container.size-2xl {
      max-width: var(--container-2xl);
    }

    .container.size-fluid {
      max-width: 100%;
    }

    /* Content width (for readable text) */
    .container.size-content {
      max-width: var(--content-width);
    }

    /* Responsive padding */
    @media (min-width: 768px) {
      .container.padding {
        padding-left: var(--space-6);
        padding-right: var(--space-6);
      }
    }

    @media (min-width: 1024px) {
      .container.padding {
        padding-left: var(--space-8);
        padding-right: var(--space-8);
      }
    }
  `;

  render() {
    const classes = [
      "container",
      `size-${this.size}`,
      this.padding ? "padding" : "",
      this.center ? "center" : "",
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

customElements.define("ds-container", DSContainer);
