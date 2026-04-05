<template>
  <article
      class="countdown-item"
      :class="{ 'countdown-item--active': isActive }"
      :style="{ '--countdown-accent': event.color }"
      @click="emit('select', event.id)"
  >
    <div class="countdown-item__main">
      <div class="countdown-item__emoji">{{ event.emoji || '✨' }}</div>

      <div class="countdown-item__content">
        <h3>{{ event.title }}</h3>
        <p>{{ formattedDate }}</p>
      </div>
    </div>

    <RouterLink
        class="countdown-item__link"
        :to="`/countdowns/${event.id}`"
        @click.stop
    >
      Открыть
    </RouterLink>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import type { CountdownEvent } from '../types/countdown'
import { formatCountdownDate } from '../utils/date'

const props = defineProps<{
  event: CountdownEvent
  isActive?: boolean
}>()

const emit = defineEmits<{
  select: [id: string]
}>()

const formattedDate = computed(() => {
  return formatCountdownDate(props.event.targetDate)
})
</script>

<style scoped lang="scss">
.countdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid transparent;
  cursor: pointer;
  transition:
      transform 0.2s ease,
      border-color 0.2s ease,
      background 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.055);
  }

  &--active {
    border-color: color-mix(in srgb, var(--countdown-accent) 70%, white 12%);
    background: color-mix(in srgb, var(--countdown-accent) 18%, rgba(255, 255, 255, 0.04));
  }

  &__main {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }

  &__content {
    min-width: 0;

    h3,
    p {
      margin: 0;
    }

    h3 {
      font-size: 17px;
      line-height: 1.25;
    }

    p {
      margin-top: 4px;
      color: rgba(255, 255, 255, 0.72);
      font-size: 14px;
    }
  }

  &__emoji {
    flex-shrink: 0;
    font-size: 28px;
  }

  &__link {
    flex-shrink: 0;
    color: white;
    text-decoration: none;
    opacity: 0.84;
  }
}

@media (max-width: 720px) {
  .countdown-item {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>