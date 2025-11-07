# Design System Test App

A test application for the `@ahell/design-system` package using live workspace source files.

## Purpose

This app serves as a testing ground for:

- Design system component integration
- New features before adding to showcase
- Bug reproduction and fixes

## Features Tested

- ✅ Alert components (info, success, warning, error variants)
- ✅ Button components (default, primary, secondary, outline variants)
- ✅ Card component with slots
- ✅ Input component with labels
- ✅ CSS token imports

## Running the App

```bash
pnpm dev
```

The app will be available at `http://localhost:3002/`

## Package Configuration

This app uses the design system from the workspace:

```json
{
  "dependencies": {
    "@ahell/design-system": "workspace:*"
  }
}
```

This links directly to the source files in `../../design-system/`, so changes are reflected immediately during development.

## Comparison with Other Apps

- **web-app**: Full showcase of all components
- **test-app**: Quick testing environment (this app)
- **student-groups-app**: Real-world application with Canvas LMS integration
