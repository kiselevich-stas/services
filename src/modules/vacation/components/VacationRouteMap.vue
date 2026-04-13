<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

type VacationDayPoint = {
  id: string
  latitude: number
  longitude: number
  title?: string
  description?: string
}

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

delete (L.Icon.Default.prototype as any)._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const mapElement = ref<HTMLElement | null>(null)

let map: L.Map | null = null
let routingControl: any = null

const DEFAULT_CENTER: L.LatLngTuple = [55.7558, 37.6176]

function buildWaypoints(): L.LatLng[] {
  return props.points.map((point) => L.latLng(point.latitude, point.longitude))
}

function renderRoute(): void {
  if (!map) {
    return
  }

  const waypoints = buildWaypoints()

  if (routingControl) {
    map.removeControl(routingControl)
    routingControl = null
  }

  if (!waypoints.length) {
    map.setView(DEFAULT_CENTER, 10)
    return
  }

  // Если точка одна — просто центрируем карту.
  if (waypoints.length === 1) {
    map.setView(waypoints[0], 13)
    L.marker(waypoints[0]).addTo(map)
    return
  }

  routingControl = (L as any).Routing.control({
    waypoints,
    addWaypoints: false,
    routeWhileDragging: false,
    draggableWaypoints: false,
    fitSelectedRoutes: true,
    showAlternatives: false,
    lineOptions: {
      styles: [
        {
          color: '#8B5CF6',
          opacity: 0.9,
          weight: 5,
        },
      ],
    },
    createMarker: (index: number, waypoint: any) => {
      return L.marker(waypoint.latLng).bindPopup(
          props.points[index]?.title || `Точка ${index + 1}`,
      )
    },
  }).addTo(map)
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

  renderRoute()

  setTimeout(() => {
    map?.invalidateSize()
  }, 0)
})

watch(
    () => props.points,
    () => {
      if (!map) {
        return
      }

      // Удаляем старые обычные marker'ы, если они были добавлены вручную
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker && !(layer as any)._icon?.classList?.contains('leaflet-routing-icon')) {
          map?.removeLayer(layer)
        }
      })

      renderRoute()
    },
    { deep: true },
)

onBeforeUnmount(() => {
  if (routingControl && map) {
    map.removeControl(routingControl)
    routingControl = null
  }

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