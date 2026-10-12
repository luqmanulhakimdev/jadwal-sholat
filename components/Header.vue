<template>
  <header class="site-header">
    <div class="nav-wrap">
      <NuxtLink class="brand" to="/" aria-label="WaktuSholat, beranda" @click="menuOpen = false">
        <span class="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 32 32" fill="none"><path d="M22.8 5.8a11.3 11.3 0 1 0 3.4 19.7A12.1 12.1 0 0 1 22.8 5.8Z" fill="currentColor"/><path d="m16 8 .8 2.2L19 11l-2.2.8L16 14l-.8-2.2L13 11l2.2-.8L16 8Z" fill="#D9AD63"/></svg>
        </span>
        <span>Waktu<span class="brand-light">Sholat</span></span>
      </NuxtLink>
      <button class="menu-toggle" type="button" :aria-expanded="menuOpen" aria-controls="main-navigation" @click="menuOpen = !menuOpen">
        <span class="sr-only">{{ menuOpen ? 'Tutup menu' : 'Buka menu' }}</span>
        <svg v-if="!menuOpen" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
        <svg v-else viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>
      </button>
      <nav id="main-navigation" class="main-navigation" :class="{ 'is-open': menuOpen }" aria-label="Navigasi utama">
        <NuxtLink to="/" @click="menuOpen = false">Cari jadwal sholat</NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
const menuOpen = ref(false)
</script>
