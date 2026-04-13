<script setup lang="ts">
import { RouterLink } from 'vue-router'

import UiButton from '../../../components/ui/UiButton.vue'
</script>

<template>
  <section class="worklog-empty panel">
    <p class="worklog-empty__eyebrow">Пока пусто</p>
    <h2 class="worklog-empty__title">У тебя ещё нет проектов и записей</h2>
    <p class="worklog-empty__text">
      Сначала создай проект, а затем добавь первую запись по времени. После этого здесь появятся графики,
      история и статистика по нагрузке.
    </p>

    <div class="worklog-empty__actions">
      <RouterLink to="/worklog/create" class="worklog-empty__link">
        <UiButton>
          Перейти к добавлению записи
        </UiButton>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped lang="scss">
.worklog-empty {
  display: grid;
  gap: 14px;
  padding: 24px;
  border-radius: 28px;
}

.worklog-empty__eyebrow {
  margin: 0;
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(139, 92, 246, 0.9);
}

.worklog-empty__title {
  margin: 0;
  color: #fff;
  font-size: 28px;
  line-height: 1.1;
}

.worklog-empty__text {
  margin: 0;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.6;
  max-width: 720px;
}

.worklog-empty__actions {
  margin-top: 4px;
}

.worklog-empty__link {
  display: inline-flex;
  text-decoration: none;
}

@media (max-width: 720px) {
  .worklog-empty {
    padding: 20px;
  }
}
</style>