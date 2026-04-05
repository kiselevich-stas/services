<template>
  <section class="panel">
    <div class="panel__header">
      <h2 class="panel__title">Мои ожидания</h2>
      <p class="panel__text">Выбирай событие и смотри, сколько осталось.</p>
    </div>

    <div class="countdown-list">
      <button
        v-for="event in events"
        :key="event.id"
        type="button"
        class="countdown-list__item"
        :class="{ 'countdown-list__item--active': event.id === activeId }"
        @click="$emit('select', event.id)"
      >
        <div>
          <div class="countdown-list__title">{{ event.emoji }} {{ event.title }}</div>
          <div class="countdown-list__date">{{ formatCountdownDate(event.targetDate) }}</div>
        </div>

        <span class="countdown-list__dot" :style="{ backgroundColor: event.color }"></span>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { CountdownEvent } from '../types/countdown'
import { formatCountdownDate } from '../utils/date'

defineProps<{
  events: CountdownEvent[]
  activeId: string | null
}>()

defineEmits<{
  (event: 'select', id: string): void
}>()
</script>

<style scoped lang="scss">
.countdown-list {
  display: flex;
  flex-direction: column;
  gap: 10px;

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    width: 100%;
    padding: 14px 16px;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 18px;
    background: rgba(255,255,255,0.04);
    color: inherit;
    cursor: pointer;
    text-align: left;
    transition: transform 0.2s ease, border-color 0.2s ease;

    &:hover {
      transform: translateY(-1px);
      border-color: rgba(255,255,255,0.18);
    }

    &--active {
      border-color: rgba(255,255,255,0.26);
      background: rgba(255,255,255,0.08);
    }
  }

  &__title {
    font-weight: 600;
  }

  &__date {
    margin-top: 4px;
    color: rgba(255,255,255,0.64);
    font-size: 13px;
  }

  &__dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    flex-shrink: 0;
  }
}
</style>
