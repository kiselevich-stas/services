<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import L from 'leaflet'
import { usePlaceSearch } from '../composables/usePlaceSearch'
import type { MeetingPlace } from '../types'

const props = defineProps<{
  modelValue: MeetingPlace | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: MeetingPlace | null]
}>()

const mapElement = ref<HTMLDivElement | null>(null)
const query = ref(props.modelValue?.name || '')
const map = ref<L.Map | null>(null)
const marker = ref<L.Marker | null>(null)
const {
  items,
  isLoading,
  errorMessage,
  findPlaces,
} = usePlaceSearch()

const selectedLabel = computed(() => {
  if (!props.modelValue) {
    return 'Место не выбрано'
  }

  return `${props.modelValue.name} · ${props.modelValue.address}`
})

function createMarker(place: MeetingPlace) {
  if (!map.value) {
    return
  }

  marker.value?.remove()
  marker.value = L.marker([place.lat, place.lng]).addTo(map.value)
  map.value.setView([place.lat, place.lng], 15)
}

function selectPlace(place: MeetingPlace) {
  emit('update:modelValue', place)
  query.value = place.name
  createMarker(place)
}

async function submitSearch() {
  await findPlaces(query.value)

  if (items.value[0]) {
    selectPlace(items.value[0])
  }
}

onMounted(async () => {
  await nextTick()

  if (!mapElement.value) {
    return
  }

  map.value = L.map(mapElement.value, {
    zoomControl: false,
  }).setView([56.9496, 24.1052], 12)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map.value)

  map.value.on('click', async (event: L.LeafletMouseEvent) => {
    const place: MeetingPlace = {
      id: `manual-${event.latlng.lat}-${event.latlng.lng}`,
      name: 'Выбранная точка',
      address: `${event.latlng.lat.toFixed(5)}, ${event.latlng.lng.toFixed(5)}`,
      lat: event.latlng.lat,
      lng: event.latlng.lng,
      kind: 'point',
    }

    selectPlace(place)
  })

  if (props.modelValue) {
    createMarker(props.modelValue)
  }
})

watch(
  () => props.modelValue,
  (value) => {
    if (value) {
      createMarker(value)
    }
  },
)

onBeforeUnmount(() => {
  map.value?.remove()
})
</script>

<template>
  <section class="meeting-map-picker">
    <div class="meeting-map-picker__top">
      <div class="meeting-map-picker__field">
        <label class="meeting-map-picker__label">Заведение или место</label>
        <div class="meeting-map-picker__search-row">
          <input
            v-model="query"
            type="text"
            class="meeting-map-picker__input"
            placeholder="Например: Cofix, ресторан, парк, бар"
            @keydown.enter.prevent="submitSearch"
          />
          <div
            class="meeting-map-picker__search-action"
            :class="{ 'is-loading': isLoading }"
            @click="submitSearch"
          >
            Найти
          </div>
        </div>
      </div>

      <div class="meeting-map-picker__selected">{{ selectedLabel }}</div>
    </div>

    <div ref="mapElement" class="meeting-map-picker__map"></div>

    <p v-if="errorMessage" class="meeting-map-picker__error">{{ errorMessage }}</p>

    <div v-if="items.length" class="meeting-map-picker__results">
      <div
        v-for="place in items"
        :key="place.id"
        class="meeting-map-picker__result"
        @click="selectPlace(place)"
      >
        <div class="meeting-map-picker__result-title">{{ place.name }}</div>
        <div class="meeting-map-picker__result-address">{{ place.address }}</div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.meeting-map-picker {
  display: grid;
  gap: 16px;

  &__top {
    display: grid;
    gap: 12px;
  }

  &__field {
    display: grid;
    gap: 8px;
  }

  &__label {
    color: rgba(255, 255, 255, 0.8);
    font-size: 13px;
  }

  &__search-row {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 10px;
  }

  &__input {
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.04);
    color: #fff;
    border-radius: 16px;
    min-height: 48px;
    padding: 0 16px;
    outline: none;
  }

  &__search-action {
    min-width: 94px;
    border-radius: 16px;
    min-height: 48px;
    display: grid;
    place-items: center;
    color: rgba(255, 255, 255, 0.85);
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.04);
    cursor: pointer;
    user-select: none;

    &.is-loading {
      opacity: 0.6;
      pointer-events: none;
    }
  }

  &__selected {
    color: rgba(255, 255, 255, 0.58);
    font-size: 14px;
    line-height: 1.5;
  }

  &__map {
    height: 360px;
    overflow: hidden;
    border-radius: 24px;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  &__results {
    display: grid;
    gap: 10px;
  }

  &__result {
    border-radius: 18px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.03);
    padding: 14px 16px;
    cursor: pointer;
  }

  &__result-title {
    color: #fff;
    font-size: 15px;
    margin-bottom: 4px;
  }

  &__result-address,
  &__error {
    color: rgba(255, 255, 255, 0.56);
    font-size: 13px;
    line-height: 1.45;
  }
}
</style>
