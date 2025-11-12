// Feature Component: single-movie
// Single movie page component with inverted colors and homepage layout

import { LitElement, html, css } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { getSingleMovieContent } from "./data.js";
import { initializeSingleMovie } from "./logic.js";

export class BackflipSingleMovie extends LitElement {
  static properties = {
    creator: { type: String },
    title: { type: String },
    description: { type: String },
    imageUrl: { type: String },
    buttonLabel: { type: String },
    videoUrl: { type: String },
    theme: { type: String },
  };

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      position: relative;
    }

    .single-movie-grid {
      display: flex;
      flex-direction: column;
      width: 100%;
      padding-top: 80px;
    }

    .single-movie-grid:not(.inverted) {
      background-color: var(--color-text-primary);
    }

    .video-section {
      width: 100%;
      flex-shrink: 0;
    }

    .single-movie-video {
      width: 100%;
      height: 60vh;
      display: block;
      object-fit: cover;
    }

    .content-section {
      flex: 1;
      display: grid;
      grid-template-columns: 1fr 1200px 1fr;
      width: 100%;
      padding: var(--space-32) 0;
      min-height: 300px;
      background-color: var(--color-text-primary);
    }

    .media-container {
      grid-column: 2;
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: var(--space-6);
      align-items: flex-start;
      color: var(--color-bright-gold);
    }

    .media-image {
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 400px;
      object-fit: contain;
      box-shadow: var(--shadow-lg);
      margin-bottom: var(--space-6);
    }

    .media-content {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .media-title {
      font-size: var(--text-3xl);
      font-weight: var(--weight-black);
      font-family: var(--font-display);
      margin: 0;
      letter-spacing: var(--tracking-tight);
      line-height: 1.1;
      color: var(--color-bright-gold);
    }

    .media-description {
      font-size: var(--text-base);
      font-weight: var(--weight-normal);
      font-family: var(--font-sans);
      margin: 0;
      line-height: 1.6;
      color: white;
      opacity: 0.9;
    }

    .media-creator {
      font-size: var(--text-lg);
      font-weight: var(--weight-bold);
      font-family: var(--font-display);
      margin: 0;
      color: white;
    }

    .media-button {
      background-color: var(--color-bright-gold);
      color: var(--color-text-primary);
      padding: var(--space-2) var(--space-4);
      border: none;
      border-radius: var(--radius-md);
      font-weight: var(--weight-bold);
      cursor: pointer;
      margin-top: var(--space-4);
      text-align: left;
      width: fit-content;
    }

    /* Inverted theme */
    .inverted .single-movie-grid {
      background-color: white;
    }

    .inverted .content-section {
      background-color: white;
    }

    .inverted .video-section {
      background-color: white;
    }

    .inverted .media-container,
    .inverted .media-description,
    .inverted .media-creator {
      color: black;
    }

    .inverted .media-title {
      color: var(--color-bright-gold-dark);
    }

    .inverted .media-description {
      opacity: 1;
    }

    .inverted .media-button {
      background-color: var(--color-bright-gold-dark);
      color: var(--color-text-primary);
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    initializeSingleMovie();
  }

  render() {
    const content = getSingleMovieContent();
    const media = {
      creator: this.creator || content.media.creator,
      title: this.title || content.media.title,
      description: this.description || content.media.description,
      imageUrl: this.imageUrl || content.media.imageUrl,
      buttonLabel: this.buttonLabel || content.media.buttonLabel,
      videoUrl: this.videoUrl || content.media.videoUrl,
    };

    return html`
      <div class="single-movie-grid ${
        this.theme === "inverted" ? "inverted" : ""
      }">
        <div class="video-section">
          <video
            class="single-movie-video"
            autoplay
            muted
            loop
            playsinline
            src="${media.videoUrl}"
          >
            Your browser does not support the video tag.
          </video>
        </div>
        <div class="content-section">
          <div class="media-container">
            <img
              class="media-image"
              src="${media.imageUrl}"
              alt="${media.title}"
            />
            <div class="media-content">
              <h2 class="media-creator">${media.creator}</h2>
              <h2 class="media-title">${media.title}</h2>
              <p class="media-description">${media.description}</p>
              <button class="media-button">${media.buttonLabel}</button>
            </div>
          </div>
        </div>
        </div>
      </div>
    `;
  }
}

customElements.define("backflip-single-movie", BackflipSingleMovie);
