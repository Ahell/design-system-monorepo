// Feature Component: menu
// Navigation menu component with top-right alignment

import { LitElement, html, css } from "lit";
import { getMenuItems } from "./data.js";

export class BackflipMenu extends LitElement {
  static properties = {
    isOpen: { type: Boolean },
  };

  constructor() {
    super();
    this.isOpen = false;
  }

  static styles = css`
    :host {
      display: block;
    }

    .hamburger {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      width: 48px;
      height: 48px;
      cursor: pointer;
      background: var(--color-pure-black);
      border: 2px solid var(--color-pure-white);
      padding: 12px 10px;
      border-radius: 50%;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.2),
        0 0 0 1px rgba(255, 255, 255, 0.1), 0 0 12px rgba(255, 255, 255, 0.08);
      transition: all var(--duration-fast) var(--ease-out);
      position: relative;
      z-index: 10;
    }

    .hamburger:hover {
      transform: translateY(-3px) scale(1.08);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35),
        0 6px 12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.2),
        0 0 20px rgba(255, 255, 255, 0.12);
      border-color: var(--color-pure-white);
    }
    .hamburger:active {
      transform: translateY(0) scale(0.98);
      transition: all 0.1s ease;
    }

    .hamburger:focus {
      outline: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1),
        0 0 0 3px rgba(243, 206, 87, 0.3);
    }

    .hamburger-bar {
      width: 22px;
      height: 2px;
      background-color: var(--color-pure-white);
      border-radius: 1px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      transform-origin: center;
      position: relative;
    }

    .hamburger.inverted .hamburger-bar {
      background-color: var(--color-pure-black);
    }

    .hamburger.open .hamburger-bar:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }

    .hamburger.open .hamburger-bar:nth-child(2) {
      opacity: 0;
      transform: scaleX(0);
    }

    .hamburger.open .hamburger-bar:nth-child(3) {
      transform: rotate(-45deg) translate(5px, -5px);
    }

    .dropdown {
      position: absolute;
      top: 60px;
      right: 0;
      background: var(--color-pure-white);
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08);
      min-width: 180px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-8px) scale(0.95);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 1001;
      backdrop-filter: blur(8px);
    }

    .dropdown.open {
      opacity: 1;
      visibility: visible;
      transform: translateY(0) scale(1);
    }

    .dropdown-item {
      display: block;
      padding: 12px 16px;
      color: var(--color-pure-black);
      text-decoration: none;
      font-size: var(--text-sm);
      font-weight: 500;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      border: none;
      background: transparent;
      width: 100%;
      text-align: left;
      cursor: pointer;
      border-radius: 4px;
      margin: 2px 4px;
    }

    .dropdown-item:hover {
      background-color: rgba(243, 206, 87, 0.1);
      color: var(--color-pure-black);
      transform: translateX(2px);
    }

    .dropdown-item.active {
      background-color: rgba(243, 206, 87, 0.15);
      color: var(--color-pure-black);
      font-weight: 600;
    }

    .menu-container {
      position: relative;
    }
  `;

  connectedCallback() {
    super.connectedCallback();

    // Listen for page changes
    window.addEventListener("pagechange", () => {
      this.requestUpdate();
    });

    // Listen for hash changes (browser back/forward)
    window.addEventListener("hashchange", () => {
      this._updateActiveFromHash();
    });

    // Listen for clicks outside to close menu
    document.addEventListener("click", this._handleOutsideClick.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("pagechange", () => {});
    window.removeEventListener("hashchange", () => {});
    document.removeEventListener("click", this._handleOutsideClick.bind(this));
  }

  render() {
    const menuItems = getMenuItems();
    const currentPage = window.location.hash.substring(1) || "home";
    const isInverted = currentPage === "about";

    return html`
      <div class="menu-container">
        <button
          class="hamburger ${isInverted ? "inverted" : ""} ${this.isOpen
            ? "open"
            : ""}"
          @click="${this._toggleMenu}"
          aria-label="Toggle menu"
        >
          <span class="hamburger-bar"></span>
          <span class="hamburger-bar"></span>
          <span class="hamburger-bar"></span>
        </button>
        <div class="dropdown ${this.isOpen ? "open" : ""}">
          ${menuItems.map((item) => {
            const isActive = item.href.substring(1) === currentPage;
            return html`
              <a
                class="dropdown-item ${isActive ? "active" : ""}"
                href="${item.href}"
                @click="${(e) => this._handleItemClick(e, item)}"
              >
                ${item.label}
              </a>
            `;
          })}
        </div>
      </div>
    `;
  }

  _handleItemClick(event, item) {
    event.preventDefault();

    // Close the menu
    this.isOpen = false;

    // Extract page from href (remove #)
    const page = item.href.substring(1);

    // Update URL hash
    window.location.hash = page;

    // Scroll to the appropriate position
    this._scrollToPage(page);

    // Update active state
    const items = getMenuItems();
    items.forEach((menuItem) => {
      menuItem.active = menuItem.label === item.label;
    });

    // Dispatch custom event for page changes
    window.dispatchEvent(
      new CustomEvent("pagechange", {
        detail: { page, item },
      })
    );
  }

  _toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  _handleOutsideClick(event) {
    if (!this.shadowRoot.contains(event.target)) {
      this.isOpen = false;
    }
  }

  _scrollToPage(page) {
    const pageIndex =
      page === "home"
        ? 0
        : page === "about"
        ? 1
        : page === "who-are-we"
        ? 2
        : 0;
    const targetScrollY = pageIndex * window.innerHeight;

    window.scrollTo({
      top: targetScrollY,
      behavior: "smooth",
    });
  }

  _updateActiveFromHash() {
    // Trigger re-render to update active state based on new hash
    this.requestUpdate();
  }
}

customElements.define("backflip-menu", BackflipMenu);
