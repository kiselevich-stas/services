<script setup lang="ts">
interface Props {
  modelValue: boolean
  disabled?: boolean
  loading?: boolean
  id?: string
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  loading: false,
  id: undefined,
  ariaLabel: 'Переключатель',
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
}>()

function onToggle() {
  if (props.disabled || props.loading) {
    return
  }

  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <button
      :id="id"
      type="button"
      class="ui-switch"
      :class="{
      'ui-switch--active': modelValue,
      'ui-switch--disabled': disabled || loading,
      'ui-switch--loading': loading,
    }"
      :disabled="disabled || loading"
      role="switch"
      :aria-checked="modelValue"
      :aria-label="ariaLabel"
      @click="onToggle"
  >
    <span class="ui-switch__track">
      <span class="ui-switch__glow" />
      <span class="ui-switch__thumb" />
    </span>
  </button>
</template>

<style scoped lang="scss">
.ui-switch {
  --switch-width: 68px;
  --switch-height: 38px;
  --switch-padding: 4px;
  --thumb-size: 30px;
  --thumb-translate: 30px;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--switch-width);
  height: var(--switch-height);
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: none;
  }

  &:focus-visible .ui-switch__track {
    box-shadow:
        0 0 0 2px rgba(255, 255, 255, 0.06),
        0 0 0 4px rgba(91, 141, 239, 0.22),
        inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }

  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &--loading {
    pointer-events: none;
  }
}

.ui-switch__track {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 999px;
  overflow: hidden;
  background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.02)),
      linear-gradient(135deg, rgba(20, 31, 52, 0.95), rgba(28, 43, 69, 0.92));
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.06),
      inset 0 -8px 18px rgba(0, 0, 0, 0.22),
      0 8px 18px rgba(0, 0, 0, 0.22);
  transition:
      background 0.25s ease,
      border-color 0.25s ease,
      box-shadow 0.25s ease;
}

.ui-switch__glow {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background:
      radial-gradient(circle at 25% 50%, rgba(99, 102, 241, 0.14), transparent 45%),
      radial-gradient(circle at 75% 50%, rgba(56, 189, 248, 0.08), transparent 45%);
  opacity: 0.55;
  transition: opacity 0.25s ease, background 0.25s ease;
}

.ui-switch__thumb {
  position: absolute;
  top: 50%;
  left: var(--switch-padding);
  width: var(--thumb-size);
  height: var(--thumb-size);
  border-radius: 50%;
  transform: translateY(-50%);
  background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(214, 223, 240, 0.88));
  box-shadow:
      0 6px 16px rgba(0, 0, 0, 0.28),
      inset 0 1px 1px rgba(255, 255, 255, 0.8);
  transition:
      transform 0.25s ease,
      background 0.25s ease,
      box-shadow 0.25s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 7px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.26);
    opacity: 0.65;
  }
}

.ui-switch--active .ui-switch__track {
  background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.03)),
      linear-gradient(135deg, rgba(32, 64, 132, 0.95), rgba(20, 145, 185, 0.92));
  border-color: rgba(120, 190, 255, 0.26);
  box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.08),
      inset 0 -10px 20px rgba(0, 0, 0, 0.18),
      0 10px 24px rgba(8, 33, 84, 0.28),
      0 0 20px rgba(71, 144, 255, 0.12);
}

.ui-switch--active .ui-switch__glow {
  opacity: 1;
  background:
      radial-gradient(circle at 30% 50%, rgba(99, 102, 241, 0.28), transparent 42%),
      radial-gradient(circle at 75% 50%, rgba(34, 211, 238, 0.24), transparent 42%);
}

.ui-switch--active .ui-switch__thumb {
  transform: translateY(-50%) translateX(var(--thumb-translate));
  background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(225, 239, 255, 0.92));
  box-shadow:
      0 8px 20px rgba(0, 0, 0, 0.3),
      0 0 16px rgba(110, 188, 255, 0.24),
      inset 0 1px 1px rgba(255, 255, 255, 0.92);
}
</style>