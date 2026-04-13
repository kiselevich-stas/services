<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import UiButton from '../../../components/ui/UiButton.vue'
import UiCombobox from '../../../components/ui/UiCombobox.vue'
import UiInput from '../../../components/ui/UiInput.vue'
import UiTextarea from '../../../components/ui/UiTextarea.vue'

import { useZodForm } from '../../../shared/composables/useZodForm'
import { useProjectStore } from '../store/project'
import {
  getDefaultWorklogValues,
  toWorklogPayload,
  worklogSchema,
} from '../schema/worklog.schema'

import type {
  WorkLog,
  WorkLogFormValues,
  WorkLogInsertPayload,
} from '../types'

interface Props {
  modelValue?: WorkLog | null
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  loading: false,
})

const emit = defineEmits<{
  submit: [payload: WorkLogInsertPayload]
  cancel: []
}>()

const projectStore = useProjectStore()

const form = ref<WorkLogFormValues>(getDefaultWorklogValues())

const {
  errors,
  validateForm,
  handleBlur,
  handleInput,
  resetErrors,
} = useZodForm(worklogSchema, form)

const isEditMode = computed(() => Boolean(props.modelValue?.id))

const submitLabel = computed(() => {
  if (props.loading) {
    return isEditMode.value ? 'Сохраняем…' : 'Добавляем…'
  }

  return isEditMode.value ? 'Сохранить изменения' : 'Добавить запись'
})

function syncForm(value: WorkLog | null): void {
  if (!value) {
    form.value = getDefaultWorklogValues()
    resetErrors()
    return
  }

  form.value = {
    workDate: value.workDate,
    hours: String(value.hours),
    projectId: value.projectId,
    note: value.note ?? '',
  }

  resetErrors()
}

function handleProjectChange(value: string): void {
  form.value.projectId = value
}

function handleSubmit(): void {
  const isValid = validateForm()

  if (!isValid) {
    return
  }

  emit('submit', toWorklogPayload(form.value))

  if (!isEditMode.value) {
    form.value = getDefaultWorklogValues()
    resetErrors()
  }
}

function handleCancel(): void {
  syncForm(null)
  emit('cancel')
}

watch(
    () => props.modelValue,
    (value) => {
      syncForm(value)
    },
    { immediate: true },
)
</script>

<template>
  <section class="panel worklog-card worklog-card--sticky worklog-form-card">
    <div class="worklog-card__glow" />

    <div class="worklog-card__header">
      <p class="worklog-card__eyebrow">Worklog</p>

      <h2 class="worklog-card__title">
        {{ isEditMode ? 'Редактирование записи' : 'Новая запись по времени' }}
      </h2>

      <p class="worklog-card__text">
        Добавь рабочие часы по проекту, чтобы видеть красивую статистику и динамику нагрузки.
      </p>
    </div>

    <form class="worklog-form" @submit.prevent="handleSubmit">
      <UiInput
          v-model="form.workDate"
          label="Дата"
          type="date"
          required
          :error="errors.workDate"
          @blur="handleBlur('workDate')"
          @update:model-value="handleInput('workDate')"
      />

      <UiInput
          v-model="form.hours"
          label="Часы"
          type="number"
          required
          placeholder="Например, 8"
          :error="errors.hours"
          step="any"
          min="0"
          @blur="handleBlur('hours')"
          @update:model-value="handleInput('hours')"
      />

      <UiCombobox
          :model-value="form.projectId"
          class="worklog-form__full"
          label="Проект"
          placeholder="Выберите проект"
          :options="projectStore.projectOptions"
          :error="errors.projectId"
          @update:model-value="handleProjectChange"
          @blur="handleBlur('projectId')"
      />

      <UiTextarea
          v-model="form.note"
          class="worklog-form__full"
          label="Комментарий"
          placeholder="Что именно было сделано за это время?"
          :error="errors.note"
          @blur="handleBlur('note')"
          @update:model-value="handleInput('note')"
      />

      <div class="worklog-form__actions">
        <UiButton type="submit" :loading="loading">
          {{ submitLabel }}
        </UiButton>

        <UiButton
            v-if="isEditMode"
            type="button"
            variant="secondary"
            :disabled="loading"
            @click="handleCancel"
        >
          Отмена
        </UiButton>
      </div>
    </form>
  </section>
</template>

<style scoped lang="scss">
.worklog-form-card {
  position: relative;
}

.worklog-card--sticky {
  position: sticky;
  top: 20px;
}

.worklog-card__glow {
  position: absolute;
  inset: -20% auto auto -8%;
  width: 180px;
  height: 180px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(236, 72, 153, 0.18), transparent 68%);
  pointer-events: none;
}

.worklog-card__header {
  position: relative;
  z-index: 1;
  margin-bottom: 18px;
}

.worklog-card__eyebrow {
  margin: 0 0 8px;
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(236, 72, 153, 0.9);
}

.worklog-card__title {
  margin: 0;
  font-size: clamp(24px, 2.2vw, 30px);
  line-height: 1.1;
  color: #fff;
}

.worklog-card__text {
  margin: 10px 0 0;
  max-width: 520px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.55;
}

.worklog-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.worklog-form__full {
  grid-column: 1 / -1;
}

.worklog-form__actions {
  grid-column: 1 / -1;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 4px;
  justify-content: flex-end;
}

@media (max-width: 780px) {
  .worklog-card--sticky {
    position: static;
  }

  .worklog-form {
    grid-template-columns: 1fr;
  }
}
</style>