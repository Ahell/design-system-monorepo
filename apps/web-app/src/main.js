import "@yourorg/design-system";
import "@yourorg/design-system/tokens";

// Debug: Check if components are registered
console.log("App loaded with design system");
console.log("ds-alert registered:", customElements.get("ds-alert"));
console.log("ds-button registered:", customElements.get("ds-button"));
console.log("ds-badge registered:", customElements.get("ds-badge"));
console.log("ds-input registered:", customElements.get("ds-input"));
console.log("ds-card registered:", customElements.get("ds-card"));
console.log("ds-container registered:", customElements.get("ds-container"));

// Test component creation
setTimeout(() => {
  const testAlert = document.createElement("ds-alert");
  testAlert.setAttribute("variant", "info");
  testAlert.setAttribute("title", "Test");
  testAlert.textContent = "Test content";
  console.log("Test alert element:", testAlert);
  console.log("Test alert shadow root:", testAlert.shadowRoot);
}, 1000);
