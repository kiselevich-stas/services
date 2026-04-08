<script setup lang="ts">
import UiBadge from './ui/UiBadge.vue'
import type { SpaceMeeting } from '../types/spaces.types'

defineProps<{
  meetings: SpaceMeeting[]
}>()

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    weekday: 'short',
    day: '2-digit',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}
</script>

<template>
  <section class="space-block">
    <div class="space-block__header">
      <h2>Встречи</h2>
      <span>{{ meetings.length }}</span>
    </div>

    <div v-if="meetings.length" class="timeline">
      <article v-for="meeting in meetings" :key="meeting.id" class="timeline__item">
        <div class="timeline__dot" />

        <div class="timeline__card">
          <div class="timeline__top">
            <div>
              <h3>{{ meeting.title }}</h3>
              <p>{{ meeting.description || 'Без описания' }}</p>
            </div>
            <UiBadge :tone="meeting.status === 'planned' ? 'warning' : 'neutral'">
              {{ meeting.status }}
            </UiBadge>
          </div>

          <div class="timeline__meta">
            <span>{{ formatDate(meeting.starts_at) }}</span>
            <span>{{ meeting.place_title }}</span>
            <span>{{ meeting.place_address }}</span>
          </div>
        </div>
      </article>
    </div>

    <div v-else class="timeline__empty">
      Пока нет встреч. Создай первую внутри этого пространства.
    </div>
  </section>
</template>

<style scoped lang="scss">
.space-block {
  padding: 24px;
  border-radius: 28px;
  background: #fff;
  border: 1px solid #eef2f7;
  box-shadow: 0 16px 40px rgba(17, 24, 39, .05);
}
.space-block__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;

  h2 {
    margin: 0;
    font-size: 20px;
  }

  span {
    color: #6b7280;
    font-weight: 700;
  }
}
.timeline {
  display: grid;
  gap: 14px;
}
.timeline__item {
  display: grid;
  grid-template-columns: 16px 1fr;
  gap: 12px;
}
.timeline__dot {
  width: 12px;
  height: 12px;
  margin-top: 18px;
  border-radius: 999px;
  background: #111827;
}
.timeline__card {
  padding: 16px;
  border-radius: 18px;
  background: #f9fafb;
}
.timeline__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;

  h3 {
    margin: 0 0 6px;
    font-size: 16px;
  }

  p {
    margin: 0;
    color: #6b7280;
    line-height: 1.5;
  }
}
.timeline__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;

  span {
    padding: 8px 10px;
    border-radius: 999px;
    background: #fff;
    color: #374151;
    font-size: 12px;
  }
}
.timeline__empty {
  padding: 18px;
  border-radius: 18px;
  background: #f9fafb;
  color: #6b7280;
}
</style>
