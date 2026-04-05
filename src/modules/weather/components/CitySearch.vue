<template>
  <section class="panel search-panel">
    <div class="panel__header">
      <h2 class="panel__title">Найти город</h2>
      <p class="panel__text">Начни вводить название и выбери нужный вариант.</p>
    </div>

    <div class="search-box">
      <div class="search-box__input-wrapper">
        <input
            v-model="searchValue"
            type="text"
            class="search-box__input"
            :class="{ 'search-box__input--with-chip': showAutoDetectedBadge }"
            placeholder="Например: Riga, Berlin, Tbilisi"
        />

        <div
            v-if="showAutoDetectedBadge"
            class="search-box__chip"
        >
          <svg
              class="search-box__chip-icon"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
          >
            <path
                d="M12 21s6-5.686 6-11a6 6 0 1 0-12 0c0 5.314 6 11 6 11Z"
                stroke="currentColor"
                stroke-width="1.8"
            />
            <circle
                cx="12"
                cy="10"
                r="2.5"
                fill="currentColor"
            />
          </svg>

          <span>Моё местоположение</span>
        </div>
      </div>

      <div v-if="isLoading" class="search-box__dropdown">
        <div class="search-box__item">Поиск...</div>
      </div>

      <div v-else-if="showDropdown" class="search-box__dropdown">
        <button
            v-for="city in cities"
            :key="city.id"
            type="button"
            class="search-box__item search-box__item--button"
            @click="handleSelect(city)"
        >
          <span>{{ city.name }}</span>
          <span class="search-box__country">{{ city.country }}</span>
        </button>

        <div
            v-if="!cities.length && debouncedSearch.length >= 2"
            class="search-box__item"
        >
          Ничего не найдено
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useQuery } from '@tanstack/vue-query'

import { searchCities, fetchWeather } from '../api/openMeteo.ts'
import { useWeatherStore } from '../store/weather.ts'
import type { City } from '../types.ts'

const weatherStore = useWeatherStore()

const debouncedSearch = ref('')
const isSelectingCity = ref(false)

const searchValue = computed({
  get: () => weatherStore.citySearchValue,
  set: (value: string) => {
    weatherStore.setCitySearchValue(value)

    if (value.trim().length > 0 && weatherStore.isAutoDetectedCity) {
      weatherStore.setIsAutoDetectedCity(false)
    }
  },
})

const citiesQuery = useQuery({
  queryKey: computed(() => ['cities', debouncedSearch.value]),
  queryFn: () => searchCities(debouncedSearch.value),
  enabled: computed(() => debouncedSearch.value.length >= 2),
})

const cities = computed(() => citiesQuery.data.value ?? [])
const isLoading = computed(() => citiesQuery.isLoading.value)

const showDropdown = computed(() => {
  return (debouncedSearch.value.length >= 2 || isLoading.value) && !isSelectingCity.value
})

const showAutoDetectedBadge = computed(() => {
  return Boolean(
      weatherStore.selectedCity &&
      weatherStore.isAutoDetectedCity &&
      !searchValue.value.trim(),
  )
})

const applyDebounce = useDebounceFn((value: string) => {
  debouncedSearch.value = value.trim()
}, 400)

async function handleSelect(city: City): Promise<void> {
  isSelectingCity.value = true

  try {
    weatherStore.setIsDetectingCity(true)
    weatherStore.applyManualSelectedCity(city)
    debouncedSearch.value = ''

    const weatherData = await fetchWeather(city)

    weatherStore.setWeather(weatherData.current)
    weatherStore.setHourlyForecast(weatherData.hourly)
  } catch (error) {
    console.error('Ошибка при получении погоды для выбранного города', error)
  } finally {
    weatherStore.setIsDetectingCity(false)
  }
}

watch(searchValue, (value) => {
  if (isSelectingCity.value) {
    isSelectingCity.value = false
    return
  }

  applyDebounce(value)
})
</script>

<style scoped lang="scss">
.search-box__input-wrapper {
  position: relative;
  width: 100%;
}

.search-box__input {
  width: 100%;
  min-height: 48px;
}

.search-box__input--with-chip {
  padding-right: 190px;
}

.search-box__chip {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  max-width: 170px;
  padding: 6px 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px);
  color: #f3f4f6;
  font-size: 12px;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events: none;
}

.search-box__chip-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  opacity: 0.9;
}
</style>