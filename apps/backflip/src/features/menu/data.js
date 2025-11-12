// Feature Data: menu
// Menu configuration and navigation data

export const MENU_CONFIG = {
  items: [
    { label: "Home", href: "#home", active: true },
    { label: "About", href: "#about" },
    { label: "Who We Are", href: "#who-are-we" },
    { label: "Our Films", href: "#films" },
    { label: "Featured Film", href: "#single-movie" },
    { label: "Contact", href: "#contact" },
  ],
};

export function getMenuConfig() {
  return MENU_CONFIG;
}

export function getMenuItems() {
  console.log("getMenuItems called, returning:", MENU_CONFIG.items);
  return MENU_CONFIG.items;
}
