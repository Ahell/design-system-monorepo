// Feature Component: homepage
// Homepage component that includes the hero section and menu

import { LitElement, html, css } from "lit";
import { initializeHomepage } from "./logic.js";
import { getCurrentPage } from "../menu/logic.js";

export class BackflipHomepage extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      position: relative;
    }

    .homepage-grid {
      display: grid;
      grid-template-columns: 1fr 1200px 1fr;
      grid-template-rows: 100px 1fr 100px;
      height: 100vh;
      width: 100%;
      background-color: var(--color-bright-gold);
    }

    .menu-container {
      grid-row: 1;
      grid-column: 2;
      display: flex;
      justify-content: flex-end;
      padding: var(--space-4) 0;
    }

    .content-container {
      grid-row: 2;
      grid-column: 2;
      width: 100%;
    }

    .footer-container {
      grid-row: 3;
      grid-column: 2;
      width: 100%;
    }
  `;

  static properties = {
    currentPage: { type: String },
  };

  constructor() {
    super();
    this.currentPage = 'home';
  }

  connectedCallback() {
    super.connectedCallback();
    initializeHomepage();
    
    // Listen for page changes
    window.addEventListener('pagechange', (e) => {
      this.currentPage = e.detail.page;
    });
    
    // Set initial page
    this.currentPage = getCurrentPage();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('pagechange', () => {});
  }

  render() {
    return html`
      <div class="homepage-grid">
        <div class="menu-container">
          <backflip-menu></backflip-menu>
        </div>
        <div class="content-container">
          ${this._renderContent()}
        </div>
        <div class="footer-container"></div>
      </div>
    `;
  }

  _renderContent() {
    switch (this.currentPage) {
      case 'home':
        return html`<backflip-hero></backflip-hero>`;
      case 'about':
        return html`<backflip-about-us></backflip-about-us>`;
      case 'services':
        return html`<div>Services page coming soon...</div>`;
      case 'contact':
        return html`<div>Contact page coming soon...</div>`;
      default:
        return html`<backflip-hero></backflip-hero>`;
    }
  }
}

customElements.define("backflip-homepage", BackflipHomepage);
