export type Locale = 'en' | 'ru'

export const locales: { code: Locale; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
]

const messages = {
  en: {
    hero: {
      title: 'On-screen ruler for your desktop',
      subtitle:
        'Pixize overlays horizontal and vertical pixel rulers on your screen — measure distances, margins, and element sizes while you design or build UI.',
      download: 'Download for Apple Silicon',
    },
    install: {
      title: 'First launch on macOS',
      text1:
        'After downloading, unzip the archive and run this command in Terminal (replace the path if you saved the app elsewhere):',
      text2: 'Then open Pixize from Finder. You can also move it to Applications first.',
    },
    description: {
      title: 'Keyboard shortcuts',
      subtitle: 'Control rulers, movement, and resizing without touching the mouse.',
      view: 'View',
      movement: 'Movement',
      resize: 'Resize',
    },
    hotkeys: {
      rulerX: 'Toggle horizontal ruler',
      rulerY: 'Toggle vertical ruler',
      rails: 'Toggle corner rails',
      alwaysOnTop: 'Always on top',
      move: 'Move ruler by 1 px',
      moveFast: 'Move ruler by 5 px',
      resize: 'Resize ruler by 1 px',
      resizeFast: 'Resize ruler by 5 px',
    },
  },
  ru: {
    hero: {
      title: 'Экранная линейка для рабочего стола',
      subtitle:
        'Pixize накладывает горизонтальные и вертикальные пиксельные линейки на экран — измеряйте расстояния, отступы и размеры элементов при вёрстке и дизайне.',
      download: 'Скачать для Apple Silicon',
    },
    install: {
      title: 'Первый запуск на macOS',
      text1:
        'После скачивания распакуйте архив и выполните в Терминале (замените путь, если сохранили приложение в другом месте):',
      text2: 'Затем откройте Pixize из Finder. Можно сначала перенести приложение в «Программы».',
    },
    description: {
      title: 'Горячие клавиши',
      subtitle: 'Управляйте линейками, перемещением и изменением размера с клавиатуры.',
      view: 'Вид',
      movement: 'Перемещение',
      resize: 'Изменение размера',
    },
    hotkeys: {
      rulerX: 'Горизонтальная линейка',
      rulerY: 'Вертикальная линейка',
      rails: 'Угловые направляющие',
      alwaysOnTop: 'Поверх всех окон',
      move: 'Сдвинуть линейку на 1 px',
      moveFast: 'Сдвинуть линейку на 5 px',
      resize: 'Изменить размер на 1 px',
      resizeFast: 'Изменить размер на 5 px',
    },
  },
} as const

export type Messages = (typeof messages)[Locale]

export function getMessages(locale: Locale): Messages {
  return messages[locale]
}
