<template>
  <main class="home-main page-shell">
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-copy">
        <p class="eyebrow"><span class="eyebrow-dot" /> JADWAL SHOLAT INDONESIA</p>
        <h1 id="hero-title">Temukan jadwal <span>sholatmu.</span></h1>
        <p class="hero-description">Pilih kota untuk melihat waktu sholat harian yang sesuai dengan lokasimu.</p>
      </div>
      <div class="hero-art" aria-hidden="true"><span class="art-sun"/><svg viewBox="0 0 300 180" fill="none"><path d="M0 166h300M32 166v-42h38v42m111 0V97h51v69m-25-69V69h28v28m-14-28V43m-8 26 8-11 8 11m-158 97V88l28-25 28 25v78m-49-47h42m-42 21h42m-21-21v37m-35-93 35-31 35 31" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M224 166v-39h20v39m-190 0v-27h15v27" stroke="currentColor" stroke-width="3"/></svg></div>
    </section>

    <section class="search-panel surface-card" aria-labelledby="search-title">
      <div class="section-heading"><div><p class="eyebrow">MULAI DI SINI</p><h2 id="search-title">Cari kota atau kabupaten</h2></div></div>
      <form class="search-form" role="search" @submit.prevent="searchCities">
        <label class="sr-only" for="city-search">Cari kota atau kabupaten</label>
        <div class="search-input-wrap"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.2 4.2"/></svg><input id="city-search" v-model.trim="query" type="search" placeholder="Cari kota atau kabupaten..." autocomplete="off" /></div>
        <button class="button-primary" type="submit" :disabled="loading">{{ loading ? 'Mencari…' : 'Cari jadwal' }}</button>
      </form>
      <p v-if="error" class="state-message error-message" role="alert">{{ error }} <button class="text-button" type="button" @click="loadCities">Coba lagi</button></p>
      <p v-else-if="loading" class="state-message" role="status">Memuat daftar kota…</p>
      <p v-else-if="searched && !city.length" class="state-message" role="status">Kota tidak ditemukan. Periksa ejaan atau coba nama kota lain.</p>
      <p v-else-if="searched" class="results-label" role="status">{{ city.length }} hasil pencarian</p>
    </section>

    <section v-if="!searched && !loading && !error" class="popular-section" aria-labelledby="popular-title">
      <div class="section-heading"><div><p class="eyebrow">AKSES CEPAT</p><h2 id="popular-title">Kota populer</h2></div></div>
      <div class="popular-grid">
        <NuxtLink v-for="item in popularCities" :key="item.id" class="popular-card" :to="`/city/${item.id}`"><span class="city-symbol" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 20h16M6 20v-9l6-4 6 4v9m-8 0v-5h4v5M3 11l9-8 9 8"/></svg></span><span><strong>{{ cityName(item.lokasi) }}</strong><small>{{ item.daerah || 'Indonesia' }}</small></span><span class="arrow" aria-hidden="true">↗</span></NuxtLink>
      </div>
      <p v-if="!popularCities.length" class="hint-text">Cari kota melalui kolom di atas untuk menemukan jadwalnya.</p>
    </section>

    <section v-if="searched && city.length" class="city-section" aria-labelledby="results-title">
      <div class="section-heading"><div><p class="eyebrow">{{ query ? 'HASIL PENCARIAN' : 'SELURUH INDONESIA' }}</p><h2 id="results-title">{{ query ? 'Kota yang cocok' : 'Daftar kota' }}</h2></div></div>
      <div class="city-grid"><NuxtLink v-for="item in city" :key="item.id" class="city-card" :to="`/city/${item.id}`"><span><strong>{{ cityName(item.lokasi) }}</strong><small>{{ item.daerah || 'Indonesia' }}</small></span><span class="arrow" aria-hidden="true">→</span></NuxtLink></div>
    </section>
    <section v-else-if="!searched && !loading && !error" class="all-cities-link"><button class="text-button" type="button" @click="showAllCities">Lihat daftar seluruh kota <span aria-hidden="true">→</span></button></section>
    <section v-if="searched && !loading && !error && city.length === 0" class="empty-hint">Belum menemukan kota yang dicari? Coba kata kunci lain.</section>
  </main>
</template>

<script setup>
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'
const allCities = ref([])
const city = ref([])
const query = ref('')
const loading = ref(false)
const error = ref('')
const searched = ref(false)
const popularNames = ['jakarta', 'surabaya', 'bandung', 'yogyakarta']
const popularCities = computed(() => popularNames.map(name => allCities.value.find(item => String(item.lokasi || '').toLowerCase().includes(name))).filter(Boolean))
function cityName(value) { return String(value || '').replace(/^(KOTA|KAB\.)\s+/i, '').replace(/\b\w/g, letter => letter.toUpperCase()) }

async function loadCities() {
  loading.value = true
  error.value = ''
  try {
    const response = await axios.get('https://api.myquran.com/v2/sholat/kota/semua')
    if (!Array.isArray(response.data?.data)) throw new Error('Format data kota tidak sesuai.')
    allCities.value = response.data.data
    city.value = allCities.value
  } catch {
    error.value = 'Daftar kota belum dapat dimuat. Periksa koneksi internet lalu coba lagi.'
  } finally { loading.value = false }
}
async function searchCities() {
  error.value = ''
  if (!query.value) { searched.value = true; city.value = allCities.value; return }
  loading.value = true
  searched.value = true
  try {
    const response = await axios.get(`https://api.myquran.com/v2/sholat/kota/cari/${encodeURIComponent(query.value)}`)
    if (!Array.isArray(response.data?.data)) throw new Error('Format hasil pencarian tidak sesuai.')
    city.value = response.data.data
  } catch {
    city.value = []
    error.value = 'Pencarian kota gagal. Periksa koneksi internet lalu coba lagi.'
  } finally { loading.value = false }
}
function showAllCities() { city.value = allCities.value; searched.value = true; query.value = '' }
onMounted(loadCities)
</script>
