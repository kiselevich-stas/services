<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: File | null
  accept?: string
  maxSizeMb?: number
  label?: string
  hint?: string
  preview?: boolean
}>(), {
  accept: 'image/*',
  maxSizeMb: 5,
  label: 'Файл',
  hint: '',
  preview: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: File | null]
  error: [message: string]
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const previewUrl = ref('')

const maxSizeBytes = computed(() => props.maxSizeMb * 1024 * 1024)

function revokePreview() {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = ''
  }
}

function updatePreview(file: File | null) {
  revokePreview()

  if (!file || !props.preview || !file.type.startsWith('image/')) {
    return
  }

  previewUrl.value = URL.createObjectURL(file)
}

function validateFile(file: File): string | null {
  if (props.accept === 'image/*' && !file.type.startsWith('image/')) {
    return 'Можно загружать только изображения'
  }

  if (file.size > maxSizeBytes.value) {
    return `Максимальный размер файла — ${props.maxSizeMb} МБ`
  }

  return null
}

function applyFile(file: File | null) {
  if (!file) {
    emit('update:modelValue', null)
    revokePreview()
    return
  }

  const validationError = validateFile(file)

  if (validationError) {
    emit('error', validationError)

    if (inputRef.value) {
      inputRef.value.value = ''
    }

    return
  }

  emit('update:modelValue', file)
  updatePreview(file)
}

function onChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0] ?? null

  applyFile(file)
}

function openPicker() {
  inputRef.value?.click()
}

function clearFile() {
  emit('update:modelValue', null)

  if (inputRef.value) {
    inputRef.value.value = ''
  }

  revokePreview()
}

function onDrop(event: DragEvent) {
  event.preventDefault()

  const file = event.dataTransfer?.files?.[0] ?? null
  applyFile(file)
}

function onDragOver(event: DragEvent) {
  event.preventDefault()
}

watch(
    () => props.modelValue,
    (file) => {
      updatePreview(file)
    },
    { immediate: true },
)

onBeforeUnmount(() => {
  revokePreview()
})
</script>

<template>
  <div class="ui-file-uploader">
    <div class="ui-file-uploader__head">
      <span class="ui-file-uploader__label">{{ label }}</span>
      <span v-if="hint" class="ui-file-uploader__hint">{{ hint }}</span>
    </div>

    <input
        ref="inputRef"
        :accept="accept"
        type="file"
        class="ui-file-uploader__native"
        @change="onChange"
    />

    <div
        class="ui-file-uploader__dropzone"
        @click="openPicker"
        @drop="onDrop"
        @dragover="onDragOver"
    >
      <template v-if="modelValue">
        <div class="ui-file-uploader__file-row">
          <div class="ui-file-uploader__file-meta">
            <div class="ui-file-uploader__file-name">{{ modelValue.name }}</div>
            <div class="ui-file-uploader__file-size">
              {{ (modelValue.size / 1024 / 1024).toFixed(2) }} МБ
            </div>
          </div>

          <div class="ui-file-uploader__actions">
            <button type="button" class="ui-file-uploader__action" @click.stop="openPicker">
              Заменить
            </button>
            <button type="button" class="ui-file-uploader__action is-danger" @click.stop="clearFile">
              Удалить
            </button>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="ui-file-uploader__placeholder">
          <div class="ui-file-uploader__placeholder-title">Выбери файл или перетащи сюда</div>
          <div class="ui-file-uploader__placeholder-text">
            {{ accept === 'image/*' ? 'Поддерживаются изображения' : 'Поддерживаемые типы файлов' }}
          </div>
        </div>
      </template>
    </div>

    <div v-if="previewUrl" class="ui-file-uploader__preview-wrap">
      <img :src="previewUrl" alt="Предпросмотр" class="ui-file-uploader__preview" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.ui-file-uploader {
  display: grid;
  gap: 10px;

  &__head {
    display: grid;
    gap: 6px;
  }

  &__label {
    color: rgba(255, 255, 255, 0.82);
    font-size: 13px;
  }

  &__hint {
    color: rgba(255, 255, 255, 0.45);
    font-size: 12px;
  }

  &__native {
    display: none;
  }

  &__dropzone {
    min-height: 88px;
    border-radius: 20px;
    border: 1px dashed rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.03);
    padding: 16px;
    cursor: pointer;
    transition: 0.2s ease;
  }

  &__dropzone:hover {
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.05);
  }

  &__placeholder {
    display: grid;
    gap: 6px;
    place-items: start;
  }

  &__placeholder-title {
    color: #fff;
    font-size: 14px;
  }

  &__placeholder-text {
    color: rgba(255, 255, 255, 0.5);
    font-size: 12px;
  }

  &__file-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  &__file-meta {
    min-width: 0;
  }

  &__file-name {
    color: #fff;
    font-size: 14px;
    word-break: break-word;
  }

  &__file-size {
    margin-top: 4px;
    color: rgba(255, 255, 255, 0.5);
    font-size: 12px;
  }

  &__actions {
    display: flex;
    gap: 8px;
    flex-shrink: 0;
  }

  &__action {
    min-height: 36px;
    padding: 0 12px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.04);
    color: rgba(255, 255, 255, 0.88);
    cursor: pointer;
  }

  &__action.is-danger {
    color: #f2aaaa;
  }

  &__preview-wrap {
    overflow: hidden;
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.03);
  }

  &__preview {
    display: block;
    width: 100%;
    height: 220px;
    object-fit: cover;
  }
}
</style>