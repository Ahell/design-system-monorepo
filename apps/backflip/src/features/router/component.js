// Feature Component: router
// Router component that switches between different pages

import { LitElement, html, css } from "lit";
import { getCurrentPage } from "../menu/logic.js";

export class BackflipRouter extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100vh;
    }
  `;

  static properties = {
    currentPage: { type: String },
  };

  constructor() {
    super();
    this.currentPage = getCurrentPage();
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
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('pagechange', () => {});
    window.removeEventListener('hashchange', () => {});
  }

  render() {
    switch (this.currentPage) {
      case 'home':
        return html`<backflip-homepage></backflip-homepage>`;
      case 'about':
        return html`<backflip-about-us></backflip-about-us>`;
      case 'services':
        return html`<div>Services page coming soon...</div>`;
      case 'contact':
        return html`<div>Contact page coming soon...</div>`;
      default:
        return html`<backflip-homepage></backflip-homepage>`;
    }
  }
}

customElements.define("backflip-router", BackflipRouter);