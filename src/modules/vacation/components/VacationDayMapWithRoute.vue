<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import L from 'leaflet'
import type { VacationDayPoint } from '../types/vacation'

const props = defineProps<{
  points: VacationDayPoint[]
}>()

const emit = defineEmits<{
  add: [payload: { lat: number; lng: number }]
}>()

const mapRef = ref<HTMLElement | null>(null)

let map: L.Map
let markers: L.Marker[] = []
let polyline: L.Polyline | null = null

onMounted(() => {
  map = L.map(mapRef.value!).setView([55.75, 37.61], 10)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)

  map.on('click', (e: any) => {
    emit('add', {
      lat: e.latlng.lat,
      lng: e.latlng.lng,
    })
  })
})

watch(
    () => props.points,
    (points) => {
      markers.forEach((m) => m.remove())
      markers = []

      if (polyline) {
        polyline.remove()
      }

      const latlngs: L.LatLngTuple[] = []

      points.forEach((point) => {
        const marker = L.marker([point.latitude, point.longitude]).addTo(map)
        markers.push(marker)

        latlngs.push([point.latitude, point.longitude])
      })

      if (latlngs.length > 1) {
        polyline = L.polyline(latlngs, {
          color: '#8b5cf6',
          weight: 4,
        }).addTo(map)
      }
    },
    { deep: true },
)
</script>

<template>
  <div ref="mapRef" style="height: 400px; border-radius: 20px;" />
</template>