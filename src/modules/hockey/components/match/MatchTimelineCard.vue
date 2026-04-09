<template>
  <section class="match-card match-surface">
    <h3 class="match-card__title">{{ title }}</h3>

    <div v-if="items.length" class="timeline">
      <article
          v-for="(item, index) in items"
          :key="getItemKey(item, index)"
          class="timeline-item"
          :class="getItemSideClass(item)"
      >
        <template v-if="type === 'goals'">
          <div class="timeline-item__head">
            <span>{{ item.period }} период</span>
            <span>{{ formatMatchMinute(item.time) }}</span>
            <span>{{ item.score }}</span>
          </div>

          <div class="timeline-item__title">
            {{ resolveTeamName(item.author?.teamId) }}
          </div>

          <p class="timeline-item__text">
            Гол: #{{ item.author?.shirtNumber }} {{ item.author?.name }}
          </p>

          <p v-if="item.assistants?.length" class="timeline-item__text">
            Передачи:
            {{ item.assistants.map((assistant: any) => `#${assistant.shirtNumber} ${assistant.name}`).join(', ') }}
          </p>
        </template>

        <template v-else>
          <div class="timeline-item__head">
            <span>{{ item.period }} период</span>
            <span>{{ formatMatchMinute(item.time) }}</span>
            <span>{{ item.penaltyTime }} мин</span>
          </div>

          <div class="timeline-item__title">
            {{ resolveTeamName(item.violator?.teamId) }}
          </div>

          <p class="timeline-item__text">
            #{{ item.violator?.shirtNumber }} {{ item.violator?.name }}
          </p>

          <p class="timeline-item__text">
            {{ item.penaltyReason || 'Нарушение' }}
          </p>
        </template>
      </article>
    </div>

    <p v-else class="empty-text">{{ emptyText }}</p>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  emptyText: string
  items: Array<any>
  resolveTeamName: (teamId?: number | null) => string
  type: 'goals' | 'violations'
  teamAId?: number | null
}>()

function formatMatchMinute(value?: number | null) {
  if (value == null) {
    return '—'
  }

  return `${value}'`
}

function getItemSideClass(item: any) {
  const teamId =
      props.type === 'goals'
          ? item.author?.teamId
          : item.violator?.teamId

  return teamId === props.teamAId ? 'timeline-item--a' : 'timeline-item--b'
}

function getItemKey(item: any, index: number) {
  if (props.type === 'goals') {
    return `goal-${index}-${item.time}-${item.author?.name}`
  }

  return `violation-${index}-${item.time}-${item.violator?.name}`
}
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

.timeline {
  display: grid;
  gap: 12px;
}

.timeline-item {
  display: grid;
  gap: 8px;
  padding: 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
  border-left: 4px solid transparent;
}

.timeline-item--a {
  border-left-color: #60a5fa;
}

.timeline-item--b {
  border-left-color: #f87171;
}

.timeline-item__head {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  color: rgba(255, 255, 255, 0.58);
  font-size: 12px;
}

.timeline-item__title {
  font-size: 16px;
  font-weight: 800;
}

.timeline-item__text,
.empty-text {
  margin: 0;
  line-height: 1.45;
}
</style>