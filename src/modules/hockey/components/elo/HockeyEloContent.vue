<script setup lang="ts">
import HockeyEloEmptyState from './HockeyEloEmptyState.vue'
import HockeyEloRatingTable from './HockeyEloRatingTable.vue'

defineProps<{
  eloSeasonsError: string
  eloRatingError: string
  eloHasData: boolean
  eloRating: any[]
  canRecalculateSelectedSeason: boolean
  eloRecalculateLoading: boolean
  seasonLabel: string
}>()

const emit = defineEmits<{
  (event: 'recalculate'): void
}>()
</script>

<template>
  <div class="hockey-elo-content">
    <p v-if="eloSeasonsError" class="hockey-elo-content__error">
      {{ eloSeasonsError }}
    </p>

    <p v-if="eloRatingError" class="hockey-elo-content__error">
      {{ eloRatingError }}
    </p>

    <Transition name="elo-content-fade" mode="out-in">
      <HockeyEloRatingTable
          v-if="eloHasData"
          :items="eloRating"
      />

      <HockeyEloEmptyState
          v-else
          :can-recalculate="canRecalculateSelectedSeason"
          :is-loading="eloRecalculateLoading"
          :season-label="seasonLabel"
          @recalculate="emit('recalculate')"
      />
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.hockey-elo-content {
  display: grid;
  gap: 16px;
}

.hockey-elo-content__error {
  margin: 0;
  padding: 14px 16px;
  border-radius: 16px;
  background: rgba(248, 113, 113, 0.08);
  border: 1px solid rgba(248, 113, 113, 0.18);
  color: #f87171;
  font-size: 14px;
}

.elo-content-fade-enter-active,
.elo-content-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.elo-content-fade-enter-from,
.elo-content-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>