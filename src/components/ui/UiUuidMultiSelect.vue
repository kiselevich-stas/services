<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: string[]
  label?: string
  hint?: string
  placeholder?: string
}>(), {
  label: 'Пользователи',
  hint: '',
  placeholder: 'Вставь UUID и нажми Enter',
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const inputValue = ref('')

const normalizedItems = computed(() => {
  return [...new Set(props.modelValue.map((item) => item.trim()).filter(Boolean))]
})

const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function addValue(rawValue: string) {
  const value = rawValue.trim()

  if (!value) {
    return
  }

  if (!uuidPattern.test(value)) {
    return
  }

  if (normalizedItems.value.includes(value)) {
    inputValue.value = ''
    return
  }

  emit('update:modelValue', [...normalizedItems.value, value])
  inputValue.value = ''
}

function removeValue(valueToRemove: string) {
  emit(
      'update:modelValue',
      normalizedItems.value.filter((value) => value !== valueToRemove),
  )
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ',' || event.key === 'Tab') {
    event.preventDefault()
    addValue(inputValue.value)
    return
  }

  if (event.key === 'Backspace' && !inputValue.value && normalizedItems.value.length) {
    removeValue(normalizedItems.value[normalizedItems.value.length - 1])
  }
}

function onPaste(event: ClipboardEvent) {
  const pastedText = event.clipboardData?.getData('text') ?? ''

  if (!pastedText) {
    return
  }

  const values = pastedText
      .split(/[\s,;\n\t]+/)
      .map((item) => item.trim())
      .filter(Boolean)

  const validValues = values.filter((item) => uuidPattern.test(item))

  if (!validValues.length) {
    return
  }

  event.preventDefault()

  const nextValue = [...normalizedItems.value]

  for (const value of validValues) {
    if (!nextValue.includes(value)) {
      nextValue.push(value)
    }
  }

  emit('update:modelValue', nextValue)
  inputValue.value = ''
}
</script>

<template>
  <div class="ui-uuid-multi-select">
    <div class="ui-uuid-multi-select__head">
      <span class="ui-uuid-multi-select__label">{{ label }}</span>
      <span v-if="hint" class="ui-uuid-multi-select__hint">{{ hint }}</span>
    </div>

    <div class="ui-uuid-multi-select__control">
      <div v-if="normalizedItems.length" class="ui-uuid-multi-select__chips">
        <div
            v-for="item in normalizedItems"
            :key="item"
            class="ui-uuid-multi-select__chip"
        >
          <span class="ui-uuid-multi-select__chip-text">{{ item }}</span>
          <button
              type="button"
              class="ui-uuid-multi-select__chip-remove"
              @click="removeValue(item)"
          >
            ×
          </button>
        </div>
      </div>

      <input
          v-model="inputValue"
          type="text"
          class="ui-uuid-multi-select__input"
          :placeholder="placeholder"
          @keydown="onKeydown"
          @paste="onPaste"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.ui-uuid-multi-select {
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

  &__control {
    display: grid;
    gap: 10px;
    min-height: 52px;
    padding: 12px;
    border-radius: 18px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.04);
  }

  &__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__chip {
    max-width: 100%;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 34px;
    padding: 0 10px 0 12px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.07);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  &__chip-text {
    color: #fff;
    font-size: 12px;
    line-height: 1.4;
    word-break: break-all;
  }

  &__chip-remove {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    display: grid;
    place-items: center;
    border: 0;
    background: transparent;
    color: rgba(255, 255, 255, 0.65);
    cursor: pointer;
    font-size: 18px;
    line-height: 1;
  }

  &__input {
    width: 100%;
    min-width: 0;
    border: 0;
    background: transparent;
    color: #fff;
    outline: none;
    font-size: 14px;
  }

  &__input::placeholder {
    color: rgba(255, 255, 255, 0.38);
  }
}
</style>