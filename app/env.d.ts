/// <reference types="vite/client" />

import type { TElectronAPI } from './src/types'

declare global {
  interface Window {
    electronAPI: TElectronAPI
  }
}

export {}
