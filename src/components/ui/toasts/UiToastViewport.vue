<script setup lang="ts">
import { useToastStore, type ToastType } from "../../../stores/toast.ts";

const toastStore = useToastStore()

function getToastIcon(type: ToastType): string {
  switch (type) {
    case 'success':
      return '✓'
    case 'info':
      return 'i'
    case 'error':
    default:
      return '✕'
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
          <div class="toast-card__accent"></div>

          <div class="toast-card__glow"></div>

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
  top: 20px;
  right: 20px;
  z-index: 120;
  pointer-events: none;

  &__list {
    display: grid;
    gap: 14px;
    width: min(400px, calc(100vw - 32px));
  }
}

.toast-card {
  --toast-accent-rgb: 88, 101, 242;
  --toast-accent: rgb(var(--toast-accent-rgb));

  pointer-events: auto;
  position: relative;
  overflow: hidden;

  display: grid;
  grid-template-columns: 52px minmax(0, 1fr) 32px;
  align-items: start;
  gap: 14px;

  padding: 18px 18px 18px 16px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  background:
      linear-gradient(180deg, rgba(18, 24, 38, 0.92), rgba(12, 18, 30, 0.88));
  backdrop-filter: blur(20px);

  box-shadow:
      0 16px 36px rgba(0, 0, 0, 0.34),
      0 0 0 1px rgba(255, 255, 255, 0.03) inset,
      0 10px 30px rgba(var(--toast-accent-rgb), 0.12);

  transition:
      transform 0.24s ease,
      box-shadow 0.24s ease,
      border-color 0.24s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow:
        0 22px 42px rgba(0, 0, 0, 0.38),
        0 0 0 1px rgba(255, 255, 255, 0.04) inset,
        0 14px 34px rgba(var(--toast-accent-rgb), 0.16);
  }

  &__accent {
    position: absolute;
    inset: 0 auto auto 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(
            90deg,
            rgba(var(--toast-accent-rgb), 1) 0%,
            rgba(var(--toast-accent-rgb), 0.45) 60%,
            rgba(var(--toast-accent-rgb), 0) 100%
    );
  }

  &__glow {
    position: absolute;
    top: -30px;
    right: -30px;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: radial-gradient(
            circle,
            rgba(var(--toast-accent-rgb), 0.22) 0%,
            rgba(var(--toast-accent-rgb), 0.08) 42%,
            rgba(var(--toast-accent-rgb), 0) 75%
    );
    pointer-events: none;
    filter: blur(6px);
  }

  &__icon {
    position: relative;
    z-index: 1;

    width: 52px;
    height: 52px;
    border-radius: 16px;
    display: grid;
    place-items: center;

    font-size: 20px;
    font-weight: 800;
    color: #fff;

    background:
        linear-gradient(135deg, rgba(var(--toast-accent-rgb), 0.28), rgba(var(--toast-accent-rgb), 0.12));
    border: 1px solid rgba(var(--toast-accent-rgb), 0.25);

    box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.08),
        0 8px 18px rgba(var(--toast-accent-rgb), 0.18);
  }

  &__content {
    position: relative;
    z-index: 1;
    min-width: 0;
    padding-top: 2px;
  }

  &__title {
    margin: 0;
    font-size: 15px;
    line-height: 1.3;
    font-weight: 700;
    color: #f8fbff;
    letter-spacing: 0.01em;
  }

  &__message {
    margin: 8px 0 0;
    font-size: 13px;
    line-height: 1.5;
    color: rgba(232, 239, 255, 0.72);
    word-break: break-word;
  }

  &__close {
    position: relative;
    z-index: 1;

    width: 32px;
    height: 32px;
    display: grid;
    place-items: center;

    border: 0;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.04);
    color: rgba(240, 246, 255, 0.58);

    font-size: 18px;
    line-height: 1;
    cursor: pointer;

    transition:
        background 0.2s ease,
        color 0.2s ease,
        transform 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #fff;
      transform: scale(1.05);
    }

    &:active {
      transform: scale(0.96);
    }
  }

  &--error {
    --toast-accent-rgb: 239, 68, 68;
    border-color: rgba(239, 68, 68, 0.22);
    background:
        linear-gradient(180deg, rgba(30, 17, 20, 0.95), rgba(18, 13, 16, 0.92));
  }

  &--success {
    --toast-accent-rgb: 34, 197, 94;
    border-color: rgba(34, 197, 94, 0.22);
    background:
        linear-gradient(180deg, rgba(14, 28, 21, 0.95), rgba(10, 21, 17, 0.92));
  }

  &--info {
    --toast-accent-rgb: 56, 189, 248;
    border-color: rgba(56, 189, 248, 0.22);
    background:
        linear-gradient(180deg, rgba(13, 22, 34, 0.95), rgba(10, 17, 28, 0.92));
  }
}

.toast-list-enter-active,
.toast-list-leave-active {
  transition: all 0.3s ease;
}

.toast-list-enter-from {
  opacity: 0;
  transform: translateY(-10px) translateX(24px) scale(0.96);
}

.toast-list-leave-to {
  opacity: 0;
  transform: translateY(-8px) translateX(20px) scale(0.96);
}

.toast-list-move {
  transition: transform 0.3s ease;
}

@media (max-width: 768px) {
  .toast-viewport {
    top: 14px;
    right: 14px;
    left: 14px;

    &__list {
      width: 100%;
    }
  }

  .toast-card {
    grid-template-columns: 48px minmax(0, 1fr) 30px;
    padding: 16px 16px 16px 14px;
    border-radius: 20px;

    &__icon {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      font-size: 18px;
    }
  }
}
</style>