<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { hockey } from '../store/hockey'

import UiSelect from '../../../components/ui/UiSelect.vue'
import HockeyEloEmptyState from '../components/elo/HockeyEloEmptyState.vue'
import HockeyEloRatingTable from '../components/elo/HockeyEloRatingTable.vue'

const hockeyStore = hockey()

const {
  eloSeasons,
  eloSeasonsLoading,
  eloSeasonsError,
  selectedEloSeasonId,
  currentEloSeasonId,
  eloRating,
  eloRatingLoading,
  eloRatingError,
  eloCalculatedAt,
  eloSeasonLabel,
  eloHasData,
  eloRecalculateLoading,
  canRecalculateSelectedSeason,
} = storeToRefs(hockeyStore)

const seasonOptions = computed(() => {
  return eloSeasons.value.map((season) => ({
    label: `${season.seasonLabel}${season.isActive ? ' · текущий' : ''}`,
    value: season.seasonId,
  }))
})

const selectedSeasonLabel = computed(() => {
  return (
      eloSeasons.value.find((season) => season.seasonId === selectedEloSeasonId.value)
          ?.seasonLabel ?? '—'
  )
})

const formattedCalculatedAt = computed(() => {
  if (!eloCalculatedAt.value) {
    return '—'
  }

  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(eloCalculatedAt.value))
})

const isCurrentSeason = computed(() => {
  return Boolean(
      currentEloSeasonId.value &&
      selectedEloSeasonId.value &&
      currentEloSeasonId.value === selectedEloSeasonId.value,
  )
})

async function initPage() {
  await hockeyStore.fetchEloSeasons()
  await hockeyStore.fetchEloRating()
}

async function onSeasonChange(seasonId: string | number) {
  const normalizedSeasonId = String(seasonId)

  hockeyStore.setSelectedEloSeason(normalizedSeasonId)
  await hockeyStore.fetchEloRating(normalizedSeasonId, true)
}

async function onRecalculate() {
  await hockeyStore.recalculateSelectedSeasonElo()
}

onMounted(() => {
  void initPage()
})
</script>

<template>
  <section class="hockey-elo-page">
    <header class="hockey-elo-page__hero">
      <div class="hockey-elo-page__hero-content">
        <span class="hockey-elo-page__eyebrow">Hockey analytics</span>

        <h1 class="hockey-elo-page__title">Elo рейтинг команд</h1>

        <p class="hockey-elo-page__subtitle">
          Отслеживай силу команд по сезонам, смотри таблицу Elo и запускай
          пересчёт для текущего сезона прямо со страницы.
        </p>
      </div>

      <div class="hockey-elo-page__stats">
        <div class="hockey-elo-page__stat-card">
          <span>Выбранный сезон</span>
          <strong>{{ selectedSeasonLabel }}</strong>
        </div>

        <div class="hockey-elo-page__stat-card">
          <span>Последний расчёт</span>
          <strong>{{ formattedCalculatedAt }}</strong>
        </div>
      </div>
    </header>

    <section class="hockey-elo-page__toolbar">
      <div class="hockey-elo-page__control">
        <UiSelect
            label="Сезон"
            placeholder="Выберите сезон"
            :options="seasonOptions"
            :model-value="selectedEloSeasonId ?? ''"
            :disabled="eloSeasonsLoading"
            @update:model-value="onSeasonChange"
        />
      </div>

    </section>

    <p v-if="eloSeasonsError" class="hockey-elo-page__error">
      {{ eloSeasonsError }}
    </p>

    <p v-if="eloRatingError" class="hockey-elo-page__error">
      {{ eloRatingError }}
    </p>

    <div v-if="eloRatingLoading" class="hockey-elo-page__loading">
      <div
          v-for="item in 6"
          :key="item"
          class="hockey-elo-page__loading-row"
      />
    </div>

    <HockeyEloRatingTable
        v-else-if="eloHasData"
        :items="eloRating"
    />

    <HockeyEloEmptyState
        v-else
        :can-recalculate="canRecalculateSelectedSeason"
        :is-loading="eloRecalculateLoading"
        :season-label="eloSeasonLabel || selectedSeasonLabel"
        @recalculate="onRecalculate"
    />
  </section>
</template>

<style scoped lang="scss">
.hockey-elo-page {
  display: grid;
  gap: 24px;
  padding: 24px;
}

.hockey-elo-page__hero {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  padding: 32px;
  border-radius: 28px;
  background:
      radial-gradient(circle at top right, rgba(59, 130, 246, 0.16), transparent 35%),
      linear-gradient(180deg, #0f172a, #111827);
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
}

.hockey-elo-page__hero-content {
  max-width: 760px;
}

.hockey-elo-page__eyebrow {
  display: inline-block;
  margin-bottom: 12px;
  color: #8b5cf6;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.hockey-elo-page__title {
  margin: 0 0 12px;
  color: #f8fafc;
  font-size: 40px;
  line-height: 1.05;
}

.hockey-elo-page__subtitle {
  margin: 0;
  color: #94a3b8;
  font-size: 15px;
  line-height: 1.7;
}

.hockey-elo-page__stats {
  display: grid;
  gap: 12px;
  min-width: 260px;
}

.hockey-elo-page__stat-card {
  padding: 18px 20px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
}

.hockey-elo-page__stat-card span {
  display: block;
  margin-bottom: 8px;
  color: #94a3b8;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.hockey-elo-page__stat-card strong {
  color: #f8fafc;
  font-size: 16px;
  font-weight: 700;
}

.hockey-elo-page__toolbar {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding: 20px 24px;
  border-radius: 24px;
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.hockey-elo-page__control {
  width: 100%;
  max-width: 320px;
}

.hockey-elo-page__action {
  border: none;
  border-radius: 16px;
  padding: 14px 20px;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 10px 30px rgba(37, 99, 235, 0.25);
}

.hockey-elo-page__action:hover:not(:disabled) {
  transform: translateY(-1px);
}

.hockey-elo-page__action:disabled {
  opacity: 0.75;
  cursor: default;
  box-shadow: none;
}

.hockey-elo-page__error {
  margin: 0;
  padding: 14px 16px;
  border-radius: 16px;
  background: rgba(248, 113, 113, 0.08);
  border: 1px solid rgba(248, 113, 113, 0.18);
  color: #f87171;
  font-size: 14px;
}

.hockey-elo-page__loading {
  display: grid;
  gap: 12px;
}

.hockey-elo-page__loading-row {
  height: 72px;
  border-radius: 20px;
  background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0.05),
          rgba(255, 255, 255, 0.12),
          rgba(255, 255, 255, 0.05)
  );
  border: 1px solid rgba(255, 255, 255, 0.04);
}

@media (max-width: 900px) {
  .hockey-elo-page {
    padding: 16px;
  }

  .hockey-elo-page__hero {
    flex-direction: column;
    padding: 24px;
  }

  .hockey-elo-page__title {
    font-size: 32px;
  }

  .hockey-elo-page__stats {
    min-width: unset;
  }

  .hockey-elo-page__toolbar {
    padding: 16px;
  }

  .hockey-elo-page__control {
    max-width: 100%;
  }
}
</style>