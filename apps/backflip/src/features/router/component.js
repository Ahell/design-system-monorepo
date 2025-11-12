// Feature Component: router
// Router component that switches between different pages

import { LitElement, html, css } from "lit";
import { getCurrentPage } from "../menu/logic.js";
import { handleMenuItemClick } from "../menu/logic.js";

export class BackflipRouter extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100vh;
      overflow-y: auto;
      scroll-behavior: smooth;
    }

    .page-container {
      display: flex;
      flex-direction: column;
    }

    backflip-homepage,
    backflip-about-us {
      flex: 0 0 100vh;
      width: 100%;
    }
  `;

  static properties = {
    currentPage: { type: String },
  };

  constructor() {
    super();
    this.currentPage = getCurrentPage();
    this.lastScrollY = 0;
    this.scrollThreshold = 100; // Minimum scroll distance to trigger page change
  }

  connectedCallback() {
    super.connectedCallback();
    
    // Listen for page changes
    window.addEventListener('pagechange', (e) => {
      this.currentPage = e.detail.page;
    });
    
    // Listen for hash changes
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.substring(1) || 'home';
      this.currentPage = hash;
    });

    // Listen for scroll events
    window.addEventListener('scroll', this._handleScroll.bind(this), { passive: true });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('pagechange', () => {});
    window.removeEventListener('hashchange', () => {});
    window.removeEventListener('scroll', this._handleScroll.bind(this));
  }

  _handleScroll() {
    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - this.lastScrollY;
    const viewportHeight = window.innerHeight;
    
    // Only trigger page changes if we've scrolled enough
    if (Math.abs(scrollDelta) < this.scrollThreshold) {
      return;
    }

    // Determine which page is currently in view
    const currentPageIndex = Math.round(currentScrollY / viewportHeight);
    const pages = ['home', 'about'];
    const newPage = pages[currentPageIndex] || 'home';

    // Update active page if it changed
    if (newPage !== this.currentPage) {
      this._setActivePage(newPage);
    }

    this.lastScrollY = currentScrollY;
  }

  _setActivePage(page) {
    this.currentPage = page;
    
    // Update menu active state
    const menuItems = [
      { label: "Home", href: "#home" },
      { label: "About", href: "#about" },
      { label: "Services", href: "#services" },
      { label: "Contact", href: "#contact" },
    ];
    
    const menuItem = menuItems.find(item => item.href === `#${page}`);
    if (menuItem) {
      // Trigger menu update without full navigation
      window.dispatchEvent(new CustomEvent('pagechange', { 
        detail: { page, item: menuItem } 
      }));
    }
  }

  render() {
    return html`
      <div class="page-container">
        <backflip-homepage></backflip-homepage>
        <backflip-about-us></backflip-about-us>
      </div>
    `;
  }
}

customElements.define("backflip-router", BackflipRouter);