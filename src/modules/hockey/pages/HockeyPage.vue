<template>
  <section class="hockey-page">
    <header class="hockey-page__hero">
      <div>
        <p class="hockey-page__eyebrow">KHL Center</p>
        <h1>Хоккей</h1>
        <p class="hockey-page__description">
          Текущие матчи в прямом эфире и ближайшие игры сезона.
        </p>
      </div>
    </header>

    <section class="hockey-live">
      <div class="hockey-live__top" v-if="hockeyStore.liveMatches.length">
        <div>
          <h2 class="hockey-live__title">
            <span class="hockey-live__dot" />
            Сейчас идут
          </h2>
          <p class="hockey-live__subtitle">
            Счёт обновляется автоматически каждые 15 секунд
          </p>
        </div>

        <UiButton
            :loading="hockeyStore.loadingLive"
            @click="hockeyStore.refreshLiveMatches"
        >
          Обновить
        </UiButton>
      </div>

      <div
          v-if="hockeyStore.liveError && !hockeyStore.liveMatches.length"
          class="hockey-page__empty"
      >
        {{ hockeyStore.liveError }}
      </div>

      <div
          v-else-if="!hockeyStore.loadingLive && !hockeyStore.liveMatches.length"
          class="hockey-page__empty"
      >
        Сейчас нет матчей в прямом эфире
      </div>

      <div v-else-if="hockeyStore.liveMatches.length" class="hockey-live__grid">
        <HockeyLiveMatchCard
            v-for="match in hockeyStore.liveMatches"
            :key="`live-${match.id}`"
            :match="match"
        />
      </div>
    </section>

    <section class="hockey-upcoming">
      <div class="hockey-upcoming__top">
        <div>
          <p class="hockey-page__eyebrow">KHL Schedule</p>
          <h2 class="hockey-upcoming__title">Ближайшие матчи</h2>
          <p class="hockey-upcoming__subtitle">
            Предстоящие матчи текущего этапа сезона
          </p>
        </div>

        <UiButton
            :loading="hockeyStore.isLoading"
            @click="hockeyStore.fetchUpcomingMatches"
        >
          Обновить
        </UiButton>
      </div>

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
          class="hockey-page__empty hockey-upcoming__empty"
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
import HockeyLiveMatchCard from '../components/HockeyLiveMatchCard.vue'
import HockeyMatchCardSkeleton from '../components/HockeyMatchCardSkeleton.vue'
import { hockey } from '../store/hockey.ts'

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
  gap: 20px;
  padding: 24px;
}

.hockey-page__hero {
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  background: rgba(13, 18, 35, 0.82);
}

.hockey-page__eyebrow {
  margin: 0 0 8px;
  color: #a78bfa;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.hockey-page__description {
  margin: 8px 0 0;
  color: rgba(255, 255, 255, 0.72);
}

.hockey-live {
  display: grid;
  gap: 14px;
}

.hockey-live__top {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 16px;
}

.hockey-live__title {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 24px;
}

.hockey-live__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ef4444;
  box-shadow: 0 0 12px rgba(239, 68, 68, 0.8);
}

.hockey-live__subtitle {
  margin: 6px 0 0;
  color: rgba(255, 255, 255, 0.72);
}

.hockey-live__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 12px;
}

.hockey-upcoming {
  display: grid;
  gap: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  background: rgba(13, 18, 35, 0.82);
}

.hockey-upcoming__top {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 16px;
}

.hockey-upcoming__title {
  margin: 0;
  font-size: 28px;
}

.hockey-upcoming__subtitle {
  margin: 8px 0 0;
  color: rgba(255, 255, 255, 0.72);
}

.hockey-page__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 16px;
}

.hockey-page__empty {
  padding: 20px;
  border-radius: 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(13, 18, 35, 0.82);
}

.hockey-upcoming__empty {
  background: rgba(255, 255, 255, 0.02);
}

@media (max-width: 900px) {
  .hockey-page {
    padding: 16px;
  }

  .hockey-live__top,
  .hockey-upcoming__top {
    flex-direction: column;
    align-items: stretch;
  }

  .hockey-live__grid,
  .hockey-page__grid {
    grid-template-columns: 1fr;
  }
}
</style>