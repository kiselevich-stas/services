<template>
  <div class="ui-field">
    <label v-if="label" class="ui-field__label" :for="id">
      {{ label }}
    </label>

    <textarea
        :id="id"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :rows="rows"
        class="ui-field__control ui-field__control--textarea"
        :class="{
        'ui-field__control--error': !!error,
        'ui-field__control--readonly': readonly || disabled,
      }"
        @input="handleInput"
        @blur="$emit('blur')"
    />

    <p v-if="error" class="ui-field__error">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{
      modelValue: string
      label?: string
      placeholder?: string
      error?: string
      id?: string
      disabled?: boolean
      readonly?: boolean
      rows?: number
    }>(),
    {
      rows: 5,
    },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: []
}>()

function handleInput(event: Event): void {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}
</script>

<style scoped lang="scss">
.ui-field {
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

    &:focus {
      border-color: rgba(248, 113, 113, 0.85);
      box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.14);
    }
  }

  &--readonly {
    opacity: 0.82;
    cursor: not-allowed;
  }

  &--textarea {
    resize: vertical;
    min-height: 140px;
  }
}

.ui-field__error {
  margin: 0;
  color: #f87171;
  font-size: 13px;
  line-height: 1.35;
}
</style>