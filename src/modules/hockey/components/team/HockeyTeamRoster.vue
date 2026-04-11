<script setup lang="ts">
import { computed, ref } from 'vue'
import HockeyTeamPlayerCard from "./HockeyTeamPlayerCard.vue";

type Player = {
  id: number
  image?: string
  name: string
  shirtNumber?: number
  country?: string
  goals?: number
  assists?: number
}

type Roster = {
  goalkeepers?: Player[]
  defensemen?: Player[]
  forwards?: Player[]
}

const props = defineProps<{
  roster?: Roster
}>()

type FilterKey = 'all' | 'goalkeepers' | 'defensemen' | 'forwards'

const activeFilter = ref<FilterKey>('all')

const filterOptions = [
  { key: 'all', label: 'Все' },
  { key: 'goalkeepers', label: 'Вратари' },
  { key: 'defensemen', label: 'Защитники' },
  { key: 'forwards', label: 'Нападающие' },
] as const

const players = computed(() => {
  const roster = props.roster || {}

  if (activeFilter.value === 'goalkeepers') {
    return roster.goalkeepers || []
  }

  if (activeFilter.value === 'defensemen') {
    return roster.defensemen || []
  }

  if (activeFilter.value === 'forwards') {
    return roster.forwards || []
  }

  return [
    ...(roster.goalkeepers || []),
    ...(roster.defensemen || []),
    ...(roster.forwards || []),
  ]
})
</script>

<template>
  <section class="panel">
    <div class="section-head">
      <div>
        <p class="section-head__eyebrow">Состав</p>
        <h2 class="section-head__title">Игроки команды</h2>
      </div>
    </div>

    <div class="roster-filters">
      <button
          v-for="option in filterOptions"
          :key="option.key"
          type="button"
          class="roster-filters__button"
          :class="{ 'roster-filters__button--active': activeFilter === option.key }"
          @click="activeFilter = option.key"
      >
        {{ option.label }}
      </button>
    </div>

    <div
        v-if="players.length"
        class="roster-grid"
    >
      <HockeyTeamPlayerCard
          v-for="player in players"
          :key="player.id"
          :player="player"
      />
    </div>

    <p
        v-else
        class="panel__text"
    >
      Нет данных по игрокам
    </p>
  </section>
</template>

<style scoped lang="scss">
.panel {
  display: grid;
  gap: 16px;
  padding: 22px;
  border-radius: 24px;
  background: rgba(13, 18, 35, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.section-head__eyebrow {
  margin: 0;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.56);
}

.section-head__title {
  margin: 0;
  font-size: 22px;
  color: #fff;
}

.roster-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.roster-filters__button {
  padding: 9px 14px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.82);
  cursor: pointer;
}

.roster-filters__button--active {
  border-color: var(--team-color-32);
  background: var(--team-color-12);
  color: #fff;
}

.roster-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.panel__text {
  margin: 0;
  color: rgba(255, 255, 255, 0.82);
}

@media (max-width: 1180px) {
  .roster-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .roster-grid {
    grid-template-columns: 1fr;
  }
}
</style>