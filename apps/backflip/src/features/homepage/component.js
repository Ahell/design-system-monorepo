// Feature Component: homepage
// Homepage component that includes the hero section and menu

import { LitElement, html, css } from "lit";
import { initializeHomepage } from "./logic.js";

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

    .hero-container {
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

  connectedCallback() {
    super.connectedCallback();
    initializeHomepage();
  }

  render() {
    return html`
      <div class="homepage-grid">
        <div class="menu-container">
          <backflip-menu></backflip-menu>
        </div>
        <div class="hero-container">
          <backflip-hero></backflip-hero>
        </div>
        <div class="footer-container"></div>
      </div>
    `;
  }
}

customElements.define("backflip-homepage", BackflipHomepage);
