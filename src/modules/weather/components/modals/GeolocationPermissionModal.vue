<template>
  <div
      v-if="modelValue"
      class="geo-modal"
      @click.self="handleClose"
  >
    <div
        class="geo-modal__card panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="geo-modal-title"
    >
      <button
          class="geo-modal__close"
          type="button"
          aria-label="Закрыть"
          @click="handleClose"
      />

      <div class="geo-modal__icon">
        📍
      </div>

      <h2
          id="geo-modal-title"
          class="geo-modal__title"
      >
        Разрешите доступ к геолокации
      </h2>

      <p
          v-if="permission === 'prompt'"
          class="geo-modal__text"
      >
        Разреши доступ к местоположению, и мы сразу покажем погоду для твоего текущего города.
      </p>

      <p
          v-else-if="permission === 'denied'"
          class="geo-modal__text"
      >
        Доступ к геолокации заблокирован. Разреши его в настройках браузера для этого сайта, а затем попробуй снова.
      </p>

      <p
          v-else-if="permission === 'unsupported'"
          class="geo-modal__text"
      >
        Твой браузер не поддерживает геолокацию. Выбери город вручную через поиск.
      </p>

      <p
          v-else
          class="geo-modal__text"
      >
        Мы можем автоматически определить твой город и сразу показать актуальную погоду.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
type GeoPermissionState = 'prompt' | 'granted' | 'denied' | 'unsupported'

interface Props {
  modelValue: boolean
  permission: GeoPermissionState
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

function handleClose(): void {
  if (props.isLoading) {
    return
  }

  emit('update:modelValue', false)
}
</script>

<style scoped lang="scss">
.geo-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(4px);
}

.geo-modal__card {
  position: relative;
  width: 100%;
  max-width: 460px;
  padding: 24px;
  border-radius: 24px;
  text-align: center;
}

.geo-modal__close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 16px;
    height: 2px;
    border-radius: 999px;
    background-color: #5b6472;
    transition: background-color 0.2s ease;
    transform-origin: center;
  }

  &::before {
    transform: translate(-50%, -50%) rotate(45deg);
  }

  &::after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }

  &:hover {
    background: rgba(91, 100, 114, 0.1);
  }

  &:hover::before,
  &:hover::after {
    background-color: #111827;
  }

  &:active {
    transform: scale(0.96);
  }

  &:focus-visible {
    outline: 2px solid rgba(59, 130, 246, 0.45);
    outline-offset: 2px;
  }
}

.geo-modal__icon {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
  font-size: 48px;
  line-height: 1;
}

.geo-modal__title {
  margin: 0 0 12px;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
}

.geo-modal__text {
  margin: 0;
  color: #5b6472;
  font-size: 15px;
  line-height: 1.5;
}

.geo-modal__actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
}
</style>