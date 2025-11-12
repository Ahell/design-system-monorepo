// Backflip App - Main Entry Point
// Import the design system to register all custom elements
import "@ahell/design-system";

// Import Backflip features
import { BackflipHomepage } from "./features/homepage/index.js";
import { BackflipHero } from "./features/hero/index.js";
import { BackflipMenu } from "./features/menu/index.js";
import { BackflipAboutUs } from "./features/about-us/index.js";
import { BackflipWhoAreWe } from "./features/who-are-we/index.js";
import { BackflipRouter } from "./features/router/index.js";

// Components are now available globally as custom elements:
// <ds-alert>, <ds-button>, <ds-card>, <ds-input>, etc.
// Backflip features:
// <backflip-homepage>, <backflip-hero>, <backflip-menu>

// Add any Backflip-specific initialization here
console.log("🎪 Backflip app initialized with design system components!");
console.log(
  "🏠 Homepage, Hero, Menu, About Us, Who Are We, and Router features loaded"
);
