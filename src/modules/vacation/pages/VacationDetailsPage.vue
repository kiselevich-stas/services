<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import UiButton from '../../../components/ui/UiButton.vue'
import UiPageLoader from '../../../components/ui/UiPageLoader.vue'
import { supabase } from '../../../lib/supabase'

import VacationChecklistBlock from '../components/VacationChecklistBlock.vue'
import VacationDaysTimeline from '../components/VacationDaysTimeline.vue'
import VacationPlanForm from '../components/VacationPlanForm.vue'
import {
  useCreateVacationChecklistItemMutation,
  useCreateVacationDayMutation,
  useDeleteChecklistItemFileMutation,
  useDeleteVacationChecklistItemMutation,
  useDeleteVacationDayMutation,
  useToggleVacationChecklistItemMutation,
  useUpdateVacationPlanMutation,
  useUploadChecklistItemFileMutation,
  useVacationPlanDetailsQuery,
} from '../composables/useVacationQueries'
import type {
  VacationChecklistItemFormValues,
  VacationDayFormValues,
  VacationPlanFormValues,
} from '../types/vacation'

import {
  useCreateVacationDayPointMutation,
  useDeleteVacationDayPointMutation,
} from '../composables/useVacationQueries'
import type { VacationDayPointFormValues } from '../types/vacation'
import VacationPlanRouteOverview from '../components/VacationPlanRouteOverview.vue'

const route = useRoute()
const router = useRouter()

const userId = ref<string | null>(null)

const planId = computed(() => String(route.params.id ?? ''))

const pointDayId = ref<string | null>(null)

const createDayPointMutation = useCreateVacationDayPointMutation(planId, userId)
const deleteDayPointMutation = useDeleteVacationDayPointMutation(planId, userId)

onMounted(async () => {
  const { data, error } = await supabase.auth.getUser()

  if (error) {
    console.error(error)
    return
  }

  userId.value = data.user?.id ?? null
})

const planDetailsQuery = useVacationPlanDetailsQuery(planId, userId)
const updatePlanMutation = useUpdateVacationPlanMutation(planId, userId)

const createDayMutation = useCreateVacationDayMutation(planId, userId)
const deleteDayMutation = useDeleteVacationDayMutation(planId, userId)

const createChecklistItemMutation = useCreateVacationChecklistItemMutation(planId, userId)
const toggleChecklistItemMutation = useToggleVacationChecklistItemMutation(planId, userId)
const deleteChecklistItemMutation = useDeleteVacationChecklistItemMutation(planId, userId)

const plan = computed(() => planDetailsQuery.data.value?.plan ?? null)
const days = computed(() => planDetailsQuery.data.value?.days ?? [])
const checklist = computed(() => planDetailsQuery.data.value?.checklist ?? [])

const uploadChecklistFileMutation = useUploadChecklistItemFileMutation(planId, userId)
const deleteChecklistFileMutation = useDeleteChecklistItemFileMutation(planId, userId)

const initialFormValues = computed(() => {
  if (!plan.value) {
    return undefined
  }

  return {
    title: plan.value.title,
    description: plan.value.description,
    destination: plan.value.destination,
    startDate: plan.value.startDate,
    endDate: plan.value.endDate,
    status: plan.value.status,
    emoji: plan.value.emoji,
    color: plan.value.color,
    travelersCount: plan.value.travelersCount,
    budget: plan.value.budget,
    isFavorite: plan.value.isFavorite,
  }
})

const durationInDays = computed(() => {
  if (!plan.value) {
    return 0
  }

  const startTime = new Date(plan.value.startDate).getTime()
  const endTime = new Date(plan.value.endDate).getTime()

  if (Number.isNaN(startTime) || Number.isNaN(endTime)) {
    return 0
  }

  return Math.floor((endTime - startTime) / (1000 * 60 * 60 * 24)) + 1
})

const doneChecklistCount = computed(() => {
  return checklist.value.filter((item) => item.isDone).length
})

async function handleUpdatePlan(values: VacationPlanFormValues): Promise<void> {
  await updatePlanMutation.mutateAsync(values)
}

async function handleCreateDay(values: VacationDayFormValues): Promise<void> {
  await createDayMutation.mutateAsync(values)
}

async function handleDeleteDay(id: string): Promise<void> {
  const confirmed = window.confirm('Удалить этот день маршрута?')

  if (!confirmed) {
    return
  }

  await deleteDayMutation.mutateAsync(id)
}

async function handleCreateChecklistItem(
    values: VacationChecklistItemFormValues,
): Promise<void> {
  await createChecklistItemMutation.mutateAsync(values)
}

async function handleToggleChecklistItem(payload: {
  id: string
  isDone: boolean
}): Promise<void> {
  await toggleChecklistItemMutation.mutateAsync(payload)
}

async function handleDeleteChecklistItem(id: string): Promise<void> {
  const confirmed = window.confirm('Удалить этот пункт чеклиста?')

  if (!confirmed) {
    return
  }

  await deleteChecklistItemMutation.mutateAsync(id)
}

async function handleUploadChecklistFile(payload: {
  checklistItemId: string
  file: File
  fileType: 'document' | 'ticket'
}): Promise<void> {
  await uploadChecklistFileMutation.mutateAsync(payload)
}

async function handleDeleteChecklistFile(id: string): Promise<void> {
  const confirmed = window.confirm('Удалить этот файл?')

  if (!confirmed) {
    return
  }

  await deleteChecklistFileMutation.mutateAsync(id)
}
async function handleCreateDayPoint(payload: {
  dayId: string
  values: VacationDayPointFormValues
}): Promise<void> {
  await createDayPointMutation.mutateAsync(payload)
}

async function handleDeleteDayPoint(payload: {
  dayId: string
  pointId: string
}): Promise<void> {
  const confirmed = window.confirm('Удалить эту точку маршрута?')

  if (!confirmed) {
    return
  }

  pointDayId.value = payload.dayId
  await deleteDayPointMutation.mutateAsync(payload.pointId)
}

</script>

<template>
  <div class="vacation-details-page">
    <UiPageLoader
        :visible="planDetailsQuery.isLoading.value && !planDetailsQuery.data.value"
        text="Загружаем поездку..."
    />

    <div class="vacation-details-page__back">
      <UiButton variant="ghost" @click="router.push({ name: 'vacation-list' })">
        ← Ко всем отпускам
      </UiButton>
    </div>

    <section
        v-if="planDetailsQuery.isError.value || !plan"
        class="vacation-state vacation-state--error"
    >
      Не удалось загрузить отпуск
    </section>

    <template v-else>
      <section
          class="vacation-details-hero"
          :style="{ '--accent-color': plan.color }"
      >
        <div class="vacation-details-hero__main">
          <div class="vacation-details-hero__emoji">
            {{ plan.emoji }}
          </div>

          <div>
            <p class="vacation-details-hero__destination">
              {{ plan.destination || 'Без направления' }}
            </p>

            <h1 class="vacation-details-hero__title">
              {{ plan.title }}
            </h1>

            <p class="vacation-details-hero__description">
              {{ plan.description || 'Описание пока не добавлено.' }}
            </p>

            <div class="vacation-details-hero__chips">
              <span class="vacation-chip">{{ durationInDays }} дн.</span>
              <span class="vacation-chip">{{ plan.travelersCount }} чел.</span>
              <span class="vacation-chip">{{ days.length }} дней маршрута</span>
              <span class="vacation-chip">{{ doneChecklistCount }}/{{ checklist.length }} чеклист</span>
            </div>
          </div>
        </div>

        <div class="vacation-details-hero__side">
          <div class="vacation-metric-card">
            <span class="vacation-metric-card__label">Даты поездки</span>
            <strong class="vacation-metric-card__value">
              {{ plan.startDate }}
            </strong>
            <span class="vacation-metric-card__meta">
              до {{ plan.endDate }}
            </span>
          </div>
        </div>
      </section>
      <VacationPlanRouteOverview
          :days="days"
          :points="planDetailsQuery.data.value?.dayPoints ?? []"
      />
      <section class="vacation-summary-grid">
        <article class="vacation-summary-card vacation-summary-card--pink">
          <span class="vacation-summary-card__shine" />
          <div class="vacation-summary-card__body">
            <p class="vacation-summary-card__label">Длительность</p>
            <div class="vacation-summary-card__value-row">
              <strong class="vacation-summary-card__value">{{ durationInDays }}</strong>
              <span class="vacation-summary-card__suffix">дн.</span>
            </div>
          </div>
        </article>

        <article class="vacation-summary-card vacation-summary-card--violet">
          <span class="vacation-summary-card__shine" />
          <div class="vacation-summary-card__body">
            <p class="vacation-summary-card__label">Маршрут</p>
            <div class="vacation-summary-card__value-row">
              <strong class="vacation-summary-card__value">{{ days.length }}</strong>
              <span class="vacation-summary-card__suffix">дней</span>
            </div>
          </div>
        </article>

        <article class="vacation-summary-card vacation-summary-card--cyan">
          <span class="vacation-summary-card__shine" />
          <div class="vacation-summary-card__body">
            <p class="vacation-summary-card__label">Чеклист</p>
            <div class="vacation-summary-card__value-row">
              <strong class="vacation-summary-card__value">{{ doneChecklistCount }}</strong>
              <span class="vacation-summary-card__suffix">готово</span>
            </div>
          </div>
        </article>

        <article class="vacation-summary-card vacation-summary-card--green">
          <span class="vacation-summary-card__shine" />
          <div class="vacation-summary-card__body">
            <p class="vacation-summary-card__label">Путешественников</p>
            <div class="vacation-summary-card__value-row">
              <strong class="vacation-summary-card__value">{{ plan.travelersCount }}</strong>
              <span class="vacation-summary-card__suffix">чел.</span>
            </div>
          </div>
        </article>
      </section>

      <section class="vacation-details-layout">
        <div class="vacation-details-layout__main">

          <VacationDaysTimeline
              :days="days"
              :day-points="planDetailsQuery.data.value?.dayPoints ?? []"
              :loading="createDayMutation.isPending.value || deleteDayMutation.isPending.value"
              :points-loading="createDayPointMutation.isPending.value || deleteDayPointMutation.isPending.value"
              @create="handleCreateDay"
              @delete="handleDeleteDay"
              @create-point="handleCreateDayPoint"
              @delete-point="handleDeleteDayPoint"
          />

          <div class="vacation-card-shell">
            <div class="vacation-card-shell__head">
              <p class="vacation-card-shell__eyebrow">Settings</p>
              <h2 class="vacation-card-shell__title">Настройки поездки</h2>
            </div>

            <VacationPlanForm
                :initial-values="initialFormValues"
                submit-text="Сохранить изменения"
                :loading="updatePlanMutation.isPending.value"
                @submit="handleUpdatePlan"
            />
          </div>


        </div>

        <aside class="vacation-details-layout__aside">
          <VacationChecklistBlock
              :items="checklist"
              :files="planDetailsQuery.data.value?.checklistFiles ?? []"
              :loading="
    createChecklistItemMutation.isPending.value ||
    toggleChecklistItemMutation.isPending.value ||
    deleteChecklistItemMutation.isPending.value
  "
              :upload-loading="uploadChecklistFileMutation.isPending.value"
              @create="handleCreateChecklistItem"
              @toggle="handleToggleChecklistItem"
              @delete="handleDeleteChecklistItem"
              @upload-file="handleUploadChecklistFile"
              @delete-file="handleDeleteChecklistFile"
          />
        </aside>
      </section>
    </template>
  </div>
</template>

<style scoped lang="scss">
.vacation-details-page {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.vacation-details-page__back {
  display: flex;
}

.vacation-details-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(260px, 0.65fr);
  gap: 18px;
  padding: 28px;
  border-radius: 32px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background:
      radial-gradient(circle at top left, color-mix(in srgb, var(--accent-color) 24%, transparent), transparent 26%),
      radial-gradient(circle at bottom right, rgba(6, 182, 212, 0.16), transparent 24%),
      linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04)),
      rgba(10, 14, 24, 0.92);
  box-shadow: 0 22px 60px rgba(0, 0, 0, 0.32);
  backdrop-filter: blur(18px);
}

.vacation-details-hero__main {
  display: flex;
  gap: 16px;
}

.vacation-details-hero__emoji {
  width: 72px;
  height: 72px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 24px;
  font-size: 32px;
  background: rgba(255, 255, 255, 0.08);
}

.vacation-details-hero__destination {
  margin: 0;
  font-size: 13px;
  color: color-mix(in srgb, var(--accent-color) 74%, white);
}

.vacation-details-hero__title {
  margin: 8px 0 0;
  font-size: clamp(30px, 3vw, 42px);
  line-height: 1;
  letter-spacing: -0.04em;
  color: #fff;
}

.vacation-details-hero__description {
  margin: 14px 0 0;
  max-width: 780px;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.65;
}

.vacation-details-hero__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

.vacation-details-hero__side {
  display: flex;
}

.vacation-metric-card {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 22px;
  border-radius: 26px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04));
  border: 1px solid rgba(255, 255, 255, 0.08);

  &__label {
    color: rgba(255, 255, 255, 0.56);
    font-size: 13px;
  }

  &__value {
    margin-top: 8px;
    font-size: clamp(22px, 2.4vw, 30px);
    line-height: 1.1;
    color: #fff;
  }

  &__meta {
    margin-top: 8px;
    color: rgba(255, 255, 255, 0.66);
    font-size: 14px;
  }
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

.vacation-summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.vacation-summary-card {
  position: relative;
  overflow: hidden;
  min-height: 132px;
  padding: 18px;
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04)),
      rgba(10, 14, 24, 0.9);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(18px);

  &__shine {
    position: absolute;
    inset: auto -16% -40% auto;
    width: 140px;
    height: 140px;
    border-radius: 999px;
    opacity: 0.95;
    filter: blur(8px);
  }

  &__body {
    position: relative;
    z-index: 1;
  }

  &__label {
    margin: 0 0 18px;
    font-size: 13px;
    line-height: 1.4;
    color: rgba(255, 255, 255, 0.68);
  }

  &__value-row {
    display: flex;
    align-items: flex-end;
    gap: 8px;
  }

  &__value {
    font-size: clamp(28px, 2.6vw, 40px);
    line-height: 0.95;
    letter-spacing: -0.04em;
    color: #fff;
  }

  &__suffix {
    padding-bottom: 4px;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.6);
  }

  &--pink .vacation-summary-card__shine {
    background: radial-gradient(circle, rgba(236, 72, 153, 0.42), transparent 65%);
  }

  &--violet .vacation-summary-card__shine {
    background: radial-gradient(circle, rgba(139, 92, 246, 0.42), transparent 65%);
  }

  &--cyan .vacation-summary-card__shine {
    background: radial-gradient(circle, rgba(6, 182, 212, 0.42), transparent 65%);
  }

  &--green .vacation-summary-card__shine {
    background: radial-gradient(circle, rgba(34, 197, 94, 0.42), transparent 65%);
  }
}

.vacation-details-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(420px, 0.95fr);
  gap: 18px;
  align-items: start;
}

.vacation-details-layout__main {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.vacation-details-layout__aside {
  position: sticky;
  top: 80px;
}

.vacation-card-shell,
.vacation-state {
  padding: 24px;
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04)),
      rgba(10, 14, 24, 0.92);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(18px);
}

.vacation-card-shell__head {
  margin-bottom: 18px;
}

.vacation-card-shell__eyebrow {
  margin: 0 0 8px;
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(139, 92, 246, 0.9);
}

.vacation-card-shell__title {
  margin: 0;
  font-size: 24px;
  color: #fff;
}

.vacation-state {
  text-align: center;
  color: #fff;

  &--error {
    color: #fca5a5;
  }
}

@media (max-width: 1180px) {
  .vacation-summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .vacation-details-layout {
    grid-template-columns: 1fr;
  }

  .vacation-details-layout__aside {
    position: static;
  }
}

@media (max-width: 860px) {
  .vacation-details-hero {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .vacation-summary-grid {
    grid-template-columns: 1fr;
  }

  .vacation-details-hero__main {
    flex-direction: column;
  }
}
</style>