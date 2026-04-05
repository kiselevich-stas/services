<template>
  <Teleport to="body">
    <Transition name="ui-page-loader-fade">
      <div
          v-if="visible"
          class="ui-page-loader"
          role="status"
          aria-live="polite"
          aria-busy="true"
      >
        <div class="ui-page-loader__backdrop" />

        <div class="ui-page-loader__content">
          <div class="ui-page-loader__spinner" />
          <p v-if="text" class="ui-page-loader__text">
            {{ text }}
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { watch, onBeforeUnmount } from 'vue'

const props = withDefaults(
    defineProps<{
      visible: boolean
      text?: string
      lockScroll?: boolean
    }>(),
    {
      text: 'Загрузка...',
      lockScroll: true,
    },
)

function setBodyScrollLocked(isLocked: boolean): void {
  if (typeof document === 'undefined') {
    return
  }

  document.body.style.overflow = isLocked ? 'hidden' : ''
}

watch(
    () => props.visible,
    (isVisible) => {
      if (!props.lockScroll) {
        return
      }

      setBodyScrollLocked(isVisible)
    },
    { immediate: true },
)

onBeforeUnmount(() => {
  if (props.lockScroll) {
    setBodyScrollLocked(false)
  }
})
</script>

<style scoped lang="scss">
.ui-page-loader {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  place-items: center;
  pointer-events: all;
}

.ui-page-loader__backdrop {
  position: absolute;
  inset: 0;
  background:
      radial-gradient(circle at top, rgba(139, 92, 246, 0.16), transparent 35%),
      rgba(6, 10, 24, 0.72);
  backdrop-filter: blur(10px);
}

.ui-page-loader__content {
  position: relative;
  z-index: 1;
  min-width: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 24px 28px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(15, 23, 42, 0.72);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.28);
}

.ui-page-loader__spinner {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.12);
  border-top-color: #8b5cf6;
  border-right-color: #a78bfa;
  animation: ui-page-loader-spin 0.85s linear infinite;
}

.ui-page-loader__text {
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.82);
  text-align: center;
}

.ui-page-loader-fade-enter-active,
.ui-page-loader-fade-leave-active {
  transition: opacity 0.2s ease;
}

.ui-page-loader-fade-enter-from,
.ui-page-loader-fade-leave-to {
  opacity: 0;
}

@keyframes ui-page-loader-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>