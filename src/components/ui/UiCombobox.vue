<template>
  <div
      ref="rootRef"
      class="ui-field ui-combobox"
  >
    <label
        v-if="label"
        class="ui-field__label"
        :for="id"
    >
      {{ label }}
    </label>

    <div class="ui-combobox__control-wrap">
      <input
          :id="id"
          ref="inputRef"
          :value="inputValue"
          type="text"
          :placeholder="placeholder"
          :disabled="disabled"
          class="ui-field__control ui-combobox__control"
          :class="{
          'ui-field__control--error': Boolean(error),
          'ui-field__control--readonly': disabled,
          'ui-field__control--opened': isDropdownVisible,
        }"
          autocomplete="off"
          @focus="handleFocus"
          @input="handleInput"
          @keydown.down.prevent="highlightNext"
          @keydown.up.prevent="highlightPrevious"
          @keydown.enter.prevent="handleEnter"
          @keydown.esc.prevent="closeDropdown"
          @blur="handleBlur"
      >

      <button
          type="button"
          class="ui-combobox__trigger"
          :disabled="disabled"
          tabindex="-1"
          @mousedown.prevent
          @click="toggleDropdown"
      >
        <span
            class="ui-field__arrow"
            :class="{ 'ui-field__arrow--opened': isDropdownVisible }"
            aria-hidden="true"
        >
          <svg
              width="18"
              height="18"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
          >
            <path
                d="M5 7.5L10 12.5L15 7.5"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
          </svg>
        </span>
      </button>

      <transition name="ui-select-fade">
        <div
            v-if="isDropdownVisible"
            class="ui-field__dropdown"
        >
          <template v-if="filteredOptions.length">
            <button
                v-for="(option, index) in filteredOptions"
                :key="option.value"
                type="button"
                class="ui-field__option"
                :class="{
                'ui-field__option--selected': option.value === modelValue,
                'ui-combobox__option--highlighted': index === highlightedIndex,
                'ui-combobox__option--default': option.value !== modelValue,
              }"
                @mousedown.prevent="selectOption(option)"
                @mouseenter="highlightedIndex = index"
            >
              <span>{{ option.label }}</span>

              <span
                  v-if="option.value === modelValue"
                  class="ui-field__option-check"
                  aria-hidden="true"
              >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                      d="M4.5 10.5L8 14L15.5 6.5"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                  />
                </svg>
              </span>
            </button>
          </template>

          <div v-else class="ui-combobox__empty">
            Нет доступных проектов
          </div>
        </div>
      </transition>
    </div>

    <p
        v-if="error"
        class="ui-field__error"
    >
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

export interface UiComboboxOption {
  label: string
  value: string
}

interface Props {
  modelValue: string
  options: UiComboboxOption[]
  label?: string
  placeholder?: string
  error?: string
  id?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  placeholder: 'Выберите значение',
  error: '',
  id: '',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: []
}>()

const rootRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

const isOpen = ref(false)
const inputValue = ref('')
const highlightedIndex = ref(0)
const blurTimeoutId = ref<number | null>(null)

watch(
    () => props.modelValue,
    (value) => {
      const selectedOption = props.options.find((option) => option.value === value)
      inputValue.value = selectedOption?.label ?? ''
    },
    { immediate: true },
)

const normalizedQuery = computed(() => {
  return inputValue.value.trim().toLocaleLowerCase()
})

const filteredOptions = computed(() => {
  if (!normalizedQuery.value) {
    return props.options
  }

  return props.options.filter((option) =>
      option.label.toLocaleLowerCase().includes(normalizedQuery.value),
  )
})

const isDropdownVisible = computed(() => {
  return isOpen.value
})

watch(filteredOptions, () => {
  highlightedIndex.value = 0
})

function clearBlurTimeout(): void {
  if (blurTimeoutId.value !== null) {
    window.clearTimeout(blurTimeoutId.value)
    blurTimeoutId.value = null
  }
}

function openDropdown(): void {
  if (props.disabled) {
    return
  }

  isOpen.value = true
}

function closeDropdown(): void {
  isOpen.value = false
  highlightedIndex.value = 0
}

function toggleDropdown(): void {
  if (props.disabled) {
    return
  }

  clearBlurTimeout()

  if (isOpen.value) {
    closeDropdown()
    return
  }

  openDropdown()

  nextTick(() => {
    inputRef.value?.focus()
  })
}

function emitValue(value: string): void {
  emit('update:modelValue', value)
}

function handleFocus(): void {
  clearBlurTimeout()
  openDropdown()
}

function handleInput(event: Event): void {
  const target = event.target as HTMLInputElement
  const value = target.value

  inputValue.value = value
  openDropdown()
}

function selectOption(option: UiComboboxOption): void {
  clearBlurTimeout()
  inputValue.value = option.label
  emitValue(option.value)
  closeDropdown()
  emit('blur')
}

function handleEnter(): void {
  const activeOption = filteredOptions.value[highlightedIndex.value]

  if (activeOption) {
    selectOption(activeOption)
    return
  }

  closeDropdown()
  emit('blur')
}

function handleBlur(): void {
  blurTimeoutId.value = window.setTimeout(() => {
    const selectedOption = props.options.find(
        (option) => option.label.toLocaleLowerCase() === inputValue.value.trim().toLocaleLowerCase(),
    )

    if (selectedOption) {
      inputValue.value = selectedOption.label
      emitValue(selectedOption.value)
    } else {
      const currentOption = props.options.find((option) => option.value === props.modelValue)
      inputValue.value = currentOption?.label ?? ''
    }

    closeDropdown()
    emit('blur')
  }, 120)
}

function highlightNext(): void {
  if (!filteredOptions.value.length) {
    return
  }

  openDropdown()

  highlightedIndex.value =
      highlightedIndex.value >= filteredOptions.value.length - 1
          ? 0
          : highlightedIndex.value + 1
}

function highlightPrevious(): void {
  if (!filteredOptions.value.length) {
    return
  }

  openDropdown()

  highlightedIndex.value =
      highlightedIndex.value <= 0
          ? filteredOptions.value.length - 1
          : highlightedIndex.value - 1
}

function handleClickOutside(event: MouseEvent): void {
  const target = event.target as Node | null

  if (!rootRef.value || !target) {
    return
  }

  if (!rootRef.value.contains(target)) {
    clearBlurTimeout()

    const currentOption = props.options.find((option) => option.value === props.modelValue)
    inputValue.value = currentOption?.label ?? ''

    closeDropdown()
    emit('blur')
  }
}

function handleEscape(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    clearBlurTimeout()
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscape)
})

onBeforeUnmount(() => {
  clearBlurTimeout()
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped lang="scss">
.ui-field {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ui-field__label {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.86);
}

.ui-field__control {
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
  outline: none;
  transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease,
      background 0.2s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  &:focus {
    border-color: rgba(139, 92, 246, 0.6);
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.14);
  }

  &--error {
    border-color: rgba(248, 113, 113, 0.7);
  }

  &--error:focus {
    border-color: rgba(248, 113, 113, 0.85);
    box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.14);
  }

  &--readonly {
    opacity: 0.82;
    cursor: not-allowed;
  }

  &--opened {
    border-color: rgba(139, 92, 246, 0.6);
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.14);
    background: rgba(255, 255, 255, 0.06);
  }
}

.ui-field__error {
  margin: 0;
  color: #f87171;
  font-size: 13px;
  line-height: 1.35;
}

.ui-field__dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 20;
  width: 100%;
  max-height: 320px;
  padding: 8px;
  overflow: auto;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(139, 92, 246, 0.22);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.14);
  backdrop-filter: blur(10px);
}

.ui-field__option {
  width: 100%;
  min-height: 42px;
  padding: 10px 12px;
  border: 0;
  border-radius: 10px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  text-align: left;
  cursor: pointer;
  transition:
      background 0.2s ease,
      color 0.2s ease,
      transform 0.2s ease,
      box-shadow 0.2s ease;
}

.ui-combobox__option--default {
  background: rgba(255, 255, 255, 0.03);
}

.ui-combobox__option--default:hover {
  background: rgba(255, 255, 255, 0.08);
}

.ui-combobox__option--highlighted {
  background: rgba(255, 255, 255, 0.1);
}

.ui-field__option--selected {
  background: linear-gradient(
          135deg,
          rgba(139, 92, 246, 0.34),
          rgba(236, 72, 153, 0.24)
  );
  color: #ffffff;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
}

.ui-field__option-check {
  flex-shrink: 0;
  color: rgba(255, 255, 255, 0.9);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.ui-combobox__control-wrap {
  position: relative;
}

.ui-combobox__control {
  padding-right: 44px;
}

.ui-combobox__trigger {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  background: transparent;
  color: rgba(255, 255, 255, 0.58);
  cursor: pointer;
}

.ui-combobox__trigger:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.ui-field__arrow {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition:
      color 0.2s ease,
      transform 0.2s ease;
}

.ui-field__arrow--opened {
  color: rgba(255, 255, 255, 0.88);
  transform: rotate(180deg);
}

.ui-combobox__empty {
  padding: 12px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

.ui-select-fade-enter-active,
.ui-select-fade-leave-active {
  transition:
      opacity 0.18s ease,
      transform 0.18s ease;
  transform-origin: top;
}

.ui-select-fade-enter-from,
.ui-select-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px) scaleY(0.98);
}
</style>