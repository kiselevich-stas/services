<template>
  <form class="panel countdown-form" @submit.prevent="handleSubmit">
    <div class="panel__header">
      <h2 class="panel__title">{{ submitLabel }}</h2>
      <p class="panel__text">
        Создай отдельное ожидание и храни его уже в Supabase.
      </p>
    </div>

    <div class="countdown-form__grid">
      <UiInput
          v-model="form.title"
          label="Название"
          type="text"
          required
          placeholder="Например: День рождения"
          :error="errors.title"
          @blur="handleBlur('title')"
          @update:model-value="handleInput('title')"
      />

      <UiDateTimeInput
          v-model="form.targetDate"
          label="Дата и время"
          required
          :error="errors.targetDate"
          @blur="handleBlur('targetDate')"
          @update:model-value="handleInput('targetDate')"
      />

      <div class="countdown-form__full">
        <UiTextarea
            v-model="form.description"
            label="Описание"
            placeholder="Почему ты так ждёшь это событие?"
            :error="errors.description"
            @blur="handleBlur('description')"
            @update:model-value="handleInput('description')"
        />
      </div>

      <UiInput
          v-model="form.emoji"
          label="Эмодзи"
          type="text"
          maxlength="10"
          placeholder="✨"
          :error="errors.emoji"
          @blur="handleBlur('emoji')"
          @update:model-value="handleInput('emoji')"
      />

      <UiSelect
          v-model="form.mood"
          label="Настроение"
          :options="COUNTDOWN_MOODS"
          :error="errors.mood"
          @blur="handleBlur('mood')"
          @update:model-value="handleInput('mood')"
      />

      <div class="countdown-form__full countdown-form__colors-block">
        <span class="countdown-form__colors-label">Цвет</span>

        <div class="countdown-form__colors">
          <button
              v-for="color in COUNTDOWN_COLORS"
              :key="color"
              type="button"
              class="countdown-form__color"
              :class="{ 'countdown-form__color--active': form.color === color }"
              :style="{ '--countdown-color': color }"
              @click="handleColorSelect(color)"
          />
        </div>

        <p v-if="errors.color" class="countdown-form__error">
          {{ errors.color }}
        </p>
      </div>
    </div>

    <div class="countdown-form__actions">
      <UiButton type="submit">
        {{ submitLabel }}
      </UiButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import UiInput from '../../../components/ui/UiInput.vue'
import UiTextarea from '../../../components/ui/UiTextarea.vue'
import UiButton from '../../../components/ui/UiButton.vue'
import UiDateTimeInput from '../../../components/ui/UiDateTimeInput.vue'
import UiSelect from '../../../components/ui/UiSelect.vue'

import { useZodForm } from '../../../shared/composables/useZodForm'
import { countdownSchema } from '../schema/countdown.schema'

import {
  COUNTDOWN_COLORS,
  COUNTDOWN_MOODS,
  DEFAULT_COUNTDOWN_FORM,
} from '../constants/presets'
import type { CountdownEvent, CountdownFormValues } from '../types/countdown'

interface Props {
  modelValue?: CountdownEvent | null
  submitLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  submitLabel: 'Сохранить событие',
})

const emit = defineEmits<{
  submit: [value: CountdownFormValues]
}>()

const form = ref<CountdownFormValues>({
  ...DEFAULT_COUNTDOWN_FORM,
})

const {
  errors,
  validateForm,
  handleBlur,
  handleInput,
  resetErrors,
} = useZodForm(countdownSchema, form)

function syncForm(value: CountdownEvent | null): void {
  if (!value) {
    form.value = {
      ...DEFAULT_COUNTDOWN_FORM,
    }

    resetErrors()
    return
  }

  form.value = {
    title: value.title,
    description: value.description,
    targetDate: value.targetDate.slice(0, 16),
    emoji: value.emoji,
    mood: value.mood,
    color: value.color,
  }

  resetErrors()
}

function handleColorSelect(color: string): void {
  form.value.color = color
  handleInput('color')()
}

function handleSubmit(): void {
  const isValid = validateForm()

  if (!isValid) {
    return
  }

  emit('submit', {
    ...form.value,
    targetDate: new Date(form.value.targetDate).toISOString(),
    emoji: form.value.emoji || '✨',
  })
}

watch(
    () => props.modelValue,
    (value) => {
      syncForm(value)
    },
    { immediate: true },
)
</script>

<style scoped lang="scss">
.countdown-form {
  display: grid;
  gap: 18px;

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
  }

  &__full {
    grid-column: 1 / -1;
  }

  &__select-field {
    display: grid;
    gap: 8px;
  }

  &__select-label,
  &__colors-label {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.72);
  }

  &__select {
    width: 100%;
    min-height: 52px;
    padding: 12px 14px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    background: rgba(15, 23, 42, 0.8);
    color: #fff;
    outline: none;
  }

  &__colors-block {
    display: grid;
    gap: 10px;
  }

  &__colors {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  &__color {
    width: 34px;
    height: 34px;
    padding: 0;
    border-radius: 999px;
    border: 2px solid transparent;
    background: var(--countdown-color);
    cursor: pointer;
    transition: 0.2s ease;

    &:hover {
      transform: translateY(-1px);
    }

    &--active {
      border-color: #ffffff;
      box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.18);
    }
  }

  &__error {
    margin: 0;
    font-size: 13px;
    color: #fca5a5;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
  }
}

@media (max-width: 768px) {
  .countdown-form {
    &__grid {
      grid-template-columns: 1fr;
    }

    &__full {
      grid-column: auto;
    }

    &__actions {
      justify-content: stretch;
    }
  }
}
</style>