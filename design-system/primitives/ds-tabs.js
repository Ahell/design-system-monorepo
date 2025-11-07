/**
 * Design System Tabs Component
 *
 * State-of-the-art tabbed interface using design tokens.
 * Modern pill-style tabs with smooth animations and professional styling.
 */

import { LitElement, html, css } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

export class DSTabs extends LitElement {
  static properties = {
    tabs: { type: Array },
    activeTab: { type: String, attribute: "active-tab" },
    orientation: { type: String },
    variant: { type: String },
    size: { type: String },
  };

  constructor() {
    super();
    this.tabs = [];
    this.activeTab = "";
    this.orientation = "horizontal"; // 'horizontal' or 'vertical'
    this.variant = "default"; // 'default', 'pills', 'underline'
    this.size = "md"; // 'sm', 'md', 'lg'
  }

  static styles = css`
    :host {
      display: block;
      font-family: var(--font-sans);
    }

    .tabs-wrapper {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }

    .tabs-header {
      display: flex;
      gap: var(--space-1);
      overflow-x: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;
      padding: var(--space-1);
      background: var(--color-neutral-100);
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border-primary);
    }

    .tabs-header::-webkit-scrollbar {
      display: none;
    }

    .tabs-header.vertical {
      flex-direction: column;
      overflow-x: visible;
      overflow-y: auto;
      padding: var(--space-2);
      gap: var(--space-2);
    }

    /* Tab button base styles */
    .tab-button {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      padding: var(--space-3) var(--space-4);
      border: none;
      background: transparent;
      color: var(--color-text-secondary);
      cursor: pointer;
      font-size: var(--text-sm);
      font-weight: var(--weight-medium);
      white-space: nowrap;
      border-radius: var(--radius-md);
      transition: var(--transition-all);
      user-select: none;
      min-height: var(--min-height-sm);
    }

    .tab-button::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: transparent;
      transition: var(--transition-colors);
      z-index: 0;
    }

    /* Ensure text is above the background */
    .tab-button > * {
      position: relative;
      z-index: 1;
    }

    /* Size variants */
    .tab-button.size-sm {
      padding: var(--space-2) var(--space-3);
      font-size: var(--text-xs);
      min-height: var(--min-height-xs);
    }

    .tab-button.size-lg {
      padding: var(--space-4) var(--space-6);
      font-size: var(--text-md);
      font-weight: var(--weight-semibold);
      min-height: var(--min-height-md);
    }

    /* Hover states */
    .tab-button:hover:not(.active) {
      color: var(--color-text-primary);
      transform: var(--transform-lift-xs);
    }

    .tab-button:hover:not(.active)::before {
      background: var(--color-surface-primary);
      box-shadow: var(--shadow-xs);
    }

    /* Active states */
    .tab-button.active {
      color: var(--color-text-inverse);
      font-weight: var(--weight-semibold);
    }

    .tab-button.active::before {
      background: var(--color-primary-main);
      box-shadow: var(--shadow-sm);
    }

    /* Active hover state - must come after active to ensure proper cascade */
    .tab-button.active:hover {
      color: var(--color-text-inverse);
      transform: var(--transform-lift-sm);
    }

    .tab-button.active:hover::before {
      background: var(--color-hover);
      box-shadow: var(--shadow-md);
    }

    /* Focus states */
    .tab-button:focus-visible {
      outline: none;
      box-shadow: var(--shadow-focus);
    }

    /* Variant: underline */
    .tabs-header.variant-underline {
      background: transparent;
      border: none;
      padding: 0;
      gap: var(--space-6);
    }

    .variant-underline .tab-button {
      border-radius: 0;
      padding: var(--space-3) var(--space-1);
      margin-bottom: var(--space-1);
      background: transparent;
      color: var(--color-text-secondary);
      font-weight: var(--weight-medium);
    }

    .variant-underline .tab-button::before {
      display: none;
    }

    .variant-underline .tab-button:hover:not(.active) {
      color: var(--color-text-primary);
      background: transparent;
      transform: none;
    }

    .variant-underline .tab-button.active {
      color: var(--color-primary-main);
      background: transparent;
      box-shadow: none;
      font-weight: var(--weight-semibold);
    }

    .variant-underline .tab-button.active::after {
      content: "";
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 3px;
      background: var(--color-primary-main);
      border-radius: var(--radius-full);
      animation: slideIn 0.3s var(--ease-out);
    }

    /* Vertical orientation */
    .tabs-header.vertical .tab-button {
      justify-content: flex-start;
      text-align: left;
      padding: var(--space-3) var(--space-4);
    }

    .tabs-header.vertical.variant-underline {
      gap: var(--space-4);
    }

    .tabs-header.vertical.variant-underline .tab-button.active::after {
      bottom: 0;
      top: 0;
      left: -1px;
      right: auto;
      width: 3px;
      height: 100%;
    }

    /* Content area */
    .tabs-content {
      padding: var(--space-6) 0;
      min-height: 200px;
      background: var(--color-surface-primary);
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border-primary);
      box-shadow: var(--shadow-sm);
    }

    .tabs-content.variant-underline {
      background: transparent;
      border: none;
      box-shadow: none;
      padding: var(--space-4) 0;
    }

    .tab-content {
      display: none;
      animation: fadeIn 0.3s var(--ease-out);
    }

    .tab-content.active {
      display: block;
    }

    /* Loading state */
    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-8);
      gap: var(--space-4);
      color: var(--color-text-secondary);
    }

    .loading-spinner {
      width: 32px;
      height: 32px;
      border: 3px solid var(--color-border-primary);
      border-top: 3px solid var(--color-primary-main);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .loading-text {
      font-size: var(--text-sm);
      font-weight: var(--weight-medium);
    }

    /* Empty state */
    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-8);
      gap: var(--space-4);
      color: var(--color-text-tertiary);
      text-align: center;
    }

    .empty-icon {
      font-size: var(--icon-xl);
      opacity: 0.5;
    }

    .empty-title {
      font-size: var(--text-lg);
      font-weight: var(--weight-semibold);
      color: var(--color-text-secondary);
    }

    .empty-description {
      font-size: var(--text-sm);
      max-width: 300px;
    }

    /* Animations */
    @keyframes slideIn {
      from {
        transform: scaleX(0);
      }
      to {
        transform: scaleX(1);
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(var(--space-2));
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    /* Tab count indicator */
    .tab-count {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 20px;
      height: 20px;
      padding: 0 var(--space-1);
      background: var(--color-neutral-200);
      color: var(--color-text-secondary);
      font-size: var(--text-xs);
      font-weight: var(--weight-semibold);
      border-radius: var(--radius-full);
      margin-left: var(--space-1);
      transition: var(--transition-colors);
    }

    .tab-button:hover:not(.active) .tab-count {
      background: var(--color-neutral-300);
      color: var(--color-text-primary);
    }

    .tab-button.active .tab-count {
      background: rgba(255, 255, 255, 0.25);
      color: var(--color-text-inverse);
    }

    /* Disabled state */
    .tab-button:disabled {
      opacity: var(--opacity-50);
      cursor: not-allowed;
      transform: none;
      color: var(--color-text-tertiary);
    }

    .tab-button:disabled::before {
      background: transparent;
    }

    .tab-button:disabled:hover {
      transform: none;
      color: var(--color-text-tertiary);
    }

    .tab-button:disabled:hover::before {
      background: transparent;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    // Set first tab as active if none specified
    if (this.tabs.length > 0 && !this.activeTab) {
      this.activeTab = this.tabs[0].id || this.tabs[0].label || "0";
    }
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (
      changedProperties.has("tabs") &&
      this.tabs.length > 0 &&
      !this.activeTab
    ) {
      this.activeTab = this.tabs[0].id || this.tabs[0].label || "0";
    }
  }

  _handleTabClick(tabId, event) {
    event.preventDefault();
    if (this.activeTab !== tabId) {
      this.activeTab = tabId;
      this.dispatchEvent(
        new CustomEvent("tab-change", {
          detail: {
            tabId,
            tab: this.tabs.find((t) => (t.id || t.label) === tabId),
          },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  _getTabId(tab, index) {
    return tab.id || tab.label || index.toString();
  }

  _isTabActive(tab, index) {
    return this.activeTab === this._getTabId(tab, index);
  }

  render() {
    if (!this.tabs || this.tabs.length === 0) {
      return html`
        <div class="empty">
          <div class="empty-icon">📋</div>
          <div class="empty-title">No tabs available</div>
          <div class="empty-description">
            Add some tabs to get started with your content organization.
          </div>
        </div>
      `;
    }

    const headerClasses = [
      "tabs-header",
      `variant-${this.variant}`,
      this.orientation === "vertical" ? "vertical" : "",
    ]
      .filter(Boolean)
      .join(" ");

    const contentClasses = ["tabs-content", `variant-${this.variant}`]
      .filter(Boolean)
      .join(" ");

    return html`
      <div class="tabs-wrapper">
        <div class="${headerClasses}">
          ${this.tabs.map((tab, index) => {
            const tabId = this._getTabId(tab, index);
            const isActive = this._isTabActive(tab, index);
            const buttonClasses = [
              "tab-button",
              `size-${this.size}`,
              isActive ? "active" : "",
            ]
              .filter(Boolean)
              .join(" ");

            return html`
              <button
                class="${buttonClasses}"
                @click=${(e) => this._handleTabClick(tabId, e)}
                data-tab-id=${tabId}
                ?disabled=${tab.disabled}
              >
                ${tab.icon
                  ? html`<span class="tab-icon">${tab.icon}</span>`
                  : ""}
                <span class="tab-label"
                  >${tab.label || tab.title || `Tab ${index + 1}`}</span
                >
                ${tab.count !== undefined
                  ? html`<span class="tab-count">${tab.count}</span>`
                  : ""}
              </button>
            `;
          })}
        </div>

        <div class="${contentClasses}">
          ${this.tabs.map((tab, index) => {
            const tabId = this._getTabId(tab, index);
            const isActive = this._isTabActive(tab, index);
            return html`
              <div
                class="tab-content ${isActive ? "active" : ""}"
                data-tab-id=${tabId}
              >
                ${tab.loading
                  ? html`
                      <div class="loading">
                        <div class="loading-spinner"></div>
                        <div class="loading-text">
                          ${tab.loadingText || "Loading..."}
                        </div>
                      </div>
                    `
                  : tab.content
                  ? unsafeHTML(tab.content)
                  : tab.children || ""}
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }
}

customElements.define("ds-tabs", DSTabs);
