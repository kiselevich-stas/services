<template>
  <div ref="rootRef" class="ui-field">
    <label v-if="label" class="ui-field__label" :for="id">
      {{ label }}
    </label>

    <button
        :id="id"
        type="button"
        class="ui-field__control ui-field__trigger"
        :class="{
        'ui-field__control--error': Boolean(error),
        'ui-field__control--readonly': disabled,
        'ui-field__control--placeholder': !selectedOption,
        'ui-field__control--opened': isOpen,
      }"
        :disabled="disabled"
        @click="toggleDropdown"
        @blur="handleBlur"
    >
      <span class="ui-field__value">
        {{ selectedOption?.label || placeholder }}
      </span>

      <span class="ui-field__arrow" aria-hidden="true">
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
      <div v-if="isOpen" class="ui-field__dropdown">
        <button
            v-for="option in options"
            :key="option.value"
            type="button"
            class="ui-field__option"
            :class="{
            'ui-field__option--selected': option.value === modelValue,
          }"
            @click="selectOption(option.value)"
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
      </div>
    </transition>

    <p v-if="error" class="ui-field__error">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

interface UiSelectOption {
  label: string
  value: string
}

const props = withDefaults(
    defineProps<{
      modelValue: string
      options: UiSelectOption[]
      label?: string
      placeholder?: string
      error?: string
      id?: string
      disabled?: boolean
    }>(),
    {
      label: '',
      placeholder: 'Выберите значение',
      error: '',
      id: '',
      disabled: false,
    },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: []
}>()

const rootRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)

const selectedOption = computed(() => {
  return props.options.find((option) => option.value === props.modelValue) ?? null
})

function toggleDropdown(): void {
  if (props.disabled) {
    return
  }

  isOpen.value = !isOpen.value
}

function closeDropdown(): void {
  isOpen.value = false
}

function selectOption(value: string): void {
  emit('update:modelValue', value)
  closeDropdown()
  emit('blur')
}

function handleBlur(): void {
  window.setTimeout(() => {
    emit('blur')
  }, 0)
}

function handleClickOutside(event: MouseEvent): void {
  const target = event.target as Node | null

  if (!rootRef.value || !target) {
    return
  }

  if (!rootRef.value.contains(target)) {
    closeDropdown()
  }
}

function handleEscape(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscape)
})

onBeforeUnmount(() => {
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

  &--placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  &--opened {
    border-color: rgba(139, 92, 246, 0.6);
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.14);
    background: rgba(255, 255, 255, 0.06);
  }
}

.ui-field__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  text-align: left;
  cursor: pointer;
}

.ui-field__value {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ui-field__arrow {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.58);
  transition:
      color 0.2s ease,
      transform 0.2s ease;
}

.ui-field__control--opened .ui-field__arrow {
  color: rgba(255, 255, 255, 0.88);
  transform: rotate(180deg);
}

.ui-field__dropdown {
  max-height: 320px;
  overflow: auto;
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 20;
  width: 100%;
  padding: 8px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(139, 92, 246, 0.6);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.14);
  backdrop-filter: blur(10px);
}

.ui-field__option {
  width: 100%;
  min-height: 42px;
  padding: 10px 12px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  text-align: left;
  cursor: pointer;
  transition:
      background 0.2s ease,
      transform 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }

  &--selected {
    background: linear-gradient(
            135deg,
            rgba(139, 92, 246, 0.26),
            rgba(236, 72, 153, 0.18)
    );
    color: #ffffff;
  }
}

.ui-field__option-check {
  flex-shrink: 0;
  color: rgba(255, 255, 255, 0.9);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.ui-field__error {
  margin: 0;
  color: #f87171;
  font-size: 13px;
  line-height: 1.35;
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