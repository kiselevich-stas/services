<template>
  <div class="countdown-metrics">
    <div class="countdown-metric">
      <span>Дни</span>
      <strong>{{ diff.days }}</strong>
    </div>

    <div class="countdown-metric">
      <span>Часы</span>
      <strong>{{ diff.hours }}</strong>
    </div>

    <div class="countdown-metric">
      <span>Минуты</span>
      <strong>{{ diff.minutes }}</strong>
    </div>

    <div class="countdown-metric">
      <span>Секунды</span>
      <strong>{{ diff.seconds }}</strong>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CountdownDiff } from '../types/countdown'

defineProps<{
  diff: CountdownDiff
}>()
</script>

<style scoped lang="scss">
.countdown-metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.countdown-metric {
  padding: 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.06);

  span,
  strong {
    display: block;
  }

  span {
    margin-bottom: 6px;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.7);
  }

  strong {
    font-size: 28px;
    line-height: 1;
  }
}

@media (max-width: 720px) {
  .countdown-metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>