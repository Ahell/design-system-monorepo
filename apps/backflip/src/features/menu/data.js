// Feature Data: menu
// Menu configuration and navigation data

export const MENU_CONFIG = {
  items: [
    { label: "Home", href: "#home", active: true },
    { label: "About", href: "#about" },
    { label: "Who", href: "#who-are-we" },
    { label: "Services", href: "#services" },
    { label: "Contact", href: "#contact" },
  ],
};

export function getMenuConfig() {
  return MENU_CONFIG;
}

export function getMenuItems() {
  return MENU_CONFIG.items;
}
