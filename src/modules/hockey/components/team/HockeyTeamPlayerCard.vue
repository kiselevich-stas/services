<script setup lang="ts">
type Player = {
  id: number
  image?: string
  name: string
  shirtNumber?: number
  country?: string
  goals?: number
  assists?: number
}

defineProps<{
  player?: Player
  isLoading?: boolean
}>()
</script>

<template>
  <article class="player-card">
    <template v-if="isLoading">
      <div class="skeleton player-card__image-skeleton" />

      <div class="player-card__body">
        <div class="skeleton player-card__number-skeleton" />
        <div class="skeleton player-card__name-skeleton" />
        <div class="skeleton player-card__meta-skeleton" />
        <div class="skeleton player-card__stats-skeleton" />
      </div>
    </template>

    <template v-else-if="player">
      <img
          v-if="player.image"
          :src="player.image"
          :alt="player.name"
          class="player-card__image"
      >

      <div class="player-card__body">
        <p class="player-card__number">
          #{{ player.shirtNumber || '—' }}
        </p>

        <p class="player-card__name">
          {{ player.name }}
        </p>

        <p class="player-card__meta">
          {{ player.country }}
        </p>

        <p class="player-card__stats">
          {{ player.goals || 0 }} + {{ player.assists || 0 }}
        </p>
      </div>
    </template>
  </article>
</template>

<style scoped lang="scss">
.player-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.player-card__image {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  object-fit: cover;
  flex-shrink: 0;
}

.player-card__body {
  min-width: 0;
  flex: 1;
}

.player-card__number {
  margin: 0 0 4px;
  font-size: 13px;
  color: var(--team-color);
  font-weight: 700;
}

.player-card__name {
  margin: 0;
  color: #fff;
  font-weight: 600;
  line-height: 1.3;
}

.player-card__meta,
.player-card__stats {
  margin: 4px 0 0;
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
}

.player-card__image-skeleton {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  flex-shrink: 0;
}

.player-card__number-skeleton {
  width: 42px;
  height: 14px;
  margin-bottom: 6px;
}

.player-card__name-skeleton {
  width: 120px;
  max-width: 100%;
  height: 16px;
  margin-bottom: 6px;
}

.player-card__meta-skeleton,
.player-card__stats-skeleton {
  width: 80px;
  height: 13px;
  margin-top: 4px;
}

.skeleton {
  border-radius: 10px;
  background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0.06) 25%,
          rgba(255, 255, 255, 0.14) 50%,
          rgba(255, 255, 255, 0.06) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.4s infinite linear;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}
</style>