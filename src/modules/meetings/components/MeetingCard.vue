<script setup lang="ts">
import {computed} from 'vue'
import type {Meeting} from '../types'
import {formatMeetingDate} from '../utils/date'

const props = defineProps<{
  meeting: Meeting
}>()

const emit = defineEmits<{
  open: [meetingId: string]
}>()

const previewImageUrl = computed(() => {
  if (!props.meeting) {
    return ''
  }

  return props.meeting.place_image_url
})

</script>

<template>
  <article class="meeting-card" @click="emit('open', meeting.id)">
    <div class="meeting-card__media">
      <img :src="previewImageUrl" :alt="meeting.place_name" class="meeting-card__image"/>
    </div>

    <div class="meeting-card__content">
      <div class="meeting-card__meta">
        <span>{{ formatMeetingDate(meeting.starts_at) }}</span>
        <span>{{ meeting.place_kind || 'место' }}</span>
      </div>

      <h3 class="meeting-card__title">{{ meeting.title }}</h3>
      <p class="meeting-card__place">{{ meeting.place_name }}</p>
      <p class="meeting-card__address">{{ meeting.place_address }}</p>
    </div>
  </article>
</template>

<style scoped lang="scss">
.meeting-card {
  cursor: pointer;
  overflow: hidden;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(14, 14, 18, 0.88);
  backdrop-filter: blur(14px);
  transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(255, 255, 255, 0.16);
    background: rgba(18, 18, 22, 0.94);
  }

  &__media {
    height: 180px;
    overflow: hidden;
  }

  &__image {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: saturate(0.9) contrast(1.03);
  }

  &__content {
    padding: 18px;
  }

  &__meta {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 12px;
    color: rgba(255, 255, 255, 0.56);
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  &__title {
    margin: 0 0 8px;
    font-size: 20px;
    line-height: 1.2;
    color: #ffffff;
  }

  &__place {
    margin: 0 0 6px;
    color: rgba(255, 255, 255, 0.9);
    font-size: 15px;
  }

  &__address {
    margin: 0;
    color: rgba(255, 255, 255, 0.56);
    font-size: 14px;
    line-height: 1.45;
  }
}
</style>
