<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, PieChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
} from 'echarts/components'

import type {
  HockeyTeamEloChartPoint,
  HockeyTeamEloSummary,
} from '../../api/getHockeyTeamEloSnapshots'

use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
])

type EloSplits = {
  home: {
    matches: number
    wins: number
    losses: number
  }
  away: {
    matches: number
    wins: number
    losses: number
  }
}

type Props = {
  points: HockeyTeamEloChartPoint[]
  summary?: HockeyTeamEloSummary | null
  splits?: EloSplits | null
  teamName?: string
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  summary: null,
  splits: null,
  teamName: '',
  isLoading: false,
})

const hasData = computed(() => props.points?.length > 0)

const lineChartOption = computed(() => ({
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

const deltaChartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
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
    data: props.points.map((point) => point.dateLabel),
    axisLabel: {
      color: 'rgba(255,255,255,0.64)',
    },
    axisLine: {
      lineStyle: {
        color: 'rgba(255,255,255,0.18)',
      },
    },
  },
  yAxis: {
    type: 'value',
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
      name: 'Изменение Elo',
      type: 'bar',
      data: props.points.map((point) => ({
        value: point.delta,
        itemStyle: {
          color: point.delta >= 0 ? '#3fb950' : '#ff6b6b',
        },
      })),
      barMaxWidth: 24,
    },
  ],
}))

const resultChartOption = computed(() => ({
  tooltip: {
    trigger: 'item',
  },
  legend: {
    bottom: 0,
    textStyle: {
      color: 'rgba(255,255,255,0.72)',
    },
  },
  series: [
    {
      name: 'Результаты',
      type: 'pie',
      radius: ['55%', '75%'],
      avoidLabelOverlap: true,
      label: {
        color: '#fff',
        formatter: '{b}: {c}',
      },
      data: [
        {
          value: props.summary?.wins ?? 0,
          name: 'Победы',
          itemStyle: {
            color: '#3fb950',
          },
        },
        {
          value: props.summary?.losses ?? 0,
          name: 'Поражения',
          itemStyle: {
            color: '#ff6b6b',
          },
        },
      ],
    },
  ],
}))

const homeAwayChartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  legend: {
    top: 0,
    textStyle: {
      color: 'rgba(255,255,255,0.72)',
    },
  },
  grid: {
    left: 18,
    right: 18,
    top: 40,
    bottom: 24,
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    data: ['Дом', 'Выезд'],
    axisLabel: {
      color: 'rgba(255,255,255,0.64)',
    },
  },
  yAxis: {
    type: 'value',
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
      name: 'Победы',
      type: 'bar',
      data: [
        props.splits?.home.wins ?? 0,
        props.splits?.away.wins ?? 0,
      ],
      itemStyle: {
        color: '#3fb950',
      },
      barMaxWidth: 26,
    },
    {
      name: 'Поражения',
      type: 'bar',
      data: [
        props.splits?.home.losses ?? 0,
        props.splits?.away.losses ?? 0,
      ],
      itemStyle: {
        color: '#ff6b6b',
      },
      barMaxWidth: 26,
    },
  ],
}))

const goalsChartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
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
    data: ['Заброшено', 'Пропущено'],
    axisLabel: {
      color: 'rgba(255,255,255,0.64)',
    },
  },
  yAxis: {
    type: 'value',
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
      type: 'bar',
      data: [
        {
          value: props.summary?.goalsFor ?? 0,
          itemStyle: {
            color: '#4da3ff',
          },
        },
        {
          value: props.summary?.goalsAgainst ?? 0,
          itemStyle: {
            color: '#ffb347',
          },
        },
      ],
      barMaxWidth: 36,
    },
  ],
}))
</script>

<template>
  <section class="hockey-team-elo-chart">
    <div class="hockey-team-elo-chart__header">
      <div>
        <h2 class="hockey-team-elo-chart__title">
          Аналитика Elo
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
          <span>Винрейт</span>
          <strong>{{ summary.winRate }}%</strong>
        </div>
      </div>
    </div>

    <div
        v-if="isLoading"
        class="hockey-team-elo-chart__state"
    >
      Загрузка графиков...
    </div>

    <div
        v-else-if="!hasData"
        class="hockey-team-elo-chart__state"
    >
      Нет данных для графиков Elo
    </div>

    <template v-else>
      <div class="hockey-team-elo-chart__main">
        <VChart
            class="hockey-team-elo-chart__canvas hockey-team-elo-chart__canvas--lg"
            :option="lineChartOption"
            autoresize
        />
      </div>

      <div class="hockey-team-elo-chart__grid">
        <div class="hockey-team-elo-chart__card">
          <h3 class="hockey-team-elo-chart__card-title">Изменение Elo по матчам</h3>
          <VChart
              class="hockey-team-elo-chart__canvas"
              :option="deltaChartOption"
              autoresize
          />
        </div>

        <div class="hockey-team-elo-chart__card">
          <h3 class="hockey-team-elo-chart__card-title">Победы и поражения</h3>
          <VChart
              class="hockey-team-elo-chart__canvas"
              :option="resultChartOption"
              autoresize
          />
        </div>

        <div class="hockey-team-elo-chart__card">
          <h3 class="hockey-team-elo-chart__card-title">Дом / Выезд</h3>
          <VChart
              class="hockey-team-elo-chart__canvas"
              :option="homeAwayChartOption"
              autoresize
          />
        </div>

        <div class="hockey-team-elo-chart__card">
          <h3 class="hockey-team-elo-chart__card-title">Заброшенные и пропущенные</h3>
          <VChart
              class="hockey-team-elo-chart__canvas"
              :option="goalsChartOption"
              autoresize
          />
        </div>
      </div>
    </template>
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

.hockey-team-elo-chart__main {
  margin-bottom: 20px;
}

.hockey-team-elo-chart__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.hockey-team-elo-chart__card {
  padding: 16px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.03);
}

.hockey-team-elo-chart__card-title {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 600;
}

.hockey-team-elo-chart__canvas {
  width: 100%;
  height: 280px;
}

.hockey-team-elo-chart__canvas--lg {
  height: 360px;
}

.hockey-team-elo-chart__state {
  padding: 32px 12px;
  text-align: center;
  color: rgba(255, 255, 255, 0.64);
}

@media (max-width: 1100px) {
  .hockey-team-elo-chart__grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 900px) {
  .hockey-team-elo-chart__header {
    flex-direction: column;
  }

  .hockey-team-elo-chart__canvas {
    height: 260px;
  }

  .hockey-team-elo-chart__canvas--lg {
    height: 300px;
  }
}
</style>