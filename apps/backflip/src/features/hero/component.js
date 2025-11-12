// Feature Component: hero
// Hero section component with centered content

import { LitElement, html, css } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { getHeroContent } from "./data.js";

export class BackflipHero extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100vw;
      height: 100vh;
      background-color: var(--color-bright-gold);
      margin: 0;
      padding: 0;
      font-family: var(--font-serif);
    }

    .hero {
      display: grid;
      grid-template-columns: 1fr 728px 1fr;
      column-gap: var(--space-0); /* No horizontal gap */
      row-gap: var(--space-4); /* 16px vertical gap */
      color: var(--color-text-primary);
      background-color: var(--color-bright-gold);
      width: 100%;
      padding: 0 var(--space-0);
      min-height: 100vh;
    }

    .hero-title {
      grid-column: 2;
      align-self: end;
      font-size: var(--text-16xl);
      font-weight: var(--weight-normal);
      margin: 0 0 var(--space-4) 0;
      padding: 0;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
      letter-spacing: var(--tracking-tight);
      text-align: left;
    }

    .hero-subtitle {
      grid-column: 2;
      justify-self: end;
      align-self: start;
      font-size: var(--text-2xl);
      font-weight: var(--weight-bold);
      margin: 0;
      opacity: 0.8;
      text-align: left;
      line-height: 1.2;
      max-width: 400px;
    }
  `;

  render() {
    const content = getHeroContent();

    return html`
      <div class="hero">
        <h1 class="hero-title">${content.title}</h1>
        <p class="hero-subtitle">${unsafeHTML(content.subtitle)}</p>
      </div>
    `;
  }
}

customElements.define("backflip-hero", BackflipHero);
