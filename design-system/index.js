/**
 * Design System - Main Export
 *
 * Import all design system components to register custom elements.
 * Usage: import './design-system/index.js';
 */

// Import all primitives (this registers custom elements)
import "./primitives/ds-alert.js";
import "./primitives/ds-badge.js";
import "./primitives/ds-button.js";
import "./primitives/ds-card.js";
import "./primitives/ds-card-header.js";
import "./primitives/ds-card-footer.js";
import "./primitives/ds-card-content.js";
import "./primitives/ds-checkbox.js";
import "./primitives/ds-input.js";
import "./primitives/ds-radio.js";
import "./primitives/ds-radio-group.js";
import "./primitives/ds-select.js";
import "./primitives/ds-sidebar-menu.js";
import "./primitives/ds-tabs.js";
import "./primitives/ds-textarea.js";
import "./primitives/ds-table.js";
import "./primitives/ds-stat-card.js";
import "./primitives/ds-expandable-details.js";

// Import layout components
import "./layout/ds-container.js";
import "./layout/ds-stack.js";
import "./layout/ds-grid.js";
import "./layout/ds-inline.js";
import "./layout/ds-flex.js";

// Import patterns
import "./patterns/ds-hero.js";
import "./patterns/ds-feature-grid.js";
import "./patterns/ds-two-column.js";
import "./patterns/ds-cta.js";
import "./patterns/ds-footer.js";

// Also export classes for programmatic use
export { DSAlert } from "./primitives/ds-alert.js";
export { DSBadge } from "./primitives/ds-badge.js";
export { DSButton } from "./primitives/ds-button.js";
export { DSCard } from "./primitives/ds-card.js";
export { CardHeader } from "./primitives/ds-card-header.js";
export { CardFooter } from "./primitives/ds-card-footer.js";
export { DSCardContent } from "./primitives/ds-card-content.js";
export { DSCheckbox } from "./primitives/ds-checkbox.js";
export { DSInput } from "./primitives/ds-input.js";
export { DSRadio } from "./primitives/ds-radio.js";
export { DSRadioGroup } from "./primitives/ds-radio-group.js";
export { DSSelect } from "./primitives/ds-select.js";
export { DSSidebarMenu } from "./primitives/ds-sidebar-menu.js";
export { DSTabs } from "./primitives/ds-tabs.js";
export { DSTextarea } from "./primitives/ds-textarea.js";
export { DataTable } from "./primitives/ds-table.js";
export { DSStatCard } from "./primitives/ds-stat-card.js";
export { DSExpandableDetails } from "./primitives/ds-expandable-details.js";
export { DSContainer } from "./layout/ds-container.js";
export { DSStack } from "./layout/ds-stack.js";
export { DSGrid } from "./layout/ds-grid.js";
export { DSInline } from "./layout/ds-inline.js";
export { DSFlex } from "./layout/ds-flex.js";
export { DSHero } from "./patterns/ds-hero.js";
export { DSFeatureGrid } from "./patterns/ds-feature-grid.js";
export { DSTwoColumn } from "./patterns/ds-two-column.js";
export { DSCTA } from "./patterns/ds-cta.js";
export { DSFooter } from "./patterns/ds-footer.js";
