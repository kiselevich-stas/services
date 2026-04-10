<script setup lang="ts"></script>

<template>
  <section class="home-hockey-skeleton">
    <header class="hero-card">
      <div class="hero-card__content">
        <div class="skeleton skeleton--eyebrow" />
        <div class="skeleton skeleton--title" />
        <div class="skeleton skeleton--text" />
        <div class="skeleton skeleton--text skeleton--text-short" />

        <div class="hero-card__actions">
          <div class="skeleton skeleton--button" />
          <div class="skeleton skeleton--button skeleton--button-secondary" />
        </div>
      </div>

      <div class="hero-card__aside">
        <div class="hero-stat">
          <div class="skeleton skeleton--stat-label" />
          <div class="skeleton skeleton--stat-value" />
        </div>

        <div class="hero-stat">
          <div class="skeleton skeleton--stat-label" />
          <div class="skeleton skeleton--stat-value" />
        </div>

        <div class="hero-stat">
          <div class="skeleton skeleton--stat-label" />
          <div class="skeleton skeleton--stat-value" />
        </div>
      </div>
    </header>

    <section class="quick-links">
      <div
          v-for="index in 3"
          :key="`quick-${index}`"
          class="quick-link"
      >
        <div class="skeleton skeleton--quick-label" />
        <div class="skeleton skeleton--quick-title" />
        <div class="skeleton skeleton--quick-text" />
        <div class="skeleton skeleton--quick-text skeleton--quick-text-short" />
      </div>
    </section>

    <section class="section-card">
      <div class="section-card__top">
        <div class="section-card__head">
          <div class="skeleton skeleton--section-eyebrow" />
          <div class="skeleton skeleton--section-title" />
          <div class="skeleton skeleton--section-text" />
        </div>

        <div class="skeleton skeleton--section-link" />
      </div>

      <div class="live-grid">
        <div
            v-for="index in 2"
            :key="`live-${index}`"
            class="live-mini-card live-mini-card--skeleton"
        >
          <div class="live-mini-card__head">
            <div class="skeleton skeleton--badge" />
            <div class="skeleton skeleton--stage" />
          </div>

          <div class="live-mini-card__teams">
            <div class="live-mini-team">
              <div class="skeleton skeleton--logo" />
              <div class="skeleton skeleton--team-name" />
            </div>

            <div class="skeleton skeleton--score" />

            <div class="live-mini-team live-mini-team--right">
              <div class="skeleton skeleton--team-name" />
              <div class="skeleton skeleton--logo" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section-card">
      <div class="section-card__top">
        <div class="section-card__head">
          <div class="skeleton skeleton--section-eyebrow" />
          <div class="skeleton skeleton--section-title" />
          <div class="skeleton skeleton--section-text" />
        </div>

        <div class="skeleton skeleton--section-link" />
      </div>

      <div class="upcoming-grid">
        <div
            v-for="index in 6"
            :key="`upcoming-${index}`"
            class="upcoming-card upcoming-card--skeleton"
        >
          <div class="upcoming-card__top">
            <div class="skeleton skeleton--small-line" />
            <div class="skeleton skeleton--small-line" />
          </div>

          <div class="upcoming-card__body">
            <div class="upcoming-team">
              <div class="skeleton skeleton--logo" />
              <div class="skeleton skeleton--team-name" />
            </div>

            <div class="skeleton skeleton--vs" />

            <div class="upcoming-team upcoming-team--right">
              <div class="skeleton skeleton--team-name" />
              <div class="skeleton skeleton--logo" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section-card">
      <div class="section-card__top">
        <div class="section-card__head">
          <div class="skeleton skeleton--section-eyebrow" />
          <div class="skeleton skeleton--section-title" />
          <div class="skeleton skeleton--section-text" />
        </div>

        <div class="skeleton skeleton--section-link" />
      </div>

      <div class="teams-grid">
        <div
            v-for="index in 12"
            :key="`team-${index}`"
            class="team-home-card team-home-card--skeleton"
        >
          <div class="skeleton skeleton--team-logo-large" />
          <div class="skeleton skeleton--team-card-title" />
          <div class="skeleton skeleton--team-card-city" />
          <div class="team-home-card__meta">
            <div class="skeleton skeleton--pill" />
            <div class="skeleton skeleton--pill" />
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<style scoped lang="scss">
.home-hockey-skeleton {
  display: grid;
  gap: 24px;
}

/* ===== базовые контейнеры — те же, что и на странице ===== */

.hero-card,
.section-card {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 28px;
  background:
      radial-gradient(circle at top right, rgba(59, 130, 246, 0.12), transparent 30%),
      rgba(13, 18, 35, 0.86);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
}

.hero-card {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(260px, 0.8fr);
  gap: 24px;
  padding: 32px;
}

.hero-card__content {
  display: grid;
  align-content: start;
}

.hero-card__aside {
  display: grid;
  gap: 12px;
}

.hero-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
}

.hero-stat {
  display: grid;
  gap: 8px;
  padding: 18px 20px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.quick-links {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.quick-link {
  display: grid;
  gap: 10px;
  padding: 22px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(13, 18, 35, 0.86);
}

.section-card {
  display: grid;
  gap: 18px;
  padding: 24px;
}

.section-card__top {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
}

.section-card__head {
  display: grid;
  gap: 10px;
}

.live-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.upcoming-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.teams-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.live-mini-card,
.upcoming-card,
.team-home-card {
  border-radius: 22px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.live-mini-card {
  display: grid;
  gap: 16px;
  padding: 18px;
  min-height: 132px;
  background: linear-gradient(180deg, rgba(11, 16, 30, 0.94), rgba(18, 25, 48, 0.92));
}

.upcoming-card {
  display: grid;
  gap: 18px;
  padding: 18px;
  min-height: 160px;
  background: rgba(255, 255, 255, 0.03);
}

.team-home-card {
  display: grid;
  justify-items: center;
  gap: 10px;
  min-height: 220px;
  padding: 18px 16px;
  background: rgba(255, 255, 255, 0.03);
  text-align: center;
}

.live-mini-card__head,
.upcoming-card__top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.live-mini-card__teams,
.upcoming-card__body {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 12px;
  align-items: center;
}

.live-mini-team,
.upcoming-team {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.live-mini-team--right,
.upcoming-team--right {
  justify-content: flex-end;
  text-align: right;
}

.team-home-card__meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

/* ===== skeleton primitive ===== */

.skeleton {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
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
          rgba(255, 255, 255, 0.14),
          transparent
  );
  animation: skeleton-shimmer 1.5s infinite;
}

/* ===== hero ===== */

.skeleton--eyebrow {
  width: 120px;
  height: 12px;
  margin-bottom: 10px;
}

.skeleton--title {
  width: min(420px, 100%);
  height: 46px;
  margin-bottom: 12px;
  border-radius: 16px;
}

.skeleton--text {
  width: min(640px, 100%);
  height: 16px;
}

.skeleton--text-short {
  width: min(460px, 100%);
  margin-top: 6px;
}

.skeleton--button {
  width: 180px;
  height: 46px;
  border-radius: 14px;
}

.skeleton--button-secondary {
  width: 190px;
}

.skeleton--stat-label {
  width: 92px;
  height: 12px;
}

.skeleton--stat-value {
  width: 56px;
  height: 28px;
  border-radius: 14px;
}

/* ===== quick links ===== */

.skeleton--quick-label {
  width: 64px;
  height: 12px;
}

.skeleton--quick-title {
  width: 180px;
  height: 26px;
}

.skeleton--quick-text {
  width: 100%;
  height: 14px;
}

.skeleton--quick-text-short {
  width: 82%;
}

/* ===== section header ===== */

.skeleton--section-eyebrow {
  width: 70px;
  height: 12px;
}

.skeleton--section-title {
  width: 220px;
  height: 32px;
}

.skeleton--section-text {
  width: 280px;
  height: 14px;
}

.skeleton--section-link {
  width: 140px;
  height: 42px;
  border-radius: 12px;
}

/* ===== live ===== */

.skeleton--badge {
  width: 48px;
  height: 24px;
  border-radius: 999px;
}

.skeleton--stage {
  width: 100px;
  height: 12px;
}

.skeleton--logo {
  width: 36px;
  height: 36px;
  border-radius: 50%;
}

.skeleton--team-name {
  width: 110px;
  height: 14px;
}

.skeleton--score {
  width: 72px;
  height: 32px;
  border-radius: 14px;
}

/* ===== upcoming ===== */

.skeleton--small-line {
  width: 90px;
  height: 12px;
}

.skeleton--vs {
  width: 28px;
  height: 16px;
}

/* ===== teams ===== */

.skeleton--team-logo-large {
  width: 72px;
  height: 72px;
  border-radius: 50%;
}

.skeleton--team-card-title {
  width: 120px;
  height: 18px;
}

.skeleton--team-card-city {
  width: 90px;
  height: 14px;
}

.skeleton--pill {
  width: 72px;
  height: 28px;
  border-radius: 999px;
}

/* ===== animation ===== */

@keyframes skeleton-shimmer {
  100% {
    transform: translateX(100%);
  }
}

/* ===== adaptive ===== */

@media (max-width: 1100px) {
  .hero-card,
  .quick-links,
  .live-grid,
  .upcoming-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .section-card__top,
  .hero-card__actions {
    align-items: stretch;
    flex-direction: column;
  }

  .hero-card,
  .section-card {
    padding: 18px;
  }

  .live-mini-card__teams,
  .upcoming-card__body {
    grid-template-columns: 1fr;
  }

  .live-mini-team,
  .live-mini-team--right,
  .upcoming-team,
  .upcoming-team--right {
    justify-content: center;
    text-align: center;
  }

  .skeleton--section-link,
  .skeleton--button,
  .skeleton--button-secondary {
    width: 100%;
  }

  .skeleton--section-title,
  .skeleton--section-text,
  .skeleton--title,
  .skeleton--text,
  .skeleton--text-short {
    width: 100%;
  }
}
</style>