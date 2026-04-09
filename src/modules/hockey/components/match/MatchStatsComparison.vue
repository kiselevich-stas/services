<template>
  <section class="match-card match-surface">
    <h3 class="match-card__title">Сравнение команд</h3>

    <div class="stats-compare">
      <div
          v-for="item in items"
          :key="item.label"
          class="stats-compare__row"
      >
        <div class="stats-compare__value stats-compare__value--left">
          {{ item.teamA }}
        </div>

        <div class="stats-compare__label">
          {{ item.label }}
        </div>

        <div class="stats-compare__value stats-compare__value--right">
          {{ item.teamB }}
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  items: Array<{
    label: string
    teamA: string | number
    teamB: string | number
  }>
}>()
</script>

<style scoped lang="scss">
.match-surface {
  position: relative;
  border-radius: 24px;
  background:
      radial-gradient(circle at top left, rgba(96, 165, 250, 0.12), transparent 32%),
      linear-gradient(180deg, rgba(13, 18, 35, 0.92), rgba(18, 25, 48, 0.96));
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
      0 10px 30px rgba(0, 0, 0, 0.22),
      inset 0 1px 0 rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(10px);
  overflow: hidden;
  transition:
      transform 0.25s ease,
      box-shadow 0.25s ease,
      border-color 0.25s ease;
}

.match-surface::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
          120deg,
          transparent 0%,
          rgba(255, 255, 255, 0.04) 20%,
          transparent 40%
  );
  transform: translateX(-120%);
  transition: transform 0.7s ease;
  pointer-events: none;
}

.match-surface:hover {
  transform: translateY(-3px);
  border-color: rgba(96, 165, 250, 0.24);
  box-shadow:
      0 18px 40px rgba(0, 0, 0, 0.3),
      0 0 0 1px rgba(96, 165, 250, 0.05);
}

.match-surface:hover::before {
  transform: translateX(120%);
}

.match-card {
  display: grid;
  gap: 16px;
  padding: 20px;
}

.match-card__title {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
}

.stats-compare {
  display: grid;
  gap: 12px;
}

.stats-compare__row {
  display: grid;
  grid-template-columns: 1fr 220px 1fr;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
}

.stats-compare__label {
  text-align: center;
  color: rgba(255, 255, 255, 0.72);
  font-weight: 600;
}

.stats-compare__value {
  font-size: 18px;
  font-weight: 800;
}

.stats-compare__value--left {
  text-align: left;
}

.stats-compare__value--right {
  text-align: right;
}

@media (max-width: 980px) {
  .stats-compare__row {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .stats-compare__value--left,
  .stats-compare__value--right {
    text-align: center;
  }
}
</style>