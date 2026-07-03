import type { TSettings } from './types'

const { electronAPI } = window

const clickThrough = document.getElementById('clickThrough')!
const rulerX = document.getElementById('rulerX')!
const rulerY = document.getElementById('rulerY')!
const valueX = document.getElementById('valueX')!
const valueY = document.getElementById('valueY')!
const btnDragX = document.getElementById('btnDragX')!
const btnDragY = document.getElementById('btnDragY')!
const btnDragXY = document.getElementById('btnDragXY')!
const btnMoveXPlus = document.getElementById('btnMoveXPlus')!
const btnMoveXMinus = document.getElementById('btnMoveXMinus')!
const btnMoveYPlus = document.getElementById('btnMoveYPlus')!
const btnMoveYMinus = document.getElementById('btnMoveYMinus')!
const btnSizeXPlus = document.getElementById('btnSizeXPlus')!
const btnSizeXMinus = document.getElementById('btnSizeXMinus')!
const btnSizeYPlus = document.getElementById('btnSizeYPlus')!
const btnSizeYMinus = document.getElementById('btnSizeYMinus')!

const rootSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--size'))
const minSize = rootSize * 2
const length = rootSize * 6

const defaultSettings: TSettings = {
  width: length,
  height: rootSize,
  rulerX: true,
  rulerY: false,
  rails: false,
  alwaysOnTop: true,
  scheme: 1,
}
const deltaMove = 1
const deltaMoveFast = 5
const deltaResize = 1
const deltaResizeFast = 5

const setValue = () => {
  valueX.innerText = String(rulerX.getBoundingClientRect().width)
  valueY.innerText = String(rulerY.getBoundingClientRect().height)
}
const getSettings = (): TSettings => {
  return JSON.parse(localStorage.getItem('settings')!)
}
const setSettings = (settings: TSettings) => {
  localStorage.setItem('settings', JSON.stringify(settings))
}
const checkSettings = (settings: TSettings) => {
  if (settings.rulerX && settings.rulerY && settings.rails) {
    document.body.classList.remove('ruler-x', 'ruler-y', 'ruler-xy')
  } else if (settings.rulerX && settings.rulerY) {
    document.body.classList.remove('ruler-x', 'ruler-y')
    document.body.classList.add('ruler-xy')
  } else if (settings.rulerX) {
    document.body.classList.remove('ruler-y', 'ruler-xy')
    document.body.classList.add('ruler-x')
  } else {
    document.body.classList.remove('ruler-x', 'ruler-xy')
    document.body.classList.add('ruler-y')
  }
  setValue()
  if (!document.body.classList.contains('scheme-' + settings.scheme)) {
    document.body.classList.remove('scheme-1', 'scheme-2', 'scheme-3', 'scheme-4', 'scheme-5', 'scheme-6', 'scheme-7')
    document.body.classList.add('scheme-' + settings.scheme)
  }
}
const updateSettings = <K extends keyof TSettings>(
  prop: K,
  value: TSettings[K]
) => {
  let settings = getSettings()
  if (prop === 'rulerX') {
    if (value) {
      settings.width = length
    } else {
      if (!settings.rulerY) {
        settings.rulerY = true
        settings.height = length
      }
      settings.width = rootSize
      settings.rails = false
    }
  } else if (prop === 'rulerY') {
    if (value) {
      settings.height = length
    } else {
      if (!settings.rulerX) {
        settings.rulerX = true
        settings.width = length
      }
      settings.height = rootSize
      settings.rails = false
    }
  } else if (prop === 'rails') {
    if (value && !settings.rulerX) {
      settings.rulerX = true
      settings.width = length
    }
    if (value && !settings.rulerY) {
      settings.rulerY = true
      settings.height = length
    }
  }
  settings[prop] = value
  setSettings(settings)
  checkSettings(settings)
  electronAPI.send('update-settings', settings)
}
const firstSettings = () => {
  let settings = getSettings()
  if (!settings) {
    settings = defaultSettings
    setSettings(settings)
  }
  checkSettings(settings)
  electronAPI.send('first-settings', settings)
}
firstSettings()

electronAPI.on('toggle-ruler-x', (value) => {
  updateSettings('rulerX', value)
})
electronAPI.on('toggle-ruler-y', (value) => {
  updateSettings('rulerY', value)
})
electronAPI.on('toggle-rails', (value) => {
  updateSettings('rails', value)
})
electronAPI.on('toggle-always-on-top', (value) => {
  updateSettings('alwaysOnTop', value)
})
electronAPI.on('change-scheme', (value) => {
  updateSettings('scheme', value)
})

let isDragX = false
let isDragY = false
let isDragXY = false
let startClientX = 0
let startClientY = 0
let windowWidth = 0
let windowHeight = 0

const reset = () => {
  isDragX = false
  isDragY = false
  isDragXY = false
  startClientX = 0
  startClientY = 0
  windowWidth = 0
  windowHeight = 0
}

const moveXPlus = (value?: number) => {
  let delta = value ? value : deltaMove
  electronAPI.send('move-x-plus', delta)
}
const moveXMinus = (value?: number) => {
  let delta = value ? value : deltaMove
  electronAPI.send('move-x-minus', delta)
}
const moveYPlus = (value?: number) => {
  let delta = value ? value : deltaMove
  electronAPI.send('move-y-plus', delta)
}
const moveYMinus = (value?: number) => {
  let delta = value ? value : deltaMove
  electronAPI.send('move-y-minus', delta)
}
const sizeXPlus = (value?: number) => {
  let delta = value ? value : deltaResize
  let width = window.innerWidth + delta
  electronAPI.send('resize-x', width)
}
const sizeXMinus = (value?: number) => {
  let delta = value ? value : deltaResize
  let width = window.innerWidth - delta
  let checkedWidth = width < minSize ? minSize : width
  electronAPI.send('resize-x', checkedWidth)
}
const sizeYPlus = (value?: number) => {
  let delta = value ? value : deltaResize
  let height = window.innerHeight + delta
  electronAPI.send('resize-y', height)
}
const sizeYMinus = (value?: number) => {
  let delta = value ? value : deltaResize
  let height = window.innerHeight - delta
  let checkedHeight = height < minSize ? minSize : height
  electronAPI.send('resize-y', checkedHeight)
}

clickThrough.addEventListener('mouseenter', () => {
  electronAPI.send('ignore-mouse-events', true, { forward: true })
})
clickThrough.addEventListener('mouseleave', () => {
  electronAPI.send('ignore-mouse-events', false)
})

window.addEventListener('resize', setValue)
window.addEventListener('mouseup', reset)
window.addEventListener('mousemove', (e) => {
  if (isDragX) {
    let deltaX = e.clientX - startClientX
    let width = windowWidth + deltaX
    let checkedWidth = width < minSize ? minSize : width
    electronAPI.send('resize-x', checkedWidth)
  }
  if (isDragY) {
    let deltaY = e.clientY - startClientY
    let height = windowHeight + deltaY
    let checkedHeight = height < minSize ? minSize : height
    electronAPI.send('resize-y', checkedHeight)
  }
  if (isDragXY) {
    let deltaX = e.clientX - startClientX
    let deltaY = e.clientY - startClientY
    let width = windowWidth + deltaX
    let height = windowHeight + deltaY
    let checkedWidth = width < minSize ? minSize : width
    let checkedHeight = height < minSize ? minSize : height
    electronAPI.send('resize-xy', checkedWidth, checkedHeight)
  }
})

btnDragX.addEventListener('mousedown', (e) => {
  isDragX = true
  startClientX = e.clientX
  windowWidth = window.innerWidth
})
btnDragY.addEventListener('mousedown', (e) => {
  isDragY = true
  startClientY = e.clientY
  windowHeight = window.innerHeight
})
btnDragXY.addEventListener('mousedown', (e) => {
  isDragXY = true
  startClientX = e.clientX
  startClientY = e.clientY
  windowWidth = window.innerWidth
  windowHeight = window.innerHeight
})
btnMoveXPlus.addEventListener('click', () => { moveXPlus() })
btnMoveXMinus.addEventListener('click', () => { moveXMinus() })
btnMoveYPlus.addEventListener('click', () => { moveYPlus() })
btnMoveYMinus.addEventListener('click', () => { moveYMinus() })
btnSizeXPlus.addEventListener('click', () => { sizeXPlus() })
btnSizeXMinus.addEventListener('click', () => { sizeXMinus() })
btnSizeYPlus.addEventListener('click', () => { sizeYPlus() })
btnSizeYMinus.addEventListener('click', () => { sizeYMinus() })

window.addEventListener('keydown', (e) => {
  // disable zooming
  if ((e.code === 'Minus' || e.code === 'Equal') && (e.ctrlKey || e.metaKey)) { e.preventDefault() }
  // actions
  else if (e.code === 'ArrowRight' && e.metaKey && e.shiftKey) { sizeXPlus(deltaResizeFast) }
  else if (e.code === 'ArrowLeft' && e.metaKey && e.shiftKey) { sizeXMinus(deltaResizeFast) }
  else if (e.code === 'ArrowDown' && e.metaKey && e.shiftKey) { sizeYPlus(deltaResizeFast) }
  else if (e.code === 'ArrowUp' && e.metaKey && e.shiftKey) { sizeYMinus(deltaResizeFast) }
  else if (e.code === 'ArrowRight' && e.metaKey) { sizeXPlus() }
  else if (e.code === 'ArrowLeft' && e.metaKey) { sizeXMinus() }
  else if (e.code === 'ArrowDown' && e.metaKey) { sizeYPlus() }
  else if (e.code === 'ArrowUp' && e.metaKey) { sizeYMinus() }
  else if (e.code === 'ArrowRight' && e.shiftKey) { moveXPlus(deltaMoveFast) }
  else if (e.code === 'ArrowLeft' && e.shiftKey) { moveXMinus(deltaMoveFast) }
  else if (e.code === 'ArrowDown' && e.shiftKey) { moveYPlus(deltaMoveFast) }
  else if (e.code === 'ArrowUp' && e.shiftKey) { moveYMinus(deltaMoveFast) }
  else if (e.code === 'ArrowRight') { moveXPlus() }
  else if (e.code === 'ArrowLeft') { moveXMinus() }
  else if (e.code === 'ArrowDown') { moveYPlus() }
  else if (e.code === 'ArrowUp') { moveYMinus() }
})
