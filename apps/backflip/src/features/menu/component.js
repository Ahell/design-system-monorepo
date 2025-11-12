// Feature Component: menu
// Navigation menu component with top-right alignment

import { LitElement, html, css } from "lit";
import { getMenuItems } from "./data.js";
import {
  initializeMenu,
  handleMenuItemClick,
  getMenuItemStyles,
  getCurrentPage,
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

    // Listen for page changes
    window.addEventListener("pagechange", () => {
      this.requestUpdate();
    });

    // Listen for hash changes (browser back/forward)
    window.addEventListener("hashchange", () => {
      this._updateActiveFromHash();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("pagechange", () => {});
    window.removeEventListener("hashchange", () => {});
  }

  render() {
    const menuItems = getMenuItems();
    const currentPage = getCurrentPage();

    return html`
      <nav class="menu">
        ${menuItems.map((item) => {
          const isActive = item.href.substring(1) === currentPage;
          return html`
            <a
              class="menu-item ${isActive ? "active" : ""}"
              href="${item.href}"
              @click="${(e) => this._handleItemClick(e, item)}"
            >
              ${item.label}
            </a>
          `;
        })}
      </nav>
    `;
  }

  _handleItemClick(event, item) {
    event.preventDefault();
    handleMenuItemClick(item);
  }

  _updateActiveFromHash() {
    const hash = window.location.hash.substring(1) || "home";
    // This will trigger a pagechange event through handleMenuItemClick
    const items = getMenuItems();
    const item = items.find((i) => i.href === `#${hash}`);
    if (item) {
      handleMenuItemClick(item);
    }
  }
}

customElements.define("backflip-menu", BackflipMenu);
