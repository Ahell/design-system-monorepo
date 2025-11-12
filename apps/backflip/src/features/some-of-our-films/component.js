// Feature Component: some-of-our-films
// Some of our films page component with inverted colors and homepage layout

import { LitElement, html, css } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { getSomeOfOurFilmsContent } from "./data.js";
import { initializeSomeOfOurFilms } from "./logic.js";

export class BackflipSomeOfOurFilms extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      position: relative;
    }

    .some-of-our-films-grid {
      display: grid;
      grid-template-columns: 1fr 1200px 1fr;
      grid-template-rows: 100px 1fr 100px;
      min-height: 100vh;
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

    .some-of-our-films-hero {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: var(--color-bright-gold);
      background-color: var(--color-text-primary);
      width: 100%;
      height: 100%;
      padding: var(--space-4) 0;
      gap: var(--space-8);
    }

    .title-section {
      width: 100%;
      max-width: 728px;
    }

    .gallery-section {
      width: 100%;
      max-width: 1400px;
    }

    .some-of-our-films-title {
      font-size: var(--text-10xl);
      font-weight: var(--weight-black);
      margin: 0;
      padding: 0;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
      letter-spacing: var(--tracking-tight);
      text-align: center;
    }

    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: var(--space-4);
      width: 100%;
    }

    .gallery-item {
      aspect-ratio: 2/3;
      overflow: hidden;
      box-shadow: var(--shadow-lg);
      transition: transform var(--duration-fast) var(--ease-out);
    }

    .gallery-item:hover {
      transform: scale(1.05);
    }

    .gallery-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .gallery-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-text-primary);
      font-size: var(--text-sm);
      font-weight: var(--weight-semibold);
      text-align: center;
      padding: var(--space-2);
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    initializeSomeOfOurFilms();
  }

  _navigateToMovieDetail(movieId) {
    // Navigate to the detailed single movie page with the specific movie ID
    window.location.hash = `#detailed-single-movie?movieId=${movieId}`;
  }

  render() {
    const content = getSomeOfOurFilmsContent();

    return html`
      <div class="some-of-our-films-grid">
        <div class="menu-container"></div>
        <div class="hero-container">
          <div class="some-of-our-films-hero">
            <div class="title-section">
              <h1 class="some-of-our-films-title">${content.title}</h1>
            </div>
            <div class="gallery-section">
              <div class="gallery-grid">
                ${content.gallery.map(
                  (item) => html`
                    <div class="gallery-item" @click=${() => this._navigateToMovieDetail(item.movieId)} style="cursor: pointer;">
                      ${item.imageUrl === "placeholder"
                        ? html`<div
                            class="gallery-placeholder"
                            style="background-color: ${item.bgColor}"
                          >
                            Film Poster
                          </div>`
                        : html`<img
                            class="gallery-image"
                            src="${item.imageUrl}"
                            alt="${item.alt}"
                          />`}
                    </div>
                  `
                )}
              </div>
            </div>
          </div>
        </div>
        <div class="footer-container"></div>
      </div>
    `;
  }
}

customElements.define("backflip-some-of-our-films", BackflipSomeOfOurFilms);
