// Feature Component: menu
// Navigation menu component with top-right alignment

import { LitElement, html, css } from "lit";
import { getMenuItems } from "./data.js";

export class BackflipMenu extends LitElement {
  static properties = {
    isOpen: { type: Boolean },
  };

  constructor() {
    super();
    this.isOpen = false;
    this.dropdownElement = null;
  }

  static styles = css`
    :host {
      display: block;
    }

    .hamburger {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      width: 48px;
      height: 48px;
      cursor: pointer;
      background: var(--color-pure-black);
      border: 2px solid var(--color-pure-white);
      padding: 12px 10px;
      border-radius: 50%;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.2),
        0 0 0 1px rgba(255, 255, 255, 0.1), 0 0 12px rgba(255, 255, 255, 0.08);
      transition: all var(--duration-fast) var(--ease-out);
      position: relative;
      z-index: 10;
    }

    .hamburger:hover {
      transform: translateY(-3px) scale(1.08);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35),
        0 6px 12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.2),
        0 0 20px rgba(255, 255, 255, 0.12);
      border-color: var(--color-pure-white);
    }

    .hamburger:hover {
      transform: translateY(-3px) scale(1.08);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35),
        0 6px 12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.2),
        0 0 20px rgba(255, 255, 255, 0.12);
      border-color: var(--color-pure-white);
    }
    .hamburger:active {
      transform: translateY(0) scale(0.98);
      transition: all 0.1s ease;
    }

    .hamburger:focus {
      outline: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1),
        0 0 0 3px rgba(243, 206, 87, 0.3);
    }

    .hamburger-bar {
      width: 22px;
      height: 2px;
      background-color: var(--color-pure-white);
      border-radius: 1px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      transform-origin: center;
      position: relative;
    }

    .hamburger.open .hamburger-bar:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }

    .hamburger.open .hamburger-bar:nth-child(2) {
      opacity: 0;
      transform: scaleX(0);
    }

    .hamburger.open .hamburger-bar:nth-child(3) {
      transform: rotate(-45deg) translate(5px, -5px);
    }

    .dropdown {
      position: fixed;
      top: 80px;
      right: 20px;
      background: var(--color-pure-white);
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08);
      min-width: 180px;
      padding: 8px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-8px) scale(0.95);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 1001;
      backdrop-filter: blur(8px);
    }

    .dropdown.open {
      opacity: 1;
      visibility: visible;
      transform: translateY(0) scale(1);
    }

    .dropdown-item {
      display: block;
      padding: 12px 16px;
      color: var(--color-pure-black);
      text-decoration: none;
      font-size: var(--text-sm);
      font-weight: 500;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      border: none;
      background: transparent;
      width: 100%;
      text-align: left;
      cursor: pointer;
      border-radius: 4px;
      margin: 2px 4px;
    }

    .dropdown-item:hover {
      background-color: rgba(243, 206, 87, 0.1);
      color: var(--color-pure-black);
      transform: translateX(2px);
    }

    .dropdown-item.active {
      background-color: rgba(243, 206, 87, 0.15);
      color: var(--color-pure-black);
      font-weight: 600;
    }

    /* Styles for the portal dropdown */
    :host {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
    }

    .hamburger-dropdown {
      position: fixed !important;
      top: 80px !important;
      right: 20px !important;
      background: var(--color-surface-primary) !important;
      border: var(--border-width-thin) solid var(--color-border-primary) !important;
      border-radius: var(--radius-lg) !important;
      box-shadow: var(--shadow-lg) !important;
      min-width: 200px !important;
      padding: var(--space-2) !important;
      z-index: var(--z-dropdown) !important;
      opacity: 0 !important;
      transform: translateY(-8px) scale(0.95) !important;
      transition: var(--transition-all) !important;
      backdrop-filter: blur(8px) !important;
    }
  `;

  connectedCallback() {
    super.connectedCallback();

    // Listen for page changes
    window.addEventListener("pagechange", () => {
      this.requestUpdate();
    });

    // Listen for hash changes (browser back/forward)
    window.addEventListener("hashchange", () => {
      this._updateActiveFromHash();
    });
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has("isOpen")) {
      if (this.isOpen) {
        this._createDropdown();
      } else {
        this._destroyDropdown();
      }
    }
  }

  render() {
    const menuItems = getMenuItems();
    const currentPage = window.location.hash.substring(1) || "home";

    return html`
      <div class="menu-container">
        <button
          class="hamburger ${this.isOpen ? "open" : ""}"
          @click="${(e) => this._toggleMenu(e)}"
          aria-label="Toggle menu"
        >
          <span class="hamburger-bar"></span>
          <span class="hamburger-bar"></span>
          <span class="hamburger-bar"></span>
        </button>
      </div>
    `;
  }

  _handleItemClick(event, item) {
    event.preventDefault();
    event.stopPropagation();

    // Close the menu
    this.isOpen = false;

    // Extract page from href (remove #)
    const page = item.href.substring(1);

    // Update URL hash
    window.location.hash = page;

    // Update active state
    const items = getMenuItems();
    items.forEach((menuItem) => {
      menuItem.active = menuItem.label === item.label;
    });

    // Dispatch custom event for page changes (router will handle scrolling)
    window.dispatchEvent(
      new CustomEvent("pagechange", {
        detail: { page, item },
      })
    );
  }

  _toggleMenu(event) {
    event.stopPropagation(); // Prevent event bubbling to avoid triggering outside click
    this.isOpen = !this.isOpen;
  }

  _createDropdown() {
    if (this.dropdownElement) return;

    const menuItems = getMenuItems();
    const currentPage = window.location.hash.substring(1) || "home";

    // Create dropdown element
    this.dropdownElement = document.createElement("div");
    this.dropdownElement.className = "hamburger-dropdown";
    this.dropdownElement.innerHTML = `
      <button class="menu-close-btn" style="
        position: absolute;
        top: 20px;
        right: 20px;
        background: var(--color-pure-black);
        border: 2px solid var(--color-pure-white);
        padding: 12px 10px;
        border-radius: 50%;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.2),
          0 0 0 1px rgba(255, 255, 255, 0.1), 0 0 12px rgba(255, 255, 255, 0.08);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: pointer;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        width: 48px;
        height: 48px;
      ">
        <span class="close-bar" style="
          width: 22px;
          height: 2px;
          background-color: var(--color-pure-white);
          border-radius: 1px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: center;
        "></span>
        <span class="close-bar" style="
          width: 22px;
          height: 2px;
          background-color: var(--color-pure-white);
          border-radius: 1px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: center;
        "></span>
        <span class="close-bar" style="
          width: 22px;
          height: 2px;
          background-color: var(--color-pure-white);
          border-radius: 1px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: center;
        "></span>
      </button>
      ${
        menuItems && menuItems.length > 0
          ? menuItems
              .map((item) => {
                const isActive = item.href.substring(1) === currentPage;
                return `
              <div
                class="hamburger-dropdown-item ${isActive ? "active" : ""}"
                data-href="${item.href}"
                style="
                  display: block;
                  padding: 16px 20px;
                  color: #000000;
                  text-decoration: none;
                  font-size: 16px;
                  font-weight: 500;
                  transition: all 0.2s ease;
                  border: none;
                  background: transparent;
                  width: 100%;
                  text-align: left;
                  cursor: pointer;
                  border-radius: 8px;
                  margin: 4px 0;
                  line-height: 1.4;
                  box-sizing: border-box;
                  ${isActive ? "color: #000000; font-weight: 600;" : ""}
                "
              >
                ${item.label}
              </div>
            `;
              })
              .join("")
          : '<div class="hamburger-dropdown-item" style="display: block; padding: 16px 20px; color: #000000; text-decoration: none; font-size: 16px; font-weight: 500; box-sizing: border-box;">No menu items</div>'
      }
    `;

    // Style the dropdown
    Object.assign(this.dropdownElement.style, {
      position: "fixed",
      top: "0",
      right: "0",
      width: "250px",
      height: "100vh",
      background: "white",
      border: "none",
      borderLeft: "1px solid rgba(0, 0, 0, 0.1)",
      boxShadow: "-4px 0 20px rgba(0, 0, 0, 0.15)",
      padding: "80px 24px 24px 24px",
      zIndex: "9999",
      transform: "translateX(100%)",
      transition: "transform 0.3s ease-out",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
    });

    // Add click handler
    this.dropdownElement.addEventListener(
      "click",
      this._handleDropdownClick.bind(this)
    );

    // Add close button handler
    const closeBtn = this.dropdownElement.querySelector(".menu-close-btn");
    if (closeBtn) {
      // Apply X transformation to close button bars
      const closeBars = closeBtn.querySelectorAll(".close-bar");
      if (closeBars.length === 3) {
        closeBars[0].style.transform = "rotate(45deg) translate(5px, 5px)";
        closeBars[1].style.opacity = "0";
        closeBars[1].style.transform = "scaleX(0)";
        closeBars[2].style.transform = "rotate(-45deg) translate(5px, -5px)";
      }

      closeBtn.addEventListener("click", () => {
        this.isOpen = false;
      });
      closeBtn.addEventListener("mouseenter", () => {
        closeBtn.style.transform = "translateY(-3px) scale(1.08)";
        closeBtn.style.boxShadow =
          "0 12px 32px rgba(0, 0, 0, 0.35), 0 6px 12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.2), 0 0 20px rgba(255, 255, 255, 0.12)";
        closeBtn.style.borderColor = "var(--color-pure-white)";
      });
      closeBtn.addEventListener("mouseleave", () => {
        closeBtn.style.transform = "translateY(0) scale(1)";
        closeBtn.style.boxShadow =
          "0 8px 24px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1), 0 0 12px rgba(255, 255, 255, 0.08)";
        closeBtn.style.borderColor = "var(--color-pure-white)";
      });
    }

    // Add hover styles for menu items
    const menuItemsElements = this.dropdownElement.querySelectorAll(
      ".hamburger-dropdown-item"
    );
    menuItemsElements.forEach((item) => {
      item.addEventListener("mouseenter", () => {
        item.style.transform = "translateX(4px)";
      });
      item.addEventListener("mouseleave", () => {
        item.style.transform = "translateX(0)";
      });
    });

    // Create overlay
    this.overlayElement = document.createElement("div");
    Object.assign(this.overlayElement.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100vw",
      height: "100vh",
      background: "rgba(0, 0, 0, 0.5)",
      zIndex: "9998",
      opacity: "0",
      transition: "opacity 0.3s ease-out",
    });
    this.overlayElement.addEventListener("click", () => {
      this.isOpen = false;
    });

    // Append overlay first
    document.body.appendChild(this.overlayElement);

    // Append to body
    document.body.appendChild(this.dropdownElement);

    // Trigger animation
    requestAnimationFrame(() => {
      this.dropdownElement.style.transform = "translateX(0%)";
      this.overlayElement.style.opacity = "1";
    });

    // Add outside click listener after a short delay to avoid immediate closing
    setTimeout(() => {
      document.addEventListener("click", this._handleOutsideClick.bind(this), {
        once: true,
      });
    }, 10);
  }

  _destroyDropdown() {
    if (this.dropdownElement) {
      this.dropdownElement.style.transform = "translateX(100%)";
      if (this.overlayElement) {
        this.overlayElement.style.opacity = "0";
      }
      setTimeout(() => {
        if (this.dropdownElement && this.dropdownElement.parentNode) {
          this.dropdownElement.parentNode.removeChild(this.dropdownElement);
        }
        this.dropdownElement = null;
        if (this.overlayElement && this.overlayElement.parentNode) {
          this.overlayElement.parentNode.removeChild(this.overlayElement);
        }
        this.overlayElement = null;
      }, 300);
    }
  }

  _handleDropdownClick(event) {
    const target = event.target.closest(".hamburger-dropdown-item");
    if (target) {
      event.preventDefault();
      event.stopPropagation();
      const href = target.getAttribute("data-href");
      const item = { href, label: target.textContent.trim() };
      this._handleItemClick(event, item);
    }
  }

  _handleOutsideClick(event) {
    // Check if the click is outside the menu container and dropdown
    const menuContainer =
      this.shadowRoot?.querySelector(".menu-container") ||
      this.querySelector(".menu-container");
    const isOutsideMenu =
      menuContainer && !menuContainer.contains(event.target);
    const isOutsideDropdown =
      this.dropdownElement && !this.dropdownElement.contains(event.target);

    if (isOutsideMenu && isOutsideDropdown) {
      this.isOpen = false;
    }
  }

  _updateActiveFromHash() {
    // Trigger re-render to update active state based on new hash
    this.requestUpdate();
  }
}

customElements.define("backflip-menu", BackflipMenu);
