# 🎪 Backflip

A stunning demonstration app showcasing the design system's capabilities with custom theming and vibrant colors.

## Overview

Backflip is a demo application that highlights the design system's components with a custom "Backflip" theme featuring:

- **Vibrant Colors**: Orange primary, turquoise secondary, and purple accents
- **Enhanced Animations**: Smooth transitions and hover effects
- **Custom Components**: Extended styling for all design system components
- **Responsive Design**: Mobile-first approach with custom breakpoints

## Features

- **Component Showcase**: All design system components with Backflip theming
- **Interactive Demos**: Buttons, forms, alerts, and data display components
- **Custom Tokens**: Extended CSS custom properties for enhanced theming
- **Responsive Layout**: Grid-based layout that adapts to different screen sizes

## Development

### Running the App

```bash
# From the monorepo root
pnpm dev:backflip

# Or directly from the app directory
cd apps/backflip
pnpm dev
```

The app will be available at `http://localhost:3020`

### Project Structure

```
apps/backflip/
├── index.html          # Main HTML entry point
├── package.json        # App dependencies and scripts
├── vite.config.js      # Vite configuration
├── README.md          # This file
└── src/
    ├── main.js        # JavaScript entry point
    └── tokens/        # Custom Backflip theming
        ├── index.css  # Token imports and overrides
        ├── theme.css  # Component-specific styling
        └── tokens.css # Additional custom properties
```

## Theming

Backflip extends the design system with custom tokens:

### Color Palette

- **Primary**: Vibrant orange (#ff6b35)
- **Secondary**: Turquoise (#4ecdc4)
- **Accent**: Purple (#9b59b6)
- **Success/Warning/Error**: Custom shades with Backflip twists

### Custom Properties

Backflip adds additional CSS custom properties for:

- Extended spacing scales
- Custom border radius values
- Enhanced shadow definitions
- Animation timings
- Z-index layers
- Responsive breakpoints

## Integration with Design System

Backflip demonstrates best practices for extending the design system:

1. **Import Base Tokens**: Load design system tokens first
2. **Override Selectively**: Only override colors and properties that need customization
3. **Extend Components**: Add custom styling without breaking core functionality
4. **Maintain Consistency**: Keep the same component APIs and behaviors

## Dependencies

- `@ahell/design-system`: Core design system components and tokens
- `vite`: Development server and build tool

## Browser Support

Backflip supports all modern browsers that the design system supports, including:

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
