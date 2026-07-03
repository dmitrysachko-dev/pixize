import { contextBridge, ipcRenderer, webFrame } from 'electron'
import { sendChannels, type TSendChannel, receiveChannels, type TReceiveChannel } from '../src/types'

webFrame.setZoomFactor(1)

contextBridge.exposeInMainWorld('electronAPI', {
  send(channel: TSendChannel, ...args: unknown[]) {
    if (sendChannels.includes(channel)) {
      ipcRenderer.send(channel, ...args)
    }
  },
  on(channel: TReceiveChannel, callback: (...args: unknown[]) => void) {
    if (receiveChannels.includes(channel)) {
      ipcRenderer.on(channel, (_event, ...args) => callback(...args))
    }
  },
})
