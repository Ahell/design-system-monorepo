# Design System Showcase

An interactive showcase of all design system components, similar to Storybook but built with the design system itself.

## Features

- **Interactive Components**: See all components with different variants and states
- **Code Examples**: Copy-paste ready HTML snippets for each component
- **Live Preview**: Changes reflect immediately during development
- **Comprehensive Coverage**: All primitives, layouts, and patterns included

## Available Components

### Primitives
- **Alert**: Info, success, warning, error variants with dismissible option
- **Button**: Primary, secondary, outline, ghost variants with disabled state
- **Badge**: Default, success, warning, error variants
- **Input**: Text, email, password types with labels and disabled state
- **Card**: Header, content, footer sections

### Layout
- **Container**: Small, medium, large responsive containers
- **Stack**: Vertical spacing with configurable gaps
- **Grid**: Coming soon

### Patterns
- **Hero**: Large banner sections for landing pages
- **CTA**: Call-to-action sections
- **Feature Grid**: Coming soon
- **Two Column**: Coming soon

## Development

```bash
# Start the showcase
npm run dev

# Open http://localhost:5173 in your browser
```

## Usage in Your Apps

After exploring the showcase, use components in your applications:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="stylesheet" href="../design-system/tokens/index.css">
</head>
<body>
  <ds-container size="lg">
    <ds-alert variant="success" title="Welcome!">
      Your app is ready.
    </ds-alert>
    <ds-button variant="primary">Get Started</ds-button>
  </ds-container>

  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

```javascript
// src/main.js
import '@yourorg/design-system';
```

## Adding New Components

1. Create component in appropriate folder (`primitives/`, `layout/`, `patterns/`)
2. Export from `primitives/index.js` or main `index.js`
3. Add showcase examples to `index.html`
4. Test with `npm run dev`

This showcase serves as both documentation and testing ground for your design system! 🎨