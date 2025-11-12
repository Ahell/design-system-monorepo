// Feature Logic: menu
// Menu business logic and utilities

import { getMenuConfig, getMenuItems } from "./data.js";

/**
 * Initialize menu functionality
 */
export function initializeMenu() {
  console.log("🍔 Menu initialized");
}

/**
 * Handle menu item click
 * @param {Object} item - Menu item that was clicked
 */
export function handleMenuItemClick(item) {
  console.log(`Menu item clicked: ${item.label}`);

  // Update active state
  const items = getMenuItems();
  items.forEach((menuItem) => {
    menuItem.active = menuItem.label === item.label;
  });

  // Here you could add navigation logic, routing, etc.
}

/**
 * Get menu item styles based on state
 * @param {Object} item - Menu item
 * @returns {Object} Computed styles
 */
export function getMenuItemStyles(item) {
  return {
    color: item.active ? "var(--color-pure-black)" : "var(--color-pure-black)",
    opacity: item.active ? 1 : 0.7,
    textDecoration: item.active ? "underline" : "none",
  };
}
