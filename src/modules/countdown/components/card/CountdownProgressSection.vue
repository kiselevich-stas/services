<template>
  <div class="countdown-progress">
    <div class="countdown-progress__head">
      <div>
        <p class="countdown-progress__label">Прогресс ожидания</p>
        <strong class="countdown-progress__value">{{ normalizedProgress }}%</strong>
      </div>

      <div class="countdown-progress__pill">
        {{ hint }}
      </div>
    </div>

    <div class="countdown-progress__bar">
      <div
          class="countdown-progress__fill"
          :class="{
          'countdown-progress__fill--shimmer': shouldShowShimmer,
        }"
          :style="{ width: `${normalizedProgress}%` }"
      />
    </div>

    <div class="countdown-progress__meta">
      <span>{{ milestone }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  progress: number
  hint: string
  milestone: string
}>()

const normalizedProgress = computed(() => {
  return Math.max(0, Math.min(100, Math.round(props.progress)))
})

const shouldShowShimmer = computed(() => {
  return normalizedProgress.value >= 12
})
</script>

<style scoped lang="scss">
.countdown-progress {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);

  &__head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
  }

  &__label {
    margin: 0 0 4px;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.66);
  }

  &__value {
    font-size: 28px;
    line-height: 1;
  }

  &__pill {
    padding: 8px 12px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.06);
    color: rgba(255, 255, 255, 0.78);
    font-size: 13px;
    white-space: nowrap;
  }

  &__bar {
    position: relative;
    overflow: hidden;
    height: 12px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.08);
  }

  &__fill {
    position: relative;
    height: 100%;
    min-width: 6px;
    border-radius: inherit;
    overflow: hidden;
    background: linear-gradient(
            90deg,
            color-mix(in srgb, var(--countdown-accent) 70%, white 8%),
            color-mix(in srgb, var(--countdown-accent) 95%, white 16%)
    );
    transition: width 0.5s ease;

    &--shimmer::after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      width: 36px;
      left: -40px;
      background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.22),
              transparent
      );
      animation: countdownProgressShimmer 2.2s linear infinite;
      pointer-events: none;
    }
  }

  &__meta {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.66);
  }
}

@keyframes countdownProgressShimmer {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(220px);
  }
}

@media (max-width: 720px) {
  .countdown-progress__head {
    flex-direction: column;
  }

  .countdown-progress__pill {
    white-space: normal;
  }
}
</style>