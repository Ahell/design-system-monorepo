// Feature Component: about-us
// About us section component with inverted colors

import { LitElement, html, css } from "lit";
import { getAboutUsContent } from "./data.js";

export class BackflipAboutUs extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      background-color: var(--color-text-primary);
      margin: 0;
      padding: 0;
      font-family: var(--font-serif);
    }

    .about-us {
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
      justify-self: center;
      font-size: var(--text-16xl);
      font-weight: var(--weight-normal);
      margin: 0;
      padding: 0;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
      letter-spacing: var(--tracking-tight);
      text-align: center;
    }
  `;

  render() {
    const content = getAboutUsContent();

    return html`
      <div class="about-us">
        <h1 class="about-us-title">${content.title}</h1>
      </div>
    `;
  }
}

customElements.define("backflip-about-us", BackflipAboutUs);