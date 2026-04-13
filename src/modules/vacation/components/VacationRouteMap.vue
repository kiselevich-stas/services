<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

import type { VacationDayPoint } from '../types/vacation'

delete (L.Icon.Default.prototype as any)._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const props = withDefaults(
    defineProps<{
      points: VacationDayPoint[]
      height?: number
      clickable?: boolean
    }>(),
    {
      height: 360,
      clickable: false,
    },
)

const emit = defineEmits<{
  add: [payload: { latitude: number; longitude: number }]
}>()

const mapElement = ref<HTMLElement | null>(null)

let map: L.Map | null = null
let markers: L.Marker[] = []
let polyline: L.Polyline | null = null

const DEFAULT_CENTER: L.LatLngTuple = [55.7558, 37.6176]

function clearMapObjects(): void {
  markers.forEach((marker) => marker.remove())
  markers = []

  if (polyline) {
    polyline.remove()
    polyline = null
  }
}

function renderPoints(): void {
  if (!map) {
    return
  }

  clearMapObjects()

  if (!props.points.length) {
    map.setView(DEFAULT_CENTER, 10)
    return
  }

  const latLngs: L.LatLngTuple[] = []

  props.points.forEach((point, index) => {
    const latLng: L.LatLngTuple = [point.latitude, point.longitude]
    latLngs.push(latLng)

    const marker = L.marker(latLng)
        .addTo(map)
        .bindPopup(`
        <div style="min-width: 140px">
          <strong>${point.title || `Точка ${index + 1}`}</strong>
          ${point.description ? `<div style="margin-top: 6px">${point.description}</div>` : ''}
        </div>
      `)

    markers.push(marker)
  })

  if (latLngs.length > 1) {
    polyline = L.polyline(latLngs, {
      color: '#8b5cf6',
      weight: 4,
      opacity: 0.85,
    }).addTo(map)
  }

  const bounds = L.latLngBounds(latLngs)
  map.fitBounds(bounds, { padding: [30, 30] })
}

onMounted(() => {
  if (!mapElement.value) {
    return
  }

  map = L.map(mapElement.value, {
    zoomControl: true,
  }).setView(DEFAULT_CENTER, 10)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map)

  if (props.clickable) {
    map.on('click', (event: L.LeafletMouseEvent) => {
      emit('add', {
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
      })
    })
  }

  renderPoints()

  setTimeout(() => {
    map?.invalidateSize()
  }, 0)
})

watch(
    () => props.points,
    () => {
      renderPoints()
    },
    { deep: true },
)

onBeforeUnmount(() => {
  clearMapObjects()

  if (map) {
    map.remove()
    map = null
  }
})
</script>

<template>
  <div
      ref="mapElement"
      class="vacation-route-map"
      :style="{ height: `${height}px` }"
  />
</template>

<style scoped lang="scss">
.vacation-route-map {
  width: 100%;
  overflow: hidden;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}
</style>