// Feature Component: detailed-single-movie
// Detailed single movie page component with meta information and video player

import { LitElement, html, css } from "lit";
import { getDetailedMovieData } from "./data.js";
import { initializeDetailedSingleMovie } from "./logic.js";

export class BackflipDetailedSingleMovie extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      position: relative;
    }

    .detailed-movie-grid {
      display: grid;
      grid-template-columns: 1fr 1200px 1fr;
      grid-template-rows: 100px 1fr 100px;
      min-height: 100vh;
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
      flex-direction: column;
      gap: var(--space-8);
      padding: var(--space-4) 0;
      max-width: 1200px;
      margin: 0 auto;
      overflow-y: auto;
    }

    .movie-header {
      text-align: center;
      margin-bottom: var(--space-6);
    }

    .movie-title {
      font-size: var(--text-6xl);
      font-weight: var(--weight-black);
      font-family: var(--font-display);
      margin: 0 0 var(--space-4) 0;
      letter-spacing: var(--tracking-tight);
      line-height: 1.1;
      color: var(--color-text-primary);
    }

    .movie-meta {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--space-4);
    }

    .media-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-8);
      margin-bottom: var(--space-8);
      align-items: start;
    }

    .video-section {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .video-player {
      width: 100%;
      max-width: 900px;
      aspect-ratio: 16 / 9;
      box-shadow: var(--shadow-lg);
      object-fit: cover;
    }

    .content-section {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .meta-title {
      font-size: var(--text-lg);
      font-weight: var(--weight-bold);
      font-family: var(--font-display);
      margin: 0 0 var(--space-2) 0;
      color: var(--color-text-primary);
    }

    .meta-label {
      font-size: var(--text-sm);
      font-weight: var(--weight-semibold);
      font-family: var(--font-display);
      margin: 0 0 var(--space-1) 0;
      color: var(--color-text-secondary);
      text-transform: none;
      letter-spacing: var(--tracking-normal);
    }

    .meta-value {
      font-size: var(--text-sm);
      font-weight: var(--weight-normal);
      font-family: var(--font-sans);
      margin: 0;
      color: var(--color-text-primary);
      line-height: 1.4;
    }

    .description-section {
      background-color: var(--color-surface-secondary);
      padding: var(--space-6);
      box-shadow: var(--shadow-md);
      margin-top: var(--space-4);
    }

    .description-title {
      font-size: var(--text-xl);
      font-weight: var(--weight-bold);
      font-family: var(--font-display);
      margin: 0 0 var(--space-4) 0;
      color: var(--color-text-primary);
    }

    .description-text {
      font-size: var(--text-base);
      font-weight: var(--weight-normal);
      font-family: var(--font-sans);
      margin: 0;
      line-height: 1.6;
      color: var(--color-text-primary);
    }
  `;

  static properties = {
    movieId: { type: String },
  };

  constructor() {
    super();
    this.movieId = "men-who-sing"; // Default movie ID
  }

  connectedCallback() {
    super.connectedCallback();
    initializeDetailedSingleMovie();
    this._parseMovieIdFromUrl();
  }

  _parseMovieIdFromUrl() {
    // Parse movieId from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('movieId');
    if (movieId) {
      this.movieId = movieId;
    }
  }

  render() {
    const movieData = getDetailedMovieData(this.movieId);

    if (!movieData) {
      return html`
        <div class="detailed-movie-grid">
          <div class="content-container">
            <h1>Movie not found</h1>
          </div>
        </div>
      `;
    }

    return html`
      <div class="detailed-movie-grid">
        <div class="menu-container"></div>
        <div class="content-container">
          <div class="movie-header">
            <h1 class="movie-title">${movieData.title}</h1>
          </div>

          <div class="media-section">
            <div class="video-section">
              <video class="video-player" controls poster="${movieData.imageUrl}">
                <source src="${movieData.videoUrl}" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            <div class="content-section">
              <h3 class="meta-title">Film Details</h3>
              <div class="movie-meta">
                <div class="meta-item">
                  <div class="meta-label">Year</div>
                  <div class="meta-value">${movieData.year}</div>
                </div>
                <div class="meta-item">
                  <div class="meta-label">Duration</div>
                  <div class="meta-value">${movieData.duration}</div>
                </div>
                <div class="meta-item">
                  <div class="meta-label">Director</div>
                  <div class="meta-value">${movieData.director}</div>
                </div>
                <div class="meta-item">
                  <div class="meta-label">Producer</div>
                  <div class="meta-value">${movieData.producer}</div>
                </div>
                <div class="meta-item">
                  <div class="meta-label">Editor</div>
                  <div class="meta-value">${movieData.editor}</div>
                </div>
                <div class="meta-item">
                  <div class="meta-label">Music</div>
                  <div class="meta-value">${movieData.music}</div>
                </div>
                <div class="meta-item">
                  <div class="meta-label">With Support From</div>
                  <div class="meta-value">${movieData.support}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="description-section">
            <h2 class="description-title">About the Film</h2>
            <p class="description-text">${movieData.description}</p>
          </div>
        </div>
        <div class="footer-container"></div>
      </div>
    `;
  }
}

customElements.define(
  "backflip-detailed-single-movie",
  BackflipDetailedSingleMovie
);
