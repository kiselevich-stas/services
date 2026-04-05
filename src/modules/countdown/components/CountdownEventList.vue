<template>
  <section class="panel countdown-list">
    <div class="panel__header countdown-list__header">
      <div>
        <h2 class="panel__title">Мои countdown</h2>
        <p class="panel__text">Все записи подтягиваются из Supabase.</p>
      </div>

      <RouterLink class="countdown-list__add" to="/countdowns/new">
        + Новое событие
      </RouterLink>
    </div>

    <div v-if="events.length" class="countdown-list__items">
      <CountdownEventListItem
          v-for="event in events"
          :key="event.id"
          :event="event"
          :is-active="event.id === activeId"
          @select="emit('select', $event)"
      />
    </div>

    <CountdownEventListEmptyState v-else />
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

import type { CountdownEvent } from '../types/countdown'
import CountdownEventListItem from './CountdownEventListItem.vue'
import CountdownEventListEmptyState from './CountdownEventListEmptyState.vue'

defineProps<{
  events: CountdownEvent[]
  activeId?: string | null
}>()

const emit = defineEmits<{
  select: [id: string]
}>()
</script>

<style scoped lang="scss">
.countdown-list {
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
  }

  &__add {
    border-radius: 14px;
    padding: 10px 14px;
    background: rgba(255, 255, 255, 0.08);
    color: white;
    text-decoration: none;
    white-space: nowrap;
    transition:
        transform 0.2s ease,
        background 0.2s ease;

    &:hover {
      transform: translateY(-1px);
      background: rgba(255, 255, 255, 0.12);
    }
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}

@media (max-width: 720px) {
  .countdown-list__header {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>