<script setup lang="ts">
import { computed } from 'vue'
import { IconGitHub, IconCopy } from '@/icons'
import imgLogo from '@/assets/logo.png'
import imgHero from '@/assets/hero.png'

const downloadUrl = 'https://github.com/dmitrysachko-dev/pixize/releases/latest/download/Pixize-arm64.zip'
const githubUrl = 'https://github.com/dmitrysachko-dev/pixize'
const installCommand = 'xattr -cr ~/Downloads/Pixize.app'

const hotkeyGroups = computed(() => [
  {
    title: 'View',
    items: [
      { label: 'Toggle horizontal ruler', keys: ['⌘', '+', 'X'] },
      { label: 'Toggle vertical ruler', keys: ['⌘', '+', 'Y'] },
      { label: 'Toggle corner rails', keys: ['⌘', '+', 'R'] },
      { label: 'Always on top', keys: ['⌘', '+', 'T'] },
    ],
  },
  {
    title: 'Movement',
    items: [
      { label: 'Move ruler by 1 px', keys: ['↑', '↓', '←', '→'] },
      { label: 'Move ruler by 5 px', keys: ['⇧', '+', '↑', '↓', '←', '→'] },
    ],
  },
  {
    title: 'Resize',
    items: [
      { label: 'Resize ruler by 1 px', keys: ['⌘', '+', '↑', '↓', '←', '→'] },
      { label: 'Resize ruler by 5 px', keys: ['⌘', '+', '⇧', '+', '↑', '↓', '←', '→'] },
    ],
  },
])

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

        <a
          class="landing__github"
          :href="githubUrl"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <IconGitHub />
        </a>
      </div>
    </header>

    <main class="landing__main">
      <section class="landing__section">
        <div class="landing__hero-content">
          <div class="landing__hero-headline">
            <h1>Measure UI spacing and sizes on macOS in seconds</h1>
            <p class="subtitle">On-screen pixel ruler for designers, frontend developers, and QA.</p>
            <p class="landing__hero-description">Place horizontal and vertical rulers anywhere on screen, read exact pixel values, and verify layouts without leaving your workflow.</p>
            <a
              class="landing__button"
              :href="downloadUrl"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download free for Apple Silicon
            </a>
            <div class="landing__hero-tags">Free · No signup · Open source on GitHub</div>
          </div>

          <div class="landing__hero-visual">
            <img :src="imgHero" alt="Pixize ruler overlay" />
          </div>
        </div>

        <div class="landing__install">
          <h4>First launch on macOS</h4>
          <p>macOS may block apps downloaded outside the App Store. Three quick steps:</p>
          <p>1. <b>Download and unzip</b> the archive from GitHub.</p>
          <p>2. <b>Run this command</b> in Terminal (if you moved the app, update the path):</p>
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
          <p>3. <b>Open Pixize</b> from Finder — or drag it to Applications first.</p>
        </div>
      </section>

      <section class="landing__section">
        <div class="landing__section-header">
          <h2>Keyboard shortcuts</h2>
          <p>Show, move, and resize rulers from the keyboard — no mouse required.</p>
        </div>

        <div class="landing__hotkey-groups">
          <div
            v-for="group in hotkeyGroups"
            :key="group.title"
            class="landing__hotkey-group"
          >
            <h4>{{ group.title }}</h4>
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

      <section class="landing__section">
        <h2>Why Pixize</h2>
        <p>Small spacing mistakes show up fast in real interfaces. Pixize lets you check widths, heights, and gaps in place — without screenshots, browser devtools, or guesswork.</p>
        <ul>
          <li><b>Instant measurements</b> — rulers overlay any app or browser window</li>
          <li><b>Pixel-accurate</b> — read exact values as you align UI elements</li>
          <li><b>Stays out of the way</b> — always on top, keyboard-driven</li>
        </ul>
      </section>

      <section class="landing__section">
        <h2>Who It’s For</h2>
        <p>Built for people who ship interfaces and care about visual precision:</p>
        <ul>
          <li><b>UI/UX designers</b> — verify handoff specs against the live UI</li>
          <li><b>Frontend developers</b> — match Figma spacing and component dimensions in code</li>
          <li><b>QA engineers</b> — catch layout regressions before release</li>
          <li><b>Product teams</b> — keep execution consistent across screens and releases</li>
        </ul>
      </section>

      <section class="landing__section">
        <h2>FAQ</h2>
        <h4>Is Pixize free?</h4>
        <p>Yes. Pixize is free to download and use — no signup.</p>
        <h4>What can I measure?</h4>
        <p>Element width, height, and spacing between UI components directly on your screen.</p>
        <h4>Why does macOS block Pixize on first launch?</h4>
        <p>Apps distributed outside the App Store are quarantined by Gatekeeper. The xattr command above removes that flag so you can open the app. This is a standard step for unsigned or ad-hoc distributed macOS apps.</p>
        <h4>Which Macs are supported?</h4>
        <p>Currently available for Apple Silicon (M-series).</p>
        <h4>Does Pixize need an internet connection?</h4>
        <p>No. Once installed, measuring works fully offline.</p>
        <h4>Is the source code available?</h4>
        <p>Yes. Pixize is open source — view the code and releases on GitHub.</p>
      </section>

      <section class="landing__section">
        <h2>Ready to ship cleaner UI?</h2>
        <p>Stop guessing dimensions. Download Pixize, measure in seconds, and keep every layout pixel-accurate.</p>
        <a
          class="landing__button"
          :href="downloadUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download free for Apple Silicon
        </a>
      </section>
    </main>

    <footer class="landing__footer">
      <p>&copy; Pixize</p>
    </footer>
  </div>
</template>
