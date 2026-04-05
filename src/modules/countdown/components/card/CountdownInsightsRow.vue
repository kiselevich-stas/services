<template>
  <div class="countdown-insights">
    <div class="countdown-chip">
      <span class="countdown-chip__label">Мотивация</span>
      <strong>{{ lead }}</strong>
    </div>

    <div class="countdown-chip">
      <span class="countdown-chip__label">Уже позади</span>
      <strong>{{ passed }}</strong>
    </div>

    <div class="countdown-chip">
      <span class="countdown-chip__label">Осталось</span>
      <strong>{{ remaining }}</strong>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  lead: string
  passed: string
  remaining: string
}>()
</script>

<style scoped lang="scss">
.countdown-insights {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.countdown-chip {
  padding: 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.05);

  &__label {
    display: block;
    margin-bottom: 8px;
    font-size: 12px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.58);
  }

  strong {
    font-size: 16px;
    line-height: 1.4;
  }
}

@media (max-width: 720px) {
  .countdown-insights {
    grid-template-columns: 1fr;
  }
}
</style>