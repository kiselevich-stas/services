<script setup lang="ts">
import { computed, useAttrs } from 'vue'

type ButtonVariant = 'primary' | 'ghost' | 'secondary' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'
type ButtonNativeType = 'button' | 'submit' | 'reset'

interface Props {
  label?: string
  variant?: ButtonVariant
  size?: ButtonSize
  type?: ButtonNativeType
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  rounded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  fullWidth: false,
  rounded: true,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  mouseenter: [event: MouseEvent]
  mouseleave: [event: MouseEvent]
  mousedown: [event: MouseEvent]
  mouseup: [event: MouseEvent]
}>()

const attrs = useAttrs()

const isDisabled = computed(() => props.disabled || props.loading)

const classes = computed(() => [
  'ui-button',
  `ui-button--${props.variant}`,
  `ui-button--${props.size}`,
  {
    'ui-button--disabled': isDisabled.value,
    'ui-button--loading': props.loading,
    'ui-button--full-width': props.fullWidth,
    'ui-button--rounded': props.rounded,
  },
])

function handleClick(event: MouseEvent): void {
  if (isDisabled.value) {
    event.preventDefault()
    return
  }

  emit('click', event)
}

function handleFocus(event: FocusEvent): void {
  emit('focus', event)
}

function handleBlur(event: FocusEvent): void {
  emit('blur', event)
}

function handleMouseEnter(event: MouseEvent): void {
  emit('mouseenter', event)
}

function handleMouseLeave(event: MouseEvent): void {
  emit('mouseleave', event)
}

function handleMouseDown(event: MouseEvent): void {
  emit('mousedown', event)
}

function handleMouseUp(event: MouseEvent): void {
  emit('mouseup', event)
}
</script>

<template>
  <button
      v-bind="attrs"
      :type="type"
      :class="classes"
      :disabled="isDisabled"
      @click="handleClick"
      @focus="handleFocus"
      @blur="handleBlur"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
  >
    <span v-if="$slots.left || loading" class="ui-button__side ui-button__side--left">
      <slot name="left">
        <span class="ui-button__spinner" />
      </slot>
    </span>

    <span class="ui-button__content">
      <slot>
        {{ label }}
      </slot>
    </span>

    <span v-if="$slots.right && !loading" class="ui-button__side ui-button__side--right">
      <slot name="right" />
    </span>
  </button>
</template>

<style scoped lang="scss">
.ui-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: auto;
  border: none;
  cursor: pointer;
  text-decoration: none;
  font-weight: 600;
  line-height: 1;
  transition:
      transform 0.2s ease,
      opacity 0.2s ease,
      box-shadow 0.2s ease,
      background 0.2s ease,
      border-color 0.2s ease;
  user-select: none;
  white-space: nowrap;
  -webkit-tap-highlight-color: transparent;

  &--rounded {
    border-radius: 16px;
  }

  &--full-width {
    width: 100%;
  }

  &--sm {
    min-height: 38px;
    padding: 10px 14px;
    font-size: 14px;
  }

  &--md {
    min-height: 46px;
    padding: 14px 16px;
    font-size: 15px;
  }

  &--lg {
    min-height: 52px;
    padding: 16px 20px;
    font-size: 16px;
  }

  &--primary {
    color: #fff;
    background: linear-gradient(135deg, #8b5cf6, #ec4899);
    box-shadow: 0 10px 30px rgba(139, 92, 246, 0.28);

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 14px 34px rgba(139, 92, 246, 0.34);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }
  }

  &--ghost {
    color: #fff;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.08);

    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.14);
    }
  }

  &--secondary {
    color: #fff;
    background: rgba(139, 92, 246, 0.16);
    border: 1px solid rgba(139, 92, 246, 0.24);

    &:hover:not(:disabled) {
      background: rgba(139, 92, 246, 0.22);
      border-color: rgba(139, 92, 246, 0.34);
    }
  }

  &--danger {
    color: #fff;
    background: linear-gradient(135deg, #ef4444, #f97316);
    box-shadow: 0 10px 30px rgba(239, 68, 68, 0.24);

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 14px 34px rgba(239, 68, 68, 0.3);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }
  }

  &:focus-visible {
    outline: none;
    box-shadow:
        0 0 0 3px rgba(255, 255, 255, 0.08),
        0 0 0 6px rgba(139, 92, 246, 0.3);
  }

  &:disabled,
  &--disabled {
    cursor: not-allowed;
    opacity: 0.6;
    transform: none;
    box-shadow: none;
  }

  &__content {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  &__side {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    &--left,
    &--right {
      flex-shrink: 0;
    }
  }

  &__spinner {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    animation: ui-button-spin 0.7s linear infinite;
  }
}

@keyframes ui-button-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>