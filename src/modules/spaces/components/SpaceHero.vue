<script setup lang="ts">
import UiBadge from './ui/UiBadge.vue'
import UiButton from './ui/UiButton.vue'
import type { Space } from '../types/spaces.types'

defineProps<{
  space: Space
}>()

defineEmits<{
  createMeeting: []
  openInvite: []
}>()
</script>

<template>
  <section class="space-hero" :style="{ background: `linear-gradient(135deg, ${space.color}, #111827)` }">
    <div class="space-hero__content">
      <UiBadge tone="neutral">{{ space.visibility }}</UiBadge>
      <h1>{{ space.title }}</h1>
      <p>{{ space.description || 'Пространство для людей, встреч и общих планов.' }}</p>
    </div>

    <div class="space-hero__actions">
      <UiButton variant="secondary" @click="$emit('openInvite')">Пригласить</UiButton>
      <UiButton variant="ghost" @click="$emit('createMeeting')">Создать встречу</UiButton>
    </div>
  </section>
</template>

<style scoped lang="scss">
.space-hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  padding: 28px;
  border-radius: 32px;
  color: #fff;
}
.space-hero__content {
  max-width: 720px;

  h1 {
    margin: 14px 0 10px;
    font-size: clamp(28px, 4vw, 42px);
  }

  p {
    margin: 0;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.84);
  }
}
.space-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
