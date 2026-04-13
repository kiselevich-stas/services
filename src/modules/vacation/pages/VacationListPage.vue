<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import UiButton from '../../../components/ui/UiButton.vue'
import UiInput from '../../../components/ui/UiInput.vue'
import UiPageLoader from '../../../components/ui/UiPageLoader.vue'
import UiSelect from '../../../components/ui/UiSelect.vue'
import { supabase } from '../../../lib/supabase'

import VacationPlanCard from '../components/VacationPlanCard.vue'
import { VACATION_STATUSES } from '../constants/presets'
import {
  useDeleteVacationPlanMutation,
  useToggleVacationPlanFavoriteMutation,
  useVacationPlansQuery,
} from '../composables/useVacationQueries'
import { useVacationStore } from '../stores/vacation'

const router = useRouter()
const vacationStore = useVacationStore()

const userId = ref<string | null>(null)

onMounted(async () => {
  const { data, error } = await supabase.auth.getUser()

  if (error) {
    console.error(error)
    return
  }

  userId.value = data.user?.id ?? null
})

const plansQuery = useVacationPlansQuery(userId)
const deletePlanMutation = useDeleteVacationPlanMutation(userId)
const toggleFavoriteMutation = useToggleVacationPlanFavoriteMutation(userId)

const filteredPlans = computed(() => {
  return vacationStore.filterPlans(plansQuery.data.value ?? [])
})

const statusOptions = computed(() => [
  { label: 'Все статусы', value: 'all' },
  ...VACATION_STATUSES.map((status) => ({
    label: status.label,
    value: status.value,
  })),
])

const sortOptions = [
  { label: 'Сначала ближайшие', value: 'startDateAsc' },
  { label: 'Сначала дальние', value: 'startDateDesc' },
  { label: 'Сначала новые', value: 'createdAtDesc' },
  { label: 'По названию', value: 'titleAsc' },
]

const totalCount = computed(() => plansQuery.data.value?.length ?? 0)
const favoritesCount = computed(() => {
  return (plansQuery.data.value ?? []).filter((plan) => plan.isFavorite).length
})

async function handleDelete(id: string): Promise<void> {
  const confirmed = window.confirm(
      'Удалить отпуск? Будут удалены маршрут, чеклист и загруженные файлы.',
  )

  if (!confirmed) {
    return
  }

  await deletePlanMutation.mutateAsync(id)
}

async function handleToggleFavorite(payload: {
  id: string
  isFavorite: boolean
}): Promise<void> {
  await toggleFavoriteMutation.mutateAsync(payload)
}

function openPlan(id: string): void {
  router.push({ name: 'vacation-details', params: { id } })
}

function goToCreatePage(): void {
  router.push({ name: 'vacation-create' })
}
</script>

<template>
  <div class="vacation-list-page">
    <UiPageLoader
        :visible="plansQuery.isLoading.value && !plansQuery.data.value"
        text="Загружаем отпуска..."
    />

    <section class="vacation-hero">
      <div class="vacation-hero__content">
        <p class="vacation-hero__eyebrow">Vacation Planner</p>
        <h1 class="vacation-hero__title">Планировщик отпуска</h1>
        <p class="vacation-hero__text">
          Красиво собирай поездки, держи маршрут под рукой и отмечай всё важное
          перед выездом.
        </p>

        <div class="vacation-hero__chips">
          <span class="vacation-chip">Маршрут по дням</span>
          <span class="vacation-chip">Чеклист подготовки</span>
          <span class="vacation-chip">Избранные поездки</span>
        </div>

        <div class="vacation-hero__actions">
          <UiButton @click="goToCreatePage">
            Новый отпуск
          </UiButton>
        </div>
      </div>

      <div class="vacation-hero__aside">
        <div class="vacation-highlight-card">
          <span class="vacation-highlight-card__label">Всего отпусков</span>
          <strong class="vacation-highlight-card__value">{{ totalCount }}</strong>

          <div class="vacation-highlight-card__divider" />

          <div class="vacation-highlight-card__meta">
            <div class="vacation-highlight-card__meta-item">
              <span class="vacation-highlight-card__meta-label">В избранном</span>
              <span class="vacation-highlight-card__meta-value">{{ favoritesCount }}</span>
            </div>

            <div class="vacation-highlight-card__meta-item">
              <span class="vacation-highlight-card__meta-label">После фильтров</span>
              <span class="vacation-highlight-card__meta-value">{{ filteredPlans.length }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="vacation-filters">
      <UiInput
          :model-value="vacationStore.search"
          label="Поиск"
          placeholder="Название, описание или направление"
          @update:model-value="vacationStore.setSearch"
      />

      <UiSelect
          :model-value="vacationStore.selectedStatus"
          label="Статус"
          :options="statusOptions"
          @update:model-value="vacationStore.setSelectedStatus($event as any)"
      />

      <UiSelect
          :model-value="vacationStore.sortMode"
          label="Сортировка"
          :options="sortOptions"
          @update:model-value="vacationStore.setSortMode($event as any)"
      />

      <div class="vacation-filters__actions">
        <UiButton
            v-if="vacationStore.hasActiveFilters"
            variant="ghost"
            full-width
            @click="vacationStore.resetFilters()"
        >
          Сбросить
        </UiButton>
      </div>
    </section>

    <section
        v-if="plansQuery.isError.value"
        class="vacation-state vacation-state--error"
    >
      Не удалось загрузить отпуска
    </section>

    <section
        v-else-if="filteredPlans.length"
        class="vacation-list-grid"
    >
      <VacationPlanCard
          v-for="plan in filteredPlans"
          :key="plan.id"
          :plan="plan"
          :loading="toggleFavoriteMutation.isPending.value || deletePlanMutation.isPending.value"
          @open="openPlan"
          @toggle-favorite="handleToggleFavorite"
          @delete="handleDelete"
      />
    </section>

    <section
        v-else
        class="vacation-empty"
    >
      <div class="vacation-empty__icon">🏝️</div>
      <h2 class="vacation-empty__title">Пока нет отпусков</h2>
      <p class="vacation-empty__text">
        Создай первую поездку и начни собирать простой, но мощный план.
      </p>

      <UiButton @click="goToCreatePage">
        Создать отпуск
      </UiButton>
    </section>
  </div>
</template>

<style scoped lang="scss">
.vacation-list-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.vacation-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(280px, 0.65fr);
  gap: 18px;
  padding: 28px;
  border-radius: 32px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background:
      radial-gradient(circle at top left, rgba(236, 72, 153, 0.2), transparent 26%),
      radial-gradient(circle at bottom right, rgba(6, 182, 212, 0.18), transparent 24%),
      linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04)),
      rgba(10, 14, 24, 0.92);
  box-shadow: 0 22px 60px rgba(0, 0, 0, 0.32);
  backdrop-filter: blur(18px);
}

.vacation-hero__eyebrow {
  margin: 0 0 8px;
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(236, 72, 153, 0.9);
}

.vacation-hero__title {
  margin: 0;
  font-size: clamp(30px, 3vw, 44px);
  line-height: 1;
  letter-spacing: -0.04em;
  color: #fff;
}

.vacation-hero__text {
  margin: 14px 0 0;
  max-width: 760px;
  font-size: 16px;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.72);
}

.vacation-hero__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
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

.vacation-hero__actions {
  margin-top: 20px;
}

.vacation-hero__aside {
  display: flex;
}

.vacation-highlight-card {
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
    font-size: clamp(30px, 2.8vw, 40px);
    line-height: 1;
    color: #fff;
  }

  &__divider {
    width: 100%;
    height: 1px;
    margin: 18px 0;
    background: rgba(255, 255, 255, 0.08);
  }

  &__meta {
    display: grid;
    gap: 12px;
  }

  &__meta-item {
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }

  &__meta-label {
    color: rgba(255, 255, 255, 0.58);
    font-size: 13px;
  }

  &__meta-value {
    color: #fff;
    font-weight: 600;
  }
}

.vacation-filters {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 1fr) 180px;
  gap: 14px;
  align-items: end;
}

.vacation-filters__actions {
  display: flex;
}

.vacation-list-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.vacation-state,
.vacation-empty {
  padding: 32px 22px;
  border-radius: 28px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04)),
      rgba(10, 14, 24, 0.92);
  color: #fff;
}

.vacation-state--error {
  color: #fca5a5;
}

.vacation-empty__icon {
  font-size: 42px;
}

.vacation-empty__title {
  margin: 14px 0 0;
  font-size: 26px;
  color: #fff;
}

.vacation-empty__text {
  max-width: 520px;
  margin: 12px auto 0;
  color: rgba(255, 255, 255, 0.66);
  line-height: 1.6;
}

.vacation-empty :deep(.ui-button) {
  margin-top: 18px;
}

@media (max-width: 1180px) {
  .vacation-list-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .vacation-filters {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 860px) {
  .vacation-hero {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .vacation-filters,
  .vacation-list-grid {
    grid-template-columns: 1fr;
  }

  .vacation-hero {
    padding: 22px;
  }
}
</style>