<template>
  <section class="panel hourly-forecast__panel hourly-forecast-skeleton">
    <div class="panel__header">
      <div class="skeleton skeleton-text hourly-forecast-skeleton__title"></div>
      <div class="skeleton skeleton-text hourly-forecast-skeleton__text"></div>
    </div>

    <div class="hourly-grid">
      <div
          v-for="index in 6"
          :key="index"
          class="hourly-card hourly-card--skeleton"
          :style="{ '--delay': `${0.06 + (index - 1) * 0.05}s` }"
      >
        <div class="skeleton skeleton-text hourly-card__time-skeleton"></div>
        <div class="skeleton skeleton-text hourly-card__temp-skeleton"></div>
        <div class="skeleton skeleton-text hourly-card__meta-skeleton"></div>
        <div class="skeleton skeleton-text hourly-card__meta-skeleton hourly-card__meta-skeleton--short"></div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.hourly-forecast-skeleton {
  overflow: auto;
}

.skeleton {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.06);

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    transform: translateX(-100%);
    background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.08) 45%,
            rgba(255, 255, 255, 0.18) 50%,
            rgba(255, 255, 255, 0.08) 55%,
            rgba(255, 255, 255, 0) 100%
    );
    animation: skeletonShimmer 1.6s ease-in-out infinite;
  }
}

.skeleton-text {
  height: 14px;
}

.hourly-forecast-skeleton__title {
  width: 170px;
  height: 22px;
  margin-bottom: 10px;
  border-radius: 10px;
}

.hourly-forecast-skeleton__text {
  width: 260px;
  max-width: 100%;
  height: 14px;
  border-radius: 10px;
}

.hourly-grid {
  display: flex;
  gap: 12px;
}

.hourly-card--skeleton {
  --delay: 0s;

  padding: 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.06);

  display: flex;
  flex-direction: column;
  gap: 10px;

  opacity: 0;
  transform: translateY(18px) scale(0.96);
  animation: hourlyCardIn 0.3s ease forwards;
  animation-delay: var(--delay);
}

.hourly-card__time-skeleton {
  width: 55%;
  height: 14px;
  border-radius: 8px;
}

.hourly-card__temp-skeleton {
  width: 45%;
  height: 28px;
  border-radius: 10px;
}

.hourly-card__meta-skeleton {
  width: 85%;
  height: 13px;
  border-radius: 8px;
}

.hourly-card__meta-skeleton--short {
  width: 72%;
}

@keyframes skeletonShimmer {
  100% {
    transform: translateX(100%);
  }
}

@keyframes hourlyCardIn {
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>