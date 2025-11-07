# Design System Monorepo

A pnpm workspace monorepo containing a design system and multiple apps that consume it.

## 📁 Structure

```
design-system-monorepo/
├── package.json             # Root workspace config
├── pnpm-workspace.yaml      # Workspace definition
├── design-system/           # Design system source (no build needed for dev)
│   ├── package.json         # Points to source files (./index.js)
│   ├── vite.config.js       # Only for production builds
│   ├── tokens/              # CSS design tokens
│   ├── primitives/          # UI components
│   ├── layout/              # Layout components
│   └── patterns/            # Composite patterns
└── apps/
    ├── web-app/             # Design system showcase (port 3000)
    ├── test-app/            # Testing app (port 3002)
    └── student-groups-app/  # Canvas LMS integration
        ├── src/             # Frontend (port 3015)
        └── backend/         # API proxy (port 3001)
```

## 🚀 Quick Start

```bash
# Install all dependencies
pnpm install

# Run specific app
pnpm --filter web-app dev              # Port 3000
pnpm --filter test-app dev             # Port 3002
pnpm --filter student-groups-app dev   # Port 3015
```

## � Development Workflow

### Working on Design System

All apps use `workspace:*` dependency which points to **live source files**:

- Changes to design system are reflected immediately
- No build step needed during development
- Hot module reloading works across workspace

### Port Assignments

- `web-app`: 3000
- `test-app`: 3002
- `student-groups-app` frontend: 3015
- `student-groups-app` backend: 3001

## 📦 Apps

### web-app

Interactive showcase of all design system components.

### test-app

Testing ground for design system features.

### student-groups-app

Canvas LMS integration displaying student groups in data tables with advanced features:

- Backend Express.js proxy for Canvas API
- Frontend with Lit components
- Enhanced ds-table with sorting, selection, actions, loading states

See [student-groups-app README](apps/student-groups-app/README.md) for details.

## 🧰 Available Scripts

### Root

- `pnpm dev:web` - Start web-app showcase
- `pnpm dev:test` - Start test-app
- `pnpm dev:student-groups` - Start student-groups-app frontend only
- `pnpm dev:student-groups-backend` - Start student-groups-app backend
- `pnpm build:ds` - Build design system for production (creates dist/)

### Design System

- `pnpm build` - Build for production/publishing

### Apps

Each app has:

- `pnpm dev` - Start development server
- `pnpm build` - Build for production

## 🔗 Workspace Dependencies

Apps use `workspace:*` to consume the design system during development:

```json
{
  "dependencies": {
    "@ahell/design-system": "workspace:*"
  }
}
```

This links directly to source files (not dist/), enabling instant updates.

## ✨ Key Features

- **Zero Build Step**: Design system source files used directly during development
- **Hot Module Reload**: Changes propagate instantly across workspace
- **Simple Setup**: Standard pnpm workspaces, no custom tooling
- **Vite-Powered**: Fast dev servers for all apps
- **Monorepo Benefits**: Shared dependencies, unified tooling
