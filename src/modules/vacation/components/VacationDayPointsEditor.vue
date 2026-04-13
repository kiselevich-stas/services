<script setup lang="ts">
import { computed, reactive } from 'vue'

import UiButton from '../../../components/ui/UiButton.vue'
import UiInput from '../../../components/ui/UiInput.vue'
import UiTextarea from '../../../components/ui/UiTextarea.vue'

import { vacationDayPointSchema } from '../schema/day-point.schema'
import type {
  VacationDay,
  VacationDayPoint,
  VacationDayPointFormValues,
} from '../types/vacation'
import VacationRouteMap from './VacationRouteMap.vue'

const props = defineProps<{
  day: VacationDay
  points: VacationDayPoint[]
  loading?: boolean
}>()

const emit = defineEmits<{
  create: [values: VacationDayPointFormValues]
  delete: [id: string]
}>()

const form = reactive({
  title: '',
  description: '',
  latitude: null as number | null,
  longitude: null as number | null,
})

const errors = reactive<Record<string, string>>({})

const sortedPoints = computed(() => {
  return [...props.points].sort((firstPoint, secondPoint) => {
    return firstPoint.sortOrder - secondPoint.sortOrder
  })
})

function clearErrors(): void {
  Object.keys(errors).forEach((key) => delete errors[key])
}

function resetForm(): void {
  form.title = ''
  form.description = ''
  form.latitude = null
  form.longitude = null
}

function handleMapAdd(payload: { latitude: number; longitude: number }): void {
  form.latitude = payload.latitude
  form.longitude = payload.longitude

  if (!form.title.trim()) {
    form.title = `Точка ${sortedPoints.value.length + 1}`
  }
}

function handleSubmit(): void {
  clearErrors()

  if (form.latitude === null || form.longitude === null) {
    errors.latitude = 'Выбери точку на карте'
    return
  }

  const parseResult = vacationDayPointSchema.safeParse({
    title: form.title,
    description: form.description,
    latitude: form.latitude,
    longitude: form.longitude,
    sortOrder: sortedPoints.value.length,
  })

  if (!parseResult.success) {
    parseResult.error.issues.forEach((issue) => {
      const fieldName = issue.path[0]

      if (typeof fieldName === 'string' && !errors[fieldName]) {
        errors[fieldName] = issue.message
      }
    })

    return
  }
  console.log('VacationDayPointsEditor submit', parseResult.data)
  emit('create', parseResult.data)
  resetForm()
}

function buildMapLink(point: VacationDayPoint): string {
  return `https://www.openstreetmap.org/?mlat=${point.latitude}&mlon=${point.longitude}#map=15/${point.latitude}/${point.longitude}`
}

const previewPoints = computed(() => {
  const points = [...sortedPoints.value]

  if (form.latitude !== null && form.longitude !== null) {
    points.push({
      id: '__draft__',
      dayId: props.day.id,
      userId: '',
      title: form.title || `Точка ${sortedPoints.value.length + 1}`,
      description: form.description,
      address: '',
      latitude: form.latitude,
      longitude: form.longitude,
      sortOrder: sortedPoints.value.length,
      createdAt: '',
      updatedAt: '',
    })
  }

  return points
})

</script>

<template>
  <section class="vacation-day-points">
    <div class="vacation-day-points__header">
      <div>
        <p class="vacation-day-points__eyebrow">Route</p>
        <h4 class="vacation-day-points__title">
          Точки дня — {{ day.title || day.dayDate }}
        </h4>
      </div>

      <div class="vacation-day-points__badge">
        {{ sortedPoints.length }} точек
      </div>
    </div>

    <VacationRouteMap
        :points="previewPoints"
        :height="320"
        clickable
        @add="handleMapAdd"
    />

    <form class="vacation-day-points__form" @submit.prevent="handleSubmit">
      <UiInput
          v-model="form.title"
          label="Название точки"
          placeholder="Кафе, музей, пляж..."
          :error="errors.title"
      />

      <div class="vacation-day-points__coords">
        <UiInput
            :model-value="form.latitude === null ? '' : String(form.latitude)"
            label="Широта"
            readonly
            :error="errors.latitude"
        />

        <UiInput
            :model-value="form.longitude === null ? '' : String(form.longitude)"
            label="Долгота"
            readonly
            :error="errors.longitude"
        />
      </div>

      <UiTextarea
          v-model="form.description"
          label="Описание"
          placeholder="Заметка о точке маршрута"
          :rows="3"
      />

      <div class="vacation-day-points__actions">
        <UiButton
            type="submit"
            :loading="loading"
            :disabled="loading"
        >
          Добавить точку
        </UiButton>
      </div>
    </form>

    <div v-if="sortedPoints.length" class="vacation-day-points__list">
      <article
          v-for="(point, index) in sortedPoints"
          :key="point.id"
          class="vacation-day-points__item"
      >
        <div class="vacation-day-points__item-left">
          <div class="vacation-day-points__index">
            {{ index + 1 }}
          </div>

          <div>
            <div class="vacation-day-points__item-title">
              {{ point.title || `Точка ${index + 1}` }}
            </div>

            <div v-if="point.description" class="vacation-day-points__item-description">
              {{ point.description }}
            </div>

            <a
                class="vacation-day-points__item-link"
                :href="buildMapLink(point)"
                target="_blank"
                rel="noreferrer"
            >
              Открыть на карте
            </a>
          </div>
        </div>

        <UiButton
            size="sm"
            variant="danger-soft"
            @click="emit('delete', point.id)"
        >
          Удалить
        </UiButton>
      </article>
    </div>

    <div v-else class="vacation-day-points__empty">
      Кликни по карте, чтобы добавить первую точку маршрута.
    </div>
  </section>
</template>

<style scoped lang="scss">
.vacation-day-points {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.03);
}

.vacation-day-points__header {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: flex-start;
}

.vacation-day-points__eyebrow {
  margin: 0 0 6px;
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(6, 182, 212, 0.92);
}

.vacation-day-points__title {
  margin: 0;
  color: #fff;
  font-size: 20px;
}

.vacation-day-points__badge {
  flex-shrink: 0;
  min-height: 36px;
  padding: 0 12px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  background: rgba(6, 182, 212, 0.12);
  color: #fff;
  font-size: 13px;
}

.vacation-day-points__form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.vacation-day-points__coords {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.vacation-day-points__actions {
  display: flex;
  justify-content: flex-start;
}

.vacation-day-points__list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.vacation-day-points__item {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: flex-start;
  padding: 14px 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
}

.vacation-day-points__item-left {
  display: flex;
  gap: 12px;
  min-width: 0;
}

.vacation-day-points__index {
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: rgba(139, 92, 246, 0.18);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
}

.vacation-day-points__item-title {
  color: #fff;
  font-weight: 700;
}

.vacation-day-points__item-description {
  margin-top: 6px;
  color: rgba(255, 255, 255, 0.66);
  line-height: 1.55;
}

.vacation-day-points__item-link {
  display: inline-flex;
  margin-top: 10px;
  color: #67e8f9;
  text-decoration: none;
}

.vacation-day-points__empty {
  padding: 18px;
  border-radius: 18px;
  text-align: center;
  color: rgba(255, 255, 255, 0.62);
  background: rgba(255, 255, 255, 0.04);
}

@media (max-width: 720px) {
  .vacation-day-points__coords {
    grid-template-columns: 1fr;
  }

  .vacation-day-points__item,
  .vacation-day-points__header {
    flex-direction: column;
  }
}
</style>