<template>
  <section class="match-card match-surface">
    <h3 class="match-card__title">По периодам</h3>

    <div class="periods-grid">
      <div
          v-for="item in items"
          :key="item.label"
          class="period-item"
      >
        <span class="period-item__label">{{ item.label }}</span>
        <strong class="period-item__value">{{ item.value || '—' }}</strong>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  items: Array<{ label: string; value: string | null | undefined }>
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

.periods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 12px;
}

.period-item {
  display: grid;
  gap: 6px;
  padding: 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
}

.period-item__label {
  color: rgba(255, 255, 255, 0.62);
  font-size: 13px;
}

.period-item__value {
  font-size: 22px;
  font-weight: 800;
}
</style>