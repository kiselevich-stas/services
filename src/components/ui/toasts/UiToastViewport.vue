<script setup lang="ts">
import { useToastStore, type ToastType } from '../../../stores/toast.ts'

const toastStore = useToastStore()

function getToastIcon(type: ToastType): string {
  switch (type) {
    case 'success':
      return '✓'
    case 'info':
      return 'i'
    case 'error':
    default:
      return '!'
  }
}
</script>

<template>
  <Teleport to="body">
    <div class="toast-viewport">
      <TransitionGroup
          name="toast-list"
          tag="div"
          class="toast-viewport__list"
      >
        <article
            v-for="toast in toastStore.toasts"
            :key="toast.id"
            class="toast-card"
            :class="`toast-card--${toast.type}`"
        >
          <div class="toast-card__icon">
            {{ getToastIcon(toast.type) }}
          </div>

          <div class="toast-card__content">
            <h4 class="toast-card__title">
              {{ toast.title }}
            </h4>

            <p
                v-if="toast.message"
                class="toast-card__message"
            >
              {{ toast.message }}
            </p>
          </div>

          <button
              type="button"
              class="toast-card__close"
              aria-label="Закрыть уведомление"
              @click="toastStore.removeToast(toast.id)"
          >
            ×
          </button>
        </article>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.toast-viewport {
  position: fixed;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%);
  z-index: 120;
  pointer-events: none;
  width: min(480px, calc(100vw - 24px));

  &__list {
    display: flex;
    flex-direction: column-reverse;
    align-items: stretch;
    gap: 0;
    width: 100%;
  }
}

.toast-card {
  --toast-accent: #6b7280;
  --toast-accent-soft: rgba(107, 114, 128, 0.16);

  pointer-events: auto;
  position: relative;
  overflow: hidden;

  display: grid;
  grid-template-columns: 40px minmax(0, 1fr) 28px;
  align-items: start;
  gap: 12px;

  width: 100%;
  min-height: 72px;
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);

  background: rgba(15, 18, 24, 0.94);
  backdrop-filter: blur(14px);

  box-shadow:
      0 10px 30px rgba(0, 0, 0, 0.28),
      0 1px 0 rgba(255, 255, 255, 0.04) inset;

  transition:
      transform 0.22s ease,
      box-shadow 0.22s ease,
      border-color 0.22s ease,
      background 0.22s ease;

  &:not(:first-child) {
    margin-bottom: -18px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow:
        0 16px 36px rgba(0, 0, 0, 0.34),
        0 1px 0 rgba(255, 255, 255, 0.05) inset;
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0 auto 0 0;
    width: 3px;
    background: var(--toast-accent);
  }

  &__icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: grid;
    place-items: center;

    background: var(--toast-accent-soft);
    color: #f9fafb;
    font-size: 16px;
    font-weight: 700;
    line-height: 1;

    border: 1px solid rgba(255, 255, 255, 0.06);
  }

  &__content {
    min-width: 0;
    padding-top: 1px;
  }

  &__title {
    margin: 0;
    color: #f3f4f6;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.35;
    letter-spacing: 0.01em;
  }

  &__message {
    margin: 4px 0 0;
    color: rgba(229, 231, 235, 0.72);
    font-size: 13px;
    line-height: 1.45;
    word-break: break-word;
  }

  &__close {
    width: 28px;
    height: 28px;
    display: grid;
    place-items: center;

    border: none;
    border-radius: 8px;
    background: transparent;
    color: rgba(229, 231, 235, 0.48);

    font-size: 18px;
    line-height: 1;
    cursor: pointer;

    transition:
        background 0.2s ease,
        color 0.2s ease,
        transform 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.06);
      color: #f9fafb;
    }

    &:active {
      transform: scale(0.96);
    }
  }

  &--error {
    --toast-accent: #ef4444;
    --toast-accent-soft: rgba(239, 68, 68, 0.14);
  }

  &--success {
    --toast-accent: #22c55e;
    --toast-accent-soft: rgba(34, 197, 94, 0.14);
  }

  &--info {
    --toast-accent: #3b82f6;
    --toast-accent-soft: rgba(59, 130, 246, 0.14);
  }
}

.toast-list-enter-active,
.toast-list-leave-active {
  transition: all 0.28s ease;
}

.toast-list-enter-from {
  opacity: 0;
  transform: translateY(16px) scale(0.98);
}

.toast-list-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}

.toast-list-move {
  transition: transform 0.28s ease;
}

@media (max-width: 768px) {
  .toast-viewport {
    bottom: 14px;
    width: calc(100vw - 20px);
  }

  .toast-card {
    grid-template-columns: 36px minmax(0, 1fr) 26px;
    gap: 10px;
    min-height: 68px;
    padding: 12px 14px;
    border-radius: 14px;

    &:not(:first-child) {
      margin-bottom: -14px;
    }

    &__icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      font-size: 15px;
    }

    &__title {
      font-size: 13px;
    }

    &__message {
      font-size: 12px;
    }

    &__close {
      width: 26px;
      height: 26px;
      font-size: 16px;
    }
  }
}
</style>