<template>
  <section v-if="event && diff" class="panel countdown-hero" :style="heroStyle">
    <div class="countdown-hero__glow"></div>

    <div class="countdown-hero__content">
      <div>
        <p class="countdown-hero__eyebrow">Countdown mode</p>
        <h1 class="countdown-hero__title">
          <span class="countdown-hero__emoji">{{ event.emoji }}</span>
          {{ event.title }}
        </h1>
        <p class="countdown-hero__description">{{ event.description || 'Событие, которого очень ждут.' }}</p>
        <p class="countdown-hero__date">{{ formattedDate }}</p>
      </div>

      <div class="countdown-hero__grid">
        <div class="countdown-metric">
          <span>Дни</span>
          <strong>{{ diff.days }}</strong>
        </div>
        <div class="countdown-metric">
          <span>Часы</span>
          <strong>{{ diff.hours }}</strong>
        </div>
        <div class="countdown-metric">
          <span>Минуты</span>
          <strong>{{ diff.minutes }}</strong>
        </div>
        <div class="countdown-metric">
          <span>Секунды</span>
          <strong>{{ diff.seconds }}</strong>
        </div>
      </div>

      <div class="countdown-hero__footer">
        <div>
          <p class="countdown-hero__lead">{{ leadText }}</p>
          <p class="countdown-hero__sublead">Осталось {{ diff.totalDays }} {{ dayWord }}</p>
        </div>

        <div class="countdown-progress">
          <div class="countdown-progress__bar" :style="{ width: `${diff.progressPercent}%` }"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { CountdownDiff, CountdownEvent } from '../types/countdown'
import { buildCountdownMessage, formatCountdownDate, pluralizeDays } from '../utils/date'

const props = defineProps<{
  event: CountdownEvent | null
  diff: CountdownDiff | null
}>()

const formattedDate = computed(() => {
  if (!props.event) return ''
  return formatCountdownDate(props.event.targetDate)
})

const dayWord = computed(() => pluralizeDays(props.diff?.totalDays ?? 0))

const leadText = computed(() => {
  if (!props.diff) return ''
  if (props.diff.isExpired) return 'Событие уже прошло. Можно создать новое ожидание.'
  return buildCountdownMessage(props.diff.totalDays)
})

const heroStyle = computed(() => {
  const color = props.event?.color ?? '#8B5CF6'
  return {
    '--countdown-accent': color,
  }
})
</script>

<style scoped lang="scss">
.countdown-hero {
  position: relative;
  overflow: hidden;
  min-height: 340px;
  background:
    radial-gradient(circle at top right, color-mix(in srgb, var(--countdown-accent) 35%, transparent), transparent 28%),
    linear-gradient(180deg, rgba(15, 23, 42, 0.96), rgba(17, 24, 39, 0.98));

  &__glow {
    position: absolute;
    top: -80px;
    right: -60px;
    width: 240px;
    height: 240px;
    border-radius: 50%;
    background: color-mix(in srgb, var(--countdown-accent) 22%, transparent);
    filter: blur(40px);
  }

  &__content {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &__eyebrow {
    margin: 0 0 8px;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: rgba(255,255,255,0.65);
  }

  &__title {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0;
    font-size: 36px;
    line-height: 1.1;
  }

  &__emoji {
    font-size: 40px;
  }

  &__description,
  &__date,
  &__sublead {
    margin: 0;
    color: rgba(255,255,255,0.72);
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
  }

  &__lead {
    margin: 0 0 6px;
    font-size: 18px;
    font-weight: 600;
  }

  &__footer {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
}

.countdown-metric {
  padding: 16px;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 18px;
  background: rgba(255,255,255,0.05);

  span {
    display: block;
    margin-bottom: 8px;
    color: rgba(255,255,255,0.64);
    font-size: 13px;
  }

  strong {
    font-size: 30px;
    line-height: 1;
  }
}

.countdown-progress {
  overflow: hidden;
  width: 100%;
  height: 12px;
  border-radius: 999px;
  background: rgba(255,255,255,0.08);

  &__bar {
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, var(--countdown-accent), rgba(255,255,255,0.95));
    transition: width 0.4s ease;
  }
}

@media (max-width: 768px) {
  .countdown-hero__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
