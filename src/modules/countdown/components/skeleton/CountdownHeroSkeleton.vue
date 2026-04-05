<template>
  <section class="panel countdown-hero-skeleton">
    <div class="countdown-hero-skeleton__glow"></div>

    <div class="countdown-hero-skeleton__content">
      <div class="countdown-hero-skeleton__head">
        <div class="countdown-hero-skeleton__main">
          <div class="skeleton-line skeleton-line--eyebrow"></div>

          <div class="countdown-hero-skeleton__title-row">
            <div class="skeleton-circle"></div>
            <div class="skeleton-line skeleton-line--title"></div>
          </div>

          <div class="skeleton-line skeleton-line--description"></div>
          <div class="skeleton-line skeleton-line--description-short"></div>
          <div class="skeleton-line skeleton-line--date"></div>
        </div>

        <div class="countdown-hero-skeleton__status">
          <div class="countdown-hero-skeleton__status-dot"></div>

          <div class="countdown-hero-skeleton__status-content">
            <div class="skeleton-line skeleton-line--status-label"></div>
            <div class="skeleton-line skeleton-line--status-title"></div>
            <div class="skeleton-line skeleton-line--status-text"></div>
            <div class="skeleton-line skeleton-line--status-text-short"></div>
          </div>
        </div>
      </div>

      <div class="countdown-hero-skeleton__progress">
        <div class="countdown-hero-skeleton__progress-head">
          <div>
            <div class="skeleton-line skeleton-line--progress-label"></div>
            <div class="skeleton-line skeleton-line--progress-value"></div>
          </div>

          <div class="skeleton-pill"></div>
        </div>

        <div class="skeleton-progress"></div>
        <div class="skeleton-line skeleton-line--progress-meta"></div>
      </div>

      <div class="countdown-hero-skeleton__metrics">
        <div
            v-for="item in 4"
            :key="item"
            class="countdown-hero-skeleton__metric"
        >
          <div class="skeleton-line skeleton-line--metric-label"></div>
          <div class="skeleton-line skeleton-line--metric-value"></div>
        </div>
      </div>

      <div class="countdown-hero-skeleton__insights">
        <div
            v-for="item in 3"
            :key="item"
            class="countdown-hero-skeleton__insight"
        >
          <div class="skeleton-line skeleton-line--chip-label"></div>
          <div class="skeleton-line skeleton-line--chip-value"></div>
          <div class="skeleton-line skeleton-line--chip-value-short"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.countdown-hero-skeleton {
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
    background: color-mix(in srgb, var(--countdown-accent) 12%, transparent);
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

  &__main {
    display: flex;
    flex-direction: column;
  }

  &__title-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 4px;
  }

  &__status {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 14px 16px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.06);
  }

  &__status-dot {
    flex-shrink: 0;
    width: 10px;
    height: 10px;
    margin-top: 7px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.14);
  }

  &__status-content {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
  }

  &__progress {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 18px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.05);
  }

  &__progress-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
  }

  &__metrics {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
  }

  &__metric {
    padding: 16px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.06);
  }

  &__insights {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }

  &__insight {
    padding: 16px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.05);
  }
}

.skeleton-line,
.skeleton-circle,
.skeleton-pill,
.skeleton-progress {
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.08);

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    transform: translateX(-120%);
    background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.16),
            transparent
    );
    animation: countdownSkeletonShimmer 1.8s ease-in-out infinite;
  }
}

.skeleton-line {
  border-radius: 10px;

  &--eyebrow {
    width: 110px;
    height: 13px;
    margin-bottom: 12px;
  }

  &--title {
    width: min(360px, 72%);
    height: 38px;
    border-radius: 14px;
  }

  &--description {
    width: 78%;
    height: 16px;
    margin-top: 16px;
  }

  &--description-short {
    width: 56%;
    height: 16px;
    margin-top: 8px;
  }

  &--date {
    width: 180px;
    height: 15px;
    margin-top: 12px;
  }

  &--status-label {
    width: 64px;
    height: 11px;
  }

  &--status-title {
    width: 140px;
    height: 22px;
  }

  &--status-text {
    width: 100%;
    height: 14px;
  }

  &--status-text-short {
    width: 72%;
    height: 14px;
  }

  &--progress-label {
    width: 130px;
    height: 13px;
    margin-bottom: 10px;
  }

  &--progress-value {
    width: 64px;
    height: 28px;
    border-radius: 12px;
  }

  &--progress-meta {
    width: 190px;
    height: 13px;
  }

  &--metric-label {
    width: 48px;
    height: 13px;
    margin-bottom: 10px;
  }

  &--metric-value {
    width: 56px;
    height: 30px;
    border-radius: 12px;
  }

  &--chip-label {
    width: 82px;
    height: 11px;
    margin-bottom: 10px;
  }

  &--chip-value {
    width: 90%;
    height: 15px;
    margin-bottom: 8px;
  }

  &--chip-value-short {
    width: 62%;
    height: 15px;
  }
}

.skeleton-circle {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  flex-shrink: 0;
}

.skeleton-pill {
  width: 140px;
  height: 34px;
  border-radius: 999px;
}

.skeleton-progress {
  width: 100%;
  height: 12px;
  border-radius: 999px;
}

@keyframes countdownSkeletonShimmer {
  100% {
    transform: translateX(120%);
  }
}

@media (max-width: 920px) {
  .countdown-hero-skeleton__head {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .countdown-hero-skeleton__metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .countdown-hero-skeleton__insights {
    grid-template-columns: 1fr;
  }

  .skeleton-line--title {
    width: 75%;
    height: 30px;
  }

  .skeleton-pill {
    width: 120px;
  }

  .countdown-hero-skeleton__progress-head {
    flex-direction: column;
  }
}
</style>