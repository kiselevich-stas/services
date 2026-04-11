<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'

import type {
  HockeyTeamEloChartPoint,
  HockeyTeamEloSummary,
} from '../../api/getHockeyTeamEloSnapshots'

use([
  CanvasRenderer,
  LineChart,
  GridComponent,
  TooltipComponent,
])

type Props = {
  points: HockeyTeamEloChartPoint[]
  summary?: HockeyTeamEloSummary | null
  teamName?: string
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  summary: null,
  teamName: '',
  isLoading: false,
})

const hasData = computed(() => props.points.length > 0)

const chartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(15, 23, 42, 0.96)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    textStyle: {
      color: '#ffffff',
    },
    formatter(params: Array<{ dataIndex: number }>) {
      const point = props.points[params[0]?.dataIndex]

      if (!point) {
        return ''
      }

      const resultLabel = point.result === 'win' ? 'Победа' : 'Поражение'
      const venueLabel = point.isHome ? 'Дом' : 'Выезд'
      const deltaPrefix = point.delta > 0 ? '+' : ''

      return `
        <div style="display:flex;flex-direction:column;gap:6px;">
          <strong>${point.dateLabel}</strong>
          <span>${point.opponentTeamName}</span>
          <span>Elo: ${point.ratingAfter}</span>
          <span>Изменение: ${deltaPrefix}${point.delta}</span>
          <span>Счёт: ${point.teamScore}:${point.opponentScore}</span>
          <span>${resultLabel} · ${venueLabel}</span>
        </div>
      `
    },
  },
  grid: {
    left: 18,
    right: 18,
    top: 24,
    bottom: 24,
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: props.points.map((point) => point.dateLabel),
    axisLine: {
      lineStyle: {
        color: 'rgba(255,255,255,0.18)',
      },
    },
    axisLabel: {
      color: 'rgba(255,255,255,0.64)',
    },
  },
  yAxis: {
    type: 'value',
    scale: true,
    axisLine: {
      show: false,
    },
    axisLabel: {
      color: 'rgba(255,255,255,0.64)',
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(255,255,255,0.08)',
      },
    },
  },
  series: [
    {
      name: 'Elo',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 7,
      data: props.points.map((point) => point.ratingAfter),
      lineStyle: {
        width: 3,
        color: '#4da3ff',
      },
      itemStyle: {
        color: '#4da3ff',
        borderColor: '#ffffff',
        borderWidth: 1,
      },
      areaStyle: {
        color: 'rgba(77, 163, 255, 0.16)',
      },
    },
  ],
}))
</script>

<template>
  <section class="hockey-team-elo-chart">
    <div class="hockey-team-elo-chart__header">
      <div>
        <h2 class="hockey-team-elo-chart__title">
          График Elo
        </h2>

        <p class="hockey-team-elo-chart__subtitle">
          {{ teamName || 'Команда' }}
        </p>
      </div>

      <div
          v-if="summary"
          class="hockey-team-elo-chart__summary"
      >
        <div class="hockey-team-elo-chart__summary-item">
          <span>Текущий Elo</span>
          <strong>{{ summary.currentRating }}</strong>
        </div>

        <div class="hockey-team-elo-chart__summary-item">
          <span>Изменение</span>
          <strong>
            {{ summary.ratingChange > 0 ? '+' : '' }}{{ summary.ratingChange }}
          </strong>
        </div>

        <div class="hockey-team-elo-chart__summary-item">
          <span>Матчей</span>
          <strong>{{ summary.matchesPlayed }}</strong>
        </div>

        <div class="hockey-team-elo-chart__summary-item">
          <span>Побед</span>
          <strong>{{ summary.wins }}</strong>
        </div>
      </div>
    </div>

    <div
        v-if="isLoading"
        class="hockey-team-elo-chart__state"
    >
      Загрузка графика...
    </div>

    <div
        v-else-if="!hasData"
        class="hockey-team-elo-chart__state"
    >
      Нет данных для графика Elo
    </div>

    <VChart
        v-else
        class="hockey-team-elo-chart__canvas"
        :option="chartOption"
        autoresize
    />
  </section>
</template>

<style scoped lang="scss">
.hockey-team-elo-chart {
  padding: 20px;
  border-radius: 24px;
  background: rgba(13, 18, 35, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.hockey-team-elo-chart__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 20px;
}

.hockey-team-elo-chart__title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
}

.hockey-team-elo-chart__subtitle {
  margin: 6px 0 0;
  color: rgba(255, 255, 255, 0.64);
}

.hockey-team-elo-chart__summary {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.hockey-team-elo-chart__summary-item {
  min-width: 110px;
  padding: 10px 12px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.hockey-team-elo-chart__summary-item span {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.56);
}

.hockey-team-elo-chart__summary-item strong {
  font-size: 16px;
}

.hockey-team-elo-chart__canvas {
  width: 100%;
  height: 360px;
}

.hockey-team-elo-chart__state {
  padding: 32px 12px;
  text-align: center;
  color: rgba(255, 255, 255, 0.64);
}

@media (max-width: 900px) {
  .hockey-team-elo-chart__header {
    flex-direction: column;
  }

  .hockey-team-elo-chart__canvas {
    height: 300px;
  }
}
</style>