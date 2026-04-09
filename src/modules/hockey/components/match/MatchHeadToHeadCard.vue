<template>
  <section class="match-card match-surface">
    <h3 class="match-card__title">Очные встречи</h3>

    <div class="h2h-grid">
      <div class="h2h-team">
        <h4>{{ teamA?.name || 'Команда 1' }}</h4>
        <p>Победы: {{ headToHead?.teamA?.wins ?? 0 }}</p>
        <p>Голы: {{ headToHead?.teamA?.goals ?? 0 }}</p>
        <p>Очки: {{ headToHead?.teamA?.points ?? 0 }}</p>
      </div>

      <div class="h2h-team">
        <h4>{{ teamB?.name || 'Команда 2' }}</h4>
        <p>Победы: {{ headToHead?.teamB?.wins ?? 0 }}</p>
        <p>Голы: {{ headToHead?.teamB?.goals ?? 0 }}</p>
        <p>Очки: {{ headToHead?.teamB?.points ?? 0 }}</p>
      </div>
    </div>

    <div class="h2h-total">
      Всего матчей: {{ headToHead?.totalGames ?? 0 }}
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  headToHead: any
  teamA: any
  teamB: any
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

.h2h-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.h2h-team {
  display: grid;
  gap: 10px;
}

.h2h-team h4,
.h2h-team p {
  margin: 0;
}

.h2h-total {
  padding-top: 8px;
  color: rgba(255, 255, 255, 0.68);
  font-weight: 600;
}

@media (max-width: 980px) {
  .h2h-grid {
    grid-template-columns: 1fr;
  }
}
</style>