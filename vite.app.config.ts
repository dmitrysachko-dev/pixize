import { cpSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import electron from 'vite-plugin-electron/simple'

const appRoot = resolve(__dirname, 'app')
const appOutDir = resolve(__dirname, 'dist-app')
const electronOutDir = resolve(appOutDir, 'dist-electron')
const iconSourceDir = resolve(appRoot, 'build')
const iconOutDir = resolve(appOutDir, 'build')

function copyAppIcons(): Plugin {
  const copy = () => {
    if (!existsSync(iconSourceDir)) return
    cpSync(iconSourceDir, iconOutDir, { recursive: true })
  }

  return {
    name: 'copy-app-icons',
    buildStart() {
      copy()
    },
    closeBundle() {
      copy()
    },
  }
}

export default defineConfig({
  root: appRoot,
  plugins: [
    copyAppIcons(),
    electron({
      main: {
        entry: resolve(appRoot, 'electron/main.ts'),
        vite: {
          build: {
            outDir: electronOutDir,
            emptyOutDir: true,
          },
        },
      },
      preload: {
        input: resolve(appRoot, 'electron/preload.ts'),
        vite: {
          build: {
            outDir: electronOutDir,
            emptyOutDir: false,
          },
        },
      },
      renderer: {},
    }),
  ],
  build: {
    outDir: appOutDir,
    emptyOutDir: true,
    assetsInlineLimit: 0,
    modulePreload: { polyfill: false },
    target: 'chrome128',
    sourcemap: false,
    cssMinify: 'lightningcss',
  },
})
