<script setup lang="ts">
import UiAvatarStack from './ui/UiAvatarStack.vue'
import UiBadge from './ui/UiBadge.vue'
import type { SpaceCardModel } from '../types/spaces.types'

const props = defineProps<{
  space: SpaceCardModel
}>()

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

const gradientStyle = {
  background: `linear-gradient(135deg, ${props.space.color}, #111827)`,
}
</script>

<template>
  <router-link :to="`/spaces/${space.id}`" class="space-card">
    <div class="space-card__cover" :style="gradientStyle">
      <UiBadge tone="neutral">Space</UiBadge>
    </div>

    <div class="space-card__body">
      <div class="space-card__top">
        <div>
          <h3>{{ space.title }}</h3>
          <p>{{ space.description || 'Без описания' }}</p>
        </div>
      </div>

      <div class="space-card__meta">
        <div>
          <strong>{{ space.members_count }}</strong>
          <span>участников</span>
        </div>

        <div v-if="space.next_meeting">
          <strong>{{ formatDate(space.next_meeting.starts_at) }}</strong>
          <span>{{ space.next_meeting.title }}</span>
        </div>

        <div v-else>
          <strong>Пока пусто</strong>
          <span>Нет ближайших встреч</span>
        </div>
      </div>

      <div class="space-card__footer">
        <UiAvatarStack :items="space.members_preview" />
        <span>Открыть пространство →</span>
      </div>
    </div>
  </router-link>
</template>

<style scoped lang="scss">
.space-card {
  display: grid;
  overflow: hidden;
  border-radius: 28px;
  background: #fff;
  color: inherit;
  text-decoration: none;
  box-shadow: 0 20px 50px rgba(17, 24, 39, 0.08);
  border: 1px solid #eef2f7;
}
.space-card__cover {
  min-height: 110px;
  padding: 16px;
}
.space-card__body {
  display: grid;
  gap: 18px;
  padding: 20px;
}
.space-card__top {
  h3 {
    margin: 0 0 8px;
    font-size: 20px;
  }

  p {
    margin: 0;
    color: #6b7280;
    line-height: 1.5;
  }
}
.space-card__meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  div {
    padding: 14px;
    border-radius: 18px;
    background: #f9fafb;
  }

  strong {
    display: block;
    color: #111827;
    font-size: 14px;
    margin-bottom: 6px;
  }

  span {
    color: #6b7280;
    font-size: 13px;
  }
}
.space-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  span {
    color: #374151;
    font-size: 14px;
    font-weight: 600;
  }
}
</style>
