<script setup lang="ts">
import { computed, reactive, watch } from 'vue'

import UiButton from '../../../components/ui/UiButton.vue'
import UiInput from '../../../components/ui/UiInput.vue'
import UiSelect from '../../../components/ui/UiSelect.vue'
import UiTextarea from '../../../components/ui/UiTextarea.vue'

import {
  DEFAULT_VACATION_PLAN_FORM,
  VACATION_COLORS,
  VACATION_EMOJIS,
  VACATION_STATUSES,
} from '../constants/presets'
import { vacationPlanSchema } from '../schema/vacation.schema'
import type { VacationPlanFormValues } from '../types/vacation'

const props = withDefaults(
    defineProps<{
      initialValues?: Partial<VacationPlanFormValues>
      submitText?: string
      loading?: boolean
    }>(),
    {
      submitText: 'Сохранить',
      loading: false,
    },
)

const emit = defineEmits<{
  submit: [values: VacationPlanFormValues]
}>()

const form = reactive<VacationPlanFormValues>({
  ...DEFAULT_VACATION_PLAN_FORM,
  ...props.initialValues,
})

const errors = reactive<Record<string, string>>({})

watch(
    () => props.initialValues,
    (values) => {
      Object.assign(form, DEFAULT_VACATION_PLAN_FORM, values ?? {})
    },
    { deep: true },
)

const statusOptions = computed(() => {
  return VACATION_STATUSES.map((status) => ({
    label: status.label,
    value: status.value,
  }))
})

const travelersCountModel = computed({
  get: () => String(form.travelersCount),
  set: (value: string) => {
    const parsedValue = Number(value)
    form.travelersCount = Number.isNaN(parsedValue) ? 1 : parsedValue
  },
})

const budgetModel = computed({
  get: () => (form.budget === null ? '' : String(form.budget)),
  set: (value: string) => {
    if (!value.trim()) {
      form.budget = null
      return
    }

    const parsedValue = Number(value)
    form.budget = Number.isNaN(parsedValue) ? null : parsedValue
  },
})

function clearErrors(): void {
  Object.keys(errors).forEach((key) => {
    delete errors[key]
  })
}

function handleSubmit(): void {
  clearErrors()

  const result = vacationPlanSchema.safeParse({
    ...form,
    travelersCount: Number(form.travelersCount),
    budget: form.budget,
  })

  if (!result.success) {
    result.error.issues.forEach((issue) => {
      const fieldName = issue.path[0]

      if (typeof fieldName === 'string' && !errors[fieldName]) {
        errors[fieldName] = issue.message
      }
    })

    return
  }

  emit('submit', result.data)
}
</script>

<template>
  <form class="vacation-form" @submit.prevent="handleSubmit">
    <div class="vacation-form__grid">
      <div class="vacation-form__field vacation-form__field--full">
        <UiInput
            v-model="form.title"
            label="Название"
            placeholder="Например, Летний отпуск в Сочи"
            :error="errors.title"
        />
      </div>

      <div class="vacation-form__field vacation-form__field--full">
        <UiTextarea
            v-model="form.description"
            label="Описание"
            placeholder="Коротко опиши поездку, настроение, идеи или важные детали"
            :error="errors.description"
            :rows="4"
        />
      </div>

      <div class="vacation-form__field vacation-form__field--full">
        <UiInput
            v-model="form.destination"
            label="Направление"
            placeholder="Сочи, Россия"
            :error="errors.destination"
        />
      </div>

      <div class="vacation-form__field">
        <UiInput
            v-model="form.startDate"
            label="Дата начала"
            type="date"
            :error="errors.startDate"
        />
      </div>

      <div class="vacation-form__field">
        <UiInput
            v-model="form.endDate"
            label="Дата окончания"
            type="date"
            :error="errors.endDate"
        />
      </div>

      <div class="vacation-form__field">
        <UiSelect
            v-model="form.status"
            label="Статус"
            :options="statusOptions"
            :error="errors.status"
        />
      </div>

      <div class="vacation-form__field">
        <UiInput
            v-model="travelersCountModel"
            label="Путешественников"
            type="number"
            placeholder="1"
            :error="errors.travelersCount"
        />
      </div>

      <div class="vacation-form__field">
        <UiInput
            v-model="budgetModel"
            label="Бюджет"
            type="number"
            placeholder="100000"
            :error="errors.budget"
        />
      </div>

      <div class="vacation-form__field vacation-form__field--full">
        <p class="vacation-form__section-label">Эмодзи</p>

        <div class="vacation-form__emoji-grid">
          <button
              v-for="emoji in VACATION_EMOJIS"
              :key="emoji"
              type="button"
              class="vacation-form__emoji"
              :class="{ 'is-active': form.emoji === emoji }"
              @click="form.emoji = emoji"
          >
            {{ emoji }}
          </button>
        </div>

        <p v-if="errors.emoji" class="vacation-form__error">
          {{ errors.emoji }}
        </p>
      </div>

      <div class="vacation-form__field vacation-form__field--full">
        <p class="vacation-form__section-label">Цвет</p>

        <div class="vacation-form__color-grid">
          <button
              v-for="color in VACATION_COLORS"
              :key="color"
              type="button"
              class="vacation-form__color"
              :class="{ 'is-active': form.color === color }"
              :style="{ '--vacation-color': color }"
              @click="form.color = color"
          />
        </div>

        <p v-if="errors.color" class="vacation-form__error">
          {{ errors.color }}
        </p>
      </div>

      <div class="vacation-form__field vacation-form__field--full">
        <label class="vacation-form__checkbox">
          <input v-model="form.isFavorite" type="checkbox" />
          <span>Добавить в избранное</span>
        </label>
      </div>
    </div>

    <div class="vacation-form__footer">
      <UiButton
          type="submit"
          :loading="loading"
          :disabled="loading"
      >
        {{ submitText }}
      </UiButton>
    </div>
  </form>
</template>

<style scoped lang="scss">
.vacation-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.vacation-form__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.vacation-form__field {
  min-width: 0;

  &--full {
    grid-column: 1 / -1;
  }
}

.vacation-form__section-label {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.86);
}

.vacation-form__emoji-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.vacation-form__emoji {
  width: 52px;
  height: 52px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  transition:
      transform 0.18s ease,
      border-color 0.18s ease,
      background 0.18s ease,
      box-shadow 0.18s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(255, 255, 255, 0.14);
    background: rgba(255, 255, 255, 0.07);
  }

  &.is-active {
    border-color: rgba(139, 92, 246, 0.65);
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.16);
    background: rgba(139, 92, 246, 0.14);
  }
}

.vacation-form__color-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.vacation-form__color {
  width: 38px;
  height: 38px;
  border: 2px solid transparent;
  border-radius: 999px;
  background: var(--vacation-color);
  cursor: pointer;
  transition:
      transform 0.18s ease,
      box-shadow 0.18s ease,
      border-color 0.18s ease;

  &:hover {
    transform: scale(1.06);
  }

  &.is-active {
    border-color: #fff;
    box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.1);
  }
}

.vacation-form__checkbox {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: rgba(255, 255, 255, 0.84);
  font-size: 14px;

  input {
    accent-color: #8b5cf6;
  }
}

.vacation-form__error {
  margin: 10px 0 0;
  color: #f87171;
  font-size: 13px;
}

.vacation-form__footer {
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 760px) {
  .vacation-form__grid {
    grid-template-columns: 1fr;
  }
}
</style>