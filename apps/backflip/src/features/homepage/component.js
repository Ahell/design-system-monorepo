// Feature Component: homepage
// Homepage component that includes the hero section

import { LitElement, html, css } from "lit";
import { initializeHomepage } from "./logic.js";

export class BackflipHomepage extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    initializeHomepage();
  }

  render() {
    return html` <backflip-hero></backflip-hero> `;
  }
}

customElements.define("backflip-homepage", BackflipHomepage);
