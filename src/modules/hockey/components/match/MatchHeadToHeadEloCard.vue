<script setup lang="ts">
import { computed, ref } from 'vue'
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
  MatchHeadToHeadEloChartPoint,
  MatchHeadToHeadEloSummary,
} from '../../api/getMatchHeadToHeadElo'

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

type MatchHeadToHeadSplits = {
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

type RecentMatchItem = {
  matchId: string
  date: string
  dateLabel: string
  stageId: string | null
  stageName: string
  isHome: boolean
  result: 'win' | 'loss'
  teamScore: number
  opponentScore: number
  ratingBefore: number
  ratingAfter: number
  delta: number
}

type PerspectiveTeam = 'A' | 'B'

type Props = {
  points: MatchHeadToHeadEloChartPoint[]
  summary?: MatchHeadToHeadEloSummary | null
  splits?: MatchHeadToHeadSplits | null
  recentMatches?: RecentMatchItem[]
  teamAName?: string
  teamBName?: string
  teamALogo?: string
  teamBLogo?: string
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  summary: null,
  splits: null,
  recentMatches: () => [],
  teamAName: '',
  teamBName: '',
  teamALogo: '',
  teamBLogo: '',
  isLoading: false,
})

const TEAM_A_COLOR = '#4da3ff'
const TEAM_B_COLOR = '#ffb347'
const WIN_COLOR = '#3fb950'
const LOSS_COLOR = '#ff6b6b'
const TEXT_PRIMARY = '#ffffff'
const TEXT_SECONDARY = 'rgba(255,255,255,0.72)'
const TEXT_MUTED = 'rgba(255,255,255,0.64)'
const BORDER_COLOR = 'rgba(255,255,255,0.18)'
const GRID_COLOR = 'rgba(255,255,255,0.08)'

const selectedPerspective = ref<PerspectiveTeam>('A')

const hasData = computed(() => props.points.length > 0)

const teamA = computed(() => props.teamAName || 'Команда 1')
const teamB = computed(() => props.teamBName || 'Команда 2')

const isTeamAPerspective = computed(() => selectedPerspective.value === 'A')

const activeTeamName = computed(() =>
    isTeamAPerspective.value ? teamA.value : teamB.value,
)

const opponentTeamName = computed(() =>
    isTeamAPerspective.value ? teamB.value : teamA.value,
)

const activeTeamLogo = computed(() =>
    isTeamAPerspective.value ? props.teamALogo : props.teamBLogo,
)

const opponentTeamLogo = computed(() =>
    isTeamAPerspective.value ? props.teamBLogo : props.teamALogo,
)

const activeTeamColor = computed(() =>
    isTeamAPerspective.value ? TEAM_A_COLOR : TEAM_B_COLOR,
)

const opponentTeamColor = computed(() =>
    isTeamAPerspective.value ? TEAM_B_COLOR : TEAM_A_COLOR,
)

const titleText = computed(() => `${teamA.value} vs ${teamB.value}`)

const transformedPoints = computed(() => {
  return props.points.map((point) => {
    if (isTeamAPerspective.value) {
      return {
        ...point,
        perspectiveTeamScore: point.teamScore,
        perspectiveOpponentScore: point.opponentScore,
        perspectiveResult: point.result,
        perspectiveDelta: point.delta,
        perspectiveRatingBefore: point.ratingBefore,
        perspectiveRatingAfter: point.ratingAfter,
        perspectiveIsHome: point.isHome,
      }
    }

    return {
      ...point,
      perspectiveTeamScore: point.opponentScore,
      perspectiveOpponentScore: point.teamScore,
      perspectiveResult: point.result === 'win' ? 'loss' : 'win',
      perspectiveDelta: point.delta * -1,
      perspectiveRatingBefore: null,
      perspectiveRatingAfter: null,
      perspectiveIsHome: !point.isHome,
    }
  })
})

const transformedRecentMatches = computed(() => {
  return props.recentMatches.map((match) => {
    if (isTeamAPerspective.value) {
      return {
        ...match,
        perspectiveTeamScore: match.teamScore,
        perspectiveOpponentScore: match.opponentScore,
        perspectiveResult: match.result,
        perspectiveDelta: match.delta,
        perspectiveRatingAfter: match.ratingAfter,
        perspectiveIsHome: match.isHome,
      }
    }

    return {
      ...match,
      perspectiveTeamScore: match.opponentScore,
      perspectiveOpponentScore: match.teamScore,
      perspectiveResult: match.result === 'win' ? 'loss' : 'win',
      perspectiveDelta: match.delta * -1,
      perspectiveRatingAfter: null,
      perspectiveIsHome: !match.isHome,
    }
  })
})

const perspectiveSummary = computed(() => {
  if (!props.summary) {
    return null
  }

  if (isTeamAPerspective.value) {
    return {
      matchesPlayed: props.summary.matchesPlayed,
      wins: props.summary.teamAWins,
      losses: props.summary.teamBWins,
      winRate: props.summary.teamAWinRate,
      goalsFor: props.summary.goalsFor,
      goalsAgainst: props.summary.goalsAgainst,
      goalDifference: props.summary.goalDifference,
      startRating: props.summary.startRating,
      currentRating: props.summary.currentRating,
      ratingChange: props.summary.ratingChange,
      maxRating: props.summary.maxRating,
      minRating: props.summary.minRating,
    }
  }

  return {
    matchesPlayed: props.summary.matchesPlayed,
    wins: props.summary.teamBWins,
    losses: props.summary.teamAWins,
    winRate:
        props.summary.matchesPlayed > 0
            ? Number(((props.summary.teamBWins / props.summary.matchesPlayed) * 100).toFixed(2))
            : 0,
    goalsFor: props.summary.goalsAgainst,
    goalsAgainst: props.summary.goalsFor,
    goalDifference: props.summary.goalsAgainst - props.summary.goalsFor,
    startRating: null,
    currentRating: null,
    ratingChange: null,
    maxRating: null,
    minRating: null,
  }
})

const perspectiveSplits = computed(() => {
  if (!props.splits) {
    return null
  }

  if (isTeamAPerspective.value) {
    return props.splits
  }

  return {
    home: {
      matches: props.splits.away.matches,
      wins: props.splits.away.losses,
      losses: props.splits.away.wins,
    },
    away: {
      matches: props.splits.home.matches,
      wins: props.splits.home.losses,
      losses: props.splits.home.wins,
    },
  }
})

const totalGoals = computed(() => {
  return (
      (perspectiveSummary.value?.goalsFor ?? 0) +
      (perspectiveSummary.value?.goalsAgainst ?? 0)
  )
})

const summaryCards = computed(() => {
  if (!perspectiveSummary.value) {
    return []
  }

  return [
    {
      label: 'Матчей сыграно',
      value: perspectiveSummary.value.matchesPlayed,
    },
    {
      label: `Побед ${activeTeamName.value}`,
      value: perspectiveSummary.value.wins,
    },
    {
      label: `Поражений ${activeTeamName.value}`,
      value: perspectiveSummary.value.losses,
    },
    {
      label: `Винрейт ${activeTeamName.value}`,
      value: `${perspectiveSummary.value.winRate}%`,
    },
    {
      label: `Шайбы ${activeTeamName.value}`,
      value: perspectiveSummary.value.goalsFor,
    },
    {
      label: `Пропущено ${activeTeamName.value}`,
      value: perspectiveSummary.value.goalsAgainst,
    },
  ]
})

const eloAvailable = computed(() => isTeamAPerspective.value)

const eloLineOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(15, 23, 42, 0.96)',
    borderColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    textStyle: {
      color: '#fff',
    },
    formatter(params: Array<{ dataIndex: number }>) {
      const point = transformedPoints.value[params[0]?.dataIndex]

      if (!point) {
        return ''
      }

      const resultLabel =
          point.perspectiveResult === 'win' ? 'Победа' : 'Поражение'
      const venueLabel = point.perspectiveIsHome ? 'Домашний матч' : 'Выездной матч'
      const deltaPrefix = (point.perspectiveDelta ?? 0) > 0 ? '+' : ''

      return `
        <div style="display:flex;flex-direction:column;gap:6px;">
          <strong>${point.dateLabel}</strong>
          <span>${point.stageName}</span>
          <span><strong>Счёт:</strong> ${activeTeamName.value} ${point.perspectiveTeamScore}:${point.perspectiveOpponentScore} ${opponentTeamName.value}</span>
          <span><strong>Результат:</strong> ${resultLabel}</span>
          <span><strong>Формат:</strong> ${venueLabel}</span>
          ${
          point.perspectiveRatingAfter !== null
              ? `<span><strong>Elo:</strong> ${point.perspectiveRatingAfter}</span>
                 <span><strong>Изменение Elo:</strong> ${deltaPrefix}${point.perspectiveDelta}</span>`
              : `<span><strong>Elo:</strong> недоступно для этой перспективы</span>`
      }
        </div>
      `
    },
  },
  grid: {
    left: 18,
    right: 18,
    top: 32,
    bottom: 24,
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: transformedPoints.value.map((point) => point.dateLabel),
    axisLine: {
      lineStyle: {
        color: BORDER_COLOR,
      },
    },
    axisLabel: {
      color: TEXT_MUTED,
    },
  },
  yAxis: {
    type: 'value',
    scale: true,
    axisLine: {
      show: false,
    },
    axisLabel: {
      color: TEXT_MUTED,
    },
    splitLine: {
      lineStyle: {
        color: GRID_COLOR,
      },
    },
  },
  series: [
    {
      name: `Elo ${activeTeamName.value}`,
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 7,
      data: transformedPoints.value.map((point) => point.perspectiveRatingAfter),
      lineStyle: {
        width: 3,
        color: activeTeamColor.value,
      },
      itemStyle: {
        color: activeTeamColor.value,
        borderColor: '#ffffff',
        borderWidth: 1,
      },
      areaStyle: {
        color: isTeamAPerspective.value
            ? 'rgba(77, 163, 255, 0.16)'
            : 'rgba(255, 179, 71, 0.16)',
      },
      connectNulls: false,
    },
  ],
}))

const resultPieOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(15, 23, 42, 0.96)',
    borderColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    textStyle: {
      color: '#fff',
    },
    formatter(params: { name: string; value: number; percent: number }) {
      return `
        <div style="display:flex;flex-direction:column;gap:6px;">
          <strong>${params.name}</strong>
          <span>Матчей: ${params.value}</span>
          <span>Доля: ${params.percent}%</span>
        </div>
      `
    },
  },
  legend: {
    bottom: 0,
    textStyle: {
      color: TEXT_SECONDARY,
    },
  },
  series: [
    {
      name: 'Результаты',
      type: 'pie',
      radius: ['52%', '74%'],
      avoidLabelOverlap: true,
      label: {
        show: true,
        formatter: '{b}\n{c}',
        color: TEXT_PRIMARY,
      },
      labelLine: {
        lineStyle: {
          color: 'rgba(255,255,255,0.3)',
        },
      },
      data: [
        {
          value: perspectiveSummary.value?.wins ?? 0,
          name: `Победы ${activeTeamName.value}`,
          itemStyle: {
            color: WIN_COLOR,
          },
        },
        {
          value: perspectiveSummary.value?.losses ?? 0,
          name: `Поражения ${activeTeamName.value}`,
          itemStyle: {
            color: LOSS_COLOR,
          },
        },
      ],
    },
  ],
}))

const deltaBarOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(15, 23, 42, 0.96)',
    borderColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    textStyle: {
      color: '#fff',
    },
    formatter(params: Array<{ dataIndex: number }>) {
      const point = transformedPoints.value[params[0]?.dataIndex]

      if (!point) {
        return ''
      }

      const delta = point.perspectiveDelta ?? 0
      const deltaPrefix = delta > 0 ? '+' : ''
      const resultLabel =
          point.perspectiveResult === 'win' ? 'Победа' : 'Поражение'

      return `
        <div style="display:flex;flex-direction:column;gap:6px;">
          <strong>${point.dateLabel}</strong>
          <span>${point.stageName}</span>
          <span><strong>Результат:</strong> ${resultLabel}</span>
          ${
          isTeamAPerspective.value
              ? `<span><strong>Изменение Elo:</strong> ${deltaPrefix}${delta}</span>`
              : `<span><strong>Изменение Elo:</strong> недоступно для этой перспективы</span>`
      }
        </div>
      `
    },
  },
  grid: {
    left: 18,
    right: 18,
    top: 32,
    bottom: 24,
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    data: transformedPoints.value.map((point) => point.dateLabel),
    axisLabel: {
      color: TEXT_MUTED,
    },
    axisLine: {
      lineStyle: {
        color: BORDER_COLOR,
      },
    },
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      color: TEXT_MUTED,
    },
    splitLine: {
      lineStyle: {
        color: GRID_COLOR,
      },
    },
  },
  series: [
    {
      name: `Изменение Elo ${activeTeamName.value}`,
      type: 'bar',
      data: transformedPoints.value.map((point) => ({
        value: isTeamAPerspective.value ? point.perspectiveDelta : 0,
        itemStyle: {
          color: (point.perspectiveDelta ?? 0) >= 0 ? WIN_COLOR : LOSS_COLOR,
        },
      })),
      barMaxWidth: 26,
      label: {
        show: isTeamAPerspective.value,
        position: 'top',
        color: TEXT_PRIMARY,
        formatter(value: { value: number }) {
          return value.value > 0 ? `+${value.value}` : `${value.value}`
        },
      },
    },
  ],
}))

const venueOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
    backgroundColor: 'rgba(15, 23, 42, 0.96)',
    borderColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    textStyle: {
      color: '#fff',
    },
  },
  legend: {
    top: 0,
    textStyle: {
      color: TEXT_SECONDARY,
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
      color: TEXT_MUTED,
    },
    axisLine: {
      lineStyle: {
        color: BORDER_COLOR,
      },
    },
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      color: TEXT_MUTED,
    },
    splitLine: {
      lineStyle: {
        color: GRID_COLOR,
      },
    },
  },
  series: [
    {
      name: `Победы ${activeTeamName.value}`,
      type: 'bar',
      data: [
        perspectiveSplits.value?.home.wins ?? 0,
        perspectiveSplits.value?.away.wins ?? 0,
      ],
      itemStyle: {
        color: WIN_COLOR,
      },
      barMaxWidth: 26,
    },
    {
      name: `Поражения ${activeTeamName.value}`,
      type: 'bar',
      data: [
        perspectiveSplits.value?.home.losses ?? 0,
        perspectiveSplits.value?.away.losses ?? 0,
      ],
      itemStyle: {
        color: LOSS_COLOR,
      },
      barMaxWidth: 26,
    },
  ],
}))

const scoreOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
    backgroundColor: 'rgba(15, 23, 42, 0.96)',
    borderColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    textStyle: {
      color: '#fff',
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
    type: 'value',
    axisLabel: {
      color: TEXT_MUTED,
    },
    splitLine: {
      lineStyle: {
        color: GRID_COLOR,
      },
    },
  },
  yAxis: {
    type: 'category',
    data: [activeTeamName.value, opponentTeamName.value],
    axisLabel: {
      color: TEXT_SECONDARY,
    },
    axisLine: {
      lineStyle: {
        color: BORDER_COLOR,
      },
    },
  },
  series: [
    {
      type: 'bar',
      data: [
        {
          value: perspectiveSummary.value?.goalsFor ?? 0,
          itemStyle: {
            color: activeTeamColor.value,
          },
        },
        {
          value: perspectiveSummary.value?.goalsAgainst ?? 0,
          itemStyle: {
            color: opponentTeamColor.value,
          },
        },
      ],
      barMaxWidth: 30,
      label: {
        show: true,
        position: 'right',
        color: TEXT_PRIMARY,
      },
    },
  ],
}))

function setPerspective(team: PerspectiveTeam) {
  selectedPerspective.value = team
}
</script>

<template>
  <section class="match-head-to-head-elo-card">
    <div class="match-head-to-head-elo-card__header">
      <div class="match-head-to-head-elo-card__header-main">
        <h2 class="match-head-to-head-elo-card__title">
          Очные встречи
        </h2>

        <p class="match-head-to-head-elo-card__subtitle">
          {{ titleText }}
        </p>

        <div class="match-head-to-head-elo-card__switch">
          <button
              type="button"
              class="perspective-switch"
              :class="{ 'is-active': selectedPerspective === 'A' }"
              @click="setPerspective('A')"
          >
            <span
                v-if="teamALogo"
                class="perspective-switch__logo-wrap"
            >
              <img
                  :src="teamALogo"
                  :alt="teamA"
                  class="perspective-switch__logo"
              >
            </span>

            <span class="perspective-switch__text">{{ teamA }}</span>
          </button>

          <button
              type="button"
              class="perspective-switch"
              :class="{ 'is-active': selectedPerspective === 'B' }"
              @click="setPerspective('B')"
          >
            <span
                v-if="teamBLogo"
                class="perspective-switch__logo-wrap"
            >
              <img
                  :src="teamBLogo"
                  :alt="teamB"
                  class="perspective-switch__logo"
              >
            </span>

            <span class="perspective-switch__text">{{ teamB }}</span>
          </button>
        </div>

        <p class="match-head-to-head-elo-card__note">
          Сейчас показана статистика от лица команды
          <strong>{{ activeTeamName }}</strong>.
        </p>
      </div>

      <div
          v-if="perspectiveSummary"
          class="match-head-to-head-elo-card__summary"
      >
        <div
            v-for="card in summaryCards"
            :key="card.label"
            class="match-head-to-head-elo-card__summary-item"
        >
          <span>{{ card.label }}</span>
          <strong>{{ card.value }}</strong>
        </div>
      </div>
    </div>

    <div
        v-if="isLoading"
        class="match-head-to-head-elo-card__state"
    >
      Загрузка аналитики очных встреч...
    </div>

    <div
        v-else-if="!hasData"
        class="match-head-to-head-elo-card__state"
    >
      Нет данных по очным встречам
    </div>

    <template v-else>
      <div class="match-head-to-head-elo-card__main-chart match-head-to-head-elo-card__chart-card">
        <div class="match-head-to-head-elo-card__chart-head">
          <h3 class="match-head-to-head-elo-card__chart-title">
            Динамика Elo {{ activeTeamName }}
          </h3>

          <p class="match-head-to-head-elo-card__chart-description">
            <template v-if="eloAvailable">
              Изменение рейтинга Elo команды {{ activeTeamName }} после каждого очного матча.
            </template>

            <template v-else>
              Elo сейчас приходит только для {{ teamA }}, поэтому при переключении на {{ teamB }}
              линия недоступна.
            </template>
          </p>
        </div>

        <VChart
            class="match-head-to-head-elo-card__canvas match-head-to-head-elo-card__canvas--lg"
            :option="eloLineOption"
            autoresize
        />
      </div>

      <div class="match-head-to-head-elo-card__grid">
        <div class="match-head-to-head-elo-card__chart-card">
          <div class="match-head-to-head-elo-card__chart-head">
            <h3 class="match-head-to-head-elo-card__chart-title">
              Результаты {{ activeTeamName }}
            </h3>

            <p class="match-head-to-head-elo-card__chart-description">
              Сколько побед и поражений у команды {{ activeTeamName }} в очных матчах.
            </p>
          </div>

          <VChart
              class="match-head-to-head-elo-card__canvas"
              :option="resultPieOption"
              autoresize
          />
        </div>

        <div class="match-head-to-head-elo-card__chart-card">
          <div class="match-head-to-head-elo-card__chart-head">
            <h3 class="match-head-to-head-elo-card__chart-title">
              Изменение Elo {{ activeTeamName }}
            </h3>

            <p class="match-head-to-head-elo-card__chart-description">
              <template v-if="eloAvailable">
                Зелёный — рост рейтинга, красный — падение.
              </template>

              <template v-else>
                Для выбранной перспективы Elo не рассчитывается из текущего ответа API.
              </template>
            </p>
          </div>

          <VChart
              class="match-head-to-head-elo-card__canvas"
              :option="deltaBarOption"
              autoresize
          />
        </div>

        <div class="match-head-to-head-elo-card__chart-card">
          <div class="match-head-to-head-elo-card__chart-head">
            <h3 class="match-head-to-head-elo-card__chart-title">
              Результаты {{ activeTeamName }}: дом / выезд
            </h3>

            <p class="match-head-to-head-elo-card__chart-description">
              Победы и поражения команды {{ activeTeamName }} в домашних и выездных матчах.
            </p>
          </div>

          <VChart
              class="match-head-to-head-elo-card__canvas"
              :option="venueOption"
              autoresize
          />
        </div>

        <div class="match-head-to-head-elo-card__chart-card">
          <div class="match-head-to-head-elo-card__chart-head">
            <h3 class="match-head-to-head-elo-card__chart-title">
              Шайбы: {{ activeTeamName }} vs {{ opponentTeamName }}
            </h3>

            <p class="match-head-to-head-elo-card__chart-description">
              Всего в очных матчах: {{ totalGoals }} шайб.
            </p>
          </div>

          <VChart
              class="match-head-to-head-elo-card__canvas"
              :option="scoreOption"
              autoresize
          />
        </div>
      </div>

      <div
          v-if="transformedRecentMatches.length"
          class="match-head-to-head-elo-card__recent"
      >
        <h3 class="match-head-to-head-elo-card__recent-title">
          Последние очные встречи
        </h3>

        <div class="match-head-to-head-elo-card__recent-list">
          <article
              v-for="match in transformedRecentMatches"
              :key="match.matchId"
              class="match-head-to-head-elo-card__recent-item"
          >
            <div class="match-head-to-head-elo-card__recent-top">
              <strong>{{ match.dateLabel }}</strong>
              <span>{{ match.stageName }}</span>
            </div>

            <div class="match-head-to-head-elo-card__recent-middle">
              <span>{{ match.perspectiveIsHome ? 'Дом' : 'Выезд' }}</span>

              <strong>
                {{ activeTeamName }}
                {{ match.perspectiveTeamScore }}
                :
                {{ match.perspectiveOpponentScore }}
                {{ opponentTeamName }}
              </strong>

              <span :class="match.perspectiveResult === 'win' ? 'is-win' : 'is-loss'">
                {{
                  match.perspectiveResult === 'win'
                      ? `Победа ${activeTeamName}`
                      : `Поражение ${activeTeamName}`
                }}
              </span>
            </div>

            <div class="match-head-to-head-elo-card__recent-bottom">
              <span v-if="isTeamAPerspective">
                Elo {{ activeTeamName }}: {{ match.perspectiveRatingAfter }}
              </span>
              <span v-else>
                Elo {{ activeTeamName }}: недоступно
              </span>

              <span
                  v-if="isTeamAPerspective"
                  :class="(match.perspectiveDelta ?? 0) >= 0 ? 'is-win' : 'is-loss'"
              >
                {{ (match.perspectiveDelta ?? 0) > 0 ? '+' : '' }}{{ match.perspectiveDelta }}
              </span>
            </div>
          </article>
        </div>
      </div>
    </template>
  </section>
</template>

<style scoped lang="scss">
.match-head-to-head-elo-card {
  padding: 20px;
  border-radius: 24px;
  background: rgba(13, 18, 35, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #fff;
}

.match-head-to-head-elo-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 20px;
}

.match-head-to-head-elo-card__header-main {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.match-head-to-head-elo-card__title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
}

.match-head-to-head-elo-card__subtitle {
  margin: 0;
  color: rgba(255, 255, 255, 0.64);
}

.match-head-to-head-elo-card__note {
  margin: 0;
  font-size: 13px;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.72);
}

.match-head-to-head-elo-card__switch {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  width: fit-content;
}

.perspective-switch {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 48px;
  padding: 10px 14px;
  border: 0;
  border-radius: 14px;
  background: transparent;
  color: rgba(255, 255, 255, 0.72);
  cursor: pointer;
  transition:
      background-color 0.2s ease,
      color 0.2s ease,
      transform 0.2s ease,
      box-shadow 0.2s ease;
}

.perspective-switch:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}

.perspective-switch.is-active {
  background: linear-gradient(135deg, rgba(77, 163, 255, 0.22), rgba(255, 179, 71, 0.18));
  color: #fff;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
}

.perspective-switch__logo-wrap {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  border-radius: 50%;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.08);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.perspective-switch__logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.perspective-switch__text {
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}

.match-head-to-head-elo-card__summary {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 12px;
}

.match-head-to-head-elo-card__summary-item {
  min-width: 132px;
  padding: 10px 12px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.match-head-to-head-elo-card__summary-item span {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.56);
}

.match-head-to-head-elo-card__summary-item strong {
  font-size: 16px;
}

.match-head-to-head-elo-card__main-chart {
  margin-bottom: 20px;
}

.match-head-to-head-elo-card__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.match-head-to-head-elo-card__chart-card {
  padding: 16px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.03);
}

.match-head-to-head-elo-card__chart-head {
  margin-bottom: 12px;
}

.match-head-to-head-elo-card__chart-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.match-head-to-head-elo-card__chart-description {
  margin: 6px 0 0;
  font-size: 13px;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.62);
}

.match-head-to-head-elo-card__canvas {
  width: 100%;
  height: 280px;
}

.match-head-to-head-elo-card__canvas--lg {
  height: 360px;
}

.match-head-to-head-elo-card__state {
  padding: 32px 12px;
  text-align: center;
  color: rgba(255, 255, 255, 0.64);
}

.match-head-to-head-elo-card__recent {
  margin-top: 20px;
}

.match-head-to-head-elo-card__recent-title {
  margin: 0 0 12px;
  font-size: 18px;
  font-weight: 700;
}

.match-head-to-head-elo-card__recent-list {
  display: grid;
  gap: 12px;
}

.match-head-to-head-elo-card__recent-item {
  padding: 14px 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
  display: grid;
  gap: 8px;
}

.match-head-to-head-elo-card__recent-top,
.match-head-to-head-elo-card__recent-middle,
.match-head-to-head-elo-card__recent-bottom {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.is-win {
  color: #86efac;
}

.is-loss {
  color: #fca5a5;
}

@media (max-width: 1100px) {
  .match-head-to-head-elo-card__grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 900px) {
  .match-head-to-head-elo-card__header {
    flex-direction: column;
  }

  .match-head-to-head-elo-card__summary {
    justify-content: flex-start;
  }

  .match-head-to-head-elo-card__canvas {
    height: 260px;
  }

  .match-head-to-head-elo-card__canvas--lg {
    height: 300px;
  }

  .match-head-to-head-elo-card__switch {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }

  .perspective-switch {
    justify-content: center;
  }
}
</style>