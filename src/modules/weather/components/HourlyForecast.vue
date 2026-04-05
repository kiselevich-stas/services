<template>
  <section class="panel hourly-forecast__panel">
    <div class="panel__header">
      <h2 class="panel__title">Ближайшие часы</h2>
      <p class="panel__text">Быстрый прогноз на ближайшие 12 часов.</p>
    </div>

    <div v-if="items.length" class="hourly-grid">
      <div v-for="item in items" :key="item.time" class="hourly-card">
        <div class="hourly-card__time">{{ formatHour(item.time) }}</div>
        <div class="hourly-card__temp">{{ item.temperature }}°</div>
        <div class="hourly-card__meta">Осадки: {{ item.precipitationProbability }}%</div>
        <div class="hourly-card__meta">Ветер: {{ item.windSpeed }} км/ч</div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWeatherStore} from "../store/weather.ts";
import { formatHour} from "../utils/format.ts";

const weatherStore = useWeatherStore()
const items = computed(() => weatherStore.hourlyForecast)
</script>
<style lang="scss">
.hourly-forecast__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  min-height: 220px;
  text-align: center;
  img{
    width: 100%;
    max-width: 360px;
  }
}

.hourly-forecast__hint {
  margin: 0;
  color: rgba(226, 232, 240, 0.72);
  font-size: 14px;
  line-height: 1.4;
}
.hourly-forecast__panel{
  overflow: auto;
}
</style>