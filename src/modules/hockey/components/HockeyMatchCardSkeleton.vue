<template>
  <article class="match-card match-card--skeleton">
    <div class="match-card__top">
      <div class="skeleton skeleton--stage" />
      <div class="skeleton skeleton--date" />
    </div>

    <div class="match-card__body">
      <div class="match-team">
        <div class="skeleton skeleton--logo" />

        <div class="match-team__text">
          <div class="skeleton skeleton--name" />
          <div class="skeleton skeleton--location" />
        </div>
      </div>

      <div class="skeleton skeleton--vs" />

      <div class="match-team match-team--right">
        <div class="match-team__text">
          <div class="skeleton skeleton--name" />
          <div class="skeleton skeleton--location" />
        </div>

        <div class="skeleton skeleton--logo" />
      </div>
    </div>

    <div class="match-card__bottom">
      <div class="skeleton skeleton--status" />
      <div class="skeleton skeleton--time" />
    </div>
  </article>
</template>

<style scoped lang="scss">
.match-card {
  display: grid;
  gap: 18px;
  padding: 20px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(13, 18, 35, 0.82);
  min-height: 276px;
}

.match-card__top,
.match-card__bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  min-height: 20px;
}

.match-card__body {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 12px;
  align-items: center;
  min-height: 48px;
}

.match-team {
  display: flex;
  align-items: center;
  gap: 12px;
}

.match-team--right {
  justify-content: flex-end;
}

.match-team__text {
  display: grid;
  gap: 8px;
}

.skeleton {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
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
  animation: shimmer 1.4s infinite;
}

.skeleton--stage {
  width: 110px;
  height: 14px;
}

.skeleton--date {
  width: 130px;
  height: 16px;
}

.skeleton--logo {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  flex-shrink: 0;
}

.skeleton--name {
  width: 120px;
  height: 18px;
}

.skeleton--location {
  width: 90px;
  height: 16px;
}

.skeleton--vs {
  width: 28px;
  height: 20px;
  justify-self: center;
}

.skeleton--status {
  width: 110px;
  height: 16px;
}

.skeleton--time {
  width: 64px;
  height: 16px;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>