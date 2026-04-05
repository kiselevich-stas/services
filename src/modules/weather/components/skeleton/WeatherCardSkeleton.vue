<template>
  <section class="panel weather-card weather-card-skeleton">
    <div class="weather-card__content">
      <div class="weather-card__top">
        <div class="weather-card__hero">
          <div class="skeleton skeleton-text weather-card-skeleton__place"></div>
          <div class="skeleton skeleton-text weather-card-skeleton__temp"></div>
          <div class="skeleton skeleton-text weather-card-skeleton__desc"></div>
          <div class="skeleton skeleton-text weather-card-skeleton__feels"></div>
        </div>
      </div>

      <div class="metric-grid">
        <div
            v-for="index in 5"
            :key="index"
            class="metric-box metric-box--skeleton"
            :style="{ '--delay': `${0.08 + (index - 1) * 0.06}s` }"
        >
          <div class="skeleton skeleton-text metric-box__label"></div>
          <div class="skeleton skeleton-text metric-box__value"></div>
        </div>
      </div>
    </div>

    <div class="weather-chart-skeleton">
      <div class="skeleton skeleton-text weather-chart-skeleton__title"></div>

      <div class="weather-chart-skeleton__grid">
        <div
            v-for="index in 8"
            :key="index"
            class="weather-chart-skeleton__bar-wrap"
        >
          <div
              class="skeleton weather-chart-skeleton__bar"
              :style="{ height: `${42 + (index % 4) * 16}px` }"
          ></div>
          <div class="skeleton skeleton-text weather-chart-skeleton__time"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.weather-card-skeleton {
  overflow: hidden;
}

.weather-card__content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.weather-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.weather-card__hero {
  width: 100%;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.metric-box--skeleton {
  pointer-events: none;
}

.skeleton {
  position: relative;
  overflow: hidden;
  border-radius: 14px;
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

.weather-card-skeleton__place {
  width: 140px;
  height: 16px;
  margin-bottom: 12px;
  border-radius: 10px;
}

.weather-card-skeleton__temp {
  width: 180px;
  height: 56px;
  margin-bottom: 12px;
  border-radius: 18px;
}

.weather-card-skeleton__desc {
  width: 160px;
  height: 16px;
  margin-bottom: 8px;
  border-radius: 10px;
}

.weather-card-skeleton__feels {
  width: 190px;
  height: 14px;
  border-radius: 10px;
}

.metric-box {
  --delay: 0s;

  padding: 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.06);

  display: flex;
  flex-direction: column;
  gap: 10px;

  opacity: 0;
  transform: translateY(18px) scale(0.96);
  animation: metricBoxIn 0.3s ease forwards;
  animation-delay: var(--delay);
}

.metric-box__label {
  width: 60%;
  height: 13px;
  border-radius: 8px;
}

.metric-box__value {
  width: 75%;
  height: 18px;
  border-radius: 10px;
}

.weather-chart-skeleton {
  margin-top: 18px;
  padding-top: 18px;
}

.weather-chart-skeleton__title {
  width: 180px;
  height: 16px;
  margin-bottom: 18px;
  border-radius: 10px;
}

.weather-chart-skeleton__grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 10px;
  align-items: end;
  min-height: 120px;
}

.weather-chart-skeleton__bar-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}

.weather-chart-skeleton__bar {
  width: 100%;
  min-height: 36px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.05);
}

.weather-chart-skeleton__time {
  width: 70%;
  height: 10px;
  border-radius: 8px;
}

@keyframes skeletonShimmer {
  100% {
    transform: translateX(100%);
  }
}

@keyframes metricBoxIn {
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>