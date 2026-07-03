export type TSettings = {
  width: number
  height: number
  rulerX: boolean
  rulerY: boolean
  rails: boolean
  alwaysOnTop: boolean
  scheme: number
}

export const sendChannels = [
  'first-settings',
  'update-settings',
  'ignore-mouse-events',
  'resize-x',
  'resize-y',
  'resize-xy',
  'move-x-plus',
  'move-x-minus',
  'move-y-plus',
  'move-y-minus',
] as const

export const receiveChannels = [
  'toggle-ruler-x',
  'toggle-ruler-y',
  'toggle-rails',
  'toggle-always-on-top',
  'change-scheme',
] as const

export type TSendChannel = (typeof sendChannels)[number]
export type TReceiveChannel = (typeof receiveChannels)[number]

export type TSendPayloads = {
  'first-settings': [settings: TSettings]
  'update-settings': [settings: TSettings]
  'ignore-mouse-events': [ignore: boolean, options?: { forward: boolean }]
  'resize-x': [width: number]
  'resize-y': [height: number]
  'resize-xy': [width: number, height: number]
  'move-x-plus': [delta: number]
  'move-x-minus': [delta: number]
  'move-y-plus': [delta: number]
  'move-y-minus': [delta: number]
}

export type TReceivePayloads = {
  'toggle-ruler-x': [value: boolean]
  'toggle-ruler-y': [value: boolean]
  'toggle-rails': [value: boolean]
  'toggle-always-on-top': [value: boolean]
  'change-scheme': [value: number]
}

export interface TElectronAPI {
  send<C extends TSendChannel>(channel: C, ...args: TSendPayloads[C]): void
  on<C extends TReceiveChannel>(channel: C, callback: (...args: TReceivePayloads[C]) => void): void
}
