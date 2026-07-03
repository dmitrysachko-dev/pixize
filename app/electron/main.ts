import { app, BrowserWindow, ipcMain, Menu, nativeImage, screen } from 'electron'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import type { TSettings } from '../src/types'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '..')

const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL
const RENDERER_DIST = process.env.APP_ROOT

let mainWindow: BrowserWindow | null = null

function resolveIconPath(): string | undefined {
  const names = process.platform === 'win32'
    ? ['icon.ico', 'icon.png']
    : ['icon.png', 'icon.ico']

  const bases = [
    path.join(__dirname, '..', 'build'),
    path.join(__dirname, '../../app/build'),
    path.join(process.resourcesPath, 'build'),
  ]

  for (const base of bases) {
    for (const name of names) {
      const iconPath = path.join(base, name)
      if (existsSync(iconPath)) return iconPath
    }
  }

  return undefined
}

const iconPath = resolveIconPath()

function setAppIcon() {
  if (!iconPath) return

  const icon = nativeImage.createFromPath(iconPath)
  if (icon.isEmpty()) return

  if (process.platform === 'darwin') {
    app.dock?.setIcon(icon)
  }
}

// App menu
const appMenu = Menu.buildFromTemplate([
  {
    label: 'Pixize',
    submenu: [
      {
        label: 'Hide',
        role: 'hide'
      },
      {
        label: 'Close',
        role: 'close'
      },
      { type: 'separator' },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click: () => app.quit()
      }
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Ruler X',
        accelerator: 'Command+X',
        type: 'checkbox',
        checked: false,
        enabled: false,
        click: (menuItem) => {
          mainWindow?.webContents.send('toggle-ruler-x', menuItem.checked)
        }
      },
      {
        label: 'Ruler Y',
        accelerator: 'Command+Y',
        type: 'checkbox',
        checked: false,
        enabled: false,
        click: (menuItem) => {
          mainWindow?.webContents.send('toggle-ruler-y', menuItem.checked)
        }
      },
      {
        label: 'Rails',
        accelerator: 'Command+R',
        type: 'checkbox',
        checked: false,
        enabled: false,
        click: (menuItem) => {
          mainWindow?.webContents.send('toggle-rails', menuItem.checked)
        }
      },
      { type: 'separator' },
      {
        label: 'Always On Top',
        accelerator: 'Command+T',
        type: 'checkbox',
        checked: false,
        enabled: false,
        click: (menuItem) => {
          mainWindow?.webContents.send('toggle-always-on-top', menuItem.checked)
        }
      }
    ]
  },
  {
    label: 'Color Scheme',
    submenu: [
      {
        id: '1',
        label: 'Olive Tree',
        type: 'radio',
        checked: false,
        enabled: false,
        click: (menuItem) => {
          mainWindow?.webContents.send('change-scheme', +menuItem.id)
        }
      },
      {
        id: '2',
        label: 'Aqua Blues',
        type: 'radio',
        checked: false,
        enabled: false,
        click: (menuItem) => {
          mainWindow?.webContents.send('change-scheme', +menuItem.id)
        }
      },
      {
        id: '3',
        label: 'Cosmopolitan',
        type: 'radio',
        checked: false,
        enabled: false,
        click: (menuItem) => {
          mainWindow?.webContents.send('change-scheme', +menuItem.id)
        }
      },
      {
        id: '4',
        label: 'Hazy Grays',
        type: 'radio',
        checked: false,
        enabled: false,
        click: (menuItem) => {
          mainWindow?.webContents.send('change-scheme', +menuItem.id)
        }
      },
      {
        id: '5',
        label: 'Smoky Purples',
        type: 'radio',
        checked: false,
        enabled: false,
        click: (menuItem) => {
          mainWindow?.webContents.send('change-scheme', +menuItem.id)
        }
      },
      {
        id: '6',
        label: 'Subdued',
        type: 'radio',
        checked: false,
        enabled: false,
        click: (menuItem) => {
          mainWindow?.webContents.send('change-scheme', +menuItem.id)
        }
      },
      {
        id: '7',
        label: 'Berry Blues',
        type: 'radio',
        checked: false,
        enabled: false,
        click: (menuItem) => {
          mainWindow?.webContents.send('change-scheme', +menuItem.id)
        }
      }
    ]
  }
])
Menu.setApplicationMenu(appMenu)

const viewMenu = appMenu.items.find((item) => item.label === 'View')
const schemeMenu = appMenu.items.find((item) => item.label === 'Color Scheme')
const viewMenuItems = viewMenu?.submenu?.items ?? []
const schemeMenuItems = schemeMenu?.submenu?.items ?? []

// Create window
function createWindow() {
  mainWindow = new BrowserWindow({
    icon: iconPath,
    show: false,
    useContentSize: true,
    fullscreen: false,
    fullscreenable: false,
    resizable: false,
    maximizable: false,
    minimizable: false,
    alwaysOnTop: false,
    frame: false,
    transparent: true,
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL)
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    mainWindow.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
    viewMenuItems.map(item => {
      item.enabled = false
    })
  })
}

// App ready
app.whenReady().then(() => {
  setAppIcon()
  createWindow()

  // Settings
  ipcMain.on('first-settings', (e, settings: TSettings) => {
    if (!mainWindow) return
    // set
    mainWindow.setSize(settings.width, settings.height)
    mainWindow.setAlwaysOnTop(settings.alwaysOnTop)
    // centered window
    let bounds = screen.getPrimaryDisplay().bounds
    let x = bounds.x + ((bounds.width - mainWindow.getSize()[0]) / 2)
    let y = bounds.y + ((bounds.height - mainWindow.getSize()[1]) / 2)
    mainWindow.setPosition(x, y)
    // show window
    mainWindow.show()
    // update menu
    viewMenuItems.map(item => {
      item.enabled = true
      if (item.label === 'Ruler X') item.checked = settings.rulerX
      if (item.label === 'Ruler Y') item.checked = settings.rulerY
      if (item.label === 'Rails') item.checked = settings.rails
      if (item.label === 'Always On Top') item.checked = settings.alwaysOnTop
    })
    schemeMenuItems.map(item => {
      item.enabled = true
      if (+item.id === settings.scheme) item.checked = true
    })
  })
  ipcMain.on('update-settings', (e, settings: TSettings) => {
    if (!mainWindow) return
    // set
    mainWindow.setSize(settings.width, settings.height)
    mainWindow.setAlwaysOnTop(settings.alwaysOnTop)
    // update menu
    viewMenuItems.map(item => {
      if (item.label === 'Ruler X') item.checked = settings.rulerX
      if (item.label === 'Ruler Y') item.checked = settings.rulerY
      if (item.label === 'Rails') item.checked = settings.rails
    })
  })

  // Click through
  ipcMain.on('ignore-mouse-events', (e, ignore: boolean, options?: Electron.IgnoreMouseEventsOptions) => {
    if (!mainWindow) return
    mainWindow.setIgnoreMouseEvents(ignore, options)
  })

  // Actions
  ipcMain.on('resize-x', (e, width: number) => {
    if (!mainWindow) return
    const height = mainWindow.getSize()[1]
    mainWindow.setSize(width, height)
  })
  ipcMain.on('resize-y', (e, height: number) => {
    if (!mainWindow) return
    const width = mainWindow.getSize()[0]
    mainWindow.setSize(width, height)
  })
  ipcMain.on('resize-xy', (e, width: number, height: number) => {
    if (!mainWindow) return
    mainWindow.setSize(width, height)
  })
  ipcMain.on('move-x-plus', (e, delta: number) => {
    if (!mainWindow) return
    const x = mainWindow.getPosition()[0] + delta
    const y = mainWindow.getPosition()[1]
    mainWindow.setPosition(x, y)
  })
  ipcMain.on('move-x-minus', (e, delta: number) => {
    if (!mainWindow) return
    const x = mainWindow.getPosition()[0] - delta
    const y = mainWindow.getPosition()[1]
    mainWindow.setPosition(x, y)
  })
  ipcMain.on('move-y-plus', (e, delta: number) => {
    if (!mainWindow) return
    const x = mainWindow.getPosition()[0]
    const y = mainWindow.getPosition()[1] + delta
    mainWindow.setPosition(x, y)
  })
  ipcMain.on('move-y-minus', (e, delta: number) => {
    if (!mainWindow) return
    const x = mainWindow.getPosition()[0]
    const y = mainWindow.getPosition()[1] - delta
    mainWindow.setPosition(x, y)
  })
})

// App events
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
app.on('browser-window-focus', (e, win) => {
  win.setOpacity(1)
})
app.on('browser-window-blur', (e, win) => {
  win.setOpacity(0.4)
})
