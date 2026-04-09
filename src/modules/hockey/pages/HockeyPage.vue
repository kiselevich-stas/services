<template>
  <section class="hockey-page">
    <header class="hockey-page__hero">
      <div>
        <p class="hockey-page__eyebrow">KHL Schedule</p>
        <h1>Ближайшие матчи</h1>
        <p class="hockey-page__description">
          Показываем предстоящие матчи текущего этапа сезона.
        </p>
      </div>

      <div class="hockey-page__actions">
        <UiButton
            label="Обновить"
            :loading="isLoading"
            @click="loadUpcomingMatches"
        />
      </div>
    </header>

    <div v-if="errorMessage" class="hockey-page__error">
      {{ errorMessage }}
    </div>

    <div v-else-if="isLoading && !matches.length" class="hockey-page__empty">
      Загружаем ближайшие матчи...
    </div>

    <div v-else-if="!matches.length" class="hockey-page__empty">
      Пока нет доступных ближайших матчей
    </div>

    <div v-else class="hockey-page__grid">
      <article
          v-for="match in matches"
          :key="match.id"
          class="match-card"
      >
        <div class="match-card__top">
          <p class="match-card__stage">
            {{ match.stageName || 'Текущий этап' }}
          </p>

          <p class="match-card__date">
            {{ formatMatchDate(match.startAt) }}
          </p>
        </div>

        <div class="match-card__body">
          <div class="match-team">
            <img
                v-if="match.teamA.image"
                :src="match.teamA.image"
                :alt="match.teamA.name"
                class="match-team__logo"
            />

            <div>
              <p class="match-team__name">{{ match.teamA.name }}</p>
              <p class="match-team__location">{{ match.teamA.location || '—' }}</p>
            </div>
          </div>

          <div class="match-card__vs">VS</div>

          <div class="match-team match-team--right">
            <img
                v-if="match.teamB.image"
                :src="match.teamB.image"
                :alt="match.teamB.name"
                class="match-team__logo"
            />

            <div>
              <p class="match-team__name">{{ match.teamB.name }}</p>
              <p class="match-team__location">{{ match.teamB.location || '—' }}</p>
            </div>
          </div>
        </div>

        <div class="match-card__bottom">
          <p class="match-card__status">
            {{ match.gameState || 'Запланирован' }}
          </p>

          <p class="match-card__time">
            {{ formatMatchTime(match.startAt) }}
          </p>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import UiButton from '../../../components/ui/UiButton.vue'
import { getUpcomingMatches } from '../api/hockeyApi'
import type { HockeyUpcomingMatch } from '../types'

const matches = ref<HockeyUpcomingMatch[]>([])
const isLoading = ref(false)
const errorMessage = ref('')

onMounted(() => {
  void loadUpcomingMatches()
})

async function loadUpcomingMatches() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    matches.value = await getUpcomingMatches()
  } catch (error) {
    errorMessage.value =
        error instanceof Error ? error.message : 'Не удалось загрузить ближайшие матчи'
  } finally {
    isLoading.value = false
  }
}

function formatMatchDate(value: number | null) {
  if (!value) {
    return 'Дата неизвестна'
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))
}

function formatMatchTime(value: number | null) {
  if (!value) {
    return '—'
  }

  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}
</script>

<style scoped lang="scss">
.hockey-page {
  display: grid;
  gap: 24px;
  padding: 24px;
}

.hockey-page__hero {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  background: rgba(13, 18, 35, 0.82);
}

.hockey-page__eyebrow {
  margin-bottom: 8px;
  color: #a78bfa;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.hockey-page__description {
  color: rgba(255, 255, 255, 0.72);
}

.hockey-page__actions {
  display: flex;
  align-items: end;
}

.hockey-page__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
}

.hockey-page__error {
  padding: 16px 18px;
  border-radius: 18px;
  color: #fff;
  background: rgba(239, 68, 68, 0.16);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.hockey-page__empty {
  padding: 24px;
  border-radius: 24px;
  text-align: center;
  color: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(13, 18, 35, 0.82);
}

.match-card {
  display: grid;
  gap: 18px;
  padding: 20px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(13, 18, 35, 0.82);
}

.match-card__top,
.match-card__bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.match-card__stage {
  color: #f472b6;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.match-card__date,
.match-card__time,
.match-card__status,
.match-team__location {
  color: rgba(255, 255, 255, 0.68);
}

.match-card__body {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 12px;
  align-items: center;
}

.match-card__vs {
  font-size: 14px;
  font-weight: 700;
  color: #a78bfa;
}

.match-team {
  display: flex;
  align-items: center;
  gap: 12px;
}

.match-team--right {
  justify-content: flex-end;
  text-align: right;
}

.match-team__logo {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  background: rgba(255, 255, 255, 0.04);
}

.match-team__name {
  font-weight: 600;
}
</style>