// Feature Component: menu
// Navigation menu component with top-right alignment

import { LitElement, html, css } from "lit";
import { getMenuItems } from "./data.js";
import {
  initializeMenu,
  handleMenuItemClick,
  getMenuItemStyles,
} from "./logic.js";

export class BackflipMenu extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .menu {
      display: flex;
      gap: var(--space-6);
      align-items: center;
      background: transparent;
      padding: var(--space-2) var(--space-4);
      border-radius: var(--radius-md);
    }

    .menu-item {
      color: var(--color-pure-black);
      text-decoration: none;
      font-size: var(--text-sm);
      font-weight: var(--weight-semibold);
      transition: opacity var(--duration-fast) var(--ease-out);
      opacity: 0.7;
      cursor: pointer;
    }

    .menu-item:hover {
      opacity: 1;
    }

    .menu-item.active {
      opacity: 1;
      text-decoration: underline;
      text-underline-offset: 2px;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    initializeMenu();
  }

  render() {
    const menuItems = getMenuItems();

    return html`
      <nav class="menu">
        ${menuItems.map(
          (item) => html`
            <a
              class="menu-item ${item.active ? "active" : ""}"
              href="${item.href}"
              @click="${(e) => this._handleItemClick(e, item)}"
            >
              ${item.label}
            </a>
          `
        )}
      </nav>
    `;
  }

  _handleItemClick(event, item) {
    event.preventDefault();
    handleMenuItemClick(item);
    this.requestUpdate();
  }
}

customElements.define("backflip-menu", BackflipMenu);
