<script setup lang="ts">
import { computed } from 'vue'
import UiButton from '../../../components/ui/UiButton.vue'
import type { VacationPlan } from '../types/vacation'

const props = defineProps<{
  plan: VacationPlan
  loading?: boolean
}>()

const emit = defineEmits<{
  open: [id: string]
  toggleFavorite: [payload: { id: string; isFavorite: boolean }]
  delete: [id: string]
}>()

const durationInDays = computed(() => {
  const startTime = new Date(props.plan.startDate).getTime()
  const endTime = new Date(props.plan.endDate).getTime()

  if (Number.isNaN(startTime) || Number.isNaN(endTime)) {
    return 0
  }

  return Math.floor((endTime - startTime) / (1000 * 60 * 60 * 24)) + 1
})

const statusLabel = computed(() => {
  switch (props.plan.status) {
    case 'planned':
      return 'Запланирован'
    case 'booked':
      return 'Забронирован'
    case 'in_progress':
      return 'Идёт сейчас'
    case 'completed':
      return 'Завершён'
    case 'cancelled':
      return 'Отменён'
    default:
      return props.plan.status
  }
})

function handleOpen(): void {
  emit('open', props.plan.id)
}

function handleToggleFavorite(event: MouseEvent): void {
  event.stopPropagation()

  emit('toggleFavorite', {
    id: props.plan.id,
    isFavorite: !props.plan.isFavorite,
  })
}

function handleDelete(event: MouseEvent): void {
  event.stopPropagation()
  emit('delete', props.plan.id)
}
</script>

<template>
  <article
      class="vacation-card"
      :style="{ '--accent-color': plan.color }"
      @click="handleOpen"
  >
    <span class="vacation-card__shine" />

    <div class="vacation-card__top">
      <div class="vacation-card__identity">
        <div class="vacation-card__emoji">
          {{ plan.emoji }}
        </div>

        <div class="vacation-card__content">
          <p class="vacation-card__destination">
            {{ plan.destination || 'Без направления' }}
          </p>

          <h3 class="vacation-card__title">
            {{ plan.title }}
          </h3>

          <p v-if="plan.description" class="vacation-card__description">
            {{ plan.description }}
          </p>
        </div>
      </div>

      <div class="vacation-card__actions">
        <UiButton
            variant="ghost"
            size="sm"
            :disabled="loading"
            @click="handleToggleFavorite"
        >
          {{ plan.isFavorite ? '★' : '☆' }}
        </UiButton>

        <UiButton
            variant="danger-soft"
            size="sm"
            :disabled="loading"
            @click="handleDelete"
        >
          Удалить
        </UiButton>
      </div>
    </div>

    <div class="vacation-card__chips">
      <span class="vacation-chip">{{ statusLabel }}</span>
      <span class="vacation-chip">{{ durationInDays }} дн.</span>
      <span class="vacation-chip">{{ plan.travelersCount }} чел.</span>
      <span v-if="plan.budget !== null" class="vacation-chip">{{ plan.budget }} ₽</span>
    </div>

    <div class="vacation-card__footer">
      <span>{{ plan.startDate }}</span>
      <span class="vacation-card__divider" />
      <span>{{ plan.endDate }}</span>
    </div>
  </article>
</template>

<style scoped lang="scss">
.vacation-card {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-height: 260px;
  padding: 22px;
  border-radius: 28px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background:
      radial-gradient(circle at top left, color-mix(in srgb, var(--accent-color) 26%, transparent), transparent 28%),
      linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04)),
      rgba(10, 14, 24, 0.92);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(18px);
  transition:
      transform 0.22s ease,
      box-shadow 0.22s ease,
      border-color 0.22s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 26px 60px rgba(0, 0, 0, 0.34);
    border-color: rgba(255, 255, 255, 0.12);
  }
}

.vacation-card__shine {
  position: absolute;
  inset: auto -10% -28% auto;
  width: 180px;
  height: 180px;
  border-radius: 999px;
  background: radial-gradient(circle, color-mix(in srgb, var(--accent-color) 42%, transparent), transparent 65%);
  filter: blur(10px);
  opacity: 0.9;
}

.vacation-card__top {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  gap: 18px;
}

.vacation-card__identity {
  display: flex;
  gap: 14px;
  min-width: 0;
}

.vacation-card__emoji {
  width: 58px;
  height: 58px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 20px;
  font-size: 28px;
  background: rgba(255, 255, 255, 0.08);
}

.vacation-card__content {
  min-width: 0;
}

.vacation-card__destination {
  margin: 0;
  font-size: 13px;
  color: color-mix(in srgb, var(--accent-color) 70%, white);
}

.vacation-card__title {
  margin: 8px 0 0;
  font-size: 24px;
  line-height: 1.05;
  letter-spacing: -0.03em;
  color: #fff;
}

.vacation-card__description {
  margin: 12px 0 0;
  color: rgba(255, 255, 255, 0.68);
  line-height: 1.55;
  font-size: 14px;
}

.vacation-card__actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
}

.vacation-card__chips {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.vacation-chip {
  display: inline-flex;
  align-items: center;
  min-height: 36px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.82);
  font-size: 13px;
}

.vacation-card__footer {
  position: relative;
  z-index: 1;
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba(255, 255, 255, 0.62);
  font-size: 13px;
}

.vacation-card__divider {
  width: 16px;
  height: 1px;
  background: rgba(255, 255, 255, 0.22);
}

@media (max-width: 760px) {
  .vacation-card__top {
    flex-direction: column;
  }

  .vacation-card__actions {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>