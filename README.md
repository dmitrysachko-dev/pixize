# Pixize

Pixize is a free, open-source macOS app with an on-screen pixel ruler. It helps designers, frontend developers, and QA engineers quickly verify spacing, sizes, and alignment of UI elements directly over any window.

## Features

- Horizontal and vertical rulers overlaid on screen
- Exact pixel values
- Always-on-top mode
- Keyboard control (move, resize, toggle rulers)
- Works offline after installation

## Repository structure

```
pixize/
├── app/          # Electron app (renderer + main/preload)
├── landing/      # Vue 3 landing page
├── dist-app/     # App build output (generated)
├── dist/         # Landing build output (generated)
└── release/      # Packaged distributables (generated)
```

## Requirements

- [Node.js](https://nodejs.org/) 18 or newer
- npm

## Install dependencies

```bash
npm install
```

## Build and run

The repository contains two independent modules: the desktop app and the landing page.

### Desktop app (Electron)

**Development mode** — starts the Vite dev server and Electron with hot reload:

```bash
npm run dev:app
```

**Build** — compiles TypeScript and bundles the renderer plus Electron main/preload into `dist-app/`:

```bash
npm run build:app
```

**Run the built app:**

```bash
npm run start:app
```

**Create a distributable** — builds the app and packages it with electron-builder into `release/` (DMG/ZIP for macOS, NSIS for Windows, AppImage for Linux):

```bash
npm run dist:app
```

### Landing page (Vue 3)

**Development mode:**

```bash
npm run dev:landing
```

**Build** — output goes to `dist/`:

```bash
npm run build:landing
```

**Preview the production build:**

```bash
npm run preview:landing
```

**Deploy to GitHub Pages:**

```bash
npm run deploy
```

## Keyboard shortcuts

| Action | Shortcut |
|--------|----------|
| Horizontal ruler | ⌘ + X |
| Vertical ruler | ⌘ + Y |
| Corner rails | ⌘ + R |
| Always on top | ⌘ + T |
| Move by 1 px | ↑ ↓ ← → |
| Move by 5 px | ⇧ + arrow keys |
| Resize by 1 px | ⌘ + arrow keys |
| Resize by 5 px | ⌘ + ⇧ + arrow keys |

## Links

- [Releases and downloads](https://github.com/dmitrysachko-dev/pixize/releases)
- [GitHub repository](https://github.com/dmitrysachko-dev/pixize)
- [Web page](https://dmitrysachko-dev.github.io/pixize/)
