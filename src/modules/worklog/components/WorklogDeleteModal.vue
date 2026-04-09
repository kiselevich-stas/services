<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'
import UiButton from '../../../components/ui/UiButton.vue'

interface Props {
  open: boolean
  title: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  close: []
  confirm: []
}>()

function handleClose(): void {
  if (props.loading) {
    return
  }

  emit('close')
}

function handleConfirm(): void {
  emit('confirm')
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && props.open) {
    handleClose()
  }
}

watch(
    () => props.open,
    (value) => {
      if (value) {
        document.body.style.overflow = 'hidden'
        window.addEventListener('keydown', handleKeydown)
        return
      }

      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeydown)
    },
    { immediate: true },
)

onBeforeUnmount(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="confirm-modal-fade">
      <div
          v-if="open"
          class="confirm-modal"
          @click.self="handleClose"
      >
        <Transition name="confirm-modal-scale">
          <div
              v-if="open"
              class="confirm-modal__dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="confirm-delete-title"
          >
            <button
                type="button"
                class="confirm-modal__close"
                aria-label="Закрыть"
                @click="handleClose"
            >
              ×
            </button>

            <div class="confirm-modal__icon">
              <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
              >
                <path
                    d="M10 11V17"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                />
                <path
                    d="M14 11V17"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                />
                <path
                    d="M4 7H20"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                />
                <path
                    d="M6 7L7 19C7.1 20.1 8 21 9.1 21H14.9C16 21 16.9 20.1 17 19L18 7"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
                <path
                    d="M9 7V5C9 4.44772 9.44772 4 10 4H14C14.5523 4 15 4.44772 15 5V7"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
              </svg>
            </div>

            <h3 id="confirm-delete-title" class="confirm-modal__title">
              Удалить запись?
            </h3>

            <p class="confirm-modal__text">
              Запись по проекту
              <span class="confirm-modal__accent">«{{ title }}»</span>
              будет удалена без возможности восстановления.
            </p>

            <div class="confirm-modal__actions">
              <UiButton
                  variant="ghost"
                  :disabled="loading"
                  @click="handleClose"
              >
                Отмена
              </UiButton>

              <UiButton
                  variant="danger"
                  :loading="loading"
                  :disabled="loading"
                  @click="handleConfirm"
              >
                Подтвердить удаление
              </UiButton>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.confirm-modal {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(2, 6, 23, 0.7);
  backdrop-filter: blur(12px);
}

.confirm-modal__dialog {
  position: relative;
  width: 100%;
  max-width: 480px;
  padding: 28px;
  border-radius: 28px;
  background:
      linear-gradient(180deg, rgba(30, 41, 59, 0.94), rgba(15, 23, 42, 0.96));
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
      0 24px 80px rgba(0, 0, 0, 0.42),
      0 0 0 1px rgba(255, 255, 255, 0.03) inset;
  color: #fff;
}

.confirm-modal__close {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.78);
  cursor: pointer;
  font-size: 22px;
  line-height: 1;
  transition:
      background 0.2s ease,
      transform 0.2s ease,
      color 0.2s ease;

  &:hover {
    transform: scale(1.04);
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }
}

.confirm-modal__icon {
  width: 56px;
  height: 56px;
  margin-bottom: 18px;
  border-radius: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
          135deg,
          rgba(239, 68, 68, 0.22),
          rgba(244, 63, 94, 0.18)
  );
  color: #fca5a5;
  box-shadow: 0 10px 30px rgba(239, 68, 68, 0.16);
}

.confirm-modal__title {
  margin: 0 0 10px;
  font-size: 24px;
  line-height: 1.2;
  font-weight: 700;
}

.confirm-modal__text {
  margin: 0;
  font-size: 15px;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.72);
}

.confirm-modal__accent {
  color: #fff;
  font-weight: 600;
}

.confirm-modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.confirm-modal-fade-enter-active,
.confirm-modal-fade-leave-active {
  transition: opacity 0.22s ease;
}

.confirm-modal-fade-enter-from,
.confirm-modal-fade-leave-to {
  opacity: 0;
}

.confirm-modal-scale-enter-active,
.confirm-modal-scale-leave-active {
  transition:
      opacity 0.26s ease,
      transform 0.26s ease,
      filter 0.26s ease;
}

.confirm-modal-scale-enter-from,
.confirm-modal-scale-leave-to {
  opacity: 0;
  transform: translateY(14px) scale(0.96);
  filter: blur(8px);
}

@media (max-width: 640px) {
  .confirm-modal {
    padding: 16px;
    align-items: flex-end;
  }

  .confirm-modal__dialog {
    max-width: none;
    padding: 24px 18px 18px;
    border-radius: 24px 24px 18px 18px;
  }

  .confirm-modal__actions {
    flex-direction: column-reverse;
  }

  .confirm-modal__actions :deep(button) {
    width: 100%;
  }
}
</style>