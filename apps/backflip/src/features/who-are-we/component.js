// Feature Component: who-are-we
// Who are we page component with white background and media layout

import { LitElement, html, css } from "lit";
import { getWhoAreWeContent } from "./data.js";
import { initializeWhoAreWe } from "./logic.js";

export class BackflipWhoAreWe extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      position: relative;
    }

    .who-are-we-grid {
      display: grid;
      grid-template-columns: 1fr 1200px 1fr;
      grid-template-rows: 100px 1fr 100px;
      height: 100vh;
      width: 100%;
      background-color: var(--color-surface-primary);
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
      display: flex;
      align-items: center;
      gap: var(--space-8);
      padding: var(--space-8) 0;
    }

    .footer-container {
      grid-row: 3;
      grid-column: 2;
      width: 100%;
    }

    .image-section {
      flex: 0 0 400px;
      height: 300px;
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-lg);
    }

    .image-section img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .text-section {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: var(--space-6);
      color: var(--color-text-primary);
    }

    .who-are-we-title {
      font-size: var(--text-8xl);
      font-weight: var(--weight-black);
      font-family: var(--font-serif);
      margin: 0;
      letter-spacing: var(--tracking-tight);
      line-height: 1.1;
      color: var(--color-text-primary);
    }

    .who-are-we-description {
      font-size: var(--text-lg);
      font-weight: var(--weight-normal);
      line-height: 1.6;
      margin: 0;
      color: var(--color-text-secondary);
      max-width: 600px;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    initializeWhoAreWe();
  }

  render() {
    const content = getWhoAreWeContent();

    return html`
      <div class="who-are-we-grid">
        <div class="menu-container">
          <backflip-menu></backflip-menu>
        </div>
        <div class="content-container">
          <div class="image-section">
            <img src="${content.imageUrl}" alt="Our team" />
          </div>
          <div class="text-section">
            <h1 class="who-are-we-title">${content.title}</h1>
            <p class="who-are-we-description">${content.description}</p>
          </div>
        </div>
        <div class="footer-container"></div>
      </div>
    `;
  }
}

customElements.define("backflip-who-are-we", BackflipWhoAreWe);