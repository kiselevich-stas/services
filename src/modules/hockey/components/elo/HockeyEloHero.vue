<script setup lang="ts">
defineProps<{
  selectedSeasonLabel: string
  formattedCalculatedAt: string
}>()
</script>

<template>
  <header class="hockey-elo-hero">
    <div class="hockey-elo-hero__content">
      <span class="hockey-elo-hero__eyebrow">Hockey analytics</span>

      <h1 class="hockey-elo-hero__title">Elo рейтинг команд</h1>

      <p class="hockey-elo-hero__subtitle">
        Отслеживай силу команд по сезонам, смотри таблицу Elo и запускай
        пересчёт для текущего сезона прямо со страницы.
      </p>
    </div>

    <div class="hockey-elo-hero__stats">
      <div class="hockey-elo-hero__stat-card">
        <span>Выбранный сезон</span>

        <div class="hockey-elo-hero__value-wrap">
          <Transition name="hero-value" mode="out-in">
            <strong :key="selectedSeasonLabel">
              {{ selectedSeasonLabel }}
            </strong>
          </Transition>
        </div>
      </div>

      <div class="hockey-elo-hero__stat-card">
        <span>Последний расчёт</span>

        <div class="hockey-elo-hero__value-wrap">
          <Transition name="hero-value" mode="out-in">
            <strong :key="formattedCalculatedAt">
              {{ formattedCalculatedAt }}
            </strong>
          </Transition>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.hockey-elo-hero {
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
  animation: fade-up 0.45s ease;
}

.hockey-elo-hero__content {
  max-width: 760px;
}

.hockey-elo-hero__eyebrow {
  display: inline-block;
  margin-bottom: 12px;
  color: #8b5cf6;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.hockey-elo-hero__title {
  margin: 0 0 12px;
  color: #f8fafc;
  font-size: 40px;
  line-height: 1.05;
}

.hockey-elo-hero__subtitle {
  margin: 0;
  color: #94a3b8;
  font-size: 15px;
  line-height: 1.7;
}

.hockey-elo-hero__stats {
  display: grid;
  gap: 12px;
  min-width: 260px;
}

.hockey-elo-hero__stat-card {
  padding: 18px 20px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
}

.hockey-elo-hero__stat-card span {
  display: block;
  margin-bottom: 8px;
  color: #94a3b8;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.hockey-elo-hero__value-wrap {
  position: relative;
  min-height: 24px;
  overflow: hidden;
}

.hockey-elo-hero__stat-card strong {
  display: block;
  color: #f8fafc;
  font-size: 16px;
  font-weight: 700;
  will-change: transform, opacity, filter;
}

.hero-value-enter-active,
.hero-value-leave-active {
  transition:
      opacity 0.35s ease,
      transform 0.35s ease,
      filter 0.35s ease;
}

.hero-value-enter-from {
  opacity: 0;
  transform: translateY(14px) scale(0.98);
  filter: blur(6px);
}

.hero-value-leave-to {
  opacity: 0;
  transform: translateY(-14px) scale(0.98);
  filter: blur(6px);
}

.hero-value-enter-to,
.hero-value-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0);
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 900px) {
  .hockey-elo-hero {
    flex-direction: column;
    padding: 24px;
  }

  .hockey-elo-hero__title {
    font-size: 32px;
  }

  .hockey-elo-hero__stats {
    min-width: unset;
  }
}


.hockey-elo-hero__stat-card {
  padding: 18px 20px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.hockey-elo-hero__stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.12);
  border-color: rgba(255, 255, 255, 0.08);
}
</style>