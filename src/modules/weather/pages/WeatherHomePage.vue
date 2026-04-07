<template>
  <section class="home-page">
    <UiBreadcrumbs :items="breadcrumbs" />

    <GeolocationPermissionModal
        v-model="isGeoModalOpen"
        :permission="geoPermission"
    />

    <div class="hero panel hero-panel">
      <div class="hero-panel__content">
        <p class="hero-panel__eyebrow">Weather decisions, not just weather data</p>
        <h1 class="hero-panel__title">
          Понимай, где сейчас действительно комфортно
        </h1>
        <p class="hero-panel__text">
          Найди лучший город и лучшее время для прогулки, спорта, поездки и работы.
        </p>
      </div>
    </div>

    <div class="home-grid">
      <div class="home-grid__left">
        <CitySearch />
        <ActivityModeSwitch />
      </div>

      <div class="home-grid__right" v-if="isDetectingCity">
        <WeatherCardSkeleton />
        <HourlyForecastSkeleton />
      </div>

      <div class="home-grid__right" v-else-if="weather && selectedCity">
        <WeatherCard />
        <HourlyForecast />
      </div>

      <div v-else class="panel weather-card__empty">
        <img src="/icons/weatherCardEmpty.svg" alt="">
        Выбери город, чтобы получить данные о погоде.
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import ActivityModeSwitch from '../components/ActivityModeSwitch.vue'
import CitySearch from '../components/CitySearch.vue'
import GeolocationPermissionModal from "../components/modals/GeolocationPermissionModal.vue";
import HourlyForecast from '../components/HourlyForecast.vue'
import WeatherCard from '../components/WeatherCard.vue'
import WeatherCardSkeleton from '../components/skeleton/WeatherCardSkeleton.vue'
import HourlyForecastSkeleton from '../components/skeleton/HourlyForecastSkeleton.vue'

import { fetchWeather } from '../api/openMeteo.ts'
import { useWeatherStore } from '../store/weather.ts'
import type { City } from '../types.ts'
import UiBreadcrumbs from "../../../components/ui/breadcrumbs/UiBreadcrumbs.vue";

type GeoPermissionState = 'prompt' | 'granted' | 'denied' | 'unsupported'

const weatherStore = useWeatherStore()

const isDetectingCity = computed(() => weatherStore.isDetectingCity)
const weather = computed(() => weatherStore.weather)
const selectedCity = computed(() => weatherStore.selectedCity)

const isGeoModalOpen = ref(false)
const geoPermission = ref<GeoPermissionState>('prompt')

const breadcrumbs = computed(() => [
  { label: 'Главная', to: '/' },
  { label: 'Погода' },
])

async function detectWeatherByLocation(): Promise<void> {
  if (selectedCity.value || weather.value) {
    return
  }

  if (!navigator.geolocation) {
    geoPermission.value = 'unsupported'
    isGeoModalOpen.value = true
    weatherStore.setIsDetectingCity(false)
    return
  }

  try {
    if ('permissions' in navigator) {
      const result = await navigator.permissions.query({
        name: 'geolocation',
      } as PermissionDescriptor)

      geoPermission.value = result.state as GeoPermissionState

      result.onchange = () => {
        geoPermission.value = result.state as GeoPermissionState
      }

      if (result.state === 'denied') {
        isGeoModalOpen.value = true
        weatherStore.setIsDetectingCity(false)
        return
      }

      if (result.state === 'prompt') {
        isGeoModalOpen.value = true
      }
    }
  } catch (error) {
    console.error('Не удалось определить статус permission', error)
  }

  weatherStore.setIsDetectingCity(true)

  navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const city: City = {
            id: `geo-${position.coords.latitude}-${position.coords.longitude}`,
            name: 'Моё местоположение',
            country: '',
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timezone: 'auto',
          }

          const weatherData = await fetchWeather(city)

          weatherStore.applyAutoDetectedCity(city)
          weatherStore.setWeather(weatherData.current)
          weatherStore.setHourlyForecast(weatherData.hourly)

          geoPermission.value = 'granted'
          isGeoModalOpen.value = false
        } catch (error) {
          console.error('Ошибка получения погоды по геолокации', error)
        } finally {
          weatherStore.setIsDetectingCity(false)
        }
      },
      (error) => {
        console.error('Ошибка геолокации', error)

        if (error.code === error.PERMISSION_DENIED) {
          geoPermission.value = 'denied'
          isGeoModalOpen.value = true
        }

        weatherStore.setIsDetectingCity(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
  )
}

onMounted(() => {
  detectWeatherByLocation()
})
</script>