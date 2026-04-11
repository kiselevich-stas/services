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
  player: Player
}>()
</script>

<template>
  <article class="player-card">
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
</style>