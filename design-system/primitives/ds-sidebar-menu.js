/**
 * Design System Sidebar Menu Component
 *
 * A professional sidebar menu with darker tone for navigation.
 * Supports menu items with icons, labels, and click handlers.
 */

import { LitElement, html, css } from "lit";

export class DSSidebarMenu extends LitElement {
  static properties = {
    items: { type: Array },
    activeItem: { type: String },
    collapsed: { type: Boolean },
    expandedItems: { type: Object },
    logo: { type: String },
    logoText: { type: String },
  };

  constructor() {
    super();
    this.items = [];
    this.activeItem = "";
    this.collapsed = false;
    this.expandedItems = {};
    this.logo = "";
    this.logoText = "";
    console.log("DSSidebarMenu constructor called");
  }

  static styles = css`
    :host {
      display: block;
      background: linear-gradient(180deg, #1a1d24 0%, #0f1117 100%);
      border-right: 1px solid rgba(255, 255, 255, 0.06);
      height: 100vh;
      overflow: hidden;
      transition: width 0.3s ease;
      box-shadow: var(--shadow-lg);
    }

    :host([collapsed]) {
      width: 60px;
    }

    .logo-container {
      padding: var(--space-6) var(--space-2) var(--space-6) var(--space-6);
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      display: flex;
      align-items: center;
      gap: var(--space-3);
      margin-bottom: var(--space-4);
    }

    .logo-container img {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
    }

    .logo-text {
      font-size: var(--text-lg);
      font-weight: var(--weight-bold);
      font-family: var(--font-sans);
      color: rgba(255, 255, 255, 0.95);
      letter-spacing: -0.5px;
    }

    :host([collapsed]) .logo-container {
      padding: var(--space-4);
      justify-content: center;
    }

    :host([collapsed]) .logo-text {
      display: none;
    }

    .menu-container {
      padding: var(--space-6) 0;
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }

    :host([collapsed]) .menu-container {
      padding: var(--space-4) var(--space-2);
      align-items: center;
    }

    .menu-item {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-2) var(--space-3) var(--space-6);
      border-radius: 0;
      cursor: pointer;
      transition: var(--transition-normal);
      color: rgba(255, 255, 255, 0.75);
      text-decoration: none;
      border: none;
      border-left: 3px solid transparent;
      background: transparent;
      width: 100%;
      text-align: left;
      font-size: var(--text-sm);
      font-weight: var(--weight-medium);
      position: relative;
      overflow: hidden;
    }

    .menu-item:hover {
      background: rgba(255, 255, 255, 0.06);
      color: rgba(255, 255, 255, 0.95);
      transform: none;
    }

    .menu-item.active {
      background: rgba(76, 132, 141, 0.12);
      color: rgba(255, 255, 255, 0.85);
      border-left-color: var(--color-primary-main);
      font-weight: var(--weight-semibold);
    }

    .menu-item .icon {
      display: none;
    }

    .menu-item .label {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    :host([collapsed]) .menu-item .label {
      display: none;
    }

    :host([collapsed]) .menu-item::after {
      display: none;
    }

    :host([collapsed]) .menu-item::before {
      display: none;
    }

    :host([collapsed]) .menu-item {
      justify-content: center;
      padding: var(--space-3);
      border-left: none;
    }

    .menu-item .badge {
      background: var(--color-primary-main);
      color: var(--color-text-inverse);
      font-size: var(--text-xs);
      font-weight: var(--weight-semibold);
      padding: 2px 8px;
      border-radius: var(--radius-full);
      min-width: 20px;
      text-align: center;
      box-shadow: var(--shadow-sm);
    }

    .divider {
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.08) 50%,
        transparent 100%
      );
      margin: var(--space-5) 0;
      border: none;
    }

    :host([collapsed]) .divider {
      margin: var(--space-3) 0;
    }

    .menu-section {
      margin-bottom: var(--space-5);
    }

    .menu-section:last-child {
      margin-bottom: 0;
    }

    .submenu {
      overflow-y: auto;
      overflow-x: hidden;
      transition: max-height var(--transition-normal);
      max-height: 0;
    }

    .submenu.expanded {
      max-height: 200px;
    }

    .submenu::-webkit-scrollbar {
      width: 4px;
    }

    .submenu::-webkit-scrollbar-track {
      background: transparent;
    }

    .submenu::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 2px;
    }

    .submenu::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .submenu-item {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-2) var(--space-2) var(--space-2) var(--space-6);
      cursor: pointer;
      transition: var(--transition-normal);
      color: rgba(255, 255, 255, 0.65);
      text-decoration: none;
      background: transparent;
      width: 100%;
      text-align: left;
      font-size: var(--text-sm);
      font-weight: var(--weight-normal);
      border: none;
      border-left: 3px solid transparent;
    }

    .submenu-item .icon {
      display: none;
    }

    .submenu-item:hover {
      background: rgba(255, 255, 255, 0.04);
      color: rgba(255, 255, 255, 0.85);
    }

    .submenu-item.active {
      color: rgba(255, 255, 255, 0.85);
      border-left-color: var(--color-primary-main);
      font-weight: var(--weight-medium);
    }

    .section-title {
      font-size: var(--text-xs);
      font-weight: var(--weight-bold);
      color: rgba(255, 255, 255, 0.5);
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: var(--space-3) var(--space-6);
      margin-bottom: var(--space-2);
      margin-top: var(--space-4);
    }

    :host([collapsed]) .section-title {
      display: none;
    }

    /* Custom scrollbar for dark theme */
    :host::-webkit-scrollbar {
      display: none;
    }
  `;

  _handleItemClick(item, event) {
    event.preventDefault();

    if (item.disabled) return;

    // If item has submenu, toggle expansion
    if (item.submenu && item.submenu.length > 0) {
      this._toggleSubmenu(item.id);
      return;
    }

    this.activeItem = item.id;

    // Dispatch custom event
    this.dispatchEvent(
      new CustomEvent("menu-item-click", {
        detail: {
          item: item,
          id: item.id,
        },
        bubbles: true,
        composed: true,
      })
    );

    // Call click handler if provided
    if (item.onClick) {
      item.onClick(item);
    }
  }

  _toggleSubmenu(itemId) {
    this.expandedItems = {
      ...this.expandedItems,
      [itemId]: !this.expandedItems[itemId],
    };
  }

  _handleSubmenuItemClick(parentItem, subItem, event) {
    event.preventDefault();
    event.stopPropagation();

    if (subItem.disabled) return;

    this.activeItem = subItem.id;

    // Dispatch custom event
    this.dispatchEvent(
      new CustomEvent("menu-item-click", {
        detail: {
          item: subItem,
          parentItem: parentItem,
          id: subItem.id,
        },
        bubbles: true,
        composed: true,
      })
    );

    // Call click handler if provided
    if (subItem.onClick) {
      subItem.onClick(subItem);
    }
  }

  _toggleCollapsed() {
    this.collapsed = !this.collapsed;
    this.dispatchEvent(
      new CustomEvent("menu-toggle", {
        detail: { collapsed: this.collapsed },
        bubbles: true,
        composed: true,
      })
    );
  }

  _renderMenuItem(item) {
    const isActive = this.activeItem === item.id;
    const isExpanded = this.expandedItems[item.id];
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const classes = `menu-item ${isActive ? "active" : ""} ${
      item.disabled ? "disabled" : ""
    } ${isExpanded ? "expanded" : ""} ${!hasSubmenu ? "no-submenu" : ""}`;

    return html`
      <button
        class=${classes}
        ?disabled=${item.disabled}
        @click=${(e) => this._handleItemClick(item, e)}
      >
        ${item.icon ? html`<span class="icon">${item.icon}</span>` : ""}
        <span class="label">${item.label}</span>
        ${item.badge ? html`<span class="badge">${item.badge}</span>` : ""}
      </button>
      ${hasSubmenu
        ? html`
            <div class="submenu ${isExpanded ? "expanded" : ""}">
              ${item.submenu.map((subItem) =>
                this._renderSubmenuItem(item, subItem)
              )}
            </div>
          `
        : ""}
    `;
  }

  _renderSubmenuItem(parentItem, subItem) {
    const isActive = this.activeItem === subItem.id;
    const classes = `submenu-item ${isActive ? "active" : ""} ${
      subItem.disabled ? "disabled" : ""
    }`;

    return html`
      <button
        class=${classes}
        ?disabled=${subItem.disabled}
        @click=${(e) => this._handleSubmenuItemClick(parentItem, subItem, e)}
      >
        ${subItem.icon ? html`<span class="icon">${subItem.icon}</span>` : ""}
        <span class="label">${subItem.label}</span>
        ${subItem.badge
          ? html`<span class="badge">${subItem.badge}</span>`
          : ""}
      </button>
    `;
  }

  _renderMenuSection(section) {
    return html`
      <div class="menu-section">
        ${section.title
          ? html`<div class="section-title">${section.title}</div>`
          : ""}
        ${section.items.map((item) => this._renderMenuItem(item))}
      </div>
    `;
  }

  render() {
    console.log("DSSidebarMenu render called with items:", this.items);

    // Group items by sections if they have section property
    const sections = this.items.reduce((acc, item) => {
      const sectionKey = item.section || "main";
      if (!acc[sectionKey]) {
        acc[sectionKey] = {
          title: item.section,
          items: [],
        };
      }
      acc[sectionKey].items.push(item);
      return acc;
    }, {});

    const sectionArray = Object.values(sections);
    console.log("Section array:", sectionArray);

    return html`
      <div style="position: relative;">
        ${this.logo || this.logoText
          ? html`
              <div class="logo-container">
                ${this.logo ? html`<img src=${this.logo} alt="Logo" />` : ""}
                ${this.logoText
                  ? html`<span class="logo-text">${this.logoText}</span>`
                  : ""}
              </div>
            `
          : ""}

        <div class="menu-container">
          ${sectionArray.map(
            (section, index) => html`
              ${this._renderMenuSection(section)}
              ${index < sectionArray.length - 1
                ? html`<hr class="divider" />`
                : ""}
            `
          )}
        </div>
      </div>
    `;
  }
}

customElements.define("ds-sidebar-menu", DSSidebarMenu);
