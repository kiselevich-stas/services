<template>
  <section class="panel search-panel">
    <div class="panel__header">
      <h2 class="panel__title">Найти город</h2>
      <p class="panel__text">Начни вводить название и выбери нужный вариант.</p>
    </div>

    <div class="search-box">
      <input
          v-model="searchValue"
          type="text"
          class="search-box__input"
          placeholder="Например: Riga, Berlin, Tbilisi"
      />

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

        <div v-if="!cities.length && debouncedSearch.length >= 2" class="search-box__item">
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

import { searchCities} from "../api/openMeteo.ts";
import { useWeatherStore} from "../store/weather.ts";
import type { City} from "../types.ts";

const weatherStore = useWeatherStore()

const searchValue = ref('')
const debouncedSearch = ref('')
const isSelectingCity = ref(false)

const applyDebounce = useDebounceFn((value: string) => {
  debouncedSearch.value = value.trim()
}, 400)

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

function handleSelect(city: City): void {
  isSelectingCity.value = true
  weatherStore.setSelectedCity(city)
  searchValue.value = `${city.name}, ${city.country}`
  debouncedSearch.value = ''
}

watch(searchValue, (value) => {
  if (isSelectingCity.value) {
    isSelectingCity.value = false
    return
  }

  applyDebounce(value)
})
</script>