// Feature Logic: menu
// Menu business logic and utilities

import { getMenuConfig, getMenuItems } from "./data.js";

// Current page state
let currentPage = 'home';

/**
 * Initialize menu functionality
 */
export function initializeMenu() {
  console.log("🍔 Menu initialized");
  
  // Set initial page from URL hash or default to home
  const hash = window.location.hash.substring(1) || 'home';
  setCurrentPage(hash);
}

/**
 * Handle menu item click
 * @param {Object} item - Menu item that was clicked
 */
export function handleMenuItemClick(item) {
  console.log(`Menu item clicked: ${item.label}`);

  // Extract page from href (remove #)
  const page = item.href.substring(1);
  
  // Update URL hash
  window.location.hash = page;
  
  // Set current page
  setCurrentPage(page);

  // Update active state
  const items = getMenuItems();
  items.forEach((menuItem) => {
    menuItem.active = menuItem.label === item.label;
  });

  // Dispatch custom event for page changes
  window.dispatchEvent(new CustomEvent('pagechange', { 
    detail: { page, item } 
  }));
}

/**
 * Set the current page
 * @param {string} page - Page identifier
 */
export function setCurrentPage(page) {
  currentPage = page;
}

/**
 * Get the current page
 * @returns {string} Current page identifier
 */
export function getCurrentPage() {
  return currentPage;
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
