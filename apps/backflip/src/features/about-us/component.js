// Feature Component: about-us
// About us page component with inverted colors and homepage layout

import { LitElement, html, css } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { getAboutUsContent } from "./data.js";
import { initializeAboutUs } from "./logic.js";

export class BackflipAboutUs extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      position: relative;
    }

    .about-us-grid {
      display: grid;
      grid-template-columns: 1fr 1200px 1fr;
      grid-template-rows: 100px 1fr 100px;
      height: 100vh;
      width: 100%;
      background-color: var(--color-text-primary);
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
      font-family: var(--font-serif);
    }

    .footer-container {
      grid-row: 3;
      grid-column: 2;
      width: 100%;
    }

    .about-us-hero {
      display: grid;
      grid-template-columns: 1fr 728px 1fr;
      color: var(--color-bright-gold);
      background-color: var(--color-text-primary);
      width: 100%;
      height: 100%;
      padding: 0 var(--space-0);
    }

    .about-us-title {
      grid-column: 2;
      align-self: center;
      font-size: var(--text-10xl);
      font-weight: var(--weight-black);
      margin: 0 0 var(--space-4) 0;
      padding: 0;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
      letter-spacing: var(--tracking-tight);
      text-align: left;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    initializeAboutUs();
  }

  render() {
    const content = getAboutUsContent();

    return html`
      <div class="about-us-grid">
        <div class="menu-container">
          <backflip-menu></backflip-menu>
        </div>
        <div class="hero-container">
          <div class="about-us-hero">
            <h1 class="about-us-title">${content.title}</h1>
          </div>
        </div>
        <div class="footer-container"></div>
      </div>
    `;
  }
}

customElements.define("backflip-about-us", BackflipAboutUs);
