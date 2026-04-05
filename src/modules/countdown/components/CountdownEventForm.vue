<template>
  <form class="panel countdown-form" @submit.prevent="handleSubmit">
    <div class="panel__header">
      <h2 class="panel__title">{{ submitLabel }}</h2>
      <p class="panel__text">Создай отдельное ожидание и храни его в приложении.</p>
    </div>

    <div class="countdown-form__grid">
      <label class="countdown-field">
        <span>Название</span>
        <input v-model="form.title" type="text" required placeholder="Например: День рождения" />
      </label>

      <label class="countdown-field">
        <span>Дата и время</span>
        <input v-model="form.targetDate" type="datetime-local" required />
      </label>

      <label class="countdown-field countdown-field--full">
        <span>Описание</span>
        <textarea v-model="form.description" rows="3" placeholder="Почему ты так ждёшь это событие?"></textarea>
      </label>

      <label class="countdown-field">
        <span>Эмодзи</span>
        <input v-model="form.emoji" type="text" maxlength="2" placeholder="🎂" />
      </label>

      <label class="countdown-field">
        <span>Настроение</span>
        <select v-model="form.mood">
          <option v-for="mood in COUNTDOWN_MOODS" :key="mood.value" :value="mood.value">
            {{ mood.label }}
          </option>
        </select>
      </label>

      <div class="countdown-field countdown-field--full">
        <span>Цвет карточки</span>
        <div class="countdown-colors">
          <button
            v-for="color in COUNTDOWN_COLORS"
            :key="color"
            type="button"
            class="countdown-colors__item"
            :class="{ 'countdown-colors__item--active': form.color === color }"
            :style="{ backgroundColor: color }"
            @click="form.color = color"
          />
        </div>
      </div>
    </div>

    <button type="submit" class="countdown-submit">{{ submitLabel }}</button>
  </form>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

import { COUNTDOWN_COLORS, COUNTDOWN_MOODS, DEFAULT_COUNTDOWN } from '../constants/presets'
import type { CountdownEvent, CountdownFormValues } from '../types/countdown'

const props = defineProps<{
  modelValue?: CountdownEvent | null
  submitLabel?: string
}>()

const emit = defineEmits<{
  (event: 'submit', values: CountdownFormValues): void
}>()

const form = reactive<CountdownFormValues>({
  title: DEFAULT_COUNTDOWN.title,
  description: DEFAULT_COUNTDOWN.description,
  targetDate: DEFAULT_COUNTDOWN.targetDate.slice(0, 16),
  emoji: DEFAULT_COUNTDOWN.emoji,
  mood: DEFAULT_COUNTDOWN.mood,
  color: DEFAULT_COUNTDOWN.color,
})

watch(
  () => props.modelValue,
  (value) => {
    if (!value) return

    form.title = value.title
    form.description = value.description
    form.targetDate = value.targetDate.slice(0, 16)
    form.emoji = value.emoji
    form.mood = value.mood
    form.color = value.color
  },
  { immediate: true },
)

function handleSubmit(): void {
  emit('submit', {
    ...form,
    targetDate: new Date(form.targetDate).toISOString(),
    emoji: form.emoji || '✨',
  })
}
</script>

<style scoped lang="scss">
.countdown-form {
  display: flex;
  flex-direction: column;
  gap: 18px;

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }
}

.countdown-field {
  display: flex;
  flex-direction: column;
  gap: 8px;

  span {
    font-size: 14px;
    color: rgba(255,255,255,0.72);
  }

  input,
  textarea,
  select {
    width: 100%;
    padding: 12px 14px;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px;
    background: rgba(15, 23, 42, 0.7);
    color: #fff;
  }

  &--full {
    grid-column: 1 / -1;
  }
}

.countdown-colors {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;

  &__item {
    width: 34px;
    height: 34px;
    border: 2px solid transparent;
    border-radius: 50%;
    cursor: pointer;

    &--active {
      border-color: #fff;
      box-shadow: 0 0 0 3px rgba(255,255,255,0.18);
    }
  }
}

.countdown-submit {
  align-self: flex-start;
  padding: 12px 18px;
  border: 0;
  border-radius: 14px;
  background: linear-gradient(135deg, #8B5CF6, #EC4899);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}

@media (max-width: 768px) {
  .countdown-form__grid {
    grid-template-columns: 1fr;
  }
}
</style>
