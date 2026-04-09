<template>
  <section class="match-page-skeleton">
    <div class="skeleton-hero skeleton-surface">
      <div class="skeleton-hero__team">
        <div class="skeleton skeleton-circle" />
        <div class="skeleton-hero__meta">
          <div class="skeleton skeleton-line skeleton-line--lg" />
          <div class="skeleton skeleton-line skeleton-line--sm" />
        </div>
      </div>

      <div class="skeleton-hero__center">
        <div class="skeleton skeleton-pill" />
        <div class="skeleton skeleton-score" />
        <div class="skeleton skeleton-line skeleton-line--md" />
        <div class="skeleton skeleton-line skeleton-line--sm" />
      </div>

      <div class="skeleton-hero__team skeleton-hero__team--right">
        <div class="skeleton-hero__meta">
          <div class="skeleton skeleton-line skeleton-line--lg" />
          <div class="skeleton skeleton-line skeleton-line--sm" />
        </div>
        <div class="skeleton skeleton-circle" />
      </div>
    </div>

    <div class="skeleton-grid">
      <div
          v-for="index in 8"
          :key="index"
          class="skeleton-card skeleton-surface"
          :class="{ 'skeleton-card--full': index === 3 || index === 6 || index === 8 }"
      >
        <div class="skeleton skeleton-line skeleton-line--title" />
        <div class="skeleton-card__content">
          <div
              v-for="row in 4"
              :key="row"
              class="skeleton skeleton-line"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.match-page-skeleton {
  display: grid;
  gap: 20px;
}

.skeleton-surface {
  border-radius: 28px;
  background: linear-gradient(180deg, rgba(13, 18, 35, 0.92), rgba(18, 25, 48, 0.95));
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.skeleton {
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.06);
}

.skeleton::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.12),
          transparent
  );
  animation: shimmer 1.4s infinite;
}

.skeleton-hero {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 20px;
  align-items: center;
  padding: 24px;
}

.skeleton-hero__team {
  display: flex;
  align-items: center;
  gap: 14px;
}

.skeleton-hero__team--right {
  justify-content: flex-end;
}

.skeleton-hero__meta {
  display: grid;
  gap: 10px;
}

.skeleton-hero__center {
  display: grid;
  justify-items: center;
  gap: 12px;
  min-width: 220px;
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.skeleton-card {
  padding: 20px;
  min-height: 220px;
}

.skeleton-card--full {
  grid-column: 1 / -1;
}

.skeleton-card__content {
  display: grid;
  gap: 12px;
  margin-top: 16px;
}

.skeleton-circle {
  width: 72px;
  height: 72px;
  border-radius: 50%;
}

.skeleton-pill {
  width: 120px;
  height: 32px;
  border-radius: 999px;
}

.skeleton-score {
  width: 180px;
  height: 56px;
  border-radius: 18px;
}

.skeleton-line {
  height: 16px;
  border-radius: 999px;
}

.skeleton-line--title {
  width: 180px;
  height: 24px;
}

.skeleton-line--lg {
  width: 180px;
}

.skeleton-line--md {
  width: 150px;
}

.skeleton-line--sm {
  width: 110px;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

@media (max-width: 980px) {
  .skeleton-hero {
    grid-template-columns: 1fr;
    justify-items: center;
  }

  .skeleton-grid {
    grid-template-columns: 1fr;
  }
}
</style>