// Feature Component: router
// Router component that switches between different pages

import { LitElement, html, css } from "lit";
import { getCurrentPage } from "../menu/logic.js";
import { handleMenuItemClick } from "../menu/logic.js";

export class BackflipRouter extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100vh;
      overflow-y: auto;
      scroll-behavior: smooth;
    }

    .page-container {
      display: flex;
      flex-direction: column;
    }

    backflip-homepage,
    backflip-homepage,
    backflip-some-of-our-films,
    backflip-single-movie,
    backflip-detailed-single-movie,
    backflip-contact {
      flex: 0 0 100vh;
      width: 100%;
    }

    backflip-about-us {
      flex: 0 0 auto;
      width: 100%;
    }

    backflip-single-movie[showvideo="false"] {
      flex: 0 0 auto;
    }

    .floating-menu {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
    }
  `;

  static properties = {
    currentPage: { type: String },
  };

  constructor() {
    super();
    this.currentPage = getCurrentPage();
    this.lastScrollY = 0;
    this.scrollThreshold = 100; // Minimum scroll distance to trigger page change
  }

  connectedCallback() {
    super.connectedCallback();

    // Listen for page changes
    window.addEventListener("pagechange", (e) => {
      this.currentPage = e.detail.page;
    });

    // Listen for hash changes
    window.addEventListener("hashchange", () => {
      const hash = window.location.hash.substring(1) || "home";
      this.currentPage = hash;

      // Scroll to the corresponding page
      this._scrollToPage(hash);
    });

    // Listen for scroll events
    window.addEventListener("scroll", this._handleScroll.bind(this), {
      passive: true,
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("pagechange", () => {});
    window.removeEventListener("hashchange", () => {});
    window.removeEventListener("scroll", this._handleScroll.bind(this));
  }

  _handleScroll() {
    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - this.lastScrollY;
    const viewportHeight = window.innerHeight;

    // Only trigger page changes if we've scrolled enough
    if (Math.abs(scrollDelta) < this.scrollThreshold) {
      return;
    }

    // Determine which page is currently in view
    const currentPageIndex = Math.round(currentScrollY / viewportHeight);
    const pages = [
      "home",
      "about",
      "who-are-we",
      "films",
      "single-movie",
      "single-movie",
      "single-movie",
      "single-movie",
      "single-movie",
      "single-movie",
      "detailed-single-movie",
      "contact",
    ];
    const newPage = pages[currentPageIndex] || "home";

    // Update active page if it changed
    if (newPage !== this.currentPage) {
      this._setActivePage(newPage);
    }

    this.lastScrollY = currentScrollY;
  }

  _scrollToPage(page) {
    // Try to find the element by ID
    const element = document.getElementById(page);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // Fallback to viewport height calculation
      const pages = [
        "home",
        "about",
        "who-are-we",
        "films",
        "single-movie",
        "single-movie",
        "single-movie",
        "single-movie",
        "single-movie",
        "single-movie",
        "detailed-single-movie",
        "contact",
      ];
      const pageIndex = pages.indexOf(page);
      if (pageIndex !== -1) {
        const viewportHeight = window.innerHeight;
        const scrollPosition = pageIndex * viewportHeight;
        window.scrollTo({
          top: scrollPosition,
          behavior: "smooth",
        });
      }
    }
  }

  render() {
    const currentHash = window.location.hash.substring(1) || "home";
    return html`
      <div class="floating-menu">
        <backflip-menu></backflip-menu>
      </div>
      <div class="page-container">
        <backflip-homepage id="home"></backflip-homepage>
        <backflip-about-us id="about"></backflip-about-us>
        <backflip-who-are-we id="who-are-we"></backflip-who-are-we>
        <backflip-some-of-our-films id="films"></backflip-some-of-our-films>
        <backflip-single-movie
          id="single-movie-1"
          theme="inverted"
          showVideo="false"
        ></backflip-single-movie>
        <backflip-single-movie
          id="single-movie-2"
          showVideo="false"
          creator="Dylan Williams"
          title="Men Who Sing"
          description="And here is a simple film about my Dad. A very sim-
ple but heartfelt film about my father and his choir.
This film was distributed via Curzon Cinemas in 40
towns and cities in the UK, BBC and SVT. It is now
being made into a major Fiction Film in the UK with
an Oscar winning actor in the main role. Cinema re-
lease in the UK and Sweden. Winner BAFTA, BIFFL
Audience Award."
          imageUrl="./images/men_who_sing.png"
          buttonLabel="Link"
          videoUrl="./videos/behind_the_swedish_model.mp4"
        >
        </backflip-single-movie>
        <backflip-single-movie
          id="single-movie-3"
          theme="inverted"
          showVideo="false"
        ></backflip-single-movie>
        <backflip-single-movie
          id="single-movie-4"
          showVideo="false"
          creator="Dylan Williams"
          title="Men Who Sing"
          description="And here is a simple film about my Dad. A very sim-
ple but heartfelt film about my father and his choir.
This film was distributed via Curzon Cinemas in 40
towns and cities in the UK, BBC and SVT. It is now
being made into a major Fiction Film in the UK with
an Oscar winning actor in the main role. Cinema re-
lease in the UK and Sweden. Winner BAFTA, BIFFL
Audience Award."
          imageUrl="./images/men_who_sing.png"
          buttonLabel="Link"
          videoUrl="./videos/behind_the_swedish_model.mp4"
        >
        </backflip-single-movie>
        <backflip-single-movie
          id="single-movie-5"
          theme="inverted"
          showVideo="false"
        ></backflip-single-movie>
        <backflip-single-movie
          id="single-movie-6"
          showVideo="false"
          creator="Dylan Williams"
          title="Men Who Sing"
          description="And here is a simple film about my Dad. A very sim-
ple but heartfelt film about my father and his choir.
This film was distributed via Curzon Cinemas in 40
towns and cities in the UK, BBC and SVT. It is now
being made into a major Fiction Film in the UK with
an Oscar winning actor in the main role. Cinema re-
lease in the UK and Sweden. Winner BAFTA, BIFFL
Audience Award."
          imageUrl="./images/men_who_sing.png"
          buttonLabel="Link"
          videoUrl="./videos/behind_the_swedish_model.mp4"
        >
        </backflip-single-movie>
        <backflip-detailed-single-movie
          id="detailed-single-movie"
        ></backflip-detailed-single-movie>
        <backflip-contact id="contact"></backflip-contact>
      </div>
    `;
  }
}

customElements.define("backflip-router", BackflipRouter);
