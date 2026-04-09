<template>
  <header class="match-hero match-surface">
    <div class="match-hero__team">
      <img
          v-if="matchDetails.teamA?.image"
          :src="matchDetails.teamA.image"
          :alt="matchDetails.teamA.name"
          class="match-hero__logo"
      />
      <div class="match-hero__team-meta">
        <h2>{{ matchDetails.teamA?.name || 'Команда 1' }}</h2>
        <p>{{ matchDetails.teamA?.location || '—' }}</p>
      </div>
    </div>

    <div class="match-hero__center">
      <div class="match-hero__status">
        <span v-if="isLive" class="match-hero__live-dot" />
        {{ matchStatusLabel }}
      </div>

      <div class="match-hero__score">
        {{ formattedScore }}
      </div>

      <div class="match-hero__meta">
        <span>{{ formattedStartAt }}</span>
        <span v-if="matchDetails.stageName">• {{ matchDetails.stageName }}</span>
      </div>

      <div class="match-hero__arena">
        {{ arenaLabel }}
      </div>
    </div>

    <div class="match-hero__team match-hero__team--right">
      <img
          v-if="matchDetails.teamB?.image"
          :src="matchDetails.teamB.image"
          :alt="matchDetails.teamB.name"
          class="match-hero__logo"
      />
      <div class="match-hero__team-meta">
        <h2>{{ matchDetails.teamB?.name || 'Команда 2' }}</h2>
        <p>{{ matchDetails.teamB?.location || '—' }}</p>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  matchDetails: any
  formattedScore: string
  formattedStartAt: string
  arenaLabel: string
  matchStatusLabel: string
  isLive?: boolean
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

.match-hero {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 20px;
  padding: 24px;
}

.match-hero__team {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.match-hero__team--right {
  justify-content: flex-end;
  text-align: right;
}

.match-hero__logo {
  width: 72px;
  height: 72px;
  object-fit: contain;
  flex-shrink: 0;
  filter: drop-shadow(0 4px 14px rgba(255, 255, 255, 0.12));
}

.match-hero__team-meta h2 {
  margin: 0 0 6px;
  font-size: 24px;
  font-weight: 800;
  line-height: 1.1;
}

.match-hero__team-meta p {
  margin: 0;
  color: rgba(255, 255, 255, 0.64);
  font-size: 14px;
}

.match-hero__center {
  display: grid;
  justify-items: center;
  gap: 10px;
  min-width: 220px;
}

.match-hero__status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.match-hero__live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ef4444;
  box-shadow: 0 0 0 rgba(239, 68, 68, 0.8);
  animation: live-pulse 1.6s infinite;
}

@keyframes live-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.8);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
  }
}

.match-hero__score {
  position: relative;
  font-size: clamp(42px, 6vw, 56px);
  font-weight: 900;
  line-height: 1;
  white-space: nowrap;
  letter-spacing: -0.03em;
  text-shadow: 0 8px 28px rgba(255, 255, 255, 0.08);
}

.match-hero__meta,
.match-hero__arena {
  color: rgba(255, 255, 255, 0.68);
  font-size: 14px;
  text-align: center;
}

@media (max-width: 980px) {
  .match-hero {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;
  }

  .match-hero__team,
  .match-hero__team--right {
    justify-content: center;
    text-align: center;
  }
}
</style>