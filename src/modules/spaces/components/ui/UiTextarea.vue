<script setup lang="ts">
withDefaults(defineProps<{
  modelValue: string | null
  label?: string
  placeholder?: string
  error?: string
  rows?: number
}>(), {
  label: '',
  placeholder: '',
  error: '',
  rows: 5,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <label class="ui-field">
    <span v-if="label" class="ui-field__label">{{ label }}</span>
    <textarea
      class="ui-field__control ui-field__control--textarea"
      :class="{ 'is-error': error }"
      :placeholder="placeholder"
      :rows="rows"
      :value="modelValue ?? ''"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
    <span v-if="error" class="ui-field__error">{{ error }}</span>
  </label>
</template>

<style scoped lang="scss">
.ui-field {
  display: grid;
  gap: 8px;
}
.ui-field__label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}
.ui-field__control {
  width: 100%;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid #d1d5db;
  background: #fff;
  font-size: 14px;
  outline: none;
  resize: vertical;

  &:focus {
    border-color: #111827;
    box-shadow: 0 0 0 4px rgba(17, 24, 39, .08);
  }

  &.is-error {
    border-color: #dc2626;
  }
}
.ui-field__control--textarea {
  min-height: 120px;
}
.ui-field__error {
  color: #dc2626;
  font-size: 12px;
}
</style>
