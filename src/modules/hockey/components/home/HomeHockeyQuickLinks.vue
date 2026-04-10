<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="quick-links">
    <RouterLink to="/hockey" class="quick-link quick-link--matches">
      <span class="quick-link__label">Матчи</span>
      <strong class="quick-link__title">Ближайшие встречи</strong>
      <span class="quick-link__description">
        Полное расписание, карточки матчей и страница конкретной игры.
      </span>
    </RouterLink>

    <RouterLink to="/hockey/elo" class="quick-link quick-link--elo">
      <span class="quick-link__label">Рейтинг</span>
      <strong class="quick-link__title">Elo команд</strong>
      <span class="quick-link__description">
        Смотри актуальную силу команд и переключай сезоны.
      </span>
    </RouterLink>

    <RouterLink to="/hockey/teams" class="quick-link quick-link--teams">
      <span class="quick-link__label">Команды</span>
      <strong class="quick-link__title">Все клубы этапа</strong>
      <span class="quick-link__description">
        Логотипы, города, дивизионы и конференции на одной странице.
      </span>
    </RouterLink>
  </section>
</template>

<style scoped lang="scss">
.quick-links {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.quick-link {
  display: grid;
  gap: 10px;
  padding: 22px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(13, 18, 35, 0.86);
  transition: transform 0.2s ease, border-color 0.2s ease;
  text-decoration: none;
}

.quick-link:hover {
  transform: translateY(-2px);
}

.quick-link--matches:hover {
  border-color: rgba(59, 130, 246, 0.45);
}

.quick-link--elo:hover {
  border-color: rgba(168, 85, 247, 0.45);
}

.quick-link--teams:hover {
  border-color: rgba(34, 197, 94, 0.45);
}

.quick-link__label {
  color: rgba(255, 255, 255, 0.58);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.quick-link__title {
  color: #fff;
  font-size: 22px;
}

.quick-link__description {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.55;
}

@media (max-width: 1100px) {
  .quick-links {
    grid-template-columns: 1fr;
  }
}
</style>