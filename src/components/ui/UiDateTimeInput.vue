<script setup lang="ts">
defineProps<{
  modelValue: string
  label?: string
  error?: string
  required?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: []
}>()

function onInput(event: Event): void {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

function onBlur(): void {
  emit('blur')
}
</script>

<template>
  <label class="ui-input">
    <span v-if="label" class="ui-input__label">
      {{ label }}
      <span v-if="required">*</span>
    </span>

    <input
        class="ui-input__field"
        :class="{ 'ui-input__field--error': error }"
        type="datetime-local"
        :value="modelValue"
        :aria-required="required ? 'true' : 'false'"
        @input="onInput"
        @blur="onBlur"
    />

    <span v-if="error" class="ui-input__error">
      {{ error }}
    </span>
  </label>
</template>

<style scoped lang="scss">
.ui-input {
  display: flex;
  flex-direction: column;
  gap: 8px;

  &__label {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.72);
  }

  &__field {
    width: 100%;
    padding: 12px 14px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.04);
    color: #fff;
    outline: none;
    transition: 0.2s ease;

    &--error {
      border-color: #f87171;
      box-shadow: 0 0 0 1px rgba(248, 113, 113, 0.4);
    }

    &:focus {
      border-color: rgba(112, 161, 255, 0.6);
    }

    &::-webkit-calendar-picker-indicator {
      filter: invert(1);
      cursor: pointer;
    }
  }

  &__error {
    font-size: 12px;
    color: #f87171;
  }
}
</style>