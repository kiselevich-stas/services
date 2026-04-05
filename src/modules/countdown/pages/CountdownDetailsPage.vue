<template>
  <div class="countdown-details-page">
    <UiBreadcrumbs :items="breadcrumbs" />

    <div class="countdown-details-page__content">
      <template v-if="store.loading">
        <CountdownHeroSkeleton />

        <div class="countdown-details-page__floating-skeleton">
          <div class="countdown-action-skeleton"></div>
          <div class="countdown-action-skeleton countdown-action-skeleton--danger"></div>
        </div>
      </template>

      <div v-else-if="store.error" class="countdown-details-page__state">
        {{ store.error }}
      </div>

      <template v-else-if="event && diff">
        <Transition name="countdown-fade-slide" mode="out-in">
          <CountdownHero
              v-if="!isEditing"
              :key="`view-${event.id}`"
              :event="event"
              :diff="diff"
          />

          <CountdownEventForm
              v-else
              :key="`edit-${event.id}`"
              :model-value="event"
              submit-label="Сохранить изменения"
              @submit="handleSubmit"
          />
        </Transition>

        <Transition name="floating-actions">
          <div class="countdown-floating-actions">
            <UiButton v-if="!isEditing" variant="secondary" @click="openEditing">
              Редактировать
            </UiButton>

            <UiButton v-else @click="closeEditing" variant="ghost">
              Отмена
            </UiButton>

            <UiButton variant="danger-soft" @click="openDeleteModal">
              Удалить
            </UiButton>
          </div>
        </Transition>

        <ConfirmDeleteModal
            :open="isDeleteModalOpen"
            :title="event.title"
            @confirm="handleRemove"
            @close="closeDeleteModal"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import CountdownEventForm from '../components/CountdownEventForm.vue'
import ConfirmDeleteModal from '../components/modal/ConfirmDeleteModal.vue'
import UiBreadcrumbs from '../../../components/ui/breadcrumbs/UiBreadcrumbs.vue'
import UiButton from '../../../components/ui/UiButton.vue'
import CountdownHero from '../components/card/CountdownHero.vue'
import CountdownHeroSkeleton from '../components/skeleton/CountdownHeroSkeleton.vue'

import { useCountdownStore } from '../stores/countdown'
import type { CountdownFormValues } from '../types/countdown'
import { getCountdownDiff } from '../utils/date'

const route = useRoute()
const router = useRouter()
const store = useCountdownStore()

const isEditing = ref(false)
const isDeleteModalOpen = ref(false)

const event = computed(() => {
  return store.getEventById(String(route.params.id))
})

const breadcrumbs = computed(() => [
  { label: 'Главная', to: '/' },
  { label: 'Обратный отсчёт', to: '/countdowns' },
  { label: event.value?.title || '...' },
])

const diff = computed(() => {
  if (!event.value) return null

  return getCountdownDiff({
    targetDate: event.value.targetDate,
    createdAt: event.value.createdAt,
    now: new Date(store.now),
  })
})

onMounted(async () => {
  store.startTicker()
  await store.hydrate()

  if (!event.value) {
    await router.replace('/countdowns')
  }
})

function openEditing(): void {
  isEditing.value = true
}

function closeEditing(): void {
  isEditing.value = false
}

function openDeleteModal(): void {
  isDeleteModalOpen.value = true
}

function closeDeleteModal(): void {
  isDeleteModalOpen.value = false
}

async function handleSubmit(values: CountdownFormValues): Promise<void> {
  if (!event.value) return

  await store.updateEvent(event.value.id, values)
  isEditing.value = false
}

async function handleRemove(): Promise<void> {
  if (!event.value) return

  await store.removeEvent(event.value.id)
  isDeleteModalOpen.value = false
  await router.replace('/countdowns')
}
</script>

<style scoped lang="scss">
.countdown-details-page {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 110px;
  min-height: 100%;
}

.countdown-details-page__content {
  position: relative;
  min-height: 320px;
}

.countdown-details-page__state {
  padding: 24px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.04);
}

.countdown-floating-actions,
.countdown-details-page__floating-skeleton {
  position: fixed;
  left: 50%;
  bottom: 24px;
  z-index: 30;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border-radius: 22px;
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(18px);
  box-shadow:
      0 10px 30px rgba(0, 0, 0, 0.28),
      0 0 0 1px rgba(255, 255, 255, 0.04) inset;
}

.countdown-action-skeleton {
  position: relative;
  overflow: hidden;
  width: 148px;
  height: 44px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.08);

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    transform: translateX(-120%);
    background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.16),
            transparent
    );
    animation: countdownActionSkeletonShimmer 1.8s ease-in-out infinite;
  }

  &--danger {
    width: 112px;
  }
}

.countdown-fade-slide-enter-active,
.countdown-fade-slide-leave-active {
  transition:
      opacity 0.32s ease,
      transform 0.32s ease,
      filter 0.32s ease;
}

.countdown-fade-slide-enter-from {
  opacity: 0;
  transform: translateY(16px) scale(0.985);
  filter: blur(8px);
}

.countdown-fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-12px) scale(0.985);
  filter: blur(8px);
}

.floating-actions-enter-active,
.floating-actions-leave-active {
  transition:
      opacity 0.25s ease,
      transform 0.25s ease;
}

.floating-actions-enter-from,
.floating-actions-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(18px) scale(0.96);
}

@keyframes countdownActionSkeletonShimmer {
  100% {
    transform: translateX(120%);
  }
}

@media (max-width: 768px) {
  .countdown-details-page {
    padding-bottom: 132px;
  }

  .countdown-floating-actions,
  .countdown-details-page__floating-skeleton {
    left: 16px;
    right: 16px;
    bottom: 16px;
    transform: none;
    justify-content: stretch;
    gap: 10px;
    border-radius: 20px;
  }

  .countdown-floating-actions :deep(button),
  .countdown-action-skeleton {
    flex: 1;
    width: auto;
  }

  .floating-actions-enter-from,
  .floating-actions-leave-to {
    transform: translateY(18px) scale(0.96);
  }
}
</style>