<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

import UiButton from '../../../components/ui/UiButton.vue'
import UiInput from '../../../components/ui/UiInput.vue'
import UiSelect from '../../../components/ui/UiSelect.vue'

import { VACATION_CHECKLIST_CATEGORIES } from '../constants/presets'
import { vacationChecklistItemSchema } from '../schema/vacation.schema'
import type {
  VacationChecklistFileType,
  VacationChecklistItem,
  VacationChecklistItemFile,
  VacationChecklistItemFormValues,
} from '../types/vacation'

const props = defineProps<{
  items: VacationChecklistItem[]
  files: VacationChecklistItemFile[]
  loading?: boolean
  uploadLoading?: boolean
}>()

const emit = defineEmits<{
  create: [values: VacationChecklistItemFormValues]
  toggle: [payload: { id: string; isDone: boolean }]
  delete: [id: string]
  uploadFile: [payload: { checklistItemId: string; file: File; fileType: VacationChecklistFileType }]
  deleteFile: [id: string]
}>()

const form = reactive<VacationChecklistItemFormValues>({
  title: '',
  category: 'general',
  isDone: false,
  sortOrder: 0,
})

const errors = reactive<Record<string, string>>({})
const activeUploadType = ref<Record<string, VacationChecklistFileType>>({})

const categoryOptions = computed(() => {
  return VACATION_CHECKLIST_CATEGORIES.map((category) => ({
    label: category.label,
    value: category.value,
  }))
})

const progress = computed(() => {
  if (!props.items.length) {
    return 0
  }

  const doneCount = props.items.filter((item) => item.isDone).length
  return Math.round((doneCount / props.items.length) * 100)
})

function clearErrors(): void {
  Object.keys(errors).forEach((key) => delete errors[key])
}

function resetForm(): void {
  form.title = ''
  form.category = 'general'
  form.isDone = false
  form.sortOrder = props.items.length
}

function handleSubmit(): void {
  clearErrors()

  const result = vacationChecklistItemSchema.safeParse({
    ...form,
    sortOrder: props.items.length,
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

  emit('create', {
    ...result.data,
    sortOrder: props.items.length,
  })

  resetForm()
}

function getFilesByItemId(checklistItemId: string): VacationChecklistItemFile[] {
  return props.files.filter((file) => file.checklistItemId === checklistItemId)
}

function openFilePicker(checklistItemId: string, fileType: VacationChecklistFileType): void {
  activeUploadType.value[checklistItemId] = fileType
  const input = document.getElementById(`checklist-file-input-${checklistItemId}`) as HTMLInputElement | null
  input?.click()
}

function handleFileChange(checklistItemId: string, event: Event): void {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) {
    return
  }

  const fileType = activeUploadType.value[checklistItemId] ?? 'document'

  emit('uploadFile', {
    checklistItemId,
    file,
    fileType,
  })

  input.value = ''
}
</script>

<template>
  <section class="vacation-checklist">
    <div class="vacation-checklist__header">
      <div>
        <p class="vacation-checklist__eyebrow">Checklist</p>
        <h3 class="vacation-checklist__title">Подготовка к поездке</h3>
        <p class="vacation-checklist__subtitle">
          Загружай билеты, документы и все важные файлы прямо к нужному пункту.
        </p>
      </div>

      <div class="vacation-checklist__progress-card">
        <span class="vacation-checklist__progress-value">{{ progress }}%</span>
        <span class="vacation-checklist__progress-label">готовности</span>
      </div>
    </div>

    <div class="vacation-checklist__bar">
      <span class="vacation-checklist__bar-fill" :style="{ width: `${progress}%` }" />
    </div>

    <form class="vacation-checklist__form" @submit.prevent="handleSubmit">
      <UiInput
          v-model="form.title"
          label="Новый пункт"
          placeholder="Например, Купить билеты"
          :error="errors.title"
      />

      <UiSelect
          v-model="form.category"
          label="Категория"
          :options="categoryOptions"
          :error="errors.category"
      />

      <div class="vacation-checklist__submit">
        <UiButton
            type="submit"
            full-width
            :loading="loading"
            :disabled="loading"
        >
          Добавить
        </UiButton>
      </div>
    </form>

    <div v-if="items.length" class="vacation-checklist__list">
      <article
          v-for="item in items"
          :key="item.id"
          class="vacation-checklist__item"
          :class="{ 'is-done': item.isDone }"
      >
        <input
            :id="`checklist-file-input-${item.id}`"
            type="file"
            class="vacation-checklist__hidden-input"
            @change="handleFileChange(item.id, $event)"
        />

        <div class="vacation-checklist__item-main">
          <label class="vacation-checklist__checkbox">
            <input
                :checked="item.isDone"
                type="checkbox"
                @change="emit('toggle', { id: item.id, isDone: !item.isDone })"
            />

            <div>
              <div class="vacation-checklist__item-title">
                {{ item.title }}
              </div>
              <div class="vacation-checklist__item-category">
                {{ item.category }}
              </div>
            </div>
          </label>

          <div class="vacation-checklist__item-actions">
            <UiButton
                size="sm"
                variant="ghost"
                @click="openFilePicker(item.id, 'document')"
            >
              + Документ
            </UiButton>

            <UiButton
                size="sm"
                variant="ghost"
                @click="openFilePicker(item.id, 'ticket')"
            >
              + Билет
            </UiButton>

            <UiButton
                size="sm"
                variant="danger-soft"
                @click="emit('delete', item.id)"
            >
              Удалить
            </UiButton>
          </div>
        </div>

        <div
            v-if="getFilesByItemId(item.id).length"
            class="vacation-checklist__files"
        >
          <a
              v-for="file in getFilesByItemId(item.id)"
              :key="file.id"
              class="vacation-checklist__file"
              :href="file.signedUrl || '#'"
              target="_blank"
              rel="noreferrer"
          >
            <div class="vacation-checklist__file-meta">
              <span class="vacation-checklist__file-badge">
                {{ file.fileType === 'ticket' ? 'Билет' : 'Документ' }}
              </span>
              <span class="vacation-checklist__file-name">
                {{ file.fileName }}
              </span>
            </div>

            <UiButton
                size="sm"
                variant="danger-soft"
                @click.prevent="emit('deleteFile', file.id)"
            >
              Удалить файл
            </UiButton>
          </a>
        </div>
      </article>
    </div>

    <div v-else class="vacation-checklist__empty">
      <div class="vacation-checklist__empty-icon">🧳</div>
      <p class="vacation-checklist__empty-title">Чеклист пока пуст</p>
      <p class="vacation-checklist__empty-text">
        Добавь документы, брони, вещи или важные дела перед поездкой.
      </p>
    </div>
  </section>
</template>

<style scoped lang="scss">
.vacation-checklist {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 28px;
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background:
      radial-gradient(circle at top right, rgba(139, 92, 246, 0.16), transparent 26%),
      linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04)),
      rgba(10, 14, 24, 0.92);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(18px);
}

.vacation-checklist__header {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: flex-start;
}

.vacation-checklist__eyebrow {
  margin: 0 0 8px;
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(139, 92, 246, 0.9);
}

.vacation-checklist__title {
  margin: 0;
  font-size: 28px;
  line-height: 1.1;
  color: #fff;
}

.vacation-checklist__subtitle {
  margin: 12px 0 0;
  color: rgba(255, 255, 255, 0.66);
  line-height: 1.6;
}

.vacation-checklist__progress-card {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.vacation-checklist__progress-value {
  font-size: 32px;
  line-height: 1;
  color: #fff;
  font-weight: 700;
}

.vacation-checklist__progress-label {
  margin-top: 4px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.56);
}

.vacation-checklist__bar {
  overflow: hidden;
  height: 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
}

.vacation-checklist__bar-fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(135deg, #8b5cf6, #06b6d4);
  transition: width 0.25s ease;
}

.vacation-checklist__form {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr) 180px;
  gap: 14px;
  align-items: end;
}

.vacation-checklist__submit {
  display: flex;
}

.vacation-checklist__list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.vacation-checklist__item {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.04);

  &.is-done {
    opacity: 0.72;
  }
}

.vacation-checklist__hidden-input {
  display: none;
}

.vacation-checklist__item-main {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
}

.vacation-checklist__checkbox {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  color: #fff;

  input {
    accent-color: #8b5cf6;
  }
}

.vacation-checklist__item-title {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
}

.vacation-checklist__item-category {
  margin-top: 4px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.56);
}

.vacation-checklist__item-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.vacation-checklist__files {
  display: grid;
  gap: 10px;
}

.vacation-checklist__file {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: center;
  text-decoration: none;
  padding: 14px 16px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.03);
}

.vacation-checklist__file-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.vacation-checklist__file-badge {
  width: fit-content;
  padding: 4px 8px;
  border-radius: 999px;
  background: rgba(139, 92, 246, 0.12);
  color: #fff;
  font-size: 12px;
}

.vacation-checklist__file-name {
  color: rgba(255, 255, 255, 0.82);
  word-break: break-word;
}

.vacation-checklist__empty {
  padding: 28px 18px;
  border-radius: 22px;
  text-align: center;
  background: rgba(255, 255, 255, 0.04);
}

.vacation-checklist__empty-icon {
  font-size: 34px;
}

.vacation-checklist__empty-title {
  margin: 12px 0 0;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
}

.vacation-checklist__empty-text {
  margin: 10px 0 0;
  color: rgba(255, 255, 255, 0.64);
  line-height: 1.55;
}

@media (max-width: 980px) {
  .vacation-checklist__form {
    grid-template-columns: 1fr;
  }

  .vacation-checklist__item-main,
  .vacation-checklist__file,
  .vacation-checklist__header {
    flex-direction: column;
  }

  .vacation-checklist__progress-card {
    align-items: flex-start;
  }
}
</style>