# Design System Monorepo

A hybrid design system setup that supports both rapid development and stable production deployments.

## 🧭 Hybrid Development Model

### Development Phase

- Apps use `workspace:*` to link directly to the local design system
- Changes in design system are reflected immediately in apps
- Perfect for rapid iteration and component development

### Production Phase

- Design system is published to npm/GitHub Packages
- Apps lock to specific versions (e.g., `^1.2.0`)
- Stable, predictable deployments

## 📁 Structure

```
design-system-workspace/
├── .npmrc                    # GitHub Packages config
├── package.json             # Root workspace config
├── design-system/           # Design system package
│   ├── package.json
│   ├── vite.config.js
│   ├── tokens/             # CSS design tokens
│   ├── primitives/         # UI components
│   ├── layout/             # Layout components
│   ├── patterns/           # Composite patterns
│   └── dist/               # Built files (published)
└── apps/
    └── web-app/            # Example application
        ├── package.json
        ├── index.html
        └── src/
```

## 🚀 Quick Start

```bash
# Install all dependencies
npm run install:all

# Develop design system
npm run dev:ds

# Develop web app (in another terminal)
npm run dev:web
```

## 🔄 Publishing Workflow

### 1. Make changes to design system

```bash
cd design-system
# Edit components, update tokens, etc.
```

### 2. Test locally

```bash
npm run dev  # Test design system
cd ../apps/web-app
npm run dev  # Test in app
```

### 3. Build for production

```bash
cd ../design-system
npm run build
```

### 4. Version and publish

```bash
npm version patch  # or minor/major
npm publish --registry=https://npm.pkg.github.com
```

### 5. Update apps to use published version

```json
// In apps/web-app/package.json
{
  "dependencies": {
    "@yourorg/design-system": "^1.2.0" // Instead of "workspace:*"
  }
}
```

## 🧰 Available Scripts

### Root workspace

- `npm run install:all` - Install all workspace dependencies
- `npm run dev:ds` - Develop design system
- `npm run dev:web` - Develop web app
- `npm run build:ds` - Build design system

### Design system

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview built version

### Apps

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview built version

## 📦 Publishing to GitHub Packages

1. Create a GitHub Personal Access Token with `packages:write` permission
2. Set `GITHUB_TOKEN` environment variable
3. Run `npm publish --registry=https://npm.pkg.github.com`

## 🔗 Temporary Local Linking

If an app uses a published version but you need to test local changes:

```bash
cd design-system && npm link
cd ../apps/web-app && npm link @yourorg/design-system
# Test your changes...
cd ../apps/web-app && npm unlink @yourorg/design-system && npm install
```

## ✨ Benefits

- **Rapid Development**: Direct local linking during development
- **Stable Production**: Versioned releases for production apps
- **Flexible Deployment**: Mix published and local versions per app
- **Single Repository**: Everything in one place with proper tooling
- **No Extra Tools**: Works with standard npm workspaces
