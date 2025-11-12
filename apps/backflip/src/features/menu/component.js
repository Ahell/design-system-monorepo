// Feature Component: menu
// Navigation menu component with top-right alignment

import { LitElement, html, css } from "lit";
import { getMenuItems } from "./data.js";

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

    /* Inverted colors for about-us page */
    .menu.inverted .menu-item {
      color: var(--color-bright-gold);
    }

    .menu.inverted .menu-item.active {
      color: var(--color-bright-gold);
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
  }  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("pagechange", () => {});
    window.removeEventListener("hashchange", () => {});
  }

  render() {
    const menuItems = getMenuItems();
    const currentPage = window.location.hash.substring(1) || 'home';
    const isInverted = currentPage === 'about';

    return html`
      <nav class="menu ${isInverted ? 'inverted' : ''}">
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
    window.dispatchEvent(new CustomEvent('pagechange', { 
      detail: { page, item } 
    }));
  }
  
  _scrollToPage(page) {
    const pageIndex = page === 'home' ? 0 : page === 'about' ? 1 : 0;
    const targetScrollY = pageIndex * window.innerHeight;
    
    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth'
    });
  }

  _updateActiveFromHash() {
    // Trigger re-render to update active state based on new hash
    this.requestUpdate();
  }
}

customElements.define("backflip-menu", BackflipMenu);
