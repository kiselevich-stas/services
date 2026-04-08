<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  block?: boolean
  loading?: boolean
  disabled?: boolean
}>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  block: false,
  loading: false,
  disabled: false,
})

const classes = computed(() => [
  'ui-button',
  `ui-button--${props.variant}`,
  `ui-button--${props.size}`,
  { 'ui-button--block': props.block },
])
</script>

<template>
  <button :type="type" :class="classes" :disabled="disabled || loading">
    <span v-if="loading" class="ui-button__spinner" />
    <span><slot /></span>
  </button>
</template>

<style scoped lang="scss">
.ui-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 1px solid transparent;
  border-radius: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &--block {
    width: 100%;
  }

  &--sm { padding: 10px 14px; font-size: 13px; }
  &--md { padding: 12px 16px; font-size: 14px; }
  &--lg { padding: 14px 20px; font-size: 15px; }

  &--primary {
    background: linear-gradient(135deg, #111827, #1f2937);
    color: #fff;
  }

  &--secondary {
    background: #ffffff;
    color: #111827;
    border-color: #e5e7eb;
  }

  &--ghost {
    background: transparent;
    color: #111827;
    border-color: #e5e7eb;
  }

  &--danger {
    background: #7f1d1d;
    color: #fff;
  }
}

.ui-button__spinner {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: currentColor;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
