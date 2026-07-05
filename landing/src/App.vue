<script setup lang="ts">
const downloadUrl = 'https://github.com/dmitrysachko-dev/pixize/releases/latest/download/Pixize-arm64.zip'

const features = [
  '1',
  '2',
  '3',
]
</script>

<template>
  <div class="landing">
    <header class="landing__header">
      <span class="landing__logo">Pixize</span>
      <a class="landing__cta" href="#">GitHub</a>
    </header>

    <main class="landing__hero">
      <h1>On-screen ruler for your desktop</h1>
      <p class="landing__subtitle">
        Pixize overlays horizontal and vertical pixel rulers on your screen — measure distances, margins, and element sizes while you design or build UI.
      </p>
<!--      <ul class="landing__features">-->
<!--        <li v-for="feature in features" :key="feature">{{ feature }}</li>-->
<!--      </ul>-->
      <section id="download" class="landing__download">
        <a
          class="landing__button"
          :href="downloadUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download for Apple Silicon
        </a>

        <div class="landing__install">
          <p class="landing__install-title">First launch on macOS</p>
          <p class="landing__install-text">
            After downloading, unzip the archive and run this command in Terminal
            (replace the path if you saved the app elsewhere):
          </p>
          <pre class="landing__install-code"><code>xattr -cr ~/Downloads/Pixize.app</code></pre>
          <p class="landing__install-text">
            Then open Pixize from Finder. You can also move it to Applications first.
          </p>
        </div>
      </section>
    </main>

    <footer class="landing__footer">
      <p>&copy; {{ new Date().getFullYear() }} Pixize</p>
    </footer>
  </div>
</template>
