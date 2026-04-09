<template>
  <section class="match-card match-surface">
    <h3 class="match-card__title">Текстовая лента</h3>

    <div v-if="items.length" class="feed">
      <article
          v-for="(entry, index) in items"
          :key="`text-event-${index}-${entry.seconds}`"
          class="feed-item"
      >
        <div class="feed-item__meta">
          <span>{{ entry.period ? `${entry.period} период` : 'Матч' }}</span>
          <span>{{ entry.time || '—' }}</span>
          <span>{{ entry.type || 'event' }}</span>
          <span v-if="entry.score">{{ entry.score }}</span>
        </div>

        <p class="feed-item__text">
          {{ entry.text || '—' }}
        </p>
      </article>
    </div>

    <p v-else class="empty-text">Нет текстовых событий</p>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  items: Array<any>
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

.feed {
  display: grid;
  gap: 12px;
}

.feed-item {
  display: grid;
  gap: 8px;
  padding: 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
}

.feed-item__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  color: rgba(255, 255, 255, 0.58);
  font-size: 12px;
}

.feed-item__text,
.empty-text {
  margin: 0;
  line-height: 1.45;
}
</style>