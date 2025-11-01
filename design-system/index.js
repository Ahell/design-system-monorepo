/**
 * Design System - Main Export
 *
 * Import all design system components to register custom elements.
 * Usage: import './design-system/index.js';
 */

// Import all primitives (this registers custom elements)
export * from "./primitives/index.js";

// Import layout components
import "./layout/ds-container.js";
import "./layout/ds-stack.js";
import "./layout/ds-grid.js";

// Import patterns
import "./patterns/ds-hero.js";
import "./patterns/ds-feature-grid.js";
import "./patterns/ds-two-column.js";
import "./patterns/ds-cta.js";

// Also export layout and pattern classes for programmatic use
export { DSContainer } from "./layout/ds-container.js";
export { DSStack } from "./layout/ds-stack.js";
export { DSGrid } from "./layout/ds-grid.js";
export { DSHero } from "./patterns/ds-hero.js";
export { DSFeatureGrid } from "./patterns/ds-feature-grid.js";
export { DSTwoColumn } from "./patterns/ds-two-column.js";
export { DSCTA } from "./patterns/ds-cta.js";
