<template>
  <section class="elo-card">
    <div class="elo-card__header">
      <div class="elo-card__header-main">
        <div>
          <p class="elo-card__eyebrow">Прогноз</p>
          <h3 class="elo-card__title">Вероятность победы по ELO</h3>
        </div>

        <MatchEloFormulaHint :home-advantage="50" />
      </div>

      <div class="elo-card__badge">
        ELO
      </div>
    </div>

    <div class="elo-card__teams">
      <div class="elo-card__team">
        <div class="elo-card__team-name">
          {{ homeTeamName }}
        </div>

        <div class="elo-card__team-rating">
          Рейтинг: {{ formatRating(homeRating) }}
        </div>

        <div class="elo-card__percent">
          {{ formatPercent(expectedHome) }}
        </div>
      </div>

      <div class="elo-card__center">
        <div class="elo-card__vs">vs</div>

        <div class="elo-card__bar">
          <div
              class="elo-card__bar-fill elo-card__bar-fill--home"
              :style="{ width: `${expectedHomePercent}%` }"
          />
        </div>

        <div class="elo-card__chances">
          <span>{{ formatPercent(expectedHome) }}</span>
          <span>{{ formatPercent(expectedAway) }}</span>
        </div>
      </div>

      <div class="elo-card__team elo-card__team--away">
        <div class="elo-card__team-name">
          {{ awayTeamName }}
        </div>

        <div class="elo-card__team-rating">
          Рейтинг: {{ formatRating(awayRating) }}
        </div>

        <div class="elo-card__percent">
          {{ formatPercent(expectedAway) }}
        </div>
      </div>
    </div>

    <div class="elo-card__footer">
      <div class="elo-card__delta">
        Разница рейтингов: <strong>{{ formatDelta(homeRating - awayRating) }}</strong>
      </div>

      <div class="elo-card__hint">
        Учтено домашнее преимущество
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getExpectedScore } from '../../lib/elo'
import MatchEloFormulaHint from "../tooltip/MatchEloFormulaHint.vue";

interface Props {
  homeTeamName: string
  awayTeamName: string
  homeRating: number
  awayRating: number
}

const props = defineProps<Props>()

const expectedHome = computed(() => getExpectedScore(props.homeRating, props.awayRating))
const expectedAway = computed(() => 1 - expectedHome.value)

const expectedHomePercent = computed(() => Number((expectedHome.value * 100).toFixed(1)))

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`
}

function formatRating(value: number): string {
  return value.toFixed(0)
}

function formatDelta(value: number): string {
  const rounded = Number(value.toFixed(2))

  if (rounded > 0) {
    return `+${rounded}`
  }

  return String(rounded)
}
</script>

<style scoped lang="scss">
.elo-card {
  position: relative;
  overflow: hidden;
  padding: 24px;
  border-radius: 24px;
  background:
      radial-gradient(circle at top left, rgba(96, 165, 250, 0.16), transparent 35%),
      radial-gradient(circle at bottom right, rgba(34, 197, 94, 0.12), transparent 35%),
      linear-gradient(180deg, rgba(13, 18, 35, 0.92), rgba(18, 25, 48, 0.95));
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
      0 20px 40px rgba(0, 0, 0, 0.28),
      inset 0 1px 0 rgba(255, 255, 255, 0.04);
  color: #ffffff;
}

.elo-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, transparent 20%, rgba(255, 255, 255, 0.05) 50%, transparent 80%);
  transform: translateX(-100%);
  animation: shimmer 4s infinite;
  pointer-events: none;
}

.elo-card__header {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.elo-card__header-main {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.elo-card__eyebrow {
  margin: 0 0 6px;
  font-size: 12px;
  line-height: 1;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
}

.elo-card__title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.15;
}

.elo-card__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 54px;
  height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(59, 130, 246, 0.14);
  border: 1px solid rgba(96, 165, 250, 0.32);
  color: #bfdbfe;
  font-size: 13px;
  font-weight: 700;
  backdrop-filter: blur(10px);
}

.elo-card__teams {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr minmax(220px, 320px) 1fr;
  gap: 24px;
  align-items: center;
}

.elo-card__team {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.elo-card__team--away {
  align-items: flex-end;
  text-align: right;
}

.elo-card__team-name {
  font-size: 22px;
  font-weight: 700;
  line-height: 1.2;
}

.elo-card__team-rating {
  color: rgba(255, 255, 255, 0.62);
  font-size: 14px;
}

.elo-card__percent {
  font-size: 40px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.04em;
}

.elo-card__center {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: stretch;
}

.elo-card__vs {
  text-align: center;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: rgba(255, 255, 255, 0.4);
}

.elo-card__bar {
  position: relative;
  height: 14px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.35);
}

.elo-card__bar-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.8s ease;
}

.elo-card__bar-fill--home {
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.95), rgba(34, 197, 94, 0.95));
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.35);
}

.elo-card__chances {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: rgba(255, 255, 255, 0.62);
  font-size: 13px;
  font-weight: 600;
}

.elo-card__footer {
  position: relative;
  z-index: 1;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.elo-card__delta,
.elo-card__hint {
  color: rgba(255, 255, 255, 0.72);
  font-size: 14px;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

@media (max-width: 980px) {
  .elo-card__teams {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .elo-card__team,
  .elo-card__team--away {
    align-items: flex-start;
    text-align: left;
  }

  .elo-card__percent {
    font-size: 34px;
  }
}

@media (max-width: 640px) {
  .elo-card {
    padding: 18px;
    border-radius: 20px;
  }

  .elo-card__title {
    font-size: 20px;
  }

  .elo-card__team-name {
    font-size: 18px;
  }

  .elo-card__percent {
    font-size: 28px;
  }
}
</style>