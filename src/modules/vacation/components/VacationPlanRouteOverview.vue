<script setup lang="ts">
import { computed } from 'vue'
import type { VacationDay, VacationDayPoint } from '../types/vacation'
import VacationRouteMap from './VacationRouteMap.vue'

const props = defineProps<{
  days: VacationDay[]
  points: VacationDayPoint[]
}>()

const orderedPoints = computed(() => {
  const daysOrderMap = new Map<string, number>()

  props.days.forEach((day, index) => {
    daysOrderMap.set(day.id, index)
  })

  return [...props.points].sort((firstPoint, secondPoint) => {
    const firstDayOrder = daysOrderMap.get(firstPoint.dayId) ?? 0
    const secondDayOrder = daysOrderMap.get(secondPoint.dayId) ?? 0

    if (firstDayOrder !== secondDayOrder) {
      return firstDayOrder - secondDayOrder
    }

    return firstPoint.sortOrder - secondPoint.sortOrder
  })
})
</script>

<template>
  <section class="vacation-plan-route-overview">
    <div class="vacation-plan-route-overview__header">
      <div>
        <p class="vacation-plan-route-overview__eyebrow">Overview</p>
        <h3 class="vacation-plan-route-overview__title">Общий маршрут поездки</h3>
      </div>

      <div class="vacation-plan-route-overview__badge">
        {{ orderedPoints.length }} точек
      </div>
    </div>

    <VacationRouteMap
        :points="orderedPoints"
        :height="380"
    />
  </section>
</template>

<style scoped lang="scss">
.vacation-plan-route-overview {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background:
      radial-gradient(circle at top right, rgba(236, 72, 153, 0.14), transparent 24%),
      linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04)),
      rgba(10, 14, 24, 0.92);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(18px);
}

.vacation-plan-route-overview__header {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: flex-start;
}

.vacation-plan-route-overview__eyebrow {
  margin: 0 0 8px;
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(236, 72, 153, 0.9);
}

.vacation-plan-route-overview__title {
  margin: 0;
  color: #fff;
  font-size: 24px;
}

.vacation-plan-route-overview__badge {
  flex-shrink: 0;
  min-height: 38px;
  padding: 0 12px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  background: rgba(236, 72, 153, 0.12);
  color: #fff;
  font-size: 13px;
}

@media (max-width: 640px) {
  .vacation-plan-route-overview__header {
    flex-direction: column;
  }
}
</style>