<template>
  <main class="detail-main page-shell">
    <NuxtLink class="back-link" to="/">← <span>Kembali ke pencarian kota</span></NuxtLink>
    <section class="location-header">
      <div><p class="eyebrow">JADWAL SHOLAT HARIAN</p><h1>{{ cityName(jadwal?.lokasi) || 'Jadwal sholat' }}</h1><p class="location-subtitle">{{ cityName(jadwal?.daerah) || 'Indonesia' }}</p></div>
      <div class="date-control"><button class="icon-button" type="button" aria-label="Tanggal sebelumnya" :disabled="loading" @click="shiftDate(-1)">‹</button><label class="date-input-wrap"><span class="sr-only">Pilih tanggal jadwal</span><input v-model="selectedDate" type="date" :disabled="loading" /></label><button class="icon-button" type="button" aria-label="Tanggal berikutnya" :disabled="loading" @click="shiftDate(1)">›</button></div>
    </section>
    <p class="date-heading">{{ formattedDate }}</p>
    <div v-if="error" class="detail-error" role="alert"><p>{{ error }}</p><button class="button-outline" type="button" @click="fetchSchedule">Coba lagi</button></div>
    <div v-else-if="loading" class="loading-card" role="status"><span class="spinner"/> Memuat jadwal sholat…</div>
    <template v-else-if="schedule">
      <section class="next-prayer-card" aria-labelledby="next-title"><div class="next-prayer-copy"><p class="eyebrow">SHOLAT BERIKUTNYA</p><h2 id="next-title">{{ nextPrayer ? nextPrayer.label : 'Jadwal hari ini' }}</h2><p>{{ nextPrayer ? 'Waktu sholat berikutnya' : nextPrayerMessage }}</p></div><div class="next-time">{{ nextPrayer?.time || '— — : — —' }}</div><span class="next-spark" aria-hidden="true">✦</span></section>
      <section class="schedule-section" aria-labelledby="schedule-title"><div class="section-heading"><div><p class="eyebrow">WAKTU SHOLAT</p><h2 id="schedule-title">Jadwal hari ini</h2></div><span v-if="schedule.tanggal" class="api-date">{{ schedule.tanggal }}</span></div>
        <div class="schedule-list"><div v-for="item in prayerTimes" :key="item.key" class="schedule-row" :class="{ 'is-next': nextPrayer?.key === item.key, 'is-unavailable': !item.time }"><span class="prayer-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path :d="item.icon"/></svg></span><span class="prayer-name">{{ item.label }}<small v-if="nextPrayer?.key === item.key">Berikutnya</small></span><time class="prayer-time">{{ item.time || '— — : — —' }}</time></div></div>
      </section>
    </template>
    <div v-else class="loading-card">Jadwal untuk tanggal ini belum tersedia.</div>
  </main>
</template>

<script setup>
import axios from 'axios'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const selectedDate = ref(localDate(new Date()))
const jadwal = ref(null)
const schedule = ref(null)
const loading = ref(false)
const error = ref('')
const now = ref(Date.now())
let clockTimer
let requestId = 0
function cityName(value) {
  return String(value || '').replace(/^(KOTA|KAB\.)\s+/i, '').toLowerCase().replace(/\b\w/g, letter => letter.toUpperCase()).replace(/^Dki\b/, 'DKI')
}
function localDate(date) { const y = date.getFullYear(); const m = String(date.getMonth()+1).padStart(2,'0'); const d = String(date.getDate()).padStart(2,'0'); return `${y}-${m}-${d}` }
const formattedDate = computed(() => new Intl.DateTimeFormat('id-ID', { weekday:'long', day:'numeric', month:'long', year:'numeric' }).format(new Date(`${selectedDate.value}T12:00:00`)))
const prayerTimes = computed(() => {
  const data = schedule.value || {}
  const definitions = [
    ['imsak','Imsak','Matahari terbit dan awal puasa'], ['subuh','Subuh','Fajar'], ['terbit','Terbit','Matahari terbit'], ['dhuha','Dhuha','Matahari siang'], ['dzuhur','Dzuhur','Matahari siang'], ['ashar','Ashar','Sore'], ['maghrib','Maghrib','Matahari terbenam'], ['isya','Isya','Malam']
  ]
  return definitions.map(([key,label]) => ({ key,label,time:normalizeTime(data[key]),icon: key === 'imsak' || key === 'subuh' ? 'M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6 7 7m10 10 1.4 1.4m0-12.8L17 7M7 17l-1.4 1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z' : 'M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6 7 7m10 10 1.4 1.4m0-12.8L17 7M7 17l-1.4 1.4' }))
})
const nextPrayer = computed(() => {
  if (!schedule.value || selectedDate.value !== localDate(new Date(now.value))) return null
  const wajib = prayerTimes.value.filter(item => ['subuh','dzuhur','ashar','maghrib','isya'].includes(item.key) && item.time)
  for (const item of wajib) {
    const [hours, minutes] = item.time.split(':').map(Number)
    if (Number.isInteger(hours) && Number.isInteger(minutes)) {
      const prayerDate = new Date(`${selectedDate.value}T${item.time}:00`)
      if (prayerDate.getTime() > now.value) return item
    }
  }
  return null
})
const nextPrayerMessage = computed(() => selectedDate.value === localDate(new Date(now.value)) ? 'Semua waktu sholat hari ini telah berlalu.' : 'Waktu sholat pada tanggal yang dipilih.')
function normalizeTime(value) { if (typeof value !== 'string') return ''; const match = value.trim().match(/^(\d{1,2}):(\d{2})/); if (!match) return ''; const h = Number(match[1]); const m = Number(match[2]); return h < 24 && m < 60 ? `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}` : '' }
async function fetchSchedule() {
  if (!selectedDate.value) return
  const currentRequest = ++requestId
  loading.value = true; error.value = ''; schedule.value = null
  try {
    const response = await axios.get(`https://api.myquran.com/v2/sholat/jadwal/${encodeURIComponent(route.params.id)}/${selectedDate.value}`)
    const data = response.data?.data
    if (!data || typeof data !== 'object' || !data.jadwal) throw new Error('Format jadwal tidak tersedia.')
    if (currentRequest === requestId) { jadwal.value = data; schedule.value = data.jadwal }
  } catch {
    if (currentRequest === requestId) error.value = 'Jadwal belum dapat dimuat. Periksa koneksi atau coba lagi beberapa saat.'
  } finally { if (currentRequest === requestId) loading.value = false }
}
function shiftDate(amount) { const date = new Date(`${selectedDate.value}T12:00:00`); date.setDate(date.getDate()+amount); selectedDate.value = localDate(date) }
watch(selectedDate, (next, previous) => { if (next && next !== previous) fetchSchedule() })
onMounted(() => { fetchSchedule(); clockTimer = window.setInterval(() => { now.value = Date.now() }, 30000) })
onUnmounted(() => { if (clockTimer) window.clearInterval(clockTimer) })
</script>
