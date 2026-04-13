<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import UiButton from '../../../components/ui/UiButton.vue'

import type { WorkLog } from '../types'

interface Props {
  logs: WorkLog[]
  deletingId: string | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  remove: [id: string]
}>()

const hasLogs = computed(() => props.logs.length > 0)

function formatDate(value: string): string {
  const date = new Date(`${value}T00:00:00`)

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function getProjectTitle(log: WorkLog): string {
  return log.projectName?.trim() || 'Без проекта'
}

function handleRemove(id: string): void {
  emit('remove', id)
}
</script>

<template>
  <section class="worklog-history panel">
    <div class="worklog-history__header">
      <div>
        <p class="worklog-history__eyebrow">История</p>
        <h2 class="worklog-history__title">Последние записи</h2>
      </div>

      <p class="worklog-history__text">
        Привязка к текущему профилю пользователя
      </p>
    </div>

    <div v-if="hasLogs" class="worklog-history__list">
      <article
          v-for="log in logs.slice(0,5)"
          :key="log.id"
          class="worklog-history-item"
      >
        <div class="worklog-history-item__main">
          <div class="worklog-history-item__top">
            <div class="worklog-history-item__project-wrap">
              <h3 class="worklog-history-item__project">
                {{ getProjectTitle(log) }}
              </h3>

              <p class="worklog-history-item__date">
                {{ formatDate(log.workDate) }}
              </p>
            </div>

            <div class="worklog-history-item__hours">
              {{ log.hours }} ч
            </div>
          </div>

          <p
              v-if="log.note"
              class="worklog-history-item__note"
          >
            {{ log.note }}
          </p>
        </div>

        <div class="worklog-history-item__actions">
          <RouterLink
              :to="`/worklog/${log.id}/edit`"
              class="worklog-history-item__link"
          >
            <UiButton
                type="button"
                variant="secondary"
            >
              Редактировать
            </UiButton>
          </RouterLink>

          <UiButton
              type="button"
              variant="ghost"
              :loading="deletingId === log.id"
              :disabled="deletingId === log.id"
              @click="handleRemove(log.id)"
          >
            Удалить
          </UiButton>
        </div>
      </article>
    </div>

    <div v-else class="worklog-history__empty">
      История пока пустая. Добавь первую запись, чтобы увидеть её здесь.
    </div>
  </section>
</template>

<style scoped lang="scss">
.worklog-history {
  display: grid;
  gap: 18px;
  padding: 22px;
  border-radius: 28px;
}

.worklog-history__header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 16px;
  align-items: end;
}

.worklog-history__eyebrow {
  margin: 0 0 8px;
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(139, 92, 246, 0.9);
}

.worklog-history__title {
  margin: 0;
  font-size: clamp(22px, 2vw, 28px);
  line-height: 1.1;
  color: #fff;
}

.worklog-history__text {
  margin: 0;
  color: rgba(255, 255, 255, 0.62);
  font-size: 14px;
  line-height: 1.5;
  text-align: right;
}

.worklog-history__list {
  display: grid;
  gap: 14px;
}

.worklog-history-item {
  display: grid;
  gap: 14px;
  padding: 18px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.03)),
      rgba(10, 14, 24, 0.7);
}

.worklog-history-item__main {
  display: grid;
  gap: 12px;
}

.worklog-history-item__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.worklog-history-item__project-wrap {
  display: grid;
  gap: 6px;
}

.worklog-history-item__project {
  margin: 0;
  color: #fff;
  font-size: 18px;
  line-height: 1.2;
}

.worklog-history-item__date {
  margin: 0;
  color: rgba(255, 255, 255, 0.58);
  font-size: 14px;
}

.worklog-history-item__hours {
  flex-shrink: 0;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(236, 72, 153, 0.14);
  border: 1px solid rgba(236, 72, 153, 0.24);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
}

.worklog-history-item__note {
  margin: 0;
  color: rgba(255, 255, 255, 0.74);
  line-height: 1.6;
  white-space: pre-line;
}

.worklog-history-item__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.worklog-history-item__link {
  text-decoration: none;
}

.worklog-history__empty {
  padding: 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.64);
  line-height: 1.55;
}

@media (max-width: 820px) {
  .worklog-history__header {
    grid-template-columns: 1fr;
  }

  .worklog-history__text {
    text-align: left;
  }
}

@media (max-width: 640px) {
  .worklog-history {
    padding: 20px;
  }

  .worklog-history-item__top {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>