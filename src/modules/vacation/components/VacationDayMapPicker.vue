<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import L from 'leaflet'

const props = defineProps<{
  latitude: number | null
  longitude: number | null
}>()

const emit = defineEmits<{
  update: [payload: { latitude: number; longitude: number }]
  clear: []
}>()

const mapElement = ref<HTMLElement | null>(null)

let map: L.Map | null = null
let marker: L.Marker | null = null

const DEFAULT_CENTER: L.LatLngTuple = [55.7558, 37.6176]

function getCenter(): L.LatLngTuple {
  if (props.latitude !== null && props.longitude !== null) {
    return [props.latitude, props.longitude]
  }

  return DEFAULT_CENTER
}

function createMarker(latitude: number, longitude: number): void {
  if (!map) {
    return
  }

  if (marker) {
    marker.setLatLng([latitude, longitude])
    return
  }

  marker = L.marker([latitude, longitude], {
    draggable: true,
  }).addTo(map)

  marker.on('dragend', () => {
    if (!marker) {
      return
    }

    const position = marker.getLatLng()

    emit('update', {
      latitude: position.lat,
      longitude: position.lng,
    })
  })
}

function removeMarker(): void {
  if (marker && map) {
    map.removeLayer(marker)
    marker = null
  }
}

onMounted(() => {
  if (!mapElement.value) {
    return
  }

  map = L.map(mapElement.value, {
    zoomControl: true,
  }).setView(getCenter(), props.latitude !== null && props.longitude !== null ? 13 : 10)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map)

  if (props.latitude !== null && props.longitude !== null) {
    createMarker(props.latitude, props.longitude)
  }

  map.on('click', (event: L.LeafletMouseEvent) => {
    const { lat, lng } = event.latlng

    createMarker(lat, lng)

    emit('update', {
      latitude: lat,
      longitude: lng,
    })
  })

  setTimeout(() => {
    map?.invalidateSize()
  }, 0)
})

watch(
    () => [props.latitude, props.longitude] as const,
    ([latitude, longitude]) => {
      if (!map) {
        return
      }

      if (latitude === null || longitude === null) {
        removeMarker()
        map.setView(DEFAULT_CENTER, 10)
        return
      }

      createMarker(latitude, longitude)
      map.setView([latitude, longitude], 13)
    },
)

onBeforeUnmount(() => {
  removeMarker()

  if (map) {
    map.remove()
    map = null
  }
})
</script>

<template>
  <div class="vacation-day-map">
    <div class="vacation-day-map__top">
      <div>
        <p class="vacation-day-map__label">Точка на карте</p>
        <p class="vacation-day-map__hint">
          Нажми на карту, чтобы отметить место этого дня
        </p>
      </div>

      <button
          v-if="latitude !== null && longitude !== null"
          type="button"
          class="vacation-day-map__clear"
          @click="emit('clear')"
      >
        Очистить
      </button>
    </div>

    <div ref="mapElement" class="vacation-day-map__canvas" />

    <div
        v-if="latitude !== null && longitude !== null"
        class="vacation-day-map__coords"
    >
      lat: {{ latitude.toFixed(6) }}, lng: {{ longitude.toFixed(6) }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.vacation-day-map {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.vacation-day-map__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.vacation-day-map__label {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.88);
}

.vacation-day-map__hint {
  margin: 6px 0 0;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.58);
}

.vacation-day-map__clear {
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
  border-radius: 12px;
  padding: 10px 12px;
  cursor: pointer;
}

.vacation-day-map__canvas {
  width: 100%;
  height: 320px;
  overflow: hidden;
  border-radius: 22px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.vacation-day-map__coords {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.62);
}
</style>