<template>
  <VChart class="weather-chart" :option="chartOption" autoresize />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'

import { useWeatherStore} from "../store/weather.ts";
import { formatHour} from "../utils/format.ts";

use([
  CanvasRenderer,
  LineChart,
  GridComponent,
  TooltipComponent,
])

const weatherStore = useWeatherStore()

const chartData = computed(() => {
  return weatherStore.hourlyForecast.slice(0, 12)
})

const chartOption = computed(() => {
  const labels = chartData.value.map((item) => formatHour(item.time))
  const temperatures = chartData.value.map((item) => item.temperature)

  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: 'rgba(255,255,255,0.08)',
      textStyle: {
        color: '#E2E8F0',
      },
    },
    grid: {
      top: 20,
      right: 8,
      bottom: 20,
      left: 8,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: labels,
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: 'rgba(226, 232, 240, 0.65)',
        fontSize: 12,
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255,255,255,0.06)',
        },
      },
      axisLabel: {
        color: 'rgba(226, 232, 240, 0.65)',
        formatter: '{value}°',
      },
    },
    series: [
      {
        name: 'Температура',
        type: 'line',
        smooth: true,
        data: temperatures,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          width: 3,
          color: '#38BDF8',
        },
        itemStyle: {
          color: '#38BDF8',
          borderColor: '#0F172A',
          borderWidth: 2,
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(56, 189, 248, 0.35)' },
              { offset: 1, color: 'rgba(56, 189, 248, 0.02)' },
            ],
          },
        },
      },
    ],
  }
})
</script>

<style scoped lang="scss">
.weather-chart {
  width: 100%;
  height: 220px;
}
</style>