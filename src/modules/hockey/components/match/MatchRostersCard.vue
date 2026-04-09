<template>
  <section class="match-card match-surface">
    <h3 class="match-card__title">Составы команд</h3>

    <div class="rosters-grid">
      <div class="roster-column">
        <h4>{{ teamA?.name || 'Команда 1' }}</h4>

        <div class="roster-group">
          <h5>Вратари</h5>
          <p v-for="player in teamA?.roster?.goalkeepers || []" :key="`a-g-${player.id}`">
            #{{ player.shirtNumber }} {{ player.name }}
          </p>
          <p v-if="!(teamA?.roster?.goalkeepers?.length)">Нет данных</p>
        </div>

        <div class="roster-group">
          <h5>Защитники</h5>
          <p v-for="player in teamA?.roster?.defensemen || []" :key="`a-d-${player.id}`">
            #{{ player.shirtNumber }} {{ player.name }}
          </p>
          <p v-if="!(teamA?.roster?.defensemen?.length)">Нет данных</p>
        </div>

        <div class="roster-group">
          <h5>Нападающие</h5>
          <p v-for="player in teamA?.roster?.forwards || []" :key="`a-f-${player.id}`">
            #{{ player.shirtNumber }} {{ player.name }}
          </p>
          <p v-if="!(teamA?.roster?.forwards?.length)">Нет данных</p>
        </div>
      </div>

      <div class="roster-column">
        <h4>{{ teamB?.name || 'Команда 2' }}</h4>

        <div class="roster-group">
          <h5>Вратари</h5>
          <p v-for="player in teamB?.roster?.goalkeepers || []" :key="`b-g-${player.id}`">
            #{{ player.shirtNumber }} {{ player.name }}
          </p>
          <p v-if="!(teamB?.roster?.goalkeepers?.length)">Нет данных</p>
        </div>

        <div class="roster-group">
          <h5>Защитники</h5>
          <p v-for="player in teamB?.roster?.defensemen || []" :key="`b-d-${player.id}`">
            #{{ player.shirtNumber }} {{ player.name }}
          </p>
          <p v-if="!(teamB?.roster?.defensemen?.length)">Нет данных</p>
        </div>

        <div class="roster-group">
          <h5>Нападающие</h5>
          <p v-for="player in teamB?.roster?.forwards || []" :key="`b-f-${player.id}`">
            #{{ player.shirtNumber }} {{ player.name }}
          </p>
          <p v-if="!(teamB?.roster?.forwards?.length)">Нет данных</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
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

.rosters-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.roster-column,
.roster-group {
  display: grid;
  gap: 10px;
}

.roster-column h4,
.roster-group h5 {
  margin: 0;
}

.roster-group {
  padding: 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
}

.roster-group p {
  margin: 0;
}

@media (max-width: 980px) {
  .rosters-grid {
    grid-template-columns: 1fr;
  }
}
</style>