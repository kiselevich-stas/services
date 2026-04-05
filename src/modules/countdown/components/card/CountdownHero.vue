<template>
  <section v-if="event && diff" class="panel countdown-hero" :style="heroStyle">
    <div class="countdown-hero__glow"></div>

    <div class="countdown-hero__content">
      <div class="countdown-hero__head">
        <div class="countdown-hero__main">
          <p class="countdown-hero__eyebrow">Countdown mode</p>

          <h1 class="countdown-hero__title">
            <span class="countdown-hero__emoji">{{ event.emoji || '✨' }}</span>
            {{ event.title }}
          </h1>

          <p class="countdown-hero__description">
            {{ event.description || 'Событие, которого очень ждут.' }}
          </p>

          <p class="countdown-hero__date">{{ formattedDate }}</p>
        </div>

        <CountdownStatusInline
            :title="statusTitle"
            :text="statusText"
        />
      </div>

      <CountdownProgressSection
          :progress="roundedProgress"
          :hint="progressHint"
          :milestone="milestoneHint"
      />

      <CountdownMetricsGrid :diff="diff" />

      <CountdownInsightsRow
          :lead="leadText"
          :passed="passedDaysText"
          :remaining="remainingText"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CountdownDiff, CountdownEvent} from "../../types/countdown.ts";
import CountdownInsightsRow from './CountdownInsightsRow.vue'
import CountdownMetricsGrid from './CountdownMetricsGrid.vue'
import CountdownProgressSection from './CountdownProgressSection.vue'
import CountdownStatusInline from './CountdownStatusInline.vue'
import { useCountdownPresentation} from "../../composables/useCountdownPresentation.ts";

const props = defineProps<{
  event: CountdownEvent | null
  diff: CountdownDiff | null
}>()

const eventRef = computed(() => props.event)
const diffRef = computed(() => props.diff)

const {
  heroStyle,
  formattedDate,
  leadText,
  roundedProgress,
  passedDaysText,
  remainingText,
  statusTitle,
  statusText,
  progressHint,
  milestoneHint,
} = useCountdownPresentation(eventRef, diffRef)
</script>

<style scoped lang="scss">
.countdown-hero {
  position: relative;
  overflow: hidden;
  --countdown-accent: #8b5cf6;

  background:
      radial-gradient(
              circle at top left,
              color-mix(in srgb, var(--countdown-accent) 16%, transparent),
              transparent 35%
      ),
      linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));

  &__glow {
    position: absolute;
    inset: -32% auto auto -10%;
    width: 260px;
    height: 260px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--countdown-accent) 18%, transparent);
    filter: blur(44px);
    pointer-events: none;
  }

  &__content {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &__head {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(260px, 320px);
    gap: 16px;
    align-items: start;
  }

  &__eyebrow {
    margin: 0 0 8px;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: rgba(255, 255, 255, 0.65);
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
  &__date {
    margin: 0;
    color: rgba(255, 255, 255, 0.72);
  }

  &__description {
    margin-top: 12px;
  }

  &__date {
    margin-top: 8px;
  }
}

@media (max-width: 920px) {
  .countdown-hero__head {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .countdown-hero__title {
    font-size: 28px;
  }
}
</style>