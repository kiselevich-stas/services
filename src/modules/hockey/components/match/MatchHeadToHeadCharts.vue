<template>
  <section class="match-card match-surface">
    <h3 class="match-card__title">Графики очных встреч</h3>

    <div class="charts">
      <div
          v-for="item in chartItems"
          :key="item.label"
          class="chart-row"
      >
        <div class="chart-row__head">
          <span>{{ item.label }}</span>
          <strong>{{ item.teamA }} / {{ item.teamB }}</strong>
        </div>

        <div class="chart-bar">
          <div
              class="chart-bar__left"
              :style="{ width: `${item.leftWidth}%` }"
          />
          <div
              class="chart-bar__right"
              :style="{ width: `${item.rightWidth}%` }"
          />
        </div>

        <div class="chart-row__footer">
          <span>{{ teamA?.name || 'Команда 1' }}</span>
          <span>{{ teamB?.name || 'Команда 2' }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  headToHead: any
  teamA: any
  teamB: any
}>()

function getWidths(leftValue: number, rightValue: number) {
  const total = leftValue + rightValue

  if (!total) {
    return {
      leftWidth: 50,
      rightWidth: 50,
    }
  }

  return {
    leftWidth: (leftValue / total) * 100,
    rightWidth: (rightValue / total) * 100,
  }
}

const chartItems = computed(() => {
  const teamAStats = props.headToHead?.teamA ?? {}
  const teamBStats = props.headToHead?.teamB ?? {}

  const items = [
    {
      label: 'Победы',
      teamA: Number(teamAStats.wins ?? 0),
      teamB: Number(teamBStats.wins ?? 0),
    },
    {
      label: 'Голы',
      teamA: Number(teamAStats.goals ?? 0),
      teamB: Number(teamBStats.goals ?? 0),
    },
    {
      label: 'Очки',
      teamA: Number(teamAStats.points ?? 0),
      teamB: Number(teamBStats.points ?? 0),
    },
  ]

  return items.map((item) => ({
    ...item,
    ...getWidths(item.teamA, item.teamB),
  }))
})
</script>

<style scoped lang="scss">
.match-surface {
  position: relative;
  border-radius: 24px;
  background:
      radial-gradient(circle at top left, rgba(96, 165, 250, 0.12), transparent 32%),
      linear-gradient(180deg, rgba(13, 18, 35, 0.92), rgba(18, 25, 48, 0.96));
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
      0 10px 30px rgba(0, 0, 0, 0.22),
      inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.match-card {
  display: grid;
  gap: 18px;
  padding: 20px;
}

.match-card__title {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
}

.charts {
  display: grid;
  gap: 16px;
}

.chart-row {
  display: grid;
  gap: 10px;
  padding: 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
}

.chart-row__head,
.chart-row__footer {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.chart-row__head span,
.chart-row__footer span {
  color: rgba(255, 255, 255, 0.66);
}

.chart-bar {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  align-items: center;
}

.chart-bar__left,
.chart-bar__right {
  height: 14px;
  border-radius: 999px;
  transition: width 0.6s ease;
}

.chart-bar__left {
  justify-self: end;
  background: linear-gradient(90deg, #1d4ed8, #60a5fa);
}

.chart-bar__right {
  background: linear-gradient(90deg, #fb7185, #ef4444);
}
</style>