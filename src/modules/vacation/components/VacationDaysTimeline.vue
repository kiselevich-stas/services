<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

import UiButton from '../../../components/ui/UiButton.vue'
import UiInput from '../../../components/ui/UiInput.vue'
import UiTextarea from '../../../components/ui/UiTextarea.vue'

import { vacationDaySchema } from '../schema/vacation.schema'
import type {
  VacationDay,
  VacationDayFormValues,
  VacationDayPoint,
  VacationDayPointFormValues,
} from '../types/vacation'
import VacationDayMapPicker from './VacationDayMapPicker.vue'
import VacationDayPointsEditor from './VacationDayPointsEditor.vue'

const props = defineProps<{
  days: VacationDay[]
  dayPoints: VacationDayPoint[]
  loading?: boolean
  pointsLoading?: boolean
}>()

const emit = defineEmits<{
  create: [values: VacationDayFormValues]
  delete: [id: string]
  createPoint: [payload: { dayId: string; values: VacationDayPointFormValues }]
  deletePoint: [payload: { dayId: string; pointId: string }]
}>()

const form = reactive<VacationDayFormValues>({
  dayDate: '',
  title: '',
  note: '',
  location: '',
  latitude: null,
  longitude: null,
  sortOrder: 0,
})

const expandedDayIds = ref<string[]>([])
const errors = reactive<Record<string, string>>({})

const totalDays = computed(() => props.days.length)

function getDayPoints(dayId: string): VacationDayPoint[] {
  return props.dayPoints
      .filter((point) => point.dayId === dayId)
      .sort((firstPoint, secondPoint) => firstPoint.sortOrder - secondPoint.sortOrder)
}

function isExpanded(dayId: string): boolean {
  return expandedDayIds.value.includes(dayId)
}

function toggleExpanded(dayId: string): void {
  if (isExpanded(dayId)) {
    expandedDayIds.value = expandedDayIds.value.filter((id) => id !== dayId)
    return
  }

  expandedDayIds.value = [...expandedDayIds.value, dayId]
}

function clearErrors(): void {
  Object.keys(errors).forEach((key) => delete errors[key])
}

function resetForm(): void {
  form.dayDate = ''
  form.title = ''
  form.note = ''
  form.location = ''
  form.latitude = null
  form.longitude = null
  form.sortOrder = props.days.length
}

function handleSubmit(): void {
  clearErrors()

  const parseResult = vacationDaySchema.safeParse({
    ...form,
    sortOrder: props.days.length,
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

  emit('create', {
    ...parseResult.data,
    sortOrder: props.days.length,
  })

  resetForm()
}

function handleMapUpdate(payload: { latitude: number; longitude: number }): void {
  form.latitude = payload.latitude
  form.longitude = payload.longitude
}

function handleCreatePoint(dayId: string, values: VacationDayPointFormValues): void {
  emit('createPoint', { dayId, values })
}

function handleDeletePoint(dayId: string, pointId: string): void {
  emit('deletePoint', { dayId, pointId })
}
</script>

<template>
  <section class="vacation-days">
    <div class="vacation-days__header">
      <div>
        <p class="vacation-days__eyebrow">Timeline</p>
        <h3 class="vacation-days__title">Маршрут по дням</h3>
        <p class="vacation-days__text">
          Добавляй дни, заметки и точки маршрута внутри каждого дня.
        </p>
      </div>

      <div class="vacation-days__badge">
        {{ totalDays }} {{ totalDays === 1 ? 'день' : totalDays < 5 ? 'дня' : 'дней' }}
      </div>
    </div>

    <form class="vacation-days__form" @submit.prevent="handleSubmit">
      <UiInput
          v-model="form.dayDate"
          label="Дата"
          type="date"
          :error="errors.dayDate"
      />

      <UiInput
          v-model="form.title"
          label="Название дня"
          placeholder="Например, День у моря"
          :error="errors.title"
      />

      <UiInput
          v-model="form.location"
          label="Локация"
          placeholder="Адлер"
          :error="errors.location"
      />

      <div class="vacation-days__note">
        <UiTextarea
            v-model="form.note"
            label="Заметка"
            placeholder="Что планируется в этот день"
            :rows="4"
            :error="errors.note"
        />
      </div>

      <div class="vacation-days__submit">
        <UiButton
            type="submit"
            :loading="loading"
            :disabled="loading"
        >
          Добавить день
        </UiButton>
      </div>
    </form>

    <div v-if="days.length" class="vacation-days__timeline">
      <article
          v-for="(day, index) in days"
          :key="day.id"
          class="vacation-days__item"
      >
        <div class="vacation-days__line">
          <span class="vacation-days__dot" />
          <span
              v-if="index !== days.length - 1"
              class="vacation-days__stem"
          />
        </div>

        <div class="vacation-days__card">
          <div class="vacation-days__card-top">
            <div>
              <p class="vacation-days__date">{{ day.dayDate }}</p>
              <h4 class="vacation-days__card-title">
                {{ day.title || 'Без названия' }}
              </h4>
            </div>

            <div class="vacation-days__card-actions">
              <UiButton
                  size="sm"
                  variant="ghost"
                  @click="toggleExpanded(day.id)"
              >
                {{ isExpanded(day.id) ? 'Скрыть маршрут' : 'Маршрут дня' }}
              </UiButton>

              <UiButton
                  size="sm"
                  variant="danger-soft"
                  @click="emit('delete', day.id)"
              >
                Удалить
              </UiButton>
            </div>
          </div>

          <p v-if="day.location" class="vacation-days__location">
            📍 {{ day.location }}
          </p>

          <p v-if="day.note" class="vacation-days__description">
            {{ day.note }}
          </p>

          <a
              v-if="day.latitude !== null && day.longitude !== null"
              class="vacation-days__map-link"
              :href="`https://www.openstreetmap.org/?mlat=${day.latitude}&mlon=${day.longitude}#map=15/${day.latitude}/${day.longitude}`"
              target="_blank"
              rel="noreferrer"
          >
            Открыть главную точку дня
          </a>

          <div class="vacation-days__meta">
            Точек маршрута: {{ getDayPoints(day.id).length }}
          </div>

          <div v-if="isExpanded(day.id)" class="vacation-days__points-editor">
            <VacationDayPointsEditor
                :day="day"
                :points="getDayPoints(day.id)"
                :loading="pointsLoading"
                @create="handleCreatePoint(day.id, $event)"
                @delete="handleDeletePoint(day.id, $event)"
            />
          </div>
        </div>
      </article>
    </div>

    <div v-else class="vacation-days__empty">
      <div class="vacation-days__empty-icon">🗺️</div>
      <p class="vacation-days__empty-title">Маршрут пока пуст</p>
      <p class="vacation-days__empty-text">
        Добавь первый день поездки и потом собери для него набор точек.
      </p>
    </div>
  </section>
</template>

<style scoped lang="scss">
.vacation-days {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 24px;
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background:
      radial-gradient(circle at bottom right, rgba(6, 182, 212, 0.14), transparent 24%),
      linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04)),
      rgba(10, 14, 24, 0.92);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(18px);
}

.vacation-days__header {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: flex-start;
}

.vacation-days__eyebrow {
  margin: 0 0 8px;
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(6, 182, 212, 0.92);
}

.vacation-days__title {
  margin: 0;
  font-size: 24px;
  line-height: 1.1;
  color: #fff;
}

.vacation-days__text {
  margin: 12px 0 0;
  color: rgba(255, 255, 255, 0.68);
  line-height: 1.55;
}

.vacation-days__badge {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  padding: 0 14px;
  border-radius: 999px;
  background: rgba(6, 182, 212, 0.12);
  border: 1px solid rgba(6, 182, 212, 0.22);
  color: #fff;
  font-size: 13px;
}

.vacation-days__form {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.vacation-days__note,
.vacation-days__map,
.vacation-days__submit {
  grid-column: 1 / -1;
}

.vacation-days__submit {
  display: flex;
  justify-content: flex-start;
}

.vacation-days__timeline {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.vacation-days__item {
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  gap: 14px;
}

.vacation-days__line {
  position: relative;
  display: flex;
  justify-content: center;
}

.vacation-days__dot {
  position: relative;
  top: 12px;
  width: 14px;
  height: 14px;
  border-radius: 999px;
  background: linear-gradient(135deg, #06b6d4, #8b5cf6);
  box-shadow: 0 0 0 6px rgba(6, 182, 212, 0.08);
}

.vacation-days__stem {
  position: absolute;
  top: 30px;
  bottom: -20px;
  width: 2px;
  background: rgba(255, 255, 255, 0.1);
}

.vacation-days__card {
  padding: 18px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.04);
}

.vacation-days__card-top {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: flex-start;
}

.vacation-days__card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.vacation-days__date {
  margin: 0;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.54);
}

.vacation-days__card-title {
  margin: 8px 0 0;
  font-size: 20px;
  line-height: 1.1;
  color: #fff;
}

.vacation-days__location {
  margin: 14px 0 0;
  color: rgba(255, 255, 255, 0.82);
}

.vacation-days__description {
  margin: 10px 0 0;
  color: rgba(255, 255, 255, 0.66);
  line-height: 1.6;
}

.vacation-days__map-link {
  display: inline-flex;
  margin-top: 14px;
  color: #67e8f9;
  text-decoration: none;
}

.vacation-days__meta {
  margin-top: 12px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.58);
}

.vacation-days__points-editor {
  margin-top: 16px;
}

.vacation-days__empty {
  padding: 28px 18px;
  border-radius: 22px;
  text-align: center;
  background: rgba(255, 255, 255, 0.04);
}

.vacation-days__empty-icon {
  font-size: 34px;
}

.vacation-days__empty-title {
  margin: 12px 0 0;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
}

.vacation-days__empty-text {
  margin: 10px 0 0;
  color: rgba(255, 255, 255, 0.64);
  line-height: 1.55;
}

@media (max-width: 900px) {
  .vacation-days__form {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .vacation-days__header,
  .vacation-days__card-top {
    flex-direction: column;
  }
}
</style>