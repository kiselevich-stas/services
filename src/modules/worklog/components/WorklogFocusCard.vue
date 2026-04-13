<script setup lang="ts">
import {computed} from "vue";

interface Props {
  project: string
  hours: number
}

const props = defineProps<Props>()

const message = computed(() => {
  if (!props.project) {
    return 'Сегодня пока нет записей. Самое время начать 🚀'
  }

  if (props.hours >= 8) {
    return 'Мощный день! Отличный фокус 💪'
  }

  if (props.hours >= 4) {
    return 'Хороший темп, так держать 👍'
  }

  return 'Можно усилить фокус завтра 🔥'
})
</script>

<template>
  <section class="focus-card">
    <p class="focus-card__eyebrow">Фокус дня</p>

    <template v-if="project">
      <h3 class="focus-card__title">
        {{ project }}
      </h3>

      <p class="focus-card__hours">
        {{ hours }} ч
      </p>
    </template>

    <template v-else>
      <h3 class="focus-card__title">
        Нет данных
      </h3>
    </template>

    <p class="focus-card__text">
      {{ message }}
    </p>
  </section>
</template>

<style scoped lang="scss">
.focus-card {
  padding: 20px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: grid;
  gap: 10px;
}

.focus-card__eyebrow {
  font-size: 12px;
  color: rgba(139, 92, 246, 0.9);
  text-transform: uppercase;
}

.focus-card__title {
  font-size: 22px;
  color: #fff;
}

.focus-card__hours {
  font-size: 18px;
  color: #86efac;
}

.focus-card__text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}
</style>