<template>
  <section class="hockey-page">
    <header class="hockey-page__hero">
      <div>
        <p class="hockey-page__eyebrow">KHL Center</p>
        <h1>Хоккей</h1>
        <p class="hockey-page__description">
          Показываем текущие матчи со счётом в прямом эфире и ближайшие игры текущего этапа сезона.
        </p>
      </div>
    </header>

    <section class="hockey-page__section">
      <header class="hockey-page__section-header">
        <div>
          <p class="hockey-page__eyebrow hockey-page__eyebrow--live">Live</p>
          <h2>Текущие матчи</h2>
          <p class="hockey-page__description">
            Счёт обновляется автоматически каждые 15 секунд.
          </p>
        </div>

        <div class="hockey-page__actions">
          <UiButton
              :loading="hockeyStore.loadingLive"
              @click="hockeyStore.refreshLiveMatches"
          >
            Обновить
          </UiButton>
        </div>
      </header>

      <div
          v-if="hockeyStore.loadingLive && !hockeyStore.liveMatches.length"
          class="hockey-page__grid"
      >
        <HockeyMatchCardSkeleton
            v-for="index in 3"
            :key="`live-skeleton-${index}`"
        />
      </div>

      <div
          v-else-if="hockeyStore.liveError && !hockeyStore.liveMatches.length"
          class="hockey-page__empty"
      >
        {{ hockeyStore.liveError }}
      </div>

      <div
          v-else-if="!hockeyStore.liveMatches.length"
          class="hockey-page__empty"
      >
        Сейчас нет матчей в прямом эфире
      </div>

      <div v-else class="hockey-page__grid">
        <HockeyLiveMatchCard
            v-for="match in hockeyStore.liveMatches"
            :key="`live-${match.id}`"
            :match="match"
        />
      </div>
    </section>

    <section class="hockey-page__section">
      <header class="hockey-page__section-header">
        <div>
          <p class="hockey-page__eyebrow">KHL Schedule</p>
          <h2>Ближайшие матчи</h2>
          <p class="hockey-page__description">
            Показываем предстоящие матчи текущего этапа сезона.
          </p>
        </div>

        <div class="hockey-page__actions">
          <UiButton
              :loading="hockeyStore.isLoading"
              @click="hockeyStore.fetchUpcomingMatches"
          >
            Обновить
          </UiButton>
        </div>
      </header>

      <div
          v-if="hockeyStore.isLoading && !hockeyStore.matches.length"
          class="hockey-page__grid"
      >
        <HockeyMatchCardSkeleton
            v-for="index in 6"
            :key="`upcoming-skeleton-${index}`"
        />
      </div>

      <div
          v-else-if="!hockeyStore.matches.length"
          class="hockey-page__empty"
      >
        Пока нет доступных ближайших матчей
      </div>

      <div v-else class="hockey-page__grid">
        <HockeyMatchCard
            v-for="match in hockeyStore.matches"
            :key="`upcoming-${match.id}`"
            :match="match"
        />
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import UiButton from '../../spaces/components/ui/UiButton.vue'
import HockeyMatchCard from '../components/HockeyMatchCard.vue'
import HockeyMatchCardSkeleton from '../components/HockeyMatchCardSkeleton.vue'
import { hockey } from '../store/hockey.ts'
import HockeyLiveMatchCard from "../components/HockeyLiveMatchCard.vue";

const hockeyStore = hockey()

onMounted(() => {
  if (!hockeyStore.matches.length) {
    void hockeyStore.fetchUpcomingMatches()
  }

  void hockeyStore.loadLiveMatches()
  hockeyStore.startLivePolling(15_000)
})

onUnmounted(() => {
  hockeyStore.stopLivePolling()
})
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

.hockey-page__section {
  display: grid;
  gap: 16px;
}

.hockey-page__section-header {
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

.hockey-page__eyebrow--live {
  color: #f87171;
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
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 16px;
}

.hockey-page__empty {
  padding: 24px;
  border-radius: 24px;
  text-align: center;
  color: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(13, 18, 35, 0.82);
}
</style>