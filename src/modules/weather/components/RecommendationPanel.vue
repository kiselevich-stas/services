<template>
  <section class="panel recommendation-panel">
    <div class="panel__header">
      <h2 class="panel__title">Итоговая рекомендация</h2>
      <p class="panel__text">Ты видишь не только цифры, но и вывод.</p>
    </div>

    <p class="recommendation-panel__lead">
      {{ recommendation }}
    </p>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useWeatherStore } from '../store/weather'

const weatherStore = useWeatherStore()
const recommendation = computed(() => weatherStore.recommendation)
</script>
