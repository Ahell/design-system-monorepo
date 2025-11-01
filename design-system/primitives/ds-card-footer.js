/**
 * Design System Card Footer Component
 *
 * Enhanced card footer with professional styling using design tokens.
 * Provides consistent footer layout with notes and custom content.
 */

import {
  LitElement,
  html,
  css,
} from "lit";

/**
 * CardFooter - Enhanced card footer with professional styling
 * @prop {string} note - Footer note/message text
 * @prop {string} type - Footer type: "note" | "info" | "warning" | "success" (default: "note")
 * @slot - Default slot for custom footer content
 */
class CardFooter extends LitElement {
  static properties = {
    note: { type: String },
    type: { type: String },
  };

  static styles = css`
    :host {
      display: block;
    }

    .card-footer {
      margin-top: var(--space-4);
      padding-top: var(--space-4);
      border-top: 1px solid var(--color-border-primary);
      display: flex;
      gap: var(--space-3);
      flex-wrap: wrap;
      align-items: center;
      font-size: var(--text-sm);
      line-height: var(--leading-snug);
    }

    .card-footer.note {
      color: var(--color-text-tertiary);
    }

    .card-footer.info {
      color: var(--color-info-main);
      background: var(--color-info-bg);
      padding: var(--space-3);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-info-main);
      margin-top: var(--space-4);
    }

    .card-footer.warning {
      color: var(--color-warning-main);
      background: var(--color-warning-bg);
      padding: var(--space-3);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-warning-main);
      margin-top: var(--space-4);
    }

    .card-footer.success {
      color: var(--color-success-main);
      background: var(--color-success-bg);
      padding: var(--space-3);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-success-main);
      margin-top: var(--space-4);
    }

    .footer-content {
      flex: 1;
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .footer-icon {
      font-size: var(--text-sm);
      flex-shrink: 0;
    }

    .footer-note {
      margin: 0;
      font-weight: var(--weight-medium);
    }

    /* Enhanced styling for slotted content */
    ::slotted(*) {
      font-size: var(--text-sm);
      margin: 0;
    }

    ::slotted(.btn) {
      margin: 0;
    }

    ::slotted(ds-button) {
      margin: 0;
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .card-footer {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-2);
      }

      .footer-content {
        width: 100%;
      }
    }
  `;

  constructor() {
    super();
    this.note = "";
    this.type = "note";
  }

  _getIcon() {
    switch (this.type) {
      case "info":
        return "ℹ";
      case "warning":
        return "⚠";
      case "success":
        return "✓";
      default:
        return "";
    }
  }

  render() {
    const icon = this._getIcon();

    return html`
      <div class="card-footer ${this.type}">
        <div class="footer-content">
          ${icon ? html`<span class="footer-icon">${icon}</span>` : ""}
          ${this.note
            ? html`<p class="footer-note">${this.note}</p>`
            : html`<slot></slot>`}
        </div>
      </div>
    `;
  }
}

// Register component
customElements.define("card-footer", CardFooter);

export { CardFooter };
