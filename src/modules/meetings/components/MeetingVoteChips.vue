<script setup lang="ts">
import type { MeetingVoteStatus } from '../types'

const props = defineProps<{
  modelValue: MeetingVoteStatus
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: MeetingVoteStatus]
}>()

const options: Array<{ label: string; value: MeetingVoteStatus }> = [
  { label: 'Приду', value: 'going' },
  { label: 'Возможно', value: 'maybe' },
  { label: 'Не приду', value: 'not_going' },
]

function select(value: MeetingVoteStatus) {
  if (props.disabled) {
    return
  }

  emit('update:modelValue', value)
}
</script>

<template>
  <div class="meeting-vote-chips">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      class="meeting-vote-chips__item"
      :class="{ 'is-active': modelValue === option.value }"
      :disabled="disabled"
      @click="select(option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.meeting-vote-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;

  &__item {
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.03);
    color: #f4f4f5;
    border-radius: 999px;
    padding: 8px 12px;
    font-size: 12px;
    letter-spacing: 0.02em;
    transition: 0.2s ease;

    &.is-active {
      background: rgba(255, 255, 255, 0.12);
      border-color: rgba(255, 255, 255, 0.24);
    }
  }
}
</style>
