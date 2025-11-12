// Feature Component: router
// Router component that switches between different pages

import { LitElement, html, css } from "lit";
import { getCurrentPage } from "../menu/logic.js";
import { handleMenuItemClick } from "../menu/logic.js";

export class BackflipRouter extends LitElement {
  static properties = {
    currentHash: { type: String }
  };

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
  `;

  firstUpdated() {
    console.log("Router firstUpdated called");
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    console.log("Router updated, checking for elements...");

    // Check if elements exist after render
    setTimeout(() => {
      const aboutEl = document.getElementById("about");
      const homeEl = document.getElementById("home");
      console.log("After render - about element:", !!aboutEl, aboutEl?.tagName);
      console.log("After render - home element:", !!homeEl, homeEl?.tagName);
    }, 100);
  }

  constructor() {
    super();
    this.currentPage = getCurrentPage();
    this.lastScrollY = 0;
    this.scrollThreshold = 100; // Minimum scroll distance to trigger page change
    this.currentHash = window.location.hash.substring(1) || "home";
  }

  // Render in light DOM so elements are accessible via document.getElementById
  createRenderRoot() {
    console.log("Router createRenderRoot called, returning this (light DOM)");
    return this;
  }

  connectedCallback() {
    super.connectedCallback();

    // Handle initial hash on page load
    const initialHash = window.location.hash.substring(1) || "home";
    console.log("Initial hash detected:", initialHash);
    this.currentPage = initialHash;
    this.currentHash = initialHash;
    if (initialHash !== "home") {
      // Wait for DOM to be fully ready before scrolling
      this._waitForDOMAndScroll(initialHash);
    }

    // Listen for page changes
    window.addEventListener("pagechange", (e) => {
      console.log("Page change event:", e.detail);
      this.currentPage = e.detail.page;
    });

    // Listen for hash changes
    window.addEventListener("hashchange", () => {
      const hash = window.location.hash.substring(1) || "home";
      console.log("Hash change detected:", hash);
      this.currentPage = hash;
      this.currentHash = hash;

      // Skip scrolling for detailed-single-movie as it's not part of scroll flow
      if (hash !== "detailed-single-movie") {
        // Scroll to the corresponding page
        this._waitForDOMAndScroll(hash);
      }
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
    console.log(`Scrolling to page: ${page}`);
    // Handle special cases
    if (page === "single-movie") {
      // Scroll to the first single-movie element
      const element =
        document.getElementById("single-movie-1") ||
        document.getElementById("single-movie");
      if (element) {
        console.log(`Found single-movie element, scrolling...`);
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }

    // Try to find the element by ID
    const element = document.getElementById(page);
    if (element) {
      console.log(`Found element for ${page}, scrolling...`);
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      console.log(`Element not found for ${page}, using fallback calculation`);
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
        "contact",
      ];
      const pageIndex = pages.indexOf(page);
      if (pageIndex !== -1) {
        const viewportHeight = window.innerHeight;
        const scrollPosition = pageIndex * viewportHeight;
        console.log(`Using fallback scroll to position: ${scrollPosition}`);
        window.scrollTo({
          top: scrollPosition,
          behavior: "smooth",
        });
      } else {
        console.log(`Page ${page} not found in pages array`);
      }
    }
  }

  _waitForDOMAndScroll(page) {
    let attempts = 0;
    const maxAttempts = 50; // Max 5 seconds at 100ms intervals

    const checkAndScroll = () => {
      attempts++;
      console.log(`Attempt ${attempts} to scroll to ${page}`);

      // Check if the element exists
      let element;
      if (page === "single-movie") {
        element =
          document.getElementById("single-movie-1") ||
          document.getElementById("single-movie");
      } else {
        element = document.getElementById(page);
      }

      if (element) {
        console.log(`Element found for ${page}, scrolling...`);
        this._scrollToPage(page);
        return;
      }

      if (attempts < maxAttempts) {
        setTimeout(checkAndScroll, 100);
      } else {
        console.log(
          `Failed to find element for ${page} after ${maxAttempts} attempts, using fallback`
        );
        // Use fallback scrolling
        this._scrollToPage(page);
      }
    };

    // Start checking immediately
    checkAndScroll();
  }

  render() {
    console.log("Router render called, current hash:", this.currentHash);
    return html`
      <backflip-menu></backflip-menu>
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
        <backflip-contact id="contact"></backflip-contact>
      </div>
      ${this.currentHash === "detailed-single-movie" ? html`
        <backflip-detailed-single-movie id="detailed-single-movie"></backflip-detailed-single-movie>
      ` : ''}
    `;
  }
}

customElements.define("backflip-router", BackflipRouter);
