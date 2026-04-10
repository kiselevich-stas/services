<script setup lang="ts">
import { computed } from 'vue'
import UiTable from "../../../../components/ui/table/UiTable.vue";
import UiTableRow from "../../../../components/ui/table/UiTableRow.vue";
import type { UiTableColumn} from "../../../../components/ui/table/UiTable.vue";
import type { HockeyEloRatingTeam} from "../../types.ts";

const props = defineProps<{
  items: HockeyEloRatingTeam[]
}>()

const columns: UiTableColumn[] = [
  { key: 'place', label: '#', width: '56px', align: 'left' },
  { key: 'team', label: 'Команда', width: 'minmax(260px, 1.5fr)', align: 'left' },
  { key: 'rating', label: 'Elo', width: '120px', align: 'left' },
  { key: 'matchesPlayed', label: 'Матчи', width: '100px', align: 'left' },
  { key: 'wins', label: 'Победы', width: '100px', align: 'left' },
  { key: 'losses', label: 'Поражения', width: '100px', align: 'left' },
  { key: 'winRate', label: 'Win rate', width: '110px', align: 'left' },
]

const columnsTemplate = columns.map((column) => column.width || '1fr').join(' ')

const rankedItems = computed(() => {
  return props.items.map((item, index) => {
    const matchesPlayed = Number(item.matchesPlayed || 0)
    const wins = Number(item.wins || 0)

    return {
      ...item,
      place: index + 1,
      winRate: matchesPlayed > 0 ? Math.round((wins / matchesPlayed) * 100) : 0,
    }
  })
})

function getFallbackLetter(teamName: string) {
  return teamName.trim().charAt(0).toUpperCase()
}
</script>

<template>
  <UiTable
      :columns="columns"
      :is-scrollable="true"
  >
    <UiTableRow
        v-for="team in rankedItems"
        :key="`${team.seasonId}-${team.teamId}`"
        :columns-template="columnsTemplate"
    >
      <div class="elo-rating-table__cell elo-rating-table__place">
        {{ team.place }}
      </div>

      <div class="elo-rating-table__cell elo-rating-table__team">
        <div
            v-if="team.logoUrl"
            class="elo-rating-table__logo"
        >
          <img :src="team.logoUrl" :alt="team.teamName" />
        </div>

        <div
            v-else
            class="elo-rating-table__logo elo-rating-table__logo--fallback"
        >
          {{ getFallbackLetter(team.teamName) }}
        </div>

        <div class="elo-rating-table__team-meta">
          <strong class="elo-rating-table__team-name">
            {{ team.teamName }}
          </strong>

          <span class="elo-rating-table__team-id">
            ID: {{ team.teamId }}
          </span>
        </div>
      </div>

      <div class="elo-rating-table__cell elo-rating-table__rating">
        {{ Number(team.rating).toFixed(2) }}
      </div>

      <div class="elo-rating-table__cell">
        {{ team.matchesPlayed }}
      </div>

      <div class="elo-rating-table__cell elo-rating-table__cell--positive">
        {{ team.wins }}
      </div>

      <div class="elo-rating-table__cell elo-rating-table__cell--negative">
        {{ team.losses }}
      </div>

      <div class="elo-rating-table__cell">
        <span class="elo-rating-table__win-rate">
          {{ team.winRate }}%
        </span>
      </div>
    </UiTableRow>
  </UiTable>
</template>

<style scoped lang="scss">
.elo-rating-table__cell {
  color: #e2e8f0;
  font-size: 14px;
}

.elo-rating-table__place {
  display: flex;
  align-items: center;
  color: #f8fafc;
  font-size: 18px;
  font-weight: 800;
}

.elo-rating-table__team {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.elo-rating-table__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  border-radius: 14px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.elo-rating-table__logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.elo-rating-table__logo--fallback {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.5), rgba(236, 72, 153, 0.32));
  color: #ffffff;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.elo-rating-table__team-meta {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.elo-rating-table__team-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #f8fafc;
  font-size: 15px;
  line-height: 1.2;
}

.elo-rating-table__team-id {
  color: #64748b;
  font-size: 12px;
}

.elo-rating-table__rating {
  color: #c4b5fd;
  font-size: 18px;
  font-weight: 800;
}

.elo-rating-table__cell--positive {
  color: #4ade80;
  font-weight: 700;
}

.elo-rating-table__cell--negative {
  color: #f87171;
  font-weight: 700;
}

.elo-rating-table__win-rate {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 68px;
  padding: 8px 10px;
  border-radius: 999px;
  background: linear-gradient(
          135deg,
          rgba(139, 92, 246, 0.22),
          rgba(236, 72, 153, 0.16)
  );
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #f8fafc;
  font-size: 13px;
  font-weight: 700;
}
</style>