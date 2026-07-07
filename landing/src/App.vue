<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { getMessages, locales, type Locale } from './i18n'
import { IconGitHub, IconEN, IconRU, IconCopy } from '@/icons'
import imgLogo from '@/assets/logo.png'
import imgHero from '@/assets/hero.png'

const downloadUrl = 'https://github.com/dmitrysachko-dev/pixize/releases/latest/download/Pixize-arm64.zip'
const githubUrl = 'https://github.com/dmitrysachko-dev/pixize'
const installCommand = 'xattr -cr ~/Downloads/Pixize.app'

const hotkeyGroups = computed(() => [
  {
    title: t.value.description.view,
    items: [
      { label: t.value.hotkeys.rulerX, keys: ['⌘', '+', 'X'] },
      { label: t.value.hotkeys.rulerY, keys: ['⌘', '+', 'Y'] },
      { label: t.value.hotkeys.rails, keys: ['⌘', '+', 'R'] },
      { label: t.value.hotkeys.alwaysOnTop, keys: ['⌘', '+', 'T'] },
    ],
  },
  {
    title: t.value.description.movement,
    items: [
      { label: t.value.hotkeys.move, keys: ['↑', '↓', '←', '→'] },
      { label: t.value.hotkeys.moveFast, keys: ['⇧', '+', '↑', '↓', '←', '→'] },
    ],
  },
  {
    title: t.value.description.resize,
    items: [
      { label: t.value.hotkeys.resize, keys: ['⌘', '+', '↑', '↓', '←', '→'] },
      { label: t.value.hotkeys.resizeFast, keys: ['⌘', '+', '⇧', '+', '↑', '↓', '←', '→'] },
    ],
  },
])

const locale = ref<Locale>('en')
const langOpen = ref(false)
const langRef = ref<HTMLElement | null>(null)

const t = computed(() => getMessages(locale.value))

function setLocale(code: Locale) {
  locale.value = code
  langOpen.value = false
  document.documentElement.lang = code
}

function toggleLangMenu() {
  langOpen.value = !langOpen.value
}

function onDocumentClick(event: MouseEvent) {
  if (!langRef.value?.contains(event.target as Node)) {
    langOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
})

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
})

async function copyInstallCommand() {
  try {
    await navigator.clipboard.writeText(installCommand)
  } catch (error) {
    console.error('Failed to copy install command', error)
  }
}
</script>

<template>
  <div class="landing">
    <header class="landing__header">
      <div class="landing__header-content">
        <div class="landing__logo">
          <img :src="imgLogo" alt="Pixize">
          <span>Pixize</span>
        </div>

        <div class="landing__header-right">
          <a
            class="landing__github"
            :href="githubUrl"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <IconGitHub />
          </a>

          <div ref="langRef" class="landing__lang">
            <button
              class="landing__lang-toggle"
              type="button"
              :aria-label="locale === 'en' ? 'English' : 'Русский'"
              @click.stop="toggleLangMenu"
            >
              <IconEN v-if="locale === 'en'" class="landing__lang-flag" />
              <IconRU v-else class="landing__lang-flag" />
            </button>

            <div v-if="langOpen" class="landing__lang-menu" role="menu">
              <button
                v-for="item in locales"
                :key="item.code"
                class="landing__lang-option"
                :class="{ 'landing__lang-option--active': locale === item.code }"
                type="button"
                role="menuitem"
                :aria-label="item.label"
                @click="setLocale(item.code)"
              >
                <IconEN v-if="item.code === 'en'" class="landing__lang-flag" />
                <IconRU v-else class="landing__lang-flag" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="landing__main">
      <section class="landing__section landing__hero">
        <div class="landing__hero-content">
          <div class="landing__hero-headline">
            <h1>{{ t.hero.title }}</h1>
            <p class="landing__subtitle">{{ t.hero.subtitle }}</p>

            <a
              class="landing__button"
              :href="downloadUrl"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ t.hero.download }}
            </a>
          </div>

          <div class="landing__hero-visual">
            <img :src="imgHero" alt="Pixize ruler overlay" />
          </div>
        </div>

        <div class="landing__install">
          <h4 class="landing__install-title">{{ t.install.title }}</h4>
          <p class="landing__install-text">{{ t.install.text1 }}</p>
          <div class="landing__install-code">
            <code>{{ installCommand }}</code>
            <button
              class="landing__copy-button"
              type="button"
              aria-label="Copy install command"
              @click="copyInstallCommand"
            >
              <IconCopy />
            </button>
          </div>
          <p class="landing__install-text">{{ t.install.text2 }}</p>
        </div>
      </section>

      <section class="landing__section">
        <div class="landing__description-header">
          <h2>{{ t.description.title }}</h2>
          <p class="landing__description-subtitle">{{ t.description.subtitle }}</p>
        </div>

        <div class="landing__hotkey-groups">
          <div
            v-for="group in hotkeyGroups"
            :key="group.title"
            class="landing__hotkey-group"
          >
            <h4 class="landing__hotkey-group-title">{{ group.title }}</h4>
            <ul class="landing__hotkey-list">
              <li
                v-for="item in group.items"
                :key="item.label"
                class="landing__hotkey-item"
              >
                <span class="landing__hotkey-label">{{ item.label }}</span>
                <span class="landing__hotkey-keys">
                  <kbd
                    v-for="(key, index) in item.keys"
                    :key="`${item.label}-${index}`"
                    class="landing__kbd"
                    :class="{ 'landing__kbd--plus': key === '+' }"
                  >
                    {{ key }}
                  </kbd>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>

    <footer class="landing__footer">
      <p>&copy; Pixize</p>
    </footer>
  </div>
</template>
