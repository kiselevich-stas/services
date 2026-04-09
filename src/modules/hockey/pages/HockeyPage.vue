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
          :key="index"
      />
    </div>

    <div v-else-if="!hockeyStore.matches.length" class="hockey-page__empty">
      Пока нет доступных ближайших матчей
    </div>

    <div v-else class="hockey-page__grid">
      <HockeyMatchCard
          v-for="match in hockeyStore.matches"
          :key="match.id"
          :match="match"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import UiButton from "../../spaces/components/ui/UiButton.vue";
import HockeyMatchCard from '../components/HockeyMatchCard.vue'
import HockeyMatchCardSkeleton from '../components/HockeyMatchCardSkeleton.vue'
import { useHockeyStore} from "../store/useHockeyStore.ts";

const hockeyStore = useHockeyStore()

onMounted(() => {
  if (!hockeyStore.matches.length) {
    void hockeyStore.fetchUpcomingMatches()
  }
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