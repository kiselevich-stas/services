<script setup lang="ts"></script>

<template>
  <section class="hockey-elo-skeleton">

    <div class="hockey-elo-skeleton__table">
      <div
          v-for="item in 6"
          :key="item"
          class="hockey-elo-skeleton__row"
      />
    </div>
  </section>
</template>

<style scoped lang="scss">
.hockey-elo-skeleton {
  display: grid;
  gap: 24px;
}

.hockey-elo-skeleton__hero {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  padding: 32px;
  border-radius: 28px;
  background:
      radial-gradient(circle at top right, rgba(59, 130, 246, 0.16), transparent 35%),
      linear-gradient(180deg, #0f172a, #111827);
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
}

.hockey-elo-skeleton__hero-content {
  flex: 1;
  max-width: 760px;
}

.hockey-elo-skeleton__stats {
  display: grid;
  gap: 12px;
  min-width: 260px;
}

.hockey-elo-skeleton__stat-card {
  display: grid;
  gap: 10px;
  padding: 18px 20px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
}

.hockey-elo-skeleton__toolbar {
  display: flex;
  align-items: end;
  gap: 16px;
  padding: 20px 24px;
  border-radius: 24px;
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.hockey-elo-skeleton__select {
  width: 100%;
  max-width: 320px;
  height: 56px;
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.06);
}

.hockey-elo-skeleton__table {
  display: grid;
  gap: 12px;
}

.hockey-elo-skeleton__row {
  height: 72px;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.hockey-elo-skeleton__item {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.06);
}

.hockey-elo-skeleton__item::after,
.hockey-elo-skeleton__row::after,
.hockey-elo-skeleton__select::after {
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
  animation: hockey-elo-skeleton-shimmer 1.4s infinite;
}

.hockey-elo-skeleton__item--eyebrow {
  width: 140px;
  height: 14px;
  margin-bottom: 12px;
}

.hockey-elo-skeleton__item--title {
  width: min(420px, 100%);
  height: 42px;
  margin-bottom: 14px;
  border-radius: 16px;
}

.hockey-elo-skeleton__item--text {
  width: 100%;
  max-width: 620px;
  height: 16px;
  margin-bottom: 10px;
}

.hockey-elo-skeleton__item--text-short {
  max-width: 420px;
  margin-bottom: 0;
}

.hockey-elo-skeleton__item--label {
  width: 120px;
  height: 12px;
}

.hockey-elo-skeleton__item--value {
  width: 180px;
  height: 18px;
}

@keyframes hockey-elo-skeleton-shimmer {
  100% {
    transform: translateX(100%);
  }
}

@media (max-width: 900px) {
  .hockey-elo-skeleton__hero {
    flex-direction: column;
    padding: 24px;
  }

  .hockey-elo-skeleton__stats {
    min-width: unset;
  }

  .hockey-elo-skeleton__toolbar {
    padding: 16px;
  }

  .hockey-elo-skeleton__select {
    max-width: 100%;
  }
}
</style>