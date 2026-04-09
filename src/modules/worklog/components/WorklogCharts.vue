<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, PieChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import type { WorkLogStats } from '../types'

use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
])

const props = defineProps<{
  stats: WorkLogStats
}>()

const chartTextColor = 'rgba(255, 255, 255, 0.72)'
const chartGridColor = 'rgba(255, 255, 255, 0.08)'
const chartAxisColor = 'rgba(255, 255, 255, 0.18)'

const trendOptions = computed(() => ({
  animationDuration: 950,
  animationEasing: 'cubicOut',
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(9, 13, 24, 0.96)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    textStyle: { color: '#fff' },
  },
  grid: {
    left: 8,
    right: 12,
    top: 16,
    bottom: 10,
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    data: props.stats.last14Days.map((item) => item.label),
    boundaryGap: false,
    axisLine: { lineStyle: { color: chartAxisColor } },
    axisLabel: { color: chartTextColor },
  },
  yAxis: {
    type: 'value',
    axisLine: { show: false },
    splitLine: { lineStyle: { color: chartGridColor } },
    axisLabel: { color: chartTextColor },
  },
  series: [
    {
      type: 'line',
      smooth: true,
      symbolSize: 8,
      data: props.stats.last14Days.map((item) => item.value),
      lineStyle: { width: 4, color: '#ec4899' },
      itemStyle: { color: '#8b5cf6' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(236, 72, 153, 0.34)' },
            { offset: 1, color: 'rgba(139, 92, 246, 0.04)' },
          ],
        },
      },
    },
  ],
}))

const weekOptions = computed(() => ({
  animationDuration: 900,
  animationEasing: 'quarticOut',
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(9, 13, 24, 0.96)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    textStyle: { color: '#fff' },
  },
  grid: {
    left: 8,
    right: 12,
    top: 16,
    bottom: 10,
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    data: props.stats.weekDistribution.map((item) => item.label),
    axisLine: { lineStyle: { color: chartAxisColor } },
    axisLabel: { color: chartTextColor },
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: chartGridColor } },
    axisLabel: { color: chartTextColor },
  },
  series: [
    {
      type: 'bar',
      barWidth: 26,
      data: props.stats.weekDistribution.map((item) => item.value),
      itemStyle: {
        borderRadius: [18, 18, 8, 8],
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#8b5cf6' },
            { offset: 1, color: '#06b6d4' },
          ],
        },
      },
    },
  ],
}))

const projectOptions = computed(() => ({
  animationDuration: 950,
  animationEasing: 'cubicOut',
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(9, 13, 24, 0.96)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    textStyle: { color: '#fff' },
  },
  legend: {
    bottom: 0,
    icon: 'circle',
    textStyle: {
      color: chartTextColor,
      fontSize: 12,
    },
  },
  series: [
    {
      type: 'pie',
      radius: ['48%', '74%'],
      center: ['50%', '46%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderColor: 'rgba(10, 14, 24, 0.86)',
        borderWidth: 4,
      },
      label: {
        color: '#fff',
        formatter: '{b|{b}}\n{c} ч',
        rich: {
          b: { fontWeight: 700, lineHeight: 22 },
        },
      },
      data: props.stats.projectDistribution.length
          ? props.stats.projectDistribution
          : [{ name: 'Нет данных', value: 1 }],
    },
  ],
}))
</script>

<template>
  <section class="worklog-chart-grid">
    <article class="worklog-chart-card">
      <div class="worklog-chart-card__header">
        <p class="worklog-chart-card__eyebrow">Тренд</p>
        <h3 class="worklog-chart-card__title">Динамика за 14 дней</h3>
        <p class="worklog-chart-card__text">Плавная линия показывает фактическую нагрузку по дням.</p>
      </div>
      <VChart class="worklog-chart" :option="trendOptions" autoresize />
    </article>

    <article class="worklog-chart-card">
      <div class="worklog-chart-card__header">
        <p class="worklog-chart-card__eyebrow">Неделя</p>
        <h3 class="worklog-chart-card__title">Распределение по дням</h3>
        <p class="worklog-chart-card__text">Сразу видно, где у тебя основная концентрация часов.</p>
      </div>
      <VChart class="worklog-chart" :option="weekOptions" autoresize />
    </article>

    <article class="worklog-chart-card worklog-chart-card--wide">
      <div class="worklog-chart-card__header">
        <p class="worklog-chart-card__eyebrow">Проекты</p>
        <h3 class="worklog-chart-card__title">Во что уходит время</h3>
        <p class="worklog-chart-card__text">Кольцевая диаграмма с анимацией по проектам и направлениям.</p>
      </div>
      <VChart class="worklog-chart worklog-chart--pie" :option="projectOptions" autoresize />
    </article>
  </section>
</template>

<style scoped lang="scss">
.worklog-chart-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.worklog-chart-card {
  min-height: 360px;
  padding: 18px;
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04)),
      rgba(10, 14, 24, 0.9);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(18px);

  &--wide {
    grid-column: 1 / -1;
  }

  &__header {
    margin-bottom: 8px;
  }

  &__eyebrow {
    margin: 0 0 6px;
    font-size: 12px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(6, 182, 212, 0.9);
  }

  &__title {
    margin: 0;
    font-size: 22px;
    color: #fff;
  }

  &__text {
    margin: 8px 0 0;
    color: rgba(255, 255, 255, 0.68);
    line-height: 1.5;
  }
}

.worklog-chart {
  width: 100%;
  height: 260px;

  &--pie {
    height: 320px;
  }
}

@media (max-width: 980px) {
  .worklog-chart-grid {
    grid-template-columns: 1fr;
  }

  .worklog-chart-card--wide {
    grid-column: auto;
  }
}
</style>