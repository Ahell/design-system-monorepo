/**
 * Design System Footer Component
 *
 * Professional footer section pattern for application footer content.
 * Supports multiple layout configurations and content sections.
 */

import { LitElement, html, css } from "lit";

export class DSFooter extends LitElement {
  static properties = {
    text: { type: String },
    copyright: { type: String },
    align: { type: String },
    variant: { type: String },
  };

  constructor() {
    super();
    this.text = "";
    this.copyright = "";
    this.align = "center";
    this.variant = "default"; // default, minimal, detailed
  }

  static styles = css`
    :host {
      display: block;
      font-family: var(--font-sans);
      width: 100%;
    }

    .footer {
      width: 100%;
      padding: var(--space-12) 0;
      background-color: var(--color-surface-secondary);
      border-top: var(--border-width-thin) solid var(--color-border-primary);
      margin-top: var(--space-16);
    }

    .footer.variant-minimal {
      padding: var(--space-6) 0;
      background-color: var(--color-surface-primary);
    }

    .footer.variant-detailed {
      padding: var(--space-16) 0 var(--space-12) 0;
      background: linear-gradient(
        to bottom,
        var(--color-surface-secondary) 0%,
        var(--color-surface-tertiary) 100%
      );
    }

    .container {
      max-width: var(--container-7xl);
      margin: 0 auto;
      padding: 0 var(--space-6);
    }

    .content {
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
    }

    .content.align-center {
      align-items: center;
      text-align: center;
    }

    .content.align-left {
      align-items: flex-start;
      text-align: left;
    }

    .content.align-right {
      align-items: flex-end;
      text-align: right;
    }

    .main-content {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
      width: 100%;
    }

    .text {
      font-size: var(--text-sm);
      color: var(--color-text-secondary);
      line-height: var(--leading-relaxed);
    }

    .copyright {
      font-size: var(--text-xs);
      color: var(--color-text-tertiary);
      padding-top: var(--space-4);
      border-top: var(--border-width-thin) solid var(--color-border-primary);
    }

    .variant-minimal .copyright {
      border-top: none;
      padding-top: 0;
    }

    .links {
      display: flex;
      gap: var(--space-6);
      flex-wrap: wrap;
      justify-content: center;
    }

    .content.align-left .links {
      justify-content: flex-start;
    }

    .content.align-right .links {
      justify-content: flex-end;
    }

    ::slotted(a) {
      font-size: var(--text-sm);
      color: var(--color-text-secondary);
      text-decoration: none;
      transition: var(--transition-colors);
    }

    ::slotted(a:hover) {
      color: var(--color-primary-main);
      text-decoration: underline;
    }

    ::slotted([slot="links"]) {
      display: flex;
      gap: var(--space-6);
      flex-wrap: wrap;
    }

    ::slotted([slot="social"]) {
      display: flex;
      gap: var(--space-3);
      margin-top: var(--space-2);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .footer {
        padding: var(--space-8) 0;
      }

      .content {
        gap: var(--space-4);
      }

      .links {
        flex-direction: column;
        gap: var(--space-3);
        align-items: center;
      }

      .content.align-left .links,
      .content.align-right .links {
        align-items: center;
      }
    }
  `;

  render() {
    const currentYear = new Date().getFullYear();
    const copyrightText = this.copyright || `© ${currentYear}`;

    return html`
      <footer class="footer variant-${this.variant}">
        <div class="container">
          <div class="content align-${this.align}">
            <div class="main-content">
              ${this.text ? html`<div class="text">${this.text}</div>` : ""}
              <slot></slot>
              <div class="links">
                <slot name="links"></slot>
              </div>
              <slot name="social"></slot>
            </div>
            <div class="copyright">${copyrightText}</div>
          </div>
        </div>
      </footer>
    `;
  }
}

// Register component
if (!customElements.get("ds-footer")) {
  customElements.define("ds-footer", DSFooter);
}
