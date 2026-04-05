<template>
  <section class="home-page">
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
        <CitySearch/>
        <ActivityModeSwitch/>
        <!--        <RecommendationPanel />-->
      </div>

      <div class="home-grid__right" v-if="weather && selectedCity">
        <WeatherCard/>
        <HourlyForecast/>
      </div>
      <div v-else class="panel weather-card__empty">
        <img src="/icons/weatherCardEmpty.svg" alt="">
        Выбери город, чтобы получить данные о погоде.
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {computed, watch} from 'vue'
import {useQuery} from '@tanstack/vue-query'

import ActivityModeSwitch from '../components/ActivityModeSwitch.vue'
import CitySearch from '../components/CitySearch.vue'
import HourlyForecast from '../components/HourlyForecast.vue'
import RecommendationPanel from '../components/RecommendationPanel.vue'
import WeatherCard from '../components/WeatherCard.vue'
import {fetchWeather} from "../api/openMeteo.ts";
import {useWeatherStore} from "../store/weather.ts";

const weatherStore = useWeatherStore()


const weather = computed(() => weatherStore.weather)
const selectedCity = computed(() => weatherStore.selectedCity)

const weatherQuery = useQuery({
  queryKey: computed(() => ['weather', selectedCity.value?.id]),
  queryFn: () => {
    if (!selectedCity.value) {
      throw new Error('Город не выбран')
    }

    return fetchWeather(selectedCity.value)
  },
  enabled: computed(() => !!selectedCity.value),
})

watch(
    () => weatherQuery.data.value,
    (value) => {
      if (!value) return

      weatherStore.setWeather(value.current)
      weatherStore.setHourlyForecast(value.hourly)
    },
    {immediate: true},
)
</script>
<style lang="scss">
.weather-card__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  min-height: 220px;
  text-align: center;

  img {
    width: 100%;
    max-width: 360px;
  }
}
</style>